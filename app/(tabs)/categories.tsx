import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryList } from "../../src/components/categories/CategoryList";
import { AppBackground } from "../../src/components/ui/AppBackground";
import { colors, spacing } from "../../src/design/tokens";
import { useCategories } from "../../src/hooks/useCategories";
import { useTransactions } from "../../src/hooks/useTransactions";

export default function CategoriesTab() {
	const router = useRouter();
	const { categories, loading, error, refresh, deleteCategory } =
		useCategories();
	const { transactions, refresh: refreshTransactions } = useTransactions({
		categories,
	});

	useFocusEffect(
		useCallback(() => {
			void refresh();
			void refreshTransactions();
		}, [refresh, refreshTransactions]),
	);

	return (
		<AppBackground>
			<SafeAreaView style={styles.container}>
				{loading ? (
					<Text style={styles.stateText}>Cargando categorías...</Text>
				) : null}
				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				{!loading ? (
					<CategoryList
						categories={categories}
						transactions={transactions}
						onCreate={() => router.push("/(tabs)/category/new")}
						onEdit={(id) => router.push(`/(tabs)/category/${id}`)}
						onDelete={(id) => {
							void deleteCategory(id).catch(() => {});
						}}
					/>
				) : null}
			</SafeAreaView>
		</AppBackground>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "transparent" },
	stateText: {
		paddingHorizontal: spacing.md,
		paddingTop: spacing.md,
		color: colors.textSecondary,
	},
	errorText: {
		paddingHorizontal: spacing.md,
		paddingTop: spacing.xs,
		color: colors.danger,
	},
});
