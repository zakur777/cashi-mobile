import { fireEvent, render, waitFor } from "@testing-library/react-native";

import TransactionDetailScreen from "../app/(tabs)/transaction/[id]";

const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockRefreshCategories = jest.fn();
const mockRefreshTransactions = jest.fn();
const mockCreateTransaction = jest.fn();
const mockUpdateTransaction = jest.fn();
const mockCapturePhoto = jest.fn();
const mockSelectPhoto = jest.fn();
const mockClearPhoto = jest.fn();
const mockCaptureLocation = jest.fn();
const mockClearLocation = jest.fn();
const mockUseImagePicker = jest.fn();
const mockUseLocation = jest.fn();
const mockTransactions = jest.fn();

jest.mock("expo-router", () => ({
	useRouter: () => ({
		back: mockBack,
	}),
	useLocalSearchParams: () => mockUseLocalSearchParams(),
	useFocusEffect: (callback: () => void) => callback(),
}));

jest.mock("../src/hooks/useCategories", () => ({
	useCategories: () => ({
		categories: [
			{
				id: "8",
				name: "Restaurante de la esquina",
				type: "expense",
				color: "#FF8A7A",
			},
		],
		error: null,
		refresh: mockRefreshCategories,
	}),
}));

jest.mock("../src/hooks/useTransactions", () => ({
	useTransactions: () => ({
		transactions: mockTransactions(),
		error: null,
		refresh: mockRefreshTransactions,
		createTransaction: mockCreateTransaction,
		updateTransaction: mockUpdateTransaction,
		deleteTransaction: jest.fn(),
	}),
}));

jest.mock("../src/hooks/useImagePicker", () => ({
	useImagePicker: (options: unknown) => mockUseImagePicker(options),
}));

jest.mock("../src/hooks/useLocation", () => ({
	useLocation: (options: unknown) => mockUseLocation(options),
}));

