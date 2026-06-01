
import { Ionicons } from "@expo/vector-icons";
import {
	KeyboardAvoidingView,
	Image,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { GradientSurface } from "../ui/GradientSurface";
import {
	colors,
	componentSizes,
	layout,
	radius,
	spacing,
	touchTarget,
	typography,
} from "../../design/tokens";
import type { Category, TransactionLocation, TransactionType } from "../../domain/types";

interface MetadataActionProps {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	onPress: () => void;
	disabled?: boolean;
	variant?: "default" | "danger";
}

function MetadataAction({
	icon,
	label,
	onPress,
	disabled = false,
	variant = "default",
}: MetadataActionProps) {
	const isDanger = variant === "danger";

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.metadataAction,
				isDanger ? styles.metadataActionDanger : undefined,
				pressed && !disabled ? styles.metadataActionPressed : undefined,
				disabled ? styles.metadataActionDisabled : undefined,
			]}
		>
			<Ionicons
				name={icon}
				size={16}
				color={isDanger ? colors.danger : colors.lime}
			/>
			<Text
				style={[
					styles.metadataActionText,
					isDanger ? styles.metadataActionTextDanger : undefined,
				]}
			>
				{label}
			</Text>
		</Pressable>
	);
}

interface TransactionFormProps {
	title: string;
	amount: string;
	type: TransactionType;
	description: string;
	date: string;
	categoryId: string;
	categories: Category[];
	errors: {
		amount?: string;
		type?: string;
		description?: string;
		date?: string;
		categoryId?: string;
	};
	formError?: string | null;
	photoUri?: string;
	photoError?: string | null;
	location?: TransactionLocation;
	locationError?: string | null;
	metadataLoading?: boolean;
	loading: boolean;
	saveLabel: string;
	onChangeAmount: (value: string) => void;
	onChangeType: (value: TransactionType) => void;
	onChangeDescription: (value: string) => void;
	onChangeDate: (value: string) => void;
	onChangeCategoryId: (value: string) => void;
	onCapturePhoto: () => void;
	onSelectPhoto: () => void;
	onClearPhoto: () => void;
	onCaptureLocation: () => void;
	onClearLocation: () => void;
	onCancel: () => void;
	onSave: () => void;
	onDelete?: () => void;
}

