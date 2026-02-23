import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const fadeTimer = setTimeout(() => {
            setFading(true);
        }, 2000);

        // Finish after fade animation (e.g., 500ms fade)
        const finishTimer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 transition-opacity duration-700 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="relative flex flex-col items-center animate-pulse">
                <img
                    src={logo}
                    alt="TaxiPro Logo"
                    className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl mb-4"
                />
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest drop-shadow-lg">
                    TaxiPro
                </h1>
                <p className="text-blue-200 mt-2 tracking-wider text-sm md:text-base uppercase">
                    Panel de Control
                </p>
            </div>

            <div className="absolute bottom-10">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin opacity-50"></div>
            </div>
        </div>
    );
}
