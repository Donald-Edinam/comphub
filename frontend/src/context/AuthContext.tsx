import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
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
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // Check if user is logged in on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedRefreshToken = localStorage.getItem('refreshToken');
                const storedUser = localStorage.getItem('user');

                if (storedToken && storedRefreshToken && storedUser) {
                    setToken(storedToken);
                    setRefreshToken(storedRefreshToken);
                    setUser(JSON.parse(storedUser));
                } else if (storedRefreshToken) {
                    // Try to refresh token if we only have refresh token
                    try {
                        const response = await authAPI.refresh(storedRefreshToken);
                        if (response.data.success) {
                            const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;
                            
                            localStorage.setItem('token', accessToken);
                            localStorage.setItem('refreshToken', newRefreshToken);
                            localStorage.setItem('user', JSON.stringify(userData));
                            
                            setToken(accessToken);
                            setRefreshToken(newRefreshToken);
                            setUser(userData);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // Clear invalid tokens
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear corrupted data
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
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
                const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

                // Store everything at once to prevent partial state
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                localStorage.setItem('user', JSON.stringify(userData));

                // Update state after successful storage
                setToken(accessToken);
                setRefreshToken(newRefreshToken);
                setUser(userData);

                return { success: true };
            }
        } catch (error: any) {
            console.error('Login error:', error);

            // Ensure we don't have partial auth state on error
            setToken(null);
            setRefreshToken(null);
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

    const logout = async () => {
        try {
            const currentRefreshToken = localStorage.getItem('refreshToken');
            
            // Call logout API to invalidate refresh token on server
            if (currentRefreshToken) {
                try {
                    await authAPI.logout(currentRefreshToken);
                } catch (error) {
                    console.error('Logout API error:', error);
                    // Continue with local logout even if API call fails
                }
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setToken(null);
            setRefreshToken(null);
            setUser(null);
        }
    };

    const isAuthenticated = !!token && !!user;

    const value: AuthContextType = {
        user,
        token,
        refreshToken,
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