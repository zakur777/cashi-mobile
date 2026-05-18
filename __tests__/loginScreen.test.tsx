import { fireEvent, render } from "@testing-library/react-native";

import LoginScreen from "../app/index";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
}));

describe("LoginScreen", () => {
	beforeEach(() => {
		mockReplace.mockClear();
	});

	it("navigates to balance when credentials are correct", async () => {
		const screen = render(<LoginScreen />);

		fireEvent.changeText(screen.getByLabelText("Email"), "demo@cashi.com");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "Cashi1234");

		fireEvent.press(screen.getByText("Ingresar"));

		expect(mockReplace).toHaveBeenCalledWith("/(tabs)/balance");
	});

	it("shows inline error when credentials are incorrect", async () => {
		const screen = render(<LoginScreen />);

		fireEvent.changeText(screen.getByLabelText("Email"), "bad@cashi.com");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "bad-password");

		fireEvent.press(screen.getByText("Ingresar"));

		expect(screen.getByText("Credenciales incorrectas")).toBeTruthy();
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("shows inline field validation errors for invalid fields", async () => {
		const screen = render(<LoginScreen />);

		fireEvent.changeText(screen.getByLabelText("Email"), "email-invalido");
		fireEvent.changeText(screen.getByLabelText("Contraseña"), "");

		fireEvent.press(screen.getByText("Ingresar"));

		expect(screen.getByText("El email no es válido")).toBeTruthy();
		expect(screen.getByText("La contraseña es obligatoria")).toBeTruthy();
		expect(mockReplace).not.toHaveBeenCalled();
	});
});
