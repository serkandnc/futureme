import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  Chip,
  FutureSelfScene,
  Screen,
  SectionHeader,
} from '@/components';
import { TIER_LABEL } from '@/domain';
import { colors, spacing, tierColors } from '@/theme';
import type { EnergyLevel } from '@/types';
import { today, useStore } from '@/store/useStore';

const ENERGY: { level: EnergyLevel; label: string; emoji: string }[] = [
  { level: 'low', label: 'Dusuk', emoji: '🌙' },
  { level: 'medium', label: 'Orta', emoji: '🌤️' },
  { level: 'high', label: 'Yuksek', emoji: '☀️' },
];

/**
 * Sabah deneyimi (README bolum 5 - Sabah). Once kisa bir gelecek sahnesi, enerji
 * isareti, sonra gunun uc hedefinin gelecekteki benlige gonderilmesi.
 */
export default function MorningScreen() {
  const router = useRouter();
  const date = today();

  const displayName = useStore((s) => s.profile.displayName);
  const plan = useStore((s) => s.plansByDate[date]);
  const startMorning = useStore((s) => s.startMorning);
  const setEnergy = useStore((s) => s.setEnergy);
  const shrinkGoal = useStore((s) => s.shrinkGoal);
  const commitPlan = useStore((s) => s.commitPlan);

  useEffect(() => {
    startMorning(date);
  }, [date, startMorning]);

  if (!plan) {
    return (
      <Screen scroll>
        <AppText variant="body">Hazirlaniyor...</AppText>
      </Screen>
    );
  }

  if (plan.sentToFutureSelf) {
    return (
      <Screen scroll>
        <FutureSelfScene
          name={displayName}
          message="Uc kaniti aldim. Gun icinde tek dokunusla tamamla; zorlanirsan kurtarma adimi hep burada."
        />
        <Button label="Yola don" onPress={() => router.replace('/(tabs)/path')} fullWidth />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <FutureSelfScene
        name={displayName}
        message="Gunaydin. Bugun kusursuz olman gerekmiyor. Bana uc kanit gonder: bir ana adim, bir destek adimi ve zor bir gun icin en kucuk adim."
      />

      <SectionHeader
        kicker="ENERJI"
        title="Bugun bana nasil yaklasiyoruz?"
        subtitle="Enerjine gore hedefleri birlikte olcekleyelim."
      />
      <View style={styles.energyRow}>
        {ENERGY.map((e) => (
          <Chip
            key={e.level}
            label={e.label}
            emoji={e.emoji}
            selected={plan.energy === e.level}
            onPress={() => setEnergy(date, e.level)}
          />
        ))}
      </View>

      <SectionHeader title="Bugunun uc koprusu" subtitle="Degistir, kucult veya oldugu gibi kabul et." />
      {plan.goals.map((g) => (
        <Card key={g.id} style={styles.goal}>
          <View style={styles.goalHeader}>
            <View style={[styles.dot, { backgroundColor: tierColors[g.tier] }]} />
            <AppText variant="label" color={tierColors[g.tier]}>
              {TIER_LABEL[g.tier]}
            </AppText>
          </View>
          <AppText variant="bodyStrong">{g.title}</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            {g.completionCriteria}
            {g.durationMinutes ? `  ·  ${g.durationMinutes} dk` : ''}
          </AppText>
          <Button
            label={`Kucult: ${g.minimumVersion}`}
            variant="ghost"
            onPress={() => shrinkGoal(date, g.id)}
            fullWidth
            style={styles.shrink}
          />
        </Card>
      ))}

      <Button
        label="Uc hedefi gelecekteki benligime gonder"
        onPress={() => {
          commitPlan(date);
          router.replace('/(tabs)/path');
        }}
        size="lg"
        fullWidth
        style={styles.send}
        accessibilityHint="Gunluk sozlesmeyi baslatir ve +1 ASAMA kazandirir"
      />
      <AppText variant="caption" color={colors.onSurfaceMuted} center>
        Gondermek gunluk sozlesmeni baslatir ve sana +1 ASAMA, +10 XP kazandirir.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  energyRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  goal: { gap: spacing.xs },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  shrink: { marginTop: spacing.sm },
  send: { marginTop: spacing.md },
});
