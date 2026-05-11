import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { colors } from '../../src/design/tokens';

export default function BalanceTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Balance (placeholder Unit 1)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
  text: { fontSize: 16, color: colors.textPrimary },
});
