import { ApiClientError } from "./errors";

const fallbackMessage =
	"No se pudo completar la operación. Intentá nuevamente.";

export function getUserFacingErrorMessage(
	error: unknown,
	fallback = fallbackMessage,
): string {
	if (!(error instanceof ApiClientError)) {
		return fallback;
	}

	if (error.error.kind === "network") {
		return "No se pudo conectar con el servidor. Revisá que el backend esté activo.";
	}

	if (error.error.kind === "config") {
		return "La conexión con el backend no está configurada correctamente.";
	}

	if (error.error.kind === "parse") {
		return "El servidor respondió con un formato inesperado.";
	}

	if (error.error.kind === "http") {
		if (
			error.error.code === "bad_request" ||
			error.error.code === "unprocessable_entity"
		) {
			return "Revisá los datos ingresados e intentá nuevamente.";
		}

		if (error.error.code === "conflict") {
			return "Ya existe un registro con esos datos.";
		}

		if (error.error.code === "not_found") {
			return "El elemento ya no existe. Actualizá la lista e intentá nuevamente.";
		}

		if (error.error.code === "server_error") {
			return "El servidor no pudo completar la operación. Intentá de nuevo.";
		}
	}

	return fallback;
}
