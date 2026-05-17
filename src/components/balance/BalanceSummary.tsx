import { StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, radius, spacing, typography } from '../../design/tokens';
import { formatCLP } from '../../domain/money';

interface PrimaryExpenseCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
}

interface BalanceSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  primaryExpenseCategory?: PrimaryExpenseCategory | null;
}

export function BalanceSummary({ totalIncome, totalExpense, balance, primaryExpenseCategory }: BalanceSummaryProps) {
  const expenseRatio = totalIncome > 0 ? Math.min(totalExpense / totalIncome, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Resumen</Text>
          <Text style={styles.title}>Balance</Text>
        </View>
        <View style={styles.iconButton}>
          <Text style={styles.iconButtonText}>↻</Text>
        </View>
      </View>

      <GradientSurface style={styles.heroCard} colors={['#281C59', '#1A1D2E', '#070811']}>
        <Text style={styles.heroKicker}>Balance actual</Text>
        <Text style={styles.mainAmount}>{formatCLP(balance)}</Text>
        <Text style={styles.heroHelp}>Calculado desde transacciones locales en CLP, sin decimales.</Text>

        <View style={styles.miniStats}>
          <View style={styles.miniStat}>
            <Text style={styles.miniLabel}>Ingresos</Text>
            <Text style={styles.incomeAmount}>{formatCLP(totalIncome)}</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniLabel}>Egresos</Text>
            <Text style={styles.expenseAmount}>{formatCLP(totalExpense)}</Text>
          </View>
        </View>
      </GradientSurface>

      {primaryExpenseCategory ? (
        <View style={styles.principalCard}>
          <View style={styles.principalTopRow}>
            <View style={styles.principalContent}>
              <Text style={styles.metricLabel}>Categoría principal</Text>
              <Text style={styles.principalName}>{primaryExpenseCategory.name}</Text>
              <Text style={styles.principalHelp}>Mayor gasto del período demo.</Text>
            </View>
            <Text style={styles.principalAmount}>{formatCLP(primaryExpenseCategory.amount)}</Text>
          </View>
          <View style={styles.progressTrack}>
            <GradientSurface style={[styles.progressFill, { width: `${Math.max(expenseRatio * 100, 8)}%` }]} />
          </View>
        </View>
      ) : null}

      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Patrones de estado</Text>
        <Text style={styles.stateText}>Vacío: CTA contextual. Cargando: skeleton de tarjetas.</Text>
        <Text style={styles.stateText}>Error: mensaje breve y reintento.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: 96,
    gap: spacing.md,
    backgroundColor: 'transparent',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: {
    color: colors.lime,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: colors.textPrimary, fontFamily: typography.display, fontSize: 30, fontWeight: '800' },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  iconButtonText: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 22, fontWeight: '800' },
  heroCard: {
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  heroKicker: {
    color: colors.textSecondary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  mainAmount: {
    color: colors.textPrimary,
    fontFamily: typography.display,
    fontSize: 40,
    fontWeight: '800',
  },
  heroHelp: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 13, lineHeight: 18, marginTop: spacing.xs },
  miniStats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.075)',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  miniLabel: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 12, marginBottom: 5 },
  incomeAmount: { color: colors.success, fontFamily: typography.bodyBold, fontWeight: '800', fontSize: 18 },
  expenseAmount: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontWeight: '800', fontSize: 18 },
  metricLabel: {
    color: colors.textSecondary,
    fontFamily: typography.bodyBold,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  principalCard: {
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  principalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  principalContent: { flex: 1 },
  principalName: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 16, fontWeight: '800' },
  principalHelp: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 13, marginTop: spacing.xs },
  principalAmount: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 18, fontWeight: '800' },
  progressTrack: { height: 7, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginTop: 11 },
  progressFill: { height: 7, borderRadius: radius.pill },
  stateCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: 'rgba(237,247,189,0.045)',
  },
  stateTitle: { color: colors.textPrimary, fontFamily: typography.bodyBold, fontSize: 14, fontWeight: '800', marginBottom: 5 },
  stateText: { color: colors.textSecondary, fontFamily: typography.body, fontSize: 13, lineHeight: 18 },
});
