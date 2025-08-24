import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

const LogoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#F97316" strokeWidth="2" fill="none" />
    <rect x="6" y="8" width="4" height="3" fill="#F97316" />
    <rect x="14" y="8" width="4" height="3" fill="#F97316" />
    <rect x="10" y="13" width="4" height="3" fill="#F97316" fillOpacity="0.7" />
    <circle cx="8" cy="15.5" r="1" fill="#F97316" fillOpacity="0.5" />
    <circle cx="16" cy="15.5" r="1" fill="#F97316" fillOpacity="0.5" />
</svg>;

const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
</svg>;

const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>;

const NavLink = ({
    href,
    children,
    isActive = false
}) => <a href={href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? "text-orange-500" : "text-gray-600 dark:text-gray-300 hover:text-orange-500"}`}>
        {children}
    </a>;

const Button = ({
    children,
    variant = "primary",
    className = "",
    onClick
}) => {
    const baseClasses = "px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105";
    const variants = {
        primary: "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-gray-900 dark:focus:ring-gray-300",
        secondary: "bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-600 shadow-sm border border-gray-200 dark:border-gray-700",
        outline: "bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 focus:ring-gray-300 dark:focus:ring-gray-600"
    };
    return <button 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        onClick={onClick}
    >
        {children}
    </button>;
};

const MobileMenu = ({
    isOpen,
    navItems,
    onLogin,
    onSignUp
}) => <div className={`
      md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg
      transition-all duration-300 ease-in-out
      ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
  `}>
        {/* <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems && navItems.map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">
                    {item}
                </a>
            ))}
        </div> */}
        <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-5 space-y-2">
                <Button variant="outline" className="w-full" onClick={onLogin}>
                    Login
                </Button>
                <Button variant="primary" className="w-full" onClick={onSignUp}>
                    Sign Up
                </Button>
            </div>
        </div>
    </div>;

const HeaderSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink] = useState("Features");
    const navItems = ["About", "Features", "Blog", "Pricing", "Contact"];
    const navigate = useNavigate();

    const handleSignin = () => {
        try {
            navigate("/login");
        } catch (error) {
            console.error("Navigation error:", error);
            // Fallback to window.location if navigate fails
            window.location.href = "/login";
        }
    };

    const handleSignUp = () => {
        try {
            navigate("/signup");
        } catch (error) {
            console.error("Navigation error:", error);
            // Fallback to window.location if navigate fails
            window.location.href = "/signup";
        }
    };

    return <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <LogoIcon />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        CompHub
                    </span>
                </div>
                {/* <nav className="hidden md:flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-full">
                    {navItems.map(item => <NavLink key={item} href={`#${item.toLowerCase()}`} isActive={activeLink === item}>
                        {item}
                    </NavLink>)}
                </nav> */}
                <div className="hidden md:flex items-center space-x-2">
                    <ThemeToggle />
                    <Button variant="outline" onClick={handleSignin}>
                        Login
                    </Button>
                    <Button variant="primary" onClick={handleSignUp}>
                        Sign Up
                    </Button>
                </div>
                <div className="md:hidden flex items-center space-x-2">
                    <ThemeToggle />
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500" aria-expanded={isMenuOpen} aria-controls="mobile-menu">
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
        </div>
        <MobileMenu 
            isOpen={isMenuOpen} 
            navItems={navItems}
            onLogin={handleSignin}
            onSignUp={handleSignUp}
        />
    </header>;
};

const Hero = () => {
    const navigate = useNavigate();
    
    const handleGetStarted = () => {
        try {
            navigate("/signup");
        } catch (error) {
            console.error("Navigation error:", error);
            window.location.href = "/signup";
        }
    };

    return <section className="relative z-10 text-center py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-orange-600 dark:text-orange-400 uppercase bg-orange-100 dark:bg-orange-900/30 rounded-full">
                WE ARE GLAD TO
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Streamline Your Electronics Inventory
                <span className="text-orange-500"> Like Never Before</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Manage your shop's components with ease, stay ahead of low stock, and make smarter repair decisions – all from a simple, secure, and responsive interface.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" className="w-full sm:w-auto" onClick={handleGetStarted}>
                    Get Started Today
                </Button>
            </div>
        </div>
    </section>;
};

export default function Hero2() {
    return <div className="relative w-full overflow-hidden bg-white dark:bg-black">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[40rem] h-[40rem] bg-gradient-to-tr from-orange-200 dark:from-orange-800/30 to-transparent opacity-20 dark:opacity-10 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none">
            <div className="w-[40rem] h-[40rem] bg-gradient-to-bl from-orange-200 dark:from-orange-800/30 to-transparent opacity-20 dark:opacity-10 rounded-full blur-3xl" />
        </div>
        <HeaderSection />
        <main>
            <Hero />
        </main>
    </div>;
}