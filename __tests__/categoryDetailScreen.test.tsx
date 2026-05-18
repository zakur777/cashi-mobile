import { fireEvent, render, waitFor } from "@testing-library/react-native";

import CategoryDetailScreen from "../app/(tabs)/category/[id]";
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockCreateCategory = jest.fn();
const mockUpdateCategory = jest.fn();
const mockDeleteCategory = jest.fn();
const mockCategories = [
	{
		id: "cat-1",
		name: "Comida",
		type: "expense",
		color: "#EDF7BD",
	},
];

jest.mock("expo-router", () => ({
	useRouter: () => ({
		back: mockBack,
		replace: mockReplace,
	}),
	useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock("../src/hooks/useCategories", () => ({
	useCategories: () => ({
		categories: mockCategories,
		createCategory: mockCreateCategory,
		updateCategory: mockUpdateCategory,
		deleteCategory: mockDeleteCategory,
	}),
}));

describe("CategoryDetailScreen", () => {
	beforeEach(() => {
		mockBack.mockClear();
		mockReplace.mockClear();
		mockCreateCategory.mockReset().mockResolvedValue(undefined);
		mockUpdateCategory.mockReset().mockResolvedValue(undefined);
		mockDeleteCategory.mockReset().mockResolvedValue(undefined);
		mockUseLocalSearchParams.mockReturnValue({ id: "cat-1" });
	});

	it("returns to categories after updating an existing category", async () => {
		const screen = render(<CategoryDetailScreen />);

		await waitFor(() =>
			expect(screen.getByDisplayValue("Comida")).toBeTruthy(),
		);

		fireEvent.changeText(screen.getByDisplayValue("Comida"), "Supermercado");
		fireEvent.press(screen.getByText("Guardar cambios"));

		await waitFor(() => {
			expect(mockUpdateCategory).toHaveBeenCalledWith("cat-1", {
				name: "Supermercado",
				type: "expense",
				color: "#EDF7BD",
			});
			expect(mockReplace).toHaveBeenCalledWith("/(tabs)/categories");
		});
		expect(mockBack).not.toHaveBeenCalled();
	});

	it("returns to categories after deleting an existing category", async () => {
		const screen = render(<CategoryDetailScreen />);

		fireEvent.press(screen.getByText("Eliminar categoría"));

		await waitFor(() => {
			expect(mockDeleteCategory).toHaveBeenCalledWith("cat-1");
			expect(mockReplace).toHaveBeenCalledWith("/(tabs)/categories");
		});
		expect(mockBack).not.toHaveBeenCalled();
	});

	it("clears stale category values and shows the name example when creating a new category", async () => {
		mockUseLocalSearchParams.mockReturnValue({ id: "new" });

		const screen = render(<CategoryDetailScreen />);

		await waitFor(() =>
			expect(
				screen.getByPlaceholderText("Ej: Comida, Transporte o Salud"),
			).toBeTruthy(),
		);
		expect(screen.queryByDisplayValue("Comida")).toBeNull();
		expect(screen.getByText("Crear categoría")).toBeTruthy();
	});
});
