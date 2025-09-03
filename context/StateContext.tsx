'use client'
import { createContext, ReactNode, useContext, useState } from "react";

interface authState {
    isLoggedIn: boolean;
    setIsLoggedIn: (action: boolean) => void;
}

const AuthContext = createContext<authState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): authState {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider") // shouldnt be hit, but worth noting
    }
    return context
}