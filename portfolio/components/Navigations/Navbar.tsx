"use client"
import { useState, useEffect, useRef } from 'react';
import { Icon } from 'lucide-react';

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
            <nav className="container mx-auto flex justify-center items-center py-4 relative">
                <div className="text-2xl font-bold text-primary cursor-pointer" onClick={toggleMenu}>
                    R.L
                </div>
                {isMenuOpen && (
                    <div ref={menuRef} className="absolute top-full mt-2 bg-white shadow-md rounded-md">
                        <div className="flex flex-col items-center py-4 space-y-4">
                            <a href="#home" className="text-primary">Home</a>
                            <a href="#about" className="text-primary">About</a>
                            <a href="#portfolio" className="text-primary">Portfolio</a>
                            <a href="#contact" className="text-primary">Contact</a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navigation;