describe("TransactionDetailScreen", () => {
	beforeEach(() => {
		mockBack.mockClear();
		mockRefreshCategories.mockClear();
		mockRefreshTransactions.mockClear();
		mockCreateTransaction.mockReset().mockResolvedValue(undefined);
		mockUpdateTransaction.mockReset().mockResolvedValue(undefined);
		mockCapturePhoto.mockReset().mockResolvedValue(undefined);
		mockSelectPhoto.mockReset().mockResolvedValue(undefined);
		mockClearPhoto.mockClear();
		mockCaptureLocation.mockReset().mockResolvedValue(undefined);
		mockClearLocation.mockClear();
		mockUseLocalSearchParams.mockReturnValue({ id: "new" });
		mockTransactions.mockReturnValue([]);
		mockUseImagePicker.mockReturnValue({
			photoUri: undefined,
			error: null,
			loading: false,
			capturePhoto: mockCapturePhoto,
			selectPhoto: mockSelectPhoto,
			clearPhoto: mockClearPhoto,
		});
		mockUseLocation.mockReturnValue({
			location: undefined,
			error: null,
			loading: false,
			captureLocation: mockCaptureLocation,
			clearLocation: mockClearLocation,
		});
	});

	it("refreshes data on focus and shows latest categories in the form", async () => {
		const screen = render(<TransactionDetailScreen />);

		await waitFor(() => {
			expect(mockRefreshCategories).toHaveBeenCalled();
			expect(mockRefreshTransactions).toHaveBeenCalled();
		});
		expect(screen.getByText("Restaurante de la esquina")).toBeTruthy();
	});

	it("shows photo preview, coordinates, inline permission errors, and clear actions", () => {
		mockUseImagePicker.mockReturnValue({
			photoUri: "file:///receipt.jpg",
			error: "No pudimos acceder a la cámara. Revisá los permisos del dispositivo.",
			loading: false,
			capturePhoto: mockCapturePhoto,
			selectPhoto: mockSelectPhoto,
			clearPhoto: mockClearPhoto,
		});
		mockUseLocation.mockReturnValue({
			location: { latitude: -33.4489, longitude: -70.6693 },
			error: "No pudimos acceder a tu ubicación. Revisá los permisos del dispositivo.",
			loading: false,
			captureLocation: mockCaptureLocation,
			clearLocation: mockClearLocation,
		});

		const screen = render(<TransactionDetailScreen />);

		expect(screen.getByLabelText("Vista previa del comprobante")).toBeTruthy();
		expect(screen.getByText("Lat: -33.4489, Lon: -70.6693")).toBeTruthy();
		expect(screen.getByText("No pudimos acceder a la cámara. Revisá los permisos del dispositivo.")).toBeTruthy();
		expect(screen.getByText("No pudimos acceder a tu ubicación. Revisá los permisos del dispositivo.")).toBeTruthy();

		fireEvent.press(screen.getByText("Quitar foto"));
		fireEvent.press(screen.getByText("Quitar ubicación"));
		expect(mockClearPhoto).toHaveBeenCalledTimes(1);
		expect(mockClearLocation).toHaveBeenCalledTimes(1);
	});

	it("saves new transactions with selected photo and coordinates", async () => {
		mockUseImagePicker.mockReturnValue({
			photoUri: "file:///receipt.jpg",
			error: null,
			loading: false,
			capturePhoto: mockCapturePhoto,
			selectPhoto: mockSelectPhoto,
			clearPhoto: mockClearPhoto,
		});
		mockUseLocation.mockReturnValue({
			location: { latitude: -33.4489, longitude: -70.6693 },
			error: null,
			loading: false,
			captureLocation: mockCaptureLocation,
			clearLocation: mockClearLocation,
		});
		const screen = render(<TransactionDetailScreen />);

		fireEvent.changeText(screen.getByPlaceholderText("Ej: 1500"), "3200");
		fireEvent.changeText(screen.getByPlaceholderText("Ej: Supermercado"), "Cena");
		fireEvent.press(screen.getByText("Restaurante de la esquina"));
		fireEvent.press(screen.getByText("Crear transacción"));

		await waitFor(() => {
			expect(mockCreateTransaction).toHaveBeenCalledWith({
				amount: 3200,
				type: "expense",
				description: "Cena",
				date: expect.any(String),
				categoryId: "8",
				photoUri: "file:///receipt.jpg",
				location: { latitude: -33.4489, longitude: -70.6693 },
			});
		});
	});

	it("initializes edit metadata and saves cleared metadata as omitted fields", async () => {
		mockUseLocalSearchParams.mockReturnValue({ id: "tx-1" });
		mockTransactions.mockReturnValue([
			{
				id: "tx-1",
				amount: 1500,
				type: "expense",
				description: "Taxi",
				date: "2026-05-20",
				categoryId: "8",
				photoUri: "file:///old.jpg",
				location: { latitude: -33.45, longitude: -70.66 },
			},
		]);
		mockUseImagePicker.mockReturnValue({
			photoUri: undefined,
			error: null,
			loading: false,
			capturePhoto: mockCapturePhoto,
			selectPhoto: mockSelectPhoto,
			clearPhoto: mockClearPhoto,
		});
		mockUseLocation.mockReturnValue({
			location: undefined,
			error: null,
			loading: false,
			captureLocation: mockCaptureLocation,
			clearLocation: mockClearLocation,
		});

		const screen = render(<TransactionDetailScreen />);

		expect(mockUseImagePicker).toHaveBeenCalledWith({ initialPhotoUri: "file:///old.jpg" });
		expect(mockUseLocation).toHaveBeenCalledWith({
			initialLocation: { latitude: -33.45, longitude: -70.66 },
		});
		await waitFor(() => {
			expect(screen.getByDisplayValue("Taxi")).toBeTruthy();
		});
		fireEvent.press(screen.getByText("Guardar cambios"));

		await waitFor(() => {
			expect(mockUpdateTransaction).toHaveBeenCalledWith(
				"tx-1",
				expect.not.objectContaining({ photoUri: expect.anything(), location: expect.anything() }),
			);
		});
	});
});
