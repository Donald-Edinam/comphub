"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login5() {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                // Small delay to ensure auth state is updated
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 100);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Login form error:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return <div className="flex items-center justify-center h-screen p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]  bg-orange-50 px-4 py-10 rounded-2xl">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to sign in to your account
                </p>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                Email
                            </label>
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                                id="email" 
                                placeholder="name@example.com" 
                                required 
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary">
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="relative">
                                <input 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                                    id="password" 
                                    required 
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <i className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'} text-muted-foreground cursor-pointer`} onClick={togglePassword}></i>
                                </div>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4 hover:text-primary">
                    Sign up
                </a>
            </p>
        </div>
    </div>;
}
export default Login5;