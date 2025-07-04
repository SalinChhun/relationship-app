// utils/auth.ts

export function getCurrentUserFromLocalStorage<T = unknown>(): T | null {
    try {
        const userData = localStorage.getItem("currentUser")
        return userData ? JSON.parse(userData) as T : null
    } catch (error) {
        console.error("Failed to parse currentUser from localStorage:", error)
        localStorage.removeItem("currentUser")
        return null
    }
}

export function setCurrentUserToLocalStorage<T = unknown>(user: T): void {
    try {
        localStorage.setItem("currentUser", JSON.stringify(user))
    } catch (error) {
        console.error("Failed to set currentUser to localStorage:", error)
    }
}
