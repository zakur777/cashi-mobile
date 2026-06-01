import { useCallback, useState } from "react";

import { getUserFacingErrorMessage } from "../api/userFacingErrors";
import type { TransactionMetadataInput, TransactionType } from "../domain/types";
import { transactionSchema } from "../domain/schemas";

interface TransactionFormValues {
	amount: string;
	type: TransactionType;
	description: string;
	date: string;
	categoryId: string;
}

interface UseTransactionFormOptions {
	initialValues: TransactionFormValues;
	metadata?: TransactionMetadataInput;
	onSubmit: (values: {
		amount: number;
		type: TransactionType;
		description: string;
		date: string;
		categoryId: string;
		photoUri?: string;
		location?: TransactionMetadataInput["location"];
	}) => Promise<void>;
}

interface TransactionFormErrors {
	amount?: string;
	type?: string;
	description?: string;
	date?: string;
	categoryId?: string;
}

export function useTransactionForm({
	initialValues,
	metadata,
	onSubmit,
}: UseTransactionFormOptions) {
	const [amount, setAmountValue] = useState(initialValues.amount);
	const [type, setTypeValue] = useState<TransactionType>(initialValues.type);
	const [description, setDescriptionValue] = useState(
		initialValues.description,
	);
	const [date, setDateValue] = useState(initialValues.date);
	const [categoryId, setCategoryIdValue] = useState(initialValues.categoryId);
	const [errors, setErrors] = useState<TransactionFormErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const setAmount = useCallback((value: string) => {
		setAmountValue(value);
		setErrors((prev) => ({ ...prev, amount: undefined }));
		setFormError(null);
	}, []);

	const setType = useCallback((value: TransactionType) => {
		setTypeValue(value);
		setErrors((prev) => ({ ...prev, type: undefined }));
		setFormError(null);
	}, []);

	const setDescription = useCallback((value: string) => {
		setDescriptionValue(value);
		setErrors((prev) => ({ ...prev, description: undefined }));
		setFormError(null);
	}, []);

	const setDate = useCallback((value: string) => {
		setDateValue(value);
		setErrors((prev) => ({ ...prev, date: undefined }));
		setFormError(null);
	}, []);

	const setCategoryId = useCallback((value: string) => {
		setCategoryIdValue(value);
		setErrors((prev) => ({ ...prev, categoryId: undefined }));
		setFormError(null);
	}, []);

	const handleSubmit = useCallback(async () => {
		const parsed = transactionSchema.safeParse({
			amount,
			type,
			description,
			date,
			categoryId,
			...(metadata?.photoUri ? { photoUri: metadata.photoUri } : {}),
			...(metadata?.location ? { location: metadata.location } : {}),
		});

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;
			setErrors({
				amount: fieldErrors.amount?.[0],
				type: fieldErrors.type?.[0],
				description: fieldErrors.description?.[0],
				date: fieldErrors.date?.[0],
				categoryId: fieldErrors.categoryId?.[0],
			});
			return false;
		}

		setSubmitting(true);
		try {
			await onSubmit(parsed.data);
			setErrors({});
			setFormError(null);
			return true;
		} catch (cause) {
			setFormError(getUserFacingErrorMessage(cause));
			return false;
		} finally {
			setSubmitting(false);
		}
	}, [amount, categoryId, date, description, metadata, onSubmit, type]);

	return {
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
	};
}
