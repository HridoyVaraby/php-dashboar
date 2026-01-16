import { useMutation } from "@tanstack/react-query";

export const useSubscribeNewsletter = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to subscribe");
            }
            return res.json();
        },
    });
};
