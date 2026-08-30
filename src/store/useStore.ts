/**
 * Merkezi uygulama durumu (Zustand + AsyncStorage kaliciligi).
 *
 * Puan, seri ve guvenlik kararlari saf domain fonksiyonlarina delege edilir;
 * store yalnizca durumu birlestirir ve olaylari deterministik kurallara baglar.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  GOAL_TEMPLATES,
  FUTURE_SELF,
  MOTIVATION_HINTS,
  possibleFuturesFor,
} from '../data/seed';
import {
  applyEntries,
  buildDailyGoals,
  classifyText,
  completionEntries,
  computeBalance,
  dayKey,
  emptyStreaks,
  recordBond,
  recordEvidence,
  safetyResponse,
  sendThreeEntries,
  shouldSuspendGame,
  SEASON_LENGTH_DAYS,
  STAGE_TARGET,
} from '../domain';
import type { Balance } from '../domain';
import type {
  AccessibilityPrefs,
  ChatMessage,
  Consents,
  DailyGoal,
  DailyPlan,
  EnergyLevel,
  Evidence,
  EveningReflection,
  GoalArea,
  Journey,
  NotificationPrefs,
  Profile,
  SafetyLabel,
  Streaks,
  ThoughtRecord,
} from '../types';

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Yerel bugunun gun anahtari. */
export function today(): string {
  return dayKey(new Date());
}

function nowIso(): string {
  return new Date().toISOString();
}

const DEFAULT_PROFILE: Profile = {
  displayName: '',
  consents: {
    photo: false,
    voice: false,
    ai: true,
    analytics: false,
    modelTraining: false, // varsayilan olarak kapali (README bolum 17)
  },
  notifications: {
    morning: true,
    planned: true,
    evening: true,
    comeback: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  },
  accessibility: {
    reduceMotion: false,
    muteSound: false,
    highContrast: false,
  },
};

export interface OnboardingPayload {
  displayName: string;
  area: GoalArea;
  northStar: string;
  whyItMatters: string;
  consents: Partial<Consents>;
}

export interface SafetyState {
  suspended: boolean;
  title: string;
  message: string;
  resources: { label: string; value: string }[];
}

interface StoreState {
  hydrated: boolean;
  onboardingComplete: boolean;
  profile: Profile;
  journey: Journey | null;
  plansByDate: Record<string, DailyPlan>;
  ledger: ReturnType<typeof applyEntries>;
  streaks: Streaks;
  evidence: Evidence[];
  thoughtRecords: ThoughtRecord[];
  messages: ChatMessage[];
  safety: SafetyState;

  // --- turetilmis ---
  balance: () => Balance;
  getPlan: (date: string) => DailyPlan | undefined;

  // --- onboarding ---
  completeOnboarding: (payload: OnboardingPayload) => void;
  resetAll: () => void;

  // --- ayarlar ---
  setConsent: (key: keyof Consents, value: boolean) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean | string) => void;
  setAccessibilityPref: (key: keyof AccessibilityPrefs, value: boolean) => void;

  // --- gunluk dongu ---
  startMorning: (date: string) => void;
  setEnergy: (date: string, energy: EnergyLevel) => void;
  shrinkGoal: (date: string, goalId: string) => void;
  editGoalTitle: (date: string, goalId: string, title: string) => void;
  commitPlan: (date: string) => void;
  completeGoal: (date: string, goalId: string) => void;
  saveReflection: (date: string, reflection: Omit<EveningReflection, 'createdAt'>) => void;

  // --- BDT ---
  addThoughtRecord: (record: Omit<ThoughtRecord, 'id' | 'createdAt'>) => void;

  // --- sohbet ---
  sendMessage: (text: string) => SafetyLabel;
  acknowledgeSafety: () => void;
}

