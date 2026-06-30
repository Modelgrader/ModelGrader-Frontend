import { Google, generateCodeVerifier, generateState } from "arctic";
import apiClient from "./index";
import { AccountModel } from "@/types/models/Account.model";

const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

function getGoogleClient() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    return new Google(clientId, "", REDIRECT_URI);
}

export async function initiateGoogleLogin(): Promise<void> {
    const google = getGoogleClient();
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    sessionStorage.setItem("google_oauth_state", state);
    sessionStorage.setItem("google_oauth_code_verifier", codeVerifier);

    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "email", "profile"]);
    window.location.href = url.toString();
}

export async function handleGoogleCallback(
    code: string,
    state: string
): Promise<AccountModel> {
    const savedState = sessionStorage.getItem("google_oauth_state");
    const codeVerifier = sessionStorage.getItem("google_oauth_code_verifier");

    sessionStorage.removeItem("google_oauth_state");
    sessionStorage.removeItem("google_oauth_code_verifier");

    if (!savedState || state !== savedState) {
        throw new Error("Invalid OAuth state. Possible CSRF attack.");
    }

    if (!codeVerifier) {
        throw new Error("Missing code verifier.");
    }

    const response = await apiClient.post<AccountModel>("/api/auth/google/callback", {
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${window.location.origin}/auth/google/callback`,
    });

    return response.data;
}
