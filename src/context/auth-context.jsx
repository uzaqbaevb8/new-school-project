import { createContext, useState, useEffect } from "react";
import { api } from "../api/api"; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    
    const login = async ({ phone, password }) => {
        try {
            const { data, status } = await api.post("/auth/login", { phone, password });

            if (status >= 200 && status < 300) {
                const accessToken = data?.data?.access_token;
                const refreshToken = data?.data?.refresh_token;

                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);

                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

                await getMe(); 
                setIsAuth(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    
    const logout = async (callback) => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        delete api.defaults.headers.common["Authorization"];

        setIsAuth(false);
        setUser(null); 

        if (typeof callback === "function") {
            callback();
        } else {
            window.location.href = "/login";
        }
    };

    
    const getMe = async () => {
        try {
            const { data, status } = await api.get("/auth/get-me");

            if (status === 200) {
                setUser(data.data); 
                setIsAuth(true);
            }
        } catch (error) {
            console.error("getMe error:", error);
            setIsAuth(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

   
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            getMe();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, loading, user, login, logout, getMe }}>
            {children}
        </AuthContext.Provider>
    );
};
