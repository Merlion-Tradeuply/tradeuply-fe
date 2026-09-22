import type { ApiErrorResponse } from "@/lib/api/types";

export class ApiRequestError extends Error {
  code: string;
  details?: ApiErrorResponse["error"]["details"];
  status: number;

  constructor(response: ApiErrorResponse, status: number) {
    super(response.error.message);
    this.name = "ApiRequestError";
    this.code = response.error.code;
    this.details = response.error.details;
    this.status = status;
  }
}

export async function postJson<TResponse, TPayload>(
  endpoint: string,
  payload: TPayload,
): Promise<TResponse> {
  const response = await fetch(endpoint, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = (await response.json()) as TResponse | ApiErrorResponse;

  if (!response.ok) {
    throw new ApiRequestError(result as ApiErrorResponse, response.status);
  }

  return result as TResponse;
}
