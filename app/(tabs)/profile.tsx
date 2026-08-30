import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText, Button, Card, Screen, SectionHeader } from '@/components';
import { colors, palette, spacing } from '@/theme';
import type { AccessibilityPrefs, Consents, NotificationPrefs } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Profil ve Kontroller ekrani (README bolum 11, 12, 13, 17).
 * Izinler, bildirimler, erisilebilirlik ve veri kontrolleri tek yerde.
 * Her izin ayri ayri ve geri alinabilir; model egitimi varsayilan olarak kapalidir.
 */

type ConsentRow = { key: keyof Consents; label: string; description: string; note?: string };
type NotifBoolKey = 'morning' | 'planned' | 'evening' | 'comeback';
type NotifRow = { key: NotifBoolKey; label: string; description: string };
type AccessRow = { key: keyof AccessibilityPrefs; label: string; description: string };

const CONSENT_ROWS: ConsentRow[] = [
  {
    key: 'photo',
    label: 'Fotograf',
    description: 'Gelecekteki benlik sahnesi ve avatar icin fotografini kullan.',
  },
  {
    key: 'voice',
    label: 'Ses',
    description: 'Sesli yol arkadasligi ve gelecek-ben sesi icin ses kaydini kullan.',
  },
  {
    key: 'ai',
    label: 'Yapay zeka',
    description: 'Plan, sohbet ve koclugu kisisellestirmek icin yapay zekayi kullan.',
  },
  {
    key: 'analytics',
    label: 'Kullanim analitigi',
    description: 'Uygulamayi iyilestirmek icin anonim kullanim olcumlerini paylas.',
  },
  {
    key: 'modelTraining',
    label: 'Model egitimi',
    description: 'Verilerini modelleri gelistirmek icin kullanmamiza izin ver.',
    note:
      'Varsayilan olarak KAPALI. Bu izin diger izinlerden ayridir ve istedigin an geri alabilirsin (README bolum 17).',
  },
];

const NOTIF_ROWS: NotifRow[] = [
  { key: 'morning', label: 'Sabah', description: 'Gelecek sahnesine ve bugunun uc kanitina davet.' },
  {
    key: 'planned',
    label: 'Planlanan an',
    description: 'Kendi uygulama niyetin icin nazik bir hatirlatma.',
  },
  { key: 'evening', label: 'Aksam', description: 'Yargisiz gunluk kapanis daveti.' },
  {
    key: 'comeback',
    label: 'Geri donus',
    description: 'Ara verdiginde bagi yeniden kurmak icin tek kucuk basamak.',
  },
];

