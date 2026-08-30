import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  FutureSelfScene,
  Screen,
  SectionHeader,
  TextField,
} from '@/components';
import { GOAL_AREAS, MOTIVATION_HINTS, goalAreaMeta, possibleFuturesFor } from '@/data/seed';
import { colors, palette, spacing } from '@/theme';
import type { Consents, GoalArea } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Onboarding (README bolum 4.1 ve 11). Bir form degil, gelecekteki benlikle ilk
 * karsilasmaya hazirlanan kisa bir seruven. Tek dosyalik sihirbaz; adimlar
 * icsel useState ile yonetilir (ayri rota dosyalari yok).
 *
 * Ton: sicak, sefkatli; kesinlik/kehanet/garanti dili yok. Bu bir iyi olus ve
 * motivasyon araci; terapi/tani/tibbi/acil hizmet degildir.
 */

const STEP_WELCOME = 0;
const STEP_NAME = 1;
const STEP_AREA = 2;
const STEP_NORTH_STAR = 3;
const STEP_MOTIVATION = 4;
const STEP_POSSIBILITY = 5;
const STEP_CONSENTS = 6;
const STEP_MEETING = 7;
const STEP_FINISH = 8;
const LAST_STEP = STEP_FINISH;

const DEFAULT_CONSENTS: Consents = {
  photo: false,
  voice: false,
  ai: true,
  analytics: false,
  modelTraining: false, // varsayilan olarak kapali (README bolum 17)
};

