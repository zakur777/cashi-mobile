import { fireEvent, render, waitFor } from "@testing-library/react-native";

import LoginScreen from "../app/index";
import { AuthProvider, type AuthService } from "../src/contexts/AuthContext";
import type { AuthTokenStorage } from "../src/storage/authTokenStorage";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
	Redirect: ({ href }: { href: string }) => href,
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

const createStorage = (): jest.Mocked<AuthTokenStorage> => ({
	load: jest.fn().mockResolvedValue(null),
	save: jest.fn().mockResolvedValue(undefined),
	clear: jest.fn().mockResolvedValue(undefined),
});

const renderLogin = (authService: jest.Mocked<AuthService>) =>
	render(
		<AuthProvider storage={createStorage()} authService={authService}>
			<LoginScreen />
		</AuthProvider>,
	);

describe("LoginScreen", () => {
	beforeEach(() => {
		mockReplace.mockClear();
	});

	it("navigates to balance when credentials are correct", async () => {
		const authService: jest.Mocked<AuthService> = {
			login: jest.fn().mockResolvedValue({ token: "screen.jwt" }),
			register: jest.fn(),
		};
		const screen = renderLogin(authService);

		await waitFor(() => expect(screen.getByText("Ingresar")).toBeTruthy());
		fireEvent.changeText(screen.getByLabelText("Email"), "person@cashi.test");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "user-password");

		fireEvent.press(screen.getByText("Ingresar"));

		await waitFor(() => expect(authService.login).toHaveBeenCalledWith({ email: "person@cashi.test", password: "user-password" }));
		expect(mockReplace).toHaveBeenCalledWith("/(tabs)/balance");
	});

	it("shows inline error when credentials are incorrect", async () => {
		const authService: jest.Mocked<AuthService> = {
			login: jest.fn().mockRejectedValue(new Error("Credenciales inválidas")),
			register: jest.fn(),
		};
		const screen = renderLogin(authService);
		await waitFor(() => expect(screen.getByText("Ingresar")).toBeTruthy());

		fireEvent.changeText(screen.getByLabelText("Email"), "bad@cashi.com");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "bad-password");

		fireEvent.press(screen.getByText("Ingresar"));

		await waitFor(() => expect(screen.getByText("Credenciales inválidas")).toBeTruthy());
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("shows inline field validation errors for invalid fields", async () => {
		const authService: jest.Mocked<AuthService> = {
			login: jest.fn(),
			register: jest.fn(),
		};
		const screen = renderLogin(authService);
		await waitFor(() => expect(screen.getByText("Ingresar")).toBeTruthy());

		fireEvent.changeText(screen.getByLabelText("Email"), "email-invalido");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "");

		fireEvent.press(screen.getByText("Ingresar"));

		expect(screen.getByText("El email no es válido")).toBeTruthy();
		expect(screen.getByText("La contraseña es obligatoria")).toBeTruthy();
		expect(authService.login).not.toHaveBeenCalled();
		expect(mockReplace).not.toHaveBeenCalled();
	});
});
