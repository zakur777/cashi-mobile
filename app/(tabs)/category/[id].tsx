import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { CategoryForm } from '../../../src/components/categories/CategoryForm';
import { colors } from '../../../src/design/tokens';
import { CATEGORY_COLORS } from '../../../src/domain/types';
import { useCategories } from '../../../src/hooks/useCategories';
import { useCategoryForm } from '../../../src/hooks/useCategoryForm';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();

  const isNew = id === 'new';

  const current = useMemo(
    () => categories.find((category) => category.id === id),
    [categories, id],
  );

  const { name, setName, type, setType, color, setColor, errors, submitting, handleSubmit } = useCategoryForm({
    initialName: '',
    onSubmit: async (validCategory) => {
      if (isNew) {
        await createCategory(validCategory);
      } else if (id) {
        await updateCategory(id, validCategory);
      }
      router.back();
    },
  });

  useEffect(() => {
    if (!isNew && current) {
      setName(current.name);
      setType(current.type ?? 'expense');
      setColor(current.color ?? CATEGORY_COLORS.lime);
    }
  }, [current, isNew, setColor, setName, setType]);

  return (
    <SafeAreaView style={styles.container}>
      <CategoryForm
        title={isNew ? 'Nueva categoría' : 'Editar categoría'}
        name={name}
        type={type}
        color={color}
        error={errors.name}
        loading={submitting}
        saveLabel={isNew ? 'Crear categoría' : 'Guardar cambios'}
        onChangeName={setName}
        onChangeType={setType}
        onChangeColor={setColor}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
});
