/**
 * Gunluk uc hedefin uretilmesi (README bolum 5 ve 14).
 *
 * Puanlar tetikleyici koda gore atanir; modelin serbest metnine birakilmaz.
 * Her hedefin acik tamamlanma olcutu ve minimum surumu vardir (README bolum 22).
 * Dusuk enerji gununde hedefler kuculur (Kurtarma Adimi ruhu).
 */

import type { DailyGoal, EnergyLevel, GoalArea, GoalTemplate, GoalTier } from '../types';
import { TIER_POINTS } from './economy';
import { classifyText } from './safety';

const TIER_ORDER: GoalTier[] = ['mainBridge', 'supportStep', 'minimumEvidence'];

/** Gunluk hedefin kararli kimligi: gun + kademe (idempotency icin sabit). */
export function goalId(date: string, tier: GoalTier): string {
  return `${date}:${tier}`;
}

/** Dusuk enerjide sureyi kuculterek minimum surume yaklastirir. */
function scaleForEnergy(template: GoalTemplate, energy: EnergyLevel): GoalTemplate {
  if (energy !== 'low') return template;
  const scaled: GoalTemplate = { ...template, difficulty: 'gentle' };
  if (typeof template.durationMinutes === 'number') {
    scaled.durationMinutes = Math.max(5, Math.round(template.durationMinutes / 2));
    scaled.completionCriteria = template.minimumVersion;
  }
  return scaled;
}

/** Bir sablondan tam bir gunluk hedef nesnesi olusturur ve puanlari atar. */
export function goalFromTemplate(
  template: GoalTemplate,
  date: string,
  energy: EnergyLevel,
): DailyGoal {
  const t = scaleForEnergy(template, energy);
  const points = TIER_POINTS[t.tier];
  return {
    id: goalId(date, t.tier),
    tier: t.tier,
    title: t.title,
    area: t.area,
    why: t.why,
    completionCriteria: t.completionCriteria,
    durationMinutes: t.durationMinutes,
    difficulty: t.difficulty,
    minimumVersion: t.minimumVersion,
    stagePoints: points.stage,
    xp: points.xp,
    suggestedTime: t.suggestedTime,
    trigger: t.trigger,
    safetyLabel: classifyText(`${t.title} ${t.why}`),
    edited: false,
    completed: false,
  };
}

/**
 * Bir hedef alani icin gunun uc hedefini uretir (her kademeden bir tane).
 * Havuzda bir kademe icin birden fazla sablon varsa, gunu tohumlayan basit bir
 * saymayla degisiklik saglanir (rastgelelik yerine deterministik secim).
 */
export function buildDailyGoals(
  templates: GoalTemplate[],
  opts: { area: GoalArea; energy: EnergyLevel; date: string },
): DailyGoal[] {
  const daySeed = dateSeed(opts.date);
  const goals: DailyGoal[] = [];
  for (const tier of TIER_ORDER) {
    const pool = templates.filter((t) => t.area === opts.area && t.tier === tier);
    if (pool.length === 0) continue;
    const picked = pool[daySeed % pool.length];
    goals.push(goalFromTemplate(picked, opts.date, opts.energy));
  }
  return goals;
}

/** "YYYY-MM-DD" -> deterministik kucuk tamsayi (sablon donusumu icin). */
function dateSeed(date: string): number {
  let sum = 0;
  for (let i = 0; i < date.length; i += 1) sum += date.charCodeAt(i);
  return sum;
}

/** Kademe -> Turkce etiket (UI icin). */
export const TIER_LABEL: Record<GoalTier, string> = {
  mainBridge: 'Ana Kopru',
  supportStep: 'Destek Adimi',
  minimumEvidence: 'Minimum Kanit',
};