export default function OnboardingScreen() {
  const router = useRouter();

  // Aksiyonu tek tek sec (zustand secici kurali: yeni nesne/dizi dondurme).
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<number>(STEP_WELCOME);
  const [displayName, setDisplayName] = useState('');
  const [area, setArea] = useState<GoalArea | null>(null);
  const [northStar, setNorthStar] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [consents, setConsents] = useState<Consents>(DEFAULT_CONSENTS);

  const meta = useMemo(() => (area ? goalAreaMeta(area) : null), [area]);
  const futures = useMemo(() => (area ? possibleFuturesFor(area) : []), [area]);

  const trimmedName = displayName.trim();
  const trimmedStar = northStar.trim();

  const greeting = trimmedName ? `Merhaba ${trimmedName}.` : 'Merhaba.';
  const meetingMessage = trimmedStar
    ? `${greeting} "${trimmedStar}" dedin. Bu yone, bugunden baslayarak attigin kucuk adimlarla ` +
      'birlikte yaklasabiliriz. Acele yok; adim adim gideriz.'
    : `${greeting} Buraya kadar geldin bile. Yarinki halinle bugunden bag kurmaya basliyoruz; ` +
      'her gun uc kucuk adim, aramizdaki mesafeyi biraz daha kisaltabilir.';

  const setConsent = (key: keyof Consents, value: boolean) =>
    setConsents((c) => ({ ...c, [key]: value }));

  const goNext = () => setStep((s) => Math.min(s + 1, LAST_STEP));
  const goBack = () => setStep((s) => Math.max(s - 1, STEP_WELCOME));

  // Alan secilmeden 3. adimin otesine gecilemez (README 4.1.2 - hedef alani).
  const nextDisabled = step === STEP_AREA && area === null;

  const onFinish = () => {
    if (!area) return; // guvenlik: alan olmadan bitirilemez
    completeOnboarding({
      displayName: trimmedName,
      area,
      northStar: trimmedStar,
      whyItMatters: whyItMatters.trim(),
      consents,
    });
    router.replace('/morning');
  };

  const renderStep = () => {
    switch (step) {
      case STEP_WELCOME:
        return (
          <>
            <FutureSelfScene
              message="Seni bekliyordum. Birlikte kisa bir yolculuga cikacagiz; sonunda tanisacagiz."
            />
            <SectionHeader
              kicker="HOS GELDIN"
              title="FutureMe'ye hos geldin"
              subtitle="Gelecekteki benliginle konusarak her gun uc kucuk kanit urettigin bir iyi olus ve motivasyon oyunu."
            />
            <Card tone="muted" style={styles.block}>
              <AppText variant="bodyStrong">Once kucuk bir not</AppText>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                FutureMe bir terapi, tani, tibbi ya da acil durum hizmeti degildir. Zor bir an
                yasiyorsan lutfen bir uzmana ya da yerel destek hatlarina basvurmayi dusun.
              </AppText>
            </Card>
            <Card tone="muted" style={styles.block}>
              <AppText variant="bodyStrong">Yapay zeka ve verin</AppText>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Deneyim yapay zeka ile kisisellestirilir ve yapay uretilen icerikler acikca
                etiketlenir. Verinin kontrolu sende: diledigin zaman disa aktarabilir ya da
                silebilirsin. Model egitimi izni varsayilan olarak kapalidir.
              </AppText>
            </Card>
          </>
        );

      case STEP_NAME:
        return (
          <>
            <SectionHeader
              kicker="TANISMA"
              title="Sana nasil sesleneyim?"
              subtitle="Istersen adini birak; bos birakabilirsin, her zaman degistirebilirsin."
            />
            <TextField
              label="Adin (istege bagli)"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ornek: Deniz"
              helperText="Yalnizca seni sicak bir sekilde selamlayabilmem icin."
            />
          </>
        );

      case STEP_AREA:
        return (
          <>
            <SectionHeader
              kicker="YON"
              title="Su aralar seni en cok ne zorluyor?"
              subtitle="Baslamak icin bir alan sec. Sonradan degistirebilirsin."
            />
            <View style={styles.chipWrap}>
              {GOAL_AREAS.map((g) => (
                <Chip
                  key={g.area}
                  label={g.label}
                  emoji={g.emoji}
                  selected={area === g.area}
                  onPress={() => setArea(g.area)}
                />
              ))}
            </View>
            {area === null ? (
              <AppText variant="caption" color={colors.onSurfaceMuted}>
                Devam etmek icin bir alan secmen yeterli.
              </AppText>
            ) : null}
          </>
        );

      case STEP_NORTH_STAR:
        return (
          <>
            <SectionHeader
              kicker="KUZEY YILDIZI"
              title="Kucuk bir yon belirleyelim"
              subtitle="Kusursuz cevap aranmiyor; birkac kelime bile yeterli."
            />
            <TextField
              label={
                meta?.northStarPrompt ??
                'Alti ay sonra hangi davranislari daha dogal yapiyor olmak istersin?'
              }
              value={northStar}
              onChangeText={setNorthStar}
              placeholder="Kendi cumlenle yaz..."
              multiline
              helperText="Kisa da olsa yeterli. Diledigin zaman degistirebilirsin."
            />
            <TextField
              label="Bu neden senin icin onemli?"
              value={whyItMatters}
              onChangeText={setWhyItMatters}
              placeholder="Arkasindaki degeri birkac kelimeyle anlat..."
              multiline
              helperText="Bos birakabilirsin; ama bir 'neden' zor gunlerde yol gosterebilir."
            />
          </>
        );

      case STEP_MOTIVATION:
        return (
          <>
            <SectionHeader
              kicker="MOTIVASYON HARITASI"
              title="Sana simdilik daha yakin gorunen yaklasimlar"
              subtitle="Bunlar bir tani ya da hukum degil; yalnizca birer olasilik. Zamanla gercek davranislarin bunlari gunceller."
            />
            {MOTIVATION_HINTS.slice(0, 3).map((h) => (
              <Card key={h.patternId} style={styles.hintCard}>
                <View style={styles.hintHeader}>
                  <AppText variant="bodyStrong" style={styles.hintTitle}>
                    {h.label}
                  </AppText>
                  <AppText variant="caption" color={colors.primary}>
                    ~%{Math.round(h.confidence * 100)} yakin
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  Ise yarayabilir: {h.approach}
                </AppText>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  Simdilik kacinilabilir: {h.avoid}
                </AppText>
              </Card>
            ))}
          </>
        );

      case STEP_POSSIBILITY:
        return (
          <>
            <SectionHeader
              kicker="OLASILIK ODASI"
              title="Ihtimal, kader degil"
              subtitle="Tek bir kesin sonuc yok. Iste ayni yone giden uc gercekci rota."
            />
            {futures.map((f) => (
              <Card key={f.id} style={styles.futureCard}>
                <AppText variant="bodyStrong">{f.title}</AppText>
                <AppText variant="caption" color={colors.onSurfaceMuted}>
                  {f.description}
                </AppText>
                <View style={styles.futureMeta}>
                  <AppText variant="label" color={colors.primary}>
                    SENIN ELINDE
                  </AppText>
                  {f.controllables.slice(0, 2).map((c) => (
                    <AppText key={c} variant="caption" color={colors.onSurface}>
                      · {c}
                    </AppText>
                  ))}
                </View>
                <View style={styles.futureMeta}>
                  <AppText variant="label" color={colors.onSurfaceFaint}>
                    BELIRSIZ
                  </AppText>
                  {f.uncertainties.slice(0, 2).map((u) => (
                    <AppText key={u} variant="caption" color={colors.onSurfaceMuted}>
                      · {u}
                    </AppText>
                  ))}
                </View>
              </Card>
            ))}
          </>
        );

      case STEP_CONSENTS:
        return (
          <>
            <SectionHeader
              kicker="IZINLER"
              title="Neyi paylasacagina sen karar ver"
              subtitle="Her izin ayridir ve istedigin zaman Profil > Kontroller'den geri alabilirsin."
            />
            <Card style={styles.consentCard}>
              <ConsentRow
                title="Fotograf"
                description="Gelecekteki benlik avatarini kisisellestirmek icin fotografini kullanma izni."
                value={consents.photo}
                onValueChange={(v) => setConsent('photo', v)}
              />
              <ConsentRow
                title="Ses"
                description="Sesli 'Benimle Yuru' deneyimi ve gelecekteki benligin ses tonu icin."
                value={consents.voice}
                onValueChange={(v) => setConsent('voice', v)}
              />
              <ConsentRow
                title="Yapay zeka"
                description="Kisisellestirilmis mesaj ve hedef onerileri uretmek icin. Kapatirsan guvenli hazir icerik kullanilir."
                value={consents.ai}
                onValueChange={(v) => setConsent('ai', v)}
              />
              <ConsentRow
                title="Kullanim analizi"
                description="Uygulamayi iyilestirmek icin anonim kullanim verisi."
                value={consents.analytics}
                onValueChange={(v) => setConsent('analytics', v)}
              />
              <ConsentRow
                title="Model egitimi"
                description="Verinin yapay zeka modeli egitiminde kullanilmasi. Varsayilan olarak kapali."
                value={consents.modelTraining}
                onValueChange={(v) => setConsent('modelTraining', v)}
                last
              />
            </Card>
          </>
        );

      case STEP_MEETING:
        return (
          <>
            <SectionHeader
              kicker="ILK GORUSME"
              title="Simdi tanisalim"
              subtitle="Gelecekteki benin, senin kendi sozlerinden yola cikarak seni selamliyor."
            />
            <FutureSelfScene name={trimmedName || undefined} message={meetingMessage} />
          </>
        );

      case STEP_FINISH:
      default:
        return (
          <>
            <SectionHeader
              kicker="ILK UC KOPRU"
              title="Hazirsin"
              subtitle="Simdi bugunun uc kucuk hedefini secip gelecekteki benligine gonderelim."
            />
            <Card tone="muted" style={styles.block}>
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Kusursuz olman gerekmiyor. Bir ana adim, bir destek adimi ve zor bir gun icin en
                kucuk adim; bu kadari bugun icin fazlasiyla yeterli.
              </AppText>
            </Card>
          </>
        );
    }
  };

  return (
    <Screen scroll>
      {/* Ilerleme gostergesi */}
      <View style={styles.progressWrap}>
        <AppText variant="label" color={colors.onSurfaceFaint}>
          ADIM {step + 1} / {LAST_STEP + 1}
        </AppText>
        <View style={styles.progressTrack}>
          {Array.from({ length: LAST_STEP + 1 }).map((_, i) => (
            <View
              key={i}
              style={[styles.progressSeg, i <= step ? styles.progressOn : styles.progressOff]}
            />
          ))}
        </View>
      </View>

      <View style={styles.step}>{renderStep()}</View>

      {/* Gezinme */}
      {step < LAST_STEP ? (
        <View style={styles.navRow}>
          {step > STEP_WELCOME ? (
            <Button label="Geri" variant="ghost" onPress={goBack} style={styles.navBtn} />
          ) : null}
          <Button
            label="Ileri"
            onPress={goNext}
            disabled={nextDisabled}
            style={styles.navBtn}
            accessibilityHint="Bir sonraki adima gecer"
          />
        </View>
      ) : (
        <View style={styles.finishWrap}>
          <Button
            label="Ilk uc hedefi sec"
            size="lg"
            fullWidth
            disabled={!area}
            onPress={onFinish}
            accessibilityHint="Onboarding'i tamamlar ve sabah deneyimine gecer"
          />
          <Button label="Geri" variant="ghost" fullWidth onPress={goBack} />
        </View>
      )}
    </Screen>
  );
}

function ConsentRow({
  title,
  description,
  value,
  onValueChange,
  last,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.consentRow, !last && styles.consentDivider]}>
      <View style={styles.consentText}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="caption" color={colors.onSurfaceMuted}>
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={palette.white}
        accessibilityLabel={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrap: { gap: spacing.sm },
  progressTrack: { flexDirection: 'row', gap: spacing.xs },
  progressSeg: { flex: 1, height: 6, borderRadius: 3 },
  progressOn: { backgroundColor: colors.primary },
  progressOff: { backgroundColor: colors.surfaceMuted },

  step: { gap: spacing.lg },
  block: { gap: spacing.xs },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  hintCard: { gap: spacing.xs },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  hintTitle: { flex: 1 },

  futureCard: { gap: spacing.sm },
  futureMeta: { gap: 2 },

  consentCard: { gap: 0 },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  consentDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  consentText: { flex: 1, gap: 2 },

  navRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  navBtn: { flex: 1 },
  finishWrap: { gap: spacing.sm, marginTop: spacing.sm },
});
