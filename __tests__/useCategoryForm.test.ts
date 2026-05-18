import { act, renderHook } from "@testing-library/react-native";

import { CATEGORY_COLORS } from "../src/domain/types";
import { useCategoryForm } from "../src/hooks/useCategoryForm";

describe("useCategoryForm", () => {
	it("blocks submit and exposes field error when name is empty", async () => {
		const onSubmit = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useCategoryForm({ onSubmit }));

		let response = false;
		await act(async () => {
			response = await result.current.handleSubmit();
		});

		expect(response).toBe(false);
		expect(result.current.errors.name).toBe("El nombre es obligatorio");
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("submits valid name and clears errors", async () => {
		const onSubmit = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useCategoryForm({ onSubmit }));

		await act(async () => {
			result.current.setName("  Comida  ");
		});

		let response = false;
		await act(async () => {
			response = await result.current.handleSubmit();
		});

		expect(response).toBe(true);
		expect(onSubmit).toHaveBeenCalledWith({
			name: "Comida",
			type: "expense",
			color: CATEGORY_COLORS.lime,
		});
		expect(result.current.errors).toEqual({});
	});

	it("submits selected type and color metadata", async () => {
		const onSubmit = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useCategoryForm({ onSubmit }));

		await act(async () => {
			result.current.setName("Sueldo");
			result.current.setType("income");
			result.current.setColor(CATEGORY_COLORS.green);
		});

		let response = false;
		await act(async () => {
			response = await result.current.handleSubmit();
		});

		expect(response).toBe(true);
		expect(onSubmit).toHaveBeenCalledWith({
			name: "Sueldo",
			type: "income",
			color: CATEGORY_COLORS.green,
		});
		expect(result.current.errors).toEqual({});
	});

	it("resets category values for a fresh form", async () => {
		const onSubmit = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useCategoryForm({ onSubmit }));

		await act(async () => {
			result.current.setName("Sueldo");
			result.current.setType("income");
			result.current.setColor(CATEGORY_COLORS.green);
			result.current.resetForm();
		});

		expect(result.current.name).toBe("");
		expect(result.current.type).toBe("expense");
		expect(result.current.color).toBe(CATEGORY_COLORS.lime);
		expect(result.current.errors).toEqual({});
	});
});
