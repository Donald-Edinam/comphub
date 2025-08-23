import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    // Check if user is logged in on app start
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear corrupted data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password);

            if (response.data.success) {
                const { token } = response.data.data;

                // Create user info
                const userInfo: User = { email };

                // Store everything at once to prevent partial state
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userInfo));

                // Update state after successful storage
                setToken(token);
                setUser(userInfo);

                return { success: true };
            }
        } catch (error: any) {
            console.error('Login error:', error);

            // Ensure we don't have partial auth state on error
            setToken(null);
            setUser(null);

            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
            };
        }

        return { success: false, error: 'Login failed' };
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await authAPI.signup(name, email, password);

            if (response.data.success) {
                return { success: true };
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }

        return { success: false, error: 'Signup failed' };
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    const isAuthenticated = !!token && !!user;

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};