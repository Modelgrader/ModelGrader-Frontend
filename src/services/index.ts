import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`;
                return apiClient(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            // ไม่ต้องส่ง refresh_token ใน body — browser ส่ง httpOnly cookie อัตโนมัติ
            const res = await apiClient.post("/api/auth/token/refresh");
            const newAccessToken: string = res.data.access_token;
            localStorage.setItem("access_token", newAccessToken);
            processQueue(null, newAccessToken);
            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(original);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;
