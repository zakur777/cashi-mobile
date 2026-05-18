import { useCallback, useState } from "react";

import { getUserFacingErrorMessage } from "../api/userFacingErrors";
import { categorySchema } from "../domain/schemas";
import {
	CATEGORY_COLORS,
	type CategoryColor,
	type CategoryInput,
	type TransactionType,
} from "../domain/types";

interface UseCategoryFormOptions {
	initialName?: string;
	initialType?: TransactionType;
	initialColor?: CategoryColor;
	onSubmit: (input: CategoryInput) => Promise<void>;
}

export function useCategoryForm({
	initialName = "",
	initialType = "expense",
	initialColor = CATEGORY_COLORS.lime,
	onSubmit,
}: UseCategoryFormOptions) {
	const [name, setName] = useState(initialName);
	const [type, setType] = useState<TransactionType>(initialType);
	const [color, setColor] = useState<CategoryColor>(initialColor);
	const [errors, setErrors] = useState<{
		name?: string;
		type?: string;
		color?: string;
	}>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const resetName = useCallback((next: string) => {
		setName(next);
		setErrors({});
		setFormError(null);
	}, []);

	const resetForm = useCallback(
		({
			nextName = "",
			nextType = "expense",
			nextColor = CATEGORY_COLORS.lime,
		}: {
			nextName?: string;
			nextType?: TransactionType;
			nextColor?: CategoryColor;
		} = {}) => {
			setName(nextName);
			setType(nextType);
			setColor(nextColor);
			setErrors({});
			setFormError(null);
		},
		[],
	);

	const handleSubmit = useCallback(async () => {
		const parsed = categorySchema.safeParse({ name, type, color });

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;
			setErrors({
				name: fieldErrors.name?.[0],
				type: fieldErrors.type?.[0],
				color: fieldErrors.color?.[0],
			});
			return false;
		}

		setSubmitting(true);
		try {
			await onSubmit(parsed.data as CategoryInput);
			setErrors({});
			setFormError(null);
			return true;
		} catch (cause) {
			setFormError(getUserFacingErrorMessage(cause));
			return false;
		} finally {
			setSubmitting(false);
		}
	}, [color, name, onSubmit, type]);

	return {
		name,
		setName: resetName,
		type,
		setType,
		color,
		setColor,
		resetForm,
		errors,
		formError,
		submitting,
		handleSubmit,
	};
}
