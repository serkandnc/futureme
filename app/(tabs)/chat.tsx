import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, SafetyBanner, Screen, TextField } from '@/components';
import { colors, radius, spacing } from '@/theme';
import type { ChatMessage } from '@/types';
import { useStore } from '@/store/useStore';

/**
 * Konus ekrani - Gelecekteki Ben ile metin sohbeti (README bolum 8).
 * Gelecekteki benlik kesinlik/kehanet dili kullanmaz; kriz aninda oyun dili
 * susar ve gercek destege yonlendirir (README bolum 17). Yanitlar store
 * icindeki kural tabanli mantikla uretilir; ekran yalnizca akisi gosterir.
 */
export default function ChatScreen() {
  const messages = useStore((s) => s.messages);
  const safety = useStore((s) => s.safety);
  const sendMessage = useStore((s) => s.sendMessage);
  const acknowledgeSafety = useStore((s) => s.acknowledgeSafety);

  const [draft, setDraft] = useState('');

  const onSend = () => {
    const text = draft.trim();
    if (!text) return;
    sendMessage(text);
    setDraft('');
  };

  return (
    <Screen scroll>
      <AppText variant="caption" color={colors.onSurfaceMuted} style={styles.contract}>
        Gelecekteki Ben kesinlik ya da kehanet diliyle konusmaz; "bu yolu surdurursen bu ihtimale
        yaklasiyorsun" der. Kriz aninda oyunu birakip gercek destege yonlendirir.
      </AppText>

      {safety.suspended ? (
        <SafetyBanner
          title={safety.title}
          message={safety.message}
          resources={safety.resources}
          onAcknowledge={acknowledgeSafety}
        />
      ) : null}

      {messages.length === 0 ? (
        <Card tone="muted">
          <AppText variant="body" color={colors.onSurfaceMuted}>
            Henuz mesaj yok. Aklindan gecen bir seyi yaz; birlikte bugunun kucuk bir adimina
            cevirelim.
          </AppText>
        </Card>
      ) : (
        <View style={styles.thread}>
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        <View style={styles.inputField}>
          <TextField
            value={draft}
            onChangeText={setDraft}
            placeholder="Gelecekteki bene yaz..."
          />
        </View>
        <Button label="Gonder" onPress={onSend} disabled={draft.trim().length === 0} />
      </View>
    </Screen>
  );
}

/** Tek bir sohbet balonu: 'future' solda ayri yuzeyde, 'user' sagda marka renginde. */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isFuture = message.role === 'future';
  return (
    <View style={[styles.bubbleRow, isFuture ? styles.rowLeft : styles.rowRight]}>
      <View style={[styles.bubble, isFuture ? styles.futureBubble : styles.userBubble]}>
        {isFuture ? (
          <AppText variant="label" color={colors.primary}>
            Gelecekteki Ben
          </AppText>
        ) : null}
        <AppText variant="body" color={isFuture ? colors.onSurface : colors.primaryText}>
          {message.text}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contract: { lineHeight: 18 },
  thread: { gap: spacing.md },
  bubbleRow: { flexDirection: 'row' },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  futureBubble: { backgroundColor: colors.surfaceMuted, borderTopLeftRadius: radius.sm },
  userBubble: { backgroundColor: colors.primary, borderTopRightRadius: radius.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  inputField: { flex: 1 },
});
