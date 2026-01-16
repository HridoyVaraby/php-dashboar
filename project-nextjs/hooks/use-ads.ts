import { useQuery } from "@tanstack/react-query";

export type Advertisement = {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    location: string;
    status: string;
};

export const useAds = (location?: string) => {
    return useQuery({
        queryKey: ["ads", location],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (location) searchParams.set("location", location);

            const res = await fetch(`/api/ads?${searchParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch ads");
            return res.json() as Promise<Advertisement[]>;
        },
    });
};
