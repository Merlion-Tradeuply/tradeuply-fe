import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { proxyPost } from "@/lib/api/proxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return proxyPost(request, API_ENDPOINTS.backend.clientRegistration);
}