const ACCESS_ROWS: AccessRow[] = [
  {
    key: 'reduceMotion',
    label: 'Hareketi azalt',
    description: 'Kutlama ve gecis animasyonlarini sakin tutar.',
  },
  { key: 'muteSound', label: 'Sesi kapat', description: 'Uygulama ici ses ve efektleri susturur.' },
  {
    key: 'highContrast',
    label: 'Yuksek kontrast',
    description: 'Metin ve ogeler arasindaki kontrasti artirir.',
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  // Zustand secici uyarisi: profile kararli bir dilim; eylem referanslari ayri ayri secilir.
  const profile = useStore((s) => s.profile);
  const setConsent = useStore((s) => s.setConsent);
  const setNotificationPref = useStore((s) => s.setNotificationPref);
  const setAccessibilityPref = useStore((s) => s.setAccessibilityPref);
  const resetAll = useStore((s) => s.resetAll);

  const [exportRequested, setExportRequested] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetAll();
    router.replace('/onboarding');
  };

  return (
    <Screen scroll>
      <SectionHeader
        title="Profil ve Kontroller"
        subtitle={
          profile.displayName
            ? `${profile.displayName}, izinler ve tercihler senin kontrolunde.`
            : 'Izinler, bildirimler ve erisilebilirlik senin kontrolunde.'
        }
      />

      {/* Izinler - her izin ayri ayri ve geri alinabilir (README bolum 4.1, 17) */}
      <Card>
        <CardHeading
          title="Izinler"
          description="Her izni ayri ayri acip kapatabilirsin; hicbiri digerini gerektirmez."
        />
        {CONSENT_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            note={row.note}
            value={profile.consents[row.key]}
            onValueChange={(v) => setConsent(row.key, v)}
            showDivider={i > 0}
          />
        ))}
      </Card>

      {/* Bildirimler (README bolum 13) */}
      <Card>
        <CardHeading
          title="Bildirimler"
          description="Ton, siklik ve sessiz saatler senin secimin. Sistem gormezden gelinen bildirimleri artirmaz."
        />
        {NOTIF_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            value={profile.notifications[row.key]}
            onValueChange={(v) => setNotificationPref(row.key, v)}
            showDivider={i > 0}
          />
        ))}
        <View style={styles.readonlyRow}>
          <AppText variant="bodyStrong">Sessiz saatler</AppText>
          <AppText variant="body" color={colors.onSurfaceMuted}>
            {profile.notifications.quietHoursStart} – {profile.notifications.quietHoursEnd} arasinda
            bildirim gonderilmez.
          </AppText>
        </View>
      </Card>

      {/* Erisilebilirlik (README bolum 12) */}
      <Card>
        <CardHeading
          title="Erisilebilirlik"
          description="Hareket azaltma, ses kapatma ve yuksek kontrast ilk surum kapsamindadir."
        />
        {ACCESS_ROWS.map((row, i) => (
          <ToggleRow
            key={row.key}
            label={row.label}
            description={row.description}
            value={profile.accessibility[row.key]}
            onValueChange={(v) => setAccessibilityPref(row.key, v)}
            showDivider={i > 0}
          />
        ))}
      </Card>

      {/* Veri kontrolleri (README bolum 17) */}
      <Card>
        <CardHeading
          title="Veri kontrolleri"
          description="Verilerin senindir. Diledigin an disa aktarabilir ya da tamamen silebilirsin."
        />
        <View style={styles.dataBlock}>
          <Button
            label="Verilerimi disa aktar"
            variant="secondary"
            fullWidth
            onPress={() => setExportRequested(true)}
          />
          {exportRequested ? (
            <AppText variant="caption" color={colors.onSurfaceMuted}>
              Disa aktarma hazirlaniyor. Uretim surumunde verilerin sifreli bir dosya olarak
              hazirlanip sana guvenli bir baglantiyla iletilir.
            </AppText>
          ) : null}
        </View>

        <View style={styles.dataBlock}>
          {confirmReset ? (
            <View style={styles.dataBlock}>
              <AppText variant="bodyStrong" color={colors.danger}>
                Emin misin?
              </AppText>
              <AppText variant="caption" color={colors.onSurfaceMuted}>
                Yolculugun, hedeflerin, kanitlarin ve tum tercihlerin kalici olarak silinir. Uretim
                surumunde silme; turetilmis medya ve yedekler icin de yurutulur (README bolum 17).
              </AppText>
              <Button label="Evet, hesabimi sil" variant="danger" fullWidth onPress={handleReset} />
              <Button
                label="Vazgec"
                variant="ghost"
                fullWidth
                onPress={() => setConfirmReset(false)}
              />
            </View>
          ) : (
            <Button
              label="Hesabimi sifirla / sil"
              variant="danger"
              fullWidth
              onPress={() => setConfirmReset(true)}
            />
          )}
        </View>
      </Card>

      {/* Klinik sinir notu (README bolum 17) */}
      <Card tone="muted">
        <CardHeading title="Klinik sinir" />
        <AppText variant="body">
          FutureMe bir terapi, tanı veya acil yardım uygulaması değildir.
        </AppText>
        <AppText variant="body" color={colors.onSurfaceMuted}>
          Kriz aninda uygulama seni gercek ve yerel yardim kaynaklarina yonlendirir; profesyonel
          bakimin yerine gecmez.
        </AppText>
      </Card>
    </Screen>
  );
}

function CardHeading({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.cardHeading}>
      <AppText variant="heading">{title}</AppText>
      {description ? (
        <AppText variant="caption" color={colors.onSurfaceMuted}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  note?: string;
  showDivider?: boolean;
}

function ToggleRow({ label, description, value, onValueChange, note, showDivider }: ToggleRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.rowDivider]}>
      <View style={styles.rowMain}>
        <View style={styles.rowText}>
          <AppText variant="bodyStrong">{label}</AppText>
          <AppText variant="caption" color={colors.onSurfaceMuted}>
            {description}
          </AppText>
          {note ? (
            <AppText variant="caption" color={colors.primary}>
              {note}
            </AppText>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={palette.white}
          ios_backgroundColor={colors.border}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeading: { gap: spacing.xs, marginBottom: spacing.sm },
  row: { paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1, gap: spacing.xs },
  readonlyRow: {
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  dataBlock: { gap: spacing.sm, marginTop: spacing.sm },
});
