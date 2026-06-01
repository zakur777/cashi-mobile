import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionForm } from "../../../src/components/transactions/TransactionForm";
import { AppBackground } from "../../../src/components/ui/AppBackground";
import { useCategories } from "../../../src/hooks/useCategories";
import { useTransactionForm } from "../../../src/hooks/useTransactionForm";
import { useImagePicker } from "../../../src/hooks/useImagePicker";
import { useLocation } from "../../../src/hooks/useLocation";
import { useTransactions } from "../../../src/hooks/useTransactions";

const today = new Date().toISOString().slice(0, 10);

export default function TransactionDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		categories,
		error: categoryError,
		refresh: refreshCategories,
	} = useCategories();
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
	const imagePicker = useImagePicker({ initialPhotoUri: current?.photoUri });
	const locationPicker = useLocation({ initialLocation: current?.location });

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
		metadata: {
			...(imagePicker.photoUri ? { photoUri: imagePicker.photoUri } : {}),
			...(locationPicker.location ? { location: locationPicker.location } : {}),
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
					photoUri={imagePicker.photoUri}
					photoError={imagePicker.error}
					location={locationPicker.location}
					locationError={locationPicker.error}
					metadataLoading={imagePicker.loading || locationPicker.loading}
					loading={submitting}
					saveLabel={isNew ? "Crear transacción" : "Guardar cambios"}
					onChangeAmount={setAmount}
					onChangeType={setType}
					onChangeDescription={setDescription}
					onChangeDate={setDate}
					onChangeCategoryId={setCategoryId}
					onCapturePhoto={() => {
						void imagePicker.capturePhoto();
					}}
					onSelectPhoto={() => {
						void imagePicker.selectPhoto();
					}}
					onClearPhoto={imagePicker.clearPhoto}
					onCaptureLocation={() => {
						void locationPicker.captureLocation();
					}}
					onClearLocation={locationPicker.clearLocation}
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
