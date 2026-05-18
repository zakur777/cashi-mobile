import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionForm } from "../../../src/components/transactions/TransactionForm";
import { AppBackground } from "../../../src/components/ui/AppBackground";
import { useCategories } from "../../../src/hooks/useCategories";
import { useTransactionForm } from "../../../src/hooks/useTransactionForm";
import { useTransactions } from "../../../src/hooks/useTransactions";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	const { categories, error: categoryError, refresh: refreshCategories } =
		useCategories();
	const {
		transactions,
		error: transactionError,
		createTransaction,
		updateTransaction,
		deleteTransaction,
		refresh: refreshTransactions,
	} = useTransactions({ categories });

	useFocusEffect(
		useCallback(() => {
			void refreshCategories();
			void refreshTransactions();
		}, [refreshCategories, refreshTransactions]),
	);

	const isNew = id === "new";
	const current = useMemo(
		() => transactions.find((transaction) => transaction.id === id),
		[transactions, id],
	);

	const {
		amount,
		type,
		description,
		date,
		categoryId,
		errors,
		formError,
		submitting,
		setAmount,
		setType,
		setDescription,
		setDate,
		setCategoryId,
		handleSubmit,
	} = useTransactionForm({
		initialValues: {
			amount: "",
			type: "expense",
			description: "",
			date: today,
			categoryId: "",
		},
		onSubmit: async (validValues) => {
			if (isNew) {
				await createTransaction(validValues);
			} else if (id) {
				await updateTransaction(id, validValues);
			}
			router.back();
		},
	});

	useEffect(() => {
		if (!isNew && current) {
			setAmount(String(current.amount));
			setType(current.type);
			setDescription(current.description);
			setDate(current.date);
			setCategoryId(current.categoryId);
		}
	}, [
		current,
		isNew,
		setAmount,
		setCategoryId,
		setDate,
		setDescription,
		setType,
	]);

	return (
		<AppBackground>
			<SafeAreaView style={styles.container}>
				<TransactionForm
					title={isNew ? "Nueva transacción" : "Editar transacción"}
					amount={amount}
					type={type}
					description={description}
					date={date}
					categoryId={categoryId}
					categories={categories}
					errors={errors}
					formError={formError ?? transactionError ?? categoryError}
					loading={submitting}
					saveLabel={isNew ? "Crear transacción" : "Guardar cambios"}
					onChangeAmount={setAmount}
					onChangeType={setType}
					onChangeDescription={setDescription}
					onChangeDate={setDate}
					onChangeCategoryId={setCategoryId}
					onCancel={() => router.back()}
					onSave={() => {
						void handleSubmit();
					}}
					onDelete={
						!isNew && id
							? () => {
									void deleteTransaction(id)
										.then(() => router.back())
										.catch(() => {});
								}
							: undefined
					}
				/>
			</SafeAreaView>
		</AppBackground>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "transparent" },
});
