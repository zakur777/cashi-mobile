import { useCallback, useEffect, useState } from "react";

import { getUserFacingErrorMessage } from "../api/userFacingErrors";
import type { Category, CategoryInput } from "../domain/types";
import {
	createBackendCategoryRepository,
	localCategoryRepository,
	resolveCashiDataSource,
	type CashiDataSource,
	type CategoryRepository,
} from "../repositories";

interface UseCategoriesOptions {
	repository?: CategoryRepository;
	dataSource?: CashiDataSource;
}

export function useCategories({
	repository,
	dataSource,
}: UseCategoriesOptions = {}) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getRepository = useCallback(() => {
		if (repository) {
			return repository;
		}

		const resolvedSource = resolveCashiDataSource({ dataSource });
		return resolvedSource === "backend"
			? createBackendCategoryRepository()
			: localCategoryRepository;
	}, [dataSource, repository]);

	const refresh = useCallback(async () => {
		setLoading(true);
		try {
			const items = await getRepository().getAll();
			setCategories(items);
			setError(null);
		} catch (cause) {
			setError(
				getUserFacingErrorMessage(
					cause,
					"No se pudieron cargar las categorías. Intentá nuevamente.",
				),
			);
		} finally {
			setLoading(false);
		}
	}, [getRepository]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const createCategory = useCallback(
		async (input: CategoryInput) => {
			try {
				const created = await getRepository().create(input);
				setCategories((current) => [...current, created]);
				setError(null);
			} catch (cause) {
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo guardar la categoría. Intentá nuevamente.",
					),
				);
				throw cause;
			}
		},
		[getRepository],
	);

	const updateCategory = useCallback(
		async (id: string, input: CategoryInput) => {
			try {
				const updated = await getRepository().update(id, input);
				setCategories((current) =>
					current.map((item) => (item.id === id ? updated : item)),
				);
				setError(null);
			} catch (cause) {
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo guardar la categoría. Intentá nuevamente.",
					),
				);
				throw cause;
			}
		},
		[getRepository],
	);

	const deleteCategory = useCallback(
		async (id: string) => {
			try {
				await getRepository().delete(id);
				setCategories((current) => current.filter((item) => item.id !== id));
				setError(null);
			} catch (cause) {
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo eliminar la categoría. Intentá nuevamente.",
					),
				);
				throw cause;
			}
		},
		[getRepository],
	);

	return {
		categories,
		loading,
		error,
		refresh,
		createCategory,
		updateCategory,
		deleteCategory,
	};
}