function makeJourney(payload: OnboardingPayload): Journey {
  return {
    id: newId('journey'),
    area: payload.area,
    northStar: payload.northStar,
    whyItMatters: payload.whyItMatters,
    startDate: today(),
    seasonLengthDays: SEASON_LENGTH_DAYS,
    stageTarget: STAGE_TARGET,
    status: 'active',
    possibleFutures: possibleFuturesFor(payload.area),
    motivationHints: MOTIVATION_HINTS,
  };
}

function pushMessage(messages: ChatMessage[], role: ChatMessage['role'], text: string): ChatMessage[] {
  return [
    ...messages,
    { id: newId('msg'), role, text, createdAt: nowIso(), safetyLabel: classifyText(text) },
  ];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingComplete: false,
      profile: DEFAULT_PROFILE,
      journey: null,
      plansByDate: {},
      ledger: [],
      streaks: emptyStreaks(),
      evidence: [],
      thoughtRecords: [],
      messages: [],
      safety: { suspended: false, title: '', message: '', resources: [] },

      balance: (): Balance => computeBalance(get().ledger),
      getPlan: (date) => get().plansByDate[date],

      completeOnboarding: (payload) =>
        set((s) => ({
          onboardingComplete: true,
          journey: makeJourney(payload),
          profile: {
            ...s.profile,
            displayName: payload.displayName,
            consents: { ...s.profile.consents, ...payload.consents },
          },
          messages: pushMessage([], 'future', FUTURE_SELF.morning(payload.displayName || undefined)),
        })),

      resetAll: () =>
        set(() => ({
          onboardingComplete: false,
          profile: DEFAULT_PROFILE,
          journey: null,
          plansByDate: {},
          ledger: [],
          streaks: emptyStreaks(),
          evidence: [],
          thoughtRecords: [],
          messages: [],
          safety: { suspended: false, title: '', message: '', resources: [] },
        })),

      setConsent: (key, value) =>
        set((s) => ({ profile: { ...s.profile, consents: { ...s.profile.consents, [key]: value } } })),

      setNotificationPref: (key, value) =>
        set((s) => ({
          profile: { ...s.profile, notifications: { ...s.profile.notifications, [key]: value } },
        })),

      setAccessibilityPref: (key, value) =>
        set((s) => ({
          profile: { ...s.profile, accessibility: { ...s.profile.accessibility, [key]: value } },
        })),

      startMorning: (date) => {
        const s = get();
        if (!s.journey) return;
        if (s.plansByDate[date]) return; // bugunun plani zaten var
        const energy: EnergyLevel = 'medium';
        const goals = buildDailyGoals(GOAL_TEMPLATES, { area: s.journey.area, energy, date });
        const plan: DailyPlan = {
          date,
          energy: null,
          goals,
          status: 'draft',
          sentToFutureSelf: false,
        };
        set({ plansByDate: { ...s.plansByDate, [date]: plan } });
      },

      setEnergy: (date, energy) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan || plan.status !== 'draft' || !s.journey) return {} as Partial<StoreState>;
          const goals = buildDailyGoals(GOAL_TEMPLATES, { area: s.journey.area, energy, date });
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, energy, goals } } };
        }),

      shrinkGoal: (date, goalId) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan) return {} as Partial<StoreState>;
          const goals = plan.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  completionCriteria: g.minimumVersion,
                  difficulty: 'gentle' as const,
                  durationMinutes: g.durationMinutes
                    ? Math.max(5, Math.round(g.durationMinutes / 2))
                    : undefined,
                  edited: true,
                }
              : g,
          );
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } } };
        }),

      editGoalTitle: (date, goalId, title) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan) return {} as Partial<StoreState>;
          const goals = plan.goals.map((g) =>
            g.id === goalId ? { ...g, title, edited: true } : g,
          );
          return { plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } } };
        }),

      commitPlan: (date) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan || plan.sentToFutureSelf) return {} as Partial<StoreState>;
          const ledger = applyEntries(s.ledger, sendThreeEntries(date, nowIso()));
          const streaks = recordBond(s.streaks, date);
          const messages = pushMessage(s.messages, 'future', FUTURE_SELF.morning(s.profile.displayName || undefined));
          return {
            ledger,
            streaks,
            messages,
            plansByDate: {
              ...s.plansByDate,
              [date]: { ...plan, status: 'committed', sentToFutureSelf: true },
            },
          };
        }),

      completeGoal: (date, goalId) =>
        set((s) => {
          if (s.safety.suspended) return {} as Partial<StoreState>; // kriz aninda oyun/puan durur
          const plan = s.plansByDate[date];
          if (!plan) return {} as Partial<StoreState>;
          const goal = plan.goals.find((g) => g.id === goalId);
          if (!goal || goal.completed) return {} as Partial<StoreState>;

          const completedAt = nowIso();
          const goals = plan.goals.map((g) =>
            g.id === goalId ? { ...g, completed: true, completedAt } : g,
          );
          const ledger = applyEntries(s.ledger, completionEntries(goal, date, completedAt));
          const streaks = recordEvidence(s.streaks, date);
          const evidenceItem: Evidence = {
            id: newId('ev'),
            goalId: goal.id,
            date,
            createdAt: completedAt,
            tier: goal.tier,
            title: goal.title,
            durationMinutes: goal.durationMinutes,
          };
          const messages = pushMessage(s.messages, 'future', FUTURE_SELF.onComplete(goal.tier));
          return {
            plansByDate: { ...s.plansByDate, [date]: { ...plan, goals } },
            ledger,
            streaks,
            evidence: [evidenceItem, ...s.evidence],
            messages,
          };
        }),

      saveReflection: (date, reflection) =>
        set((s) => {
          const plan = s.plansByDate[date];
          if (!plan) return {} as Partial<StoreState>;
          return {
            plansByDate: {
              ...s.plansByDate,
              [date]: {
                ...plan,
                status: 'closed',
                reflection: { ...reflection, createdAt: nowIso() },
              },
            },
          };
        }),

      addThoughtRecord: (record) =>
        set((s) => ({
          thoughtRecords: [
            { ...record, id: newId('tr'), createdAt: nowIso() },
            ...s.thoughtRecords,
          ],
        })),

      sendMessage: (text) => {
        const label = classifyText(text);
        set((s) => {
          let messages = pushMessage(s.messages, 'user', text);
          if (shouldSuspendGame(label)) {
            const res = safetyResponse('crisis')!;
            messages = pushMessage(messages, 'future', res.message);
            return {
              messages,
              safety: {
                suspended: true,
                title: res.title,
                message: res.message,
                resources: res.resources,
              },
            };
          }
          if (label === 'sensitive') {
            const res = safetyResponse('sensitive')!;
            messages = pushMessage(messages, 'future', res.message);
            return { messages };
          }
          messages = pushMessage(
            messages,
            'future',
            'Seni duydum. Bunu bugunun uc kucuk adimina cevirelim mi? Once en kucugunu secelim.',
          );
          return { messages };
        });
        return label;
      },

      acknowledgeSafety: () =>
        set(() => ({ safety: { suspended: false, title: '', message: '', resources: [] } })),
    }),
    {
      name: 'futureme-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        profile: s.profile,
        journey: s.journey,
        plansByDate: s.plansByDate,
        ledger: s.ledger,
        streaks: s.streaks,
        evidence: s.evidence,
        thoughtRecords: s.thoughtRecords,
        messages: s.messages,
        // safety durumu kalici degildir; her acilista temiz baslar.
      }),
    },
  ),
);

// Kaliciliktan geri yukleme tamamlaninca uygulamayi acmaya hazir isaretle.
// Yonlendirme (app/index.tsx) `hydrated` true olana kadar bekler.
useStore.persist.onFinishHydration(() => {
  useStore.setState({ hydrated: true });
});
if (useStore.persist.hasHydrated()) {
  useStore.setState({ hydrated: true });
}
