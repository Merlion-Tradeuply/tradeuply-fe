import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ClientWalletPaymentMethod } from "@/lib/api/types";

export type ClientWalletPayload = {
  asset: string;
  isDefault: boolean;
  label: string;
  network: string;
  walletAddress: string;
};

type ApiResponse<T> = {
  data?: T;
  error?: { message?: string };
};

type CloudinaryUpload = {
  apiKey: string;
  folder: string;
  publicId: string;
  signature: string;
  timestamp: number;
  uploadUrl: string;
};

type CloudinaryResult = {
  bytes: number;
  format: string;
  height: number;
  public_id: string;
  signature: string;
  version: number;
  width: number;
};

export type WalletQrUploadProgress = {
  percentage: number;
  stage: "preparing" | "uploading" | "saving";
};

async function readResponse<T>(response: Response) {
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.data) {
    throw new Error(result.error?.message ?? "The request could not be completed.");
  }
  return result.data;
}

export async function saveClientWallet(
  payload: ClientWalletPayload,
  methodId?: string,
) {
  const response = await fetch(
    methodId
      ? API_ENDPOINTS.client.clientWallet(methodId)
      : API_ENDPOINTS.client.clientWallets,
    {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: methodId ? "PATCH" : "POST",
    },
  );
  const data = await readResponse<{ method: ClientWalletPaymentMethod }>(response);
  return data.method;
}

export async function deleteClientWallet(methodId: string) {
  await readResponse<{ deletedId: string }>(
    await fetch(API_ENDPOINTS.client.clientWallet(methodId), { method: "DELETE" }),
  );
}

function uploadToCloudinary(
  file: File,
  upload: CloudinaryUpload,
  onProgress: (progress: WalletQrUploadProgress) => void,
) {
  return new Promise<CloudinaryResult>((resolve, reject) => {
    const body = new FormData();
    const request = new XMLHttpRequest();

    body.append("file", file);
    body.append("api_key", upload.apiKey);
    body.append("timestamp", String(upload.timestamp));
    body.append("signature", upload.signature);
    body.append("folder", upload.folder);
    body.append("public_id", upload.publicId);

    request.open("POST", upload.uploadUrl);
    request.timeout = 15 * 60 * 1000;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress({
          percentage: Math.round((event.loaded / event.total) * 100),
          stage: "uploading",
        });
      }
    });
    request.addEventListener("load", () => {
      let result: Partial<CloudinaryResult> & { error?: { message?: string } } = {};
      try {
        result = JSON.parse(request.responseText);
      } catch {
        reject(new Error("The upload service returned an invalid response."));
        return;
      }
      if (
        request.status < 200 ||
        request.status >= 300 ||
        !result.bytes ||
        !result.format ||
        !result.height ||
        !result.public_id ||
        !result.signature ||
        !result.version ||
        !result.width
      ) {
        reject(new Error(result.error?.message ?? "The QR image could not be uploaded."));
        return;
      }
      resolve(result as CloudinaryResult);
    });
    request.addEventListener("error", () =>
      reject(new Error("The upload was interrupted. Check your connection and retry.")),
    );
    request.addEventListener("timeout", () =>
      reject(new Error("The upload timed out. Check your connection and retry.")),
    );
    request.send(body);
  });
}

export async function uploadClientWalletQrCode({
  file,
  methodId,
  onProgress,
}: {
  file: File;
  methodId: string;
  onProgress: (progress: WalletQrUploadProgress) => void;
}) {
  onProgress({ percentage: 0, stage: "preparing" });
  const signature = await readResponse<{ upload: CloudinaryUpload }>(
    await fetch(API_ENDPOINTS.client.clientWalletQrSignature(methodId), {
      method: "POST",
    }),
  );
  onProgress({ percentage: 0, stage: "uploading" });
  const result = await uploadToCloudinary(file, signature.upload, onProgress);

  onProgress({ percentage: 100, stage: "saving" });
  const completed = await readResponse<{ method: ClientWalletPaymentMethod }>(
    await fetch(API_ENDPOINTS.client.clientWalletQrComplete(methodId), {
      body: JSON.stringify({
        bytes: result.bytes,
        format: result.format,
        height: result.height,
        publicId: result.public_id,
        signature: result.signature,
        version: result.version,
        width: result.width,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
  return completed.method;
}
