import Constants from "expo-constants";

import { createConfigError } from "../api/errors";
import type { CashiDataSource } from "./types";

export interface DataSourceConfigInput {
	dataSource?: string | null;
}

const validDataSources: CashiDataSource[] = ["local", "backend"];

function readExpoExtraDataSource(): string | null {
	const extra = Constants.expoConfig?.extra;
	const value = extra?.cashiDataSource;
	return typeof value === "string" ? value : null;
}

function normalizeDataSource(
	value: string | null | undefined,
): CashiDataSource | null {
	if (value == null || value.trim() === "") {
		return null;
	}

	if (validDataSources.includes(value as CashiDataSource)) {
		return value as CashiDataSource;
	}

	throw createConfigError("La fuente de datos de Cashi no es válida", {
		dataSource: value,
	});
}

export function resolveCashiDataSource(
	input: DataSourceConfigInput = {},
): CashiDataSource {
	if (input.dataSource !== undefined && input.dataSource !== null) {
		return normalizeDataSource(input.dataSource) ?? "local";
	}

	return (
		normalizeDataSource(process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE) ??
		normalizeDataSource(readExpoExtraDataSource()) ??
		"local"
	);
}
