import { ApiClientError } from "../src/api/errors";
import { getUserFacingErrorMessage } from "../src/api/userFacingErrors";

describe("getUserFacingErrorMessage", () => {
	it("shows a relationship-safe message for unprocessable backend errors", () => {
		const error = new ApiClientError({
			kind: "http",
			status: 422,
			code: "unprocessable_entity",
			message: "No se pudo procesar la solicitud",
		});

		expect(getUserFacingErrorMessage(error)).toBe(
			"No se pudo completar porque el registro está relacionado con otros datos.",
		);
	});

	it("falls back for unknown non-api errors", () => {
		expect(
			getUserFacingErrorMessage(new Error("boom"), "Algo salió mal."),
		).toBe("Algo salió mal.");
	});
});
