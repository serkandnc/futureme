import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  Screen,
  SectionHeader,
  TextField,
} from '@/components';
import { COGNITIVE_DISTORTIONS, THOUGHT_LAB_EXAMPLE } from '@/data/seed';
import { colors, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

/**
 * Dusunce Laboratuvari (README bolum 9 - BDT tabanli yol haritasi).
 * Takilinan bir ani kucuk bir davranis deneyine ceviren dusunce kaydi.
 * Once gundelik dil; klinik aciklama istege bagli bir notun arkasinda durur.
 */
export default function ThoughtLabScreen() {
  const router = useRouter();

  // Zustand secici uyarisi: her seferinde tek bir alan/aksiyon dondururuz.
  const thoughtRecords = useStore((s) => s.thoughtRecords);
  const addThoughtRecord = useStore((s) => s.addThoughtRecord);

  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [distortion, setDistortion] = useState<string | undefined>(undefined);
  const [emotion, setEmotion] = useState('');
  const [behavior, setBehavior] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [experiment, setExperiment] = useState('');
  const [learning, setLearning] = useState('');
  const [showMethod, setShowMethod] = useState(false);

  const canSave = situation.trim().length > 0 && automaticThought.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const trimmedLearning = learning.trim();
    addThoughtRecord({
      situation: situation.trim(),
      automaticThought: automaticThought.trim(),
      distortion,
      emotion: emotion.trim(),
      behavior: behavior.trim(),
      balancedThought: balancedThought.trim(),
      experiment: experiment.trim(),
      learning: trimmedLearning.length > 0 ? trimmedLearning : undefined,
    });
    router.back();
  };

  return (
    <Screen scroll>
      <SectionHeader
        title="Dusunce Laboratuvari"
        subtitle="Takildigin bir ani al, uzerinde biraz dusun ve onu kucucuk bir denemeye cevir. Amac kendini yargilamak degil, ne oldugunu merakla gormek."
      />

      {/* Istege bagli yontem notu - varsayilan olarak kapali. */}
      <Card tone="muted" onPress={() => setShowMethod((v) => !v)}>
        <View style={styles.methodHeader}>
          <AppText variant="bodyStrong" color={colors.primary} style={styles.methodTitle}>
            Bunun arkasindaki yontem neydi?
          </AppText>
          <AppText variant="caption" color={colors.primary}>
            {showMethod ? 'Gizle' : 'Goster'}
          </AppText>
        </View>
        {showMethod ? (
          <View style={styles.method}>
            <AppText variant="body" color={colors.onSurfaceMuted}>
              Bu kucuk akis, zorlandigin bir ani parcalara ayirmana yarar: once ne
              oldugunu (Durum), o an zihninden gecen ilk cumleyi (Otomatik dusunce) ve
              bunun sana ne hissettirip ne yaptirdigini (Duygu/Davranis) yaziyorsun.
              Sonra ayni duruma daha adil bakan bir cumle (Dengeli dusunce) ve onu
              sinayacak kucucuk bir adim (Kucuk deney) buluyorsun. En sonda da ne fark
              ettigini (Ogrenme) not ediyorsun.
            </AppText>
            <AppText variant="body" color={colors.onSurfaceMuted}>
              Fikir su: dusuncelerimizi kesin bir gercek gibi degil, sinanabilir tahminler
              gibi ele almak. Kucuk bir deney cogu zaman, korktugumuz seyin sandigimizdan
              daha kucuk oldugunu gosterir.
            </AppText>
          </View>
        ) : null}
      </Card>

      <View style={styles.form}>
        <TextField
          label="Durum"
          value={situation}
          onChangeText={setSituation}
          placeholder={THOUGHT_LAB_EXAMPLE.situation}
          multiline
          helperText="Ne oldu? Nerede, ne zaman, kimlerle?"
        />
        <TextField
          label="Otomatik dusunce"
          value={automaticThought}
          onChangeText={setAutomaticThought}
          placeholder={THOUGHT_LAB_EXAMPLE.automaticThought}
          multiline
          helperText="O anda zihninden gecen ilk cumle."
        />

        <View style={styles.field}>
          <AppText variant="bodyStrong">Oruntu</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            Dusuncenin tanidik bir tuzaga benzeyip benzemedigine bak. Istersen bir tane
            sec, istersen bos birak.
          </AppText>
          <View style={styles.chips}>
            {COGNITIVE_DISTORTIONS.map((d) => (
              <Chip
                key={d}
                label={d}
                selected={distortion === d}
                onPress={() => setDistortion((cur) => (cur === d ? undefined : d))}
              />
            ))}
          </View>
          <AppText variant="caption" color={colors.onSurfaceFaint}>
            Ornek: {THOUGHT_LAB_EXAMPLE.distortion}
          </AppText>
        </View>

        <TextField
          label="Duygu / beden"
          value={emotion}
          onChangeText={setEmotion}
          placeholder={THOUGHT_LAB_EXAMPLE.emotion}
          helperText="Ne hissettin? Bedeninde nerede duydun?"
        />
        <TextField
          label="Davranis"
          value={behavior}
          onChangeText={setBehavior}
          placeholder={THOUGHT_LAB_EXAMPLE.behavior}
          helperText="O an ne yaptin ya da neyden kacindin?"
        />
        <TextField
          label="Dengeli dusunce"
          value={balancedThought}
          onChangeText={setBalancedThought}
          placeholder={THOUGHT_LAB_EXAMPLE.balancedThought}
          multiline
          helperText="Ayni duruma daha adil ve gercekci bakan bir cumle."
        />
        <TextField
          label="Kucuk davranis deneyi"
          value={experiment}
          onChangeText={setExperiment}
          placeholder={THOUGHT_LAB_EXAMPLE.experiment}
          helperText="Bugun deneyebilecegin, gozunu korkutmayacak kadar kucuk bir adim."
        />
        <TextField
          label="Ogrenme"
          value={learning}
          onChangeText={setLearning}
          placeholder={THOUGHT_LAB_EXAMPLE.learning}
          multiline
          helperText="Istege bagli. Deneyi yaptiktan sonra doldur: ne fark ettin?"
        />
      </View>

      <Button
        label="Kaydet"
        onPress={handleSave}
        disabled={!canSave}
        fullWidth
        accessibilityHint="Dusunce kaydini saklar ve laboratuvari kapatir"
      />
      {!canSave ? (
        <AppText variant="caption" color={colors.onSurfaceMuted} center>
          Baslamak icin en azindan durumu ve o anki dusunceni yaz.
        </AppText>
      ) : null}
      <Button label="Vazgec" variant="ghost" onPress={() => router.back()} fullWidth />

      {/* Gecmis kayitlar - en yeni ustte (store zaten basa ekliyor). */}
      <SectionHeader title="Gecmis kayitlar" subtitle="Daha once uzerinde calistigin anlar." />
      {thoughtRecords.length === 0 ? (
        <Card tone="muted">
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Henuz kayit yok. Ilk takildigin ani yukarida kucuk bir denemeye cevirebilirsin.
          </AppText>
        </Card>
      ) : (
        thoughtRecords.map((r) => (
          <Card key={r.id} style={styles.record}>
            <AppText variant="bodyStrong">{r.situation}</AppText>
            {r.balancedThought.trim().length > 0 ? (
              <AppText variant="body" color={colors.onSurfaceMuted}>
                Dengeli dusunce: {r.balancedThought}
              </AppText>
            ) : null}
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  methodTitle: { flex: 1 },
  method: { gap: spacing.sm, marginTop: spacing.md },
  form: { gap: spacing.lg },
  field: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  record: { gap: spacing.xs },
});
