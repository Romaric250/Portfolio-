"use client"
import { useState, useEffect, useRef } from 'react';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-primary text-white shadow-md">
            <nav className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 lg:px-10 relative">
                <div className="text-xl font-bold cursor-pointer">
                    R.L
                </div>
                <div className="text-xl font-bold cursor-pointer" onClick={toggleMenu}>
                    Menu
                </div>
                {isMenuOpen && (
                    <div ref={menuRef} className="absolute top-full left-1/2 transform -translate-x-1/2 p-6 mt-2 bg-primary text-white shadow-md rounded-md transition-all duration-300 ease-in-out">
                        <div className="flex flex-col items-center py-4 space-y-4 text-white">
                            <a href="/" className=" hover:text-secondary transition-colors duration-200">Home</a>
                            <a href="#about" className=" hover:text-secondary transition-colors duration-200">About</a>
                            <a href="#portfolio" className=" hover:text-secondary transition-colors duration-200">Projects</a>
                            <a href="#portfolio" className="hover:text-secondary transition-colors duration-200">Blogs</a>
                            <a href="#contact" className=" hover:text-secondary transition-colors duration-200">Contact</a>
                        </div>
                    </div>
                )}
                <button className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-dark transition-colors duration-200">
                    Download CV
                </button>
            </nav>
        </div>
    );
};

export default Navigation;