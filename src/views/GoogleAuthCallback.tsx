import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { handleGoogleCallback } from "@/services/GoogleAuth.service";

const GoogleAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
            setError("Invalid callback parameters.");
            return;
        }

        handleGoogleCallback(code, state)
            .then((account) => {
                localStorage.setItem("account_id", String(account.account_id));
                localStorage.setItem("username", account.username);
                if (account.token) {
                    localStorage.setItem("token", account.token);
                }
                window.location.href = "/dashboard";
            })
            .catch((err) => {
                setError(err.message || "Google login failed.");
            });
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">{error}</p>
                <a href="/login" className="underline text-blue-600">
                    Back to Login
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Signing you in with Google...</p>
        </div>
    );
};

export default GoogleAuthCallback;
