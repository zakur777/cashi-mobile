import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryForm } from "../../../src/components/categories/CategoryForm";
import { AppBackground } from "../../../src/components/ui/AppBackground";
import { CATEGORY_COLORS } from "../../../src/domain/types";
import { useCategories } from "../../../src/hooks/useCategories";
import { useCategoryForm } from "../../../src/hooks/useCategoryForm";

export default function CategoryDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { categories, createCategory, updateCategory, deleteCategory } =
		useCategories();

	const isNew = id === "new";

	const current = useMemo(
		() => categories.find((category) => category.id === id),
		[categories, id],
	);

	const {
		name,
		setName,
		type,
		setType,
		color,
		setColor,
		errors,
		submitting,
		handleSubmit,
	} = useCategoryForm({
		initialName: "",
		onSubmit: async (validCategory) => {
			if (isNew) {
				await createCategory(validCategory);
				router.replace("/(tabs)/categories");
				return;
			}

			if (id) {
				await updateCategory(id, validCategory);
			}
			router.back();
		},
	});

	useEffect(() => {
		if (!isNew && current) {
			setName(current.name);
			setType(current.type ?? "expense");
			setColor(current.color ?? CATEGORY_COLORS.lime);
		}
	}, [current, isNew, setColor, setName, setType]);

	return (
		<AppBackground>
			<SafeAreaView style={styles.container}>
				<CategoryForm
					title={isNew ? "Nueva categoría" : "Editar categoría"}
					name={name}
					type={type}
					color={color}
					error={errors.name}
					loading={submitting}
					saveLabel={isNew ? "Crear categoría" : "Guardar cambios"}
					onChangeName={setName}
					onChangeType={setType}
					onChangeColor={setColor}
					onCancel={() => router.back()}
					onSave={() => {
						void handleSubmit();
					}}
					onDelete={
						!isNew && id
							? () => {
									void deleteCategory(id).then(() => router.back());
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
