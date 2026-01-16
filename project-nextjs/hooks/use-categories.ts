import { useQuery } from "@tanstack/react-query"

export type Category = {
    id: string
    name: string
    slug: string
}

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories")
            if (!res.ok) {
                throw new Error("Failed to fetch categories")
            }
            return res.json() as Promise<Category[]>
        },
    })
}