export function TransactionForm(props: TransactionFormProps) {
	const {
		title,
		amount,
		type,
		description,
		date,
		categoryId,
		categories,
		errors,
		formError,
		photoUri,
		photoError,
		location,
		locationError,
		metadataLoading = false,
		loading,
		saveLabel,
		onChangeAmount,
		onChangeType,
		onChangeDescription,
		onChangeDate,
		onChangeCategoryId,
		onCapturePhoto,
		onSelectPhoto,
		onClearPhoto,
		onCaptureLocation,
		onClearLocation,
		onCancel,
		onSave,
		onDelete,
	} = props;

	return (
		<KeyboardAvoidingView
			style={styles.keyboardContainer}
			behavior={Platform.select({ ios: "padding", android: undefined })}
		>
			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.topbar}>
					<Pressable
						style={styles.backButton}
						onPress={onCancel}
						accessibilityRole="button"
						accessibilityLabel="Volver"
					>
						<Text style={styles.backButtonText}>‹</Text>
					</Pressable>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>CLP</Text>
					</View>
				</View>

				<GradientSurface
					style={styles.heroCard}
					colors={["#281C59", "#151621", "#070811"]}
				>
					<Text style={styles.kicker}>Movimiento</Text>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.heroHelp}>
						Registrá ingresos y egresos en pesos chilenos.
					</Text>
				</GradientSurface>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>Monto</Text>
					<TextInput
						value={amount}
						onChangeText={onChangeAmount}
						keyboardType="decimal-pad"
						placeholder="Ej: 1500"
						placeholderTextColor={colors.textMuted}
						style={[
							styles.input,
							errors.amount ? styles.inputError : undefined,
						]}
					/>
					{errors.amount ? (
						<Text style={styles.error}>{errors.amount}</Text>
					) : null}
				</View>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>Tipo</Text>
					<View style={styles.typeRow}>
						<Pressable
							style={[
								styles.typeButton,
								type === "income" ? styles.typeButtonActive : undefined,
							]}
							onPress={() => onChangeType("income")}
						>
							<Text
								style={[
									styles.typeButtonText,
									type === "income" ? styles.typeButtonTextActive : undefined,
								]}
							>
								Ingreso
							</Text>
						</Pressable>
						<Pressable
							style={[
								styles.typeButton,
								type === "expense" ? styles.typeButtonActive : undefined,
							]}
							onPress={() => onChangeType("expense")}
						>
							<Text
								style={[
									styles.typeButtonText,
									type === "expense" ? styles.typeButtonTextActive : undefined,
								]}
							>
								Egreso
							</Text>
						</Pressable>
					</View>
					{errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}
				</View>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>Descripción</Text>
					<TextInput
						value={description}
						onChangeText={onChangeDescription}
						placeholder="Ej: Supermercado"
						placeholderTextColor={colors.textMuted}
						style={[
							styles.input,
							errors.description ? styles.inputError : undefined,
						]}
					/>
					{errors.description ? (
						<Text style={styles.error}>{errors.description}</Text>
					) : null}
				</View>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
					<TextInput
						value={date}
						onChangeText={onChangeDate}
						placeholder="2026-05-11"
						placeholderTextColor={colors.textMuted}
						style={[styles.input, errors.date ? styles.inputError : undefined]}
					/>
					{errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}
				</View>

				<View style={styles.fieldGroup}>
					<Text style={styles.label}>Categoría</Text>
					<View style={styles.categoriesWrap}>
						{categories.map((category) => (
							<Pressable
								key={category.id}
								onPress={() => onChangeCategoryId(category.id)}
								style={[
									styles.categoryChip,
									categoryId === category.id
										? styles.categoryChipActive
										: undefined,
									categoryId === category.id
										? { borderColor: category.color }
										: undefined,
								]}
							>
								<View
									style={[
										styles.categoryDot,
										{ backgroundColor: category.color },
									]}
								/>
								<Text style={styles.categoryChipText}>{category.name}</Text>
							</Pressable>
						))}
					</View>
					{errors.categoryId ? (
						<Text style={styles.error}>{errors.categoryId}</Text>
					) : null}
				</View>

				<View style={styles.metadataCard}>
					<View style={styles.metadataHeader}>
						<View style={styles.metadataIconBadge}>
							<Ionicons name="receipt-outline" size={18} color={colors.lime} />
						</View>
						<View style={styles.metadataHeaderCopy}>
							<Text style={styles.label}>Comprobante</Text>
							<Text style={styles.metadataHelp}>
								Adjuntá una foto local del ticket o boleta. No se envía al backend.
							</Text>
						</View>
					</View>
					<View style={styles.metadataButtonRow}>
						<MetadataAction
							icon="camera-outline"
							label="Tomar foto"
							onPress={onCapturePhoto}
							disabled={metadataLoading}
						/>
						<MetadataAction
							icon="images-outline"
							label="Elegir foto"
							onPress={onSelectPhoto}
							disabled={metadataLoading}
						/>
					</View>
					{photoUri ? (
						<View style={styles.previewCard}>
							<Image
								source={{ uri: photoUri }}
								style={styles.receiptPreview}
								accessibilityLabel="Vista previa del comprobante"
							/>
							<MetadataAction
								icon="trash-outline"
								label="Quitar foto"
								onPress={onClearPhoto}
								variant="danger"
							/>
						</View>
					) : null}
					{photoError ? <Text style={styles.error}>{photoError}</Text> : null}
				</View>

				<View style={styles.metadataCard}>
					<View style={styles.metadataHeader}>
						<View style={styles.metadataIconBadge}>
							<Ionicons name="location-outline" size={18} color={colors.lime} />
						</View>
						<View style={styles.metadataHeaderCopy}>
							<Text style={styles.label}>Ubicación</Text>
							<Text style={styles.metadataHelp}>
								Guardá coordenadas locales para recordar dónde hiciste el movimiento.
							</Text>
						</View>
					</View>
					<View style={styles.metadataButtonRow}>
						<MetadataAction
							icon="navigate-outline"
							label="Usar ubicación actual"
							onPress={onCaptureLocation}
							disabled={metadataLoading}
						/>
						{location ? (
							<MetadataAction
								icon="close-circle-outline"
								label="Quitar ubicación"
								onPress={onClearLocation}
								variant="danger"
							/>
						) : null}
					</View>
					{location ? (
						<View style={styles.locationPill}>
							<Ionicons name="pin-outline" size={14} color={colors.lime} />
							<Text style={styles.metadataText}>
								Lat: {location.latitude}, Lon: {location.longitude}
							</Text>
						</View>
					) : null}
					{locationError ? <Text style={styles.error}>{locationError}</Text> : null}
				</View>

				{formError ? <Text style={styles.error}>{formError}</Text> : null}

				<Pressable
					style={styles.saveButtonShell}
					onPress={onSave}
					disabled={loading}
				>
					<GradientSurface style={styles.saveButton}>
						<Text style={styles.saveText}>
							{loading ? "Guardando..." : saveLabel}
						</Text>
					</GradientSurface>
				</Pressable>

				{onDelete ? (
					<Pressable
						style={styles.deleteButton}
						onPress={onDelete}
						disabled={loading}
					>
						<Text style={styles.deleteText}>Eliminar transacción</Text>
					</Pressable>
				) : null}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	keyboardContainer: { flex: 1, backgroundColor: "transparent" },
	container: {
		padding: layout.screenPadding,
		paddingBottom: 96,
		gap: spacing.md,
		backgroundColor: "transparent",
	},
	topbar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	backButton: {
		width: componentSizes.iconButton,
		height: componentSizes.iconButton,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.surfaceSoft,
	},
	backButtonText: { color: colors.textPrimary, fontSize: 32, lineHeight: 34 },
	badge: {
		minHeight: 36,
		borderRadius: radius.pill,
		borderWidth: 1,
		borderColor: colors.border,
		justifyContent: "center",
		paddingHorizontal: spacing.sm,
		backgroundColor: colors.surfaceSoft,
	},
	badgeText: {
		color: colors.lime,
		fontFamily: typography.bodyBold,
		fontSize: 12,
		fontWeight: "800",
	},
	heroCard: {
		borderRadius: radius.lg,
		borderWidth: 1,
		borderColor: colors.borderStrong,
		padding: spacing.md,
		gap: spacing.xs,
	},
	kicker: {
		color: colors.lime,
		fontFamily: typography.bodyBold,
		fontSize: 12,
		fontWeight: "800",
		letterSpacing: 1.2,
		textTransform: "uppercase",
	},
	title: {
		fontFamily: typography.display,
		fontSize: 24,
		fontWeight: "800",
		color: colors.textPrimary,
	},
	heroHelp: {
		color: colors.textSecondary,
		fontFamily: typography.body,
		fontSize: 13,
		lineHeight: 18,
	},
	fieldGroup: { gap: spacing.xs },
	label: {
		fontFamily: typography.bodyBold,
		fontSize: 13,
		fontWeight: "800",
		color: colors.textSecondary,
		textTransform: "uppercase",
	},
	input: {
		minHeight: componentSizes.inputMinHeight,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.sm,
		paddingHorizontal: spacing.md,
		fontSize: 16,
		color: colors.textPrimary,
		fontFamily: typography.body,
		backgroundColor: colors.surfaceSoft,
	},
	inputError: { borderColor: colors.danger },
	error: {
		color: colors.danger,
		fontFamily: typography.body,
		fontSize: 12,
		lineHeight: 17,
		marginTop: 2,
	},
	typeRow: {
		flexDirection: "row",
		gap: spacing.xs,
		padding: 4,
		borderRadius: radius.md,
		backgroundColor: colors.surfaceSoft,
		borderWidth: 1,
		borderColor: colors.border,
	},
	typeButton: {
		flex: 1,
		borderRadius: radius.sm,
		minHeight: componentSizes.segmentMinHeight,
		alignItems: "center",
		justifyContent: "center",
	},
	typeButtonActive: { backgroundColor: colors.secondary },
	typeButtonText: {
		fontFamily: typography.bodyBold,
		fontWeight: "800",
		color: colors.textSecondary,
	},
	typeButtonTextActive: { color: colors.textOnAccent },
	categoriesWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
	categoryChip: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.pill,
		minHeight: touchTarget.minHeight,
		paddingHorizontal: spacing.sm,
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: colors.surfaceCard,
	},
	categoryChipActive: { backgroundColor: colors.surfaceSoft, borderWidth: 2 },
	categoryDot: { width: 10, height: 10, borderRadius: 5 },
	categoryChipText: {
		color: colors.textPrimary,
		fontFamily: typography.bodyBold,
		fontSize: 13,
		fontWeight: "800",
	},
	metadataCard: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.lg,
		padding: spacing.md,
		gap: spacing.sm,
		backgroundColor: colors.surfaceCard,
	},
	metadataHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	metadataIconBadge: {
		width: componentSizes.listIcon,
		height: componentSizes.listIcon,
		borderRadius: radius.md,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.surfaceStrong,
		borderWidth: 1,
		borderColor: colors.borderStrong,
	},
	metadataHeaderCopy: { flex: 1, gap: 4 },
	metadataHelp: {
		color: colors.textSecondary,
		fontFamily: typography.body,
		fontSize: 13,
		lineHeight: 18,
	},
	metadataButtonRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
	metadataAction: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.pill,
		minHeight: touchTarget.minHeight,
		paddingHorizontal: spacing.sm,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		backgroundColor: colors.surfaceSoft,
	},
	metadataActionDanger: {
		borderColor: colors.danger,
		backgroundColor: colors.dangerSoft,
	},
	metadataActionPressed: { opacity: 0.78 },
	metadataActionDisabled: { opacity: 0.5 },
	metadataActionText: {
		color: colors.textPrimary,
		fontFamily: typography.bodyBold,
		fontWeight: "800",
	},
	metadataActionTextDanger: { color: colors.danger },
	previewCard: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.xs,
		gap: spacing.xs,
		backgroundColor: colors.surfaceSoft,
	},
	receiptPreview: {
		width: "100%",
		height: 180,
		borderRadius: radius.sm,
		backgroundColor: colors.surfaceCard,
	},
	locationPill: {
		borderWidth: 1,
		borderColor: colors.borderStrong,
		borderRadius: radius.pill,
		paddingHorizontal: spacing.sm,
		minHeight: 36,
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		gap: spacing.xs,
		backgroundColor: colors.surfaceStrong,
	},
	metadataText: {
		color: colors.textPrimary,
		fontFamily: typography.bodyBold,
		fontSize: 13,
		fontWeight: "800",
	},
	saveButtonShell: {
		marginTop: spacing.sm,
		borderRadius: radius.pill,
		overflow: "hidden",
	},
	saveButton: {
		borderRadius: radius.pill,
		minHeight: touchTarget.minHeight,
		justifyContent: "center",
	},
	saveText: {
		color: colors.textOnAccent,
		fontFamily: typography.bodyBold,
		textAlign: "center",
		fontWeight: "800",
	},
	deleteButton: {
		backgroundColor: colors.dangerSoft,
		borderWidth: 1,
		borderColor: colors.danger,
		borderRadius: radius.pill,
		minHeight: touchTarget.minHeight,
		justifyContent: "center",
	},
	deleteText: {
		color: colors.danger,
		fontFamily: typography.bodyBold,
		textAlign: "center",
		fontWeight: "800",
	},
});
