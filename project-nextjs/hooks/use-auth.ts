import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

export const useAuth = () => {
    const { data: session, status } = useSession()

    const user = session?.user
    const isLoading = status === "loading"
    const isAuthenticated = status === "authenticated"

    const signOut = async () => {
        await nextAuthSignOut({ callbackUrl: "/" })
    }

    return {
        user,
        isLoading,
        isAuthenticated,
        signOut,
        // Helper to check roles
        isAdmin: user?.role === "ADMIN",
        isEditor: user?.role === "EDITOR",
        canAccessDashboard: user?.role === "ADMIN" || user?.role === "EDITOR",
    }
}
