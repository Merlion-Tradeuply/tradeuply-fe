import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Deposit } from "@/lib/api/types";

type DepositPayload = {
  amount: number;
  notes: string;
  paymentMethodId: string;
  senderWalletAddress: string;
  transactionHash: string;
};

type DepositResponse = {
  data?: { deposit: Deposit };
  error?: { message: string };
};

export function submitDepositWithProof({
  onProgress,
  payload,
  paymentProof,
}: {
  onProgress: (percentage: number) => void;
  payload: DepositPayload;
  paymentProof: File;
}) {
  return new Promise<Deposit>((resolve, reject) => {
    const body = new FormData();
    const request = new XMLHttpRequest();

    body.append("payload", JSON.stringify(payload));
    body.append("paymentProof", paymentProof);
    request.open("POST", API_ENDPOINTS.client.clientDeposits);

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      let result: DepositResponse = {};

      try {
        result = JSON.parse(request.responseText) as DepositResponse;
      } catch {
        reject(new Error("The deposit service returned an invalid response."));
        return;
      }

      if (
        request.status < 200 ||
        request.status >= 300 ||
        !result.data?.deposit
      ) {
        reject(
          new Error(
            result.error?.message ?? "The deposit could not be submitted.",
          ),
        );
        return;
      }

      onProgress(100);
      resolve(result.data.deposit);
    });

    request.addEventListener("error", () => {
      reject(new Error("The payment screenshot upload was interrupted."));
    });

    request.send(body);
  });
}
