"use client";



export const TeachingGraphic = ({ className }: { className?: string }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="screen-gradient" x1="0" y1="0" x2="400" y2="300">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="accent-gradient" x1="100" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>

                {/* Main Screen Frame */}
                <rect x="50" y="50" width="300" height="200" rx="10" fill="url(#screen-gradient)" stroke="#334155" strokeWidth="2" />

                {/* UI Header */}
                <path d="M50 60 C50 54.4772 54.4772 50 60 50 H340 C345.523 50 350 54.4772 350 60 V80 H50 V60 Z" fill="#334155" fillOpacity="0.5" />
                <circle cx="70" cy="65" r="3" fill="#ef4444" />
                <circle cx="80" cy="65" r="3" fill="#f59e0b" />
                <circle cx="90" cy="65" r="3" fill="#22c55e" />

                {/* Student Grid */}
                <g>
                    {/* Teacher/Main View */}
                    <rect x="60" y="90" width="180" height="110" rx="4" fill="#64748b" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="1" />
                    <rect x="120" y="110" width="60" height="60" rx="30" fill="#3b82f6" fillOpacity="0.2" />
                    <path d="M130 170 C130 150 170 150 170 170" stroke="#3b82f6" strokeWidth="2" fill="none" />

                    {/* Badge */}
                    <rect x="70" y="100" width="40" height="16" rx="8" fill="#3b82f6" />
                    <text x="75" y="111" fill="white" fontSize="8" fontFamily="sans-serif">HOST</text>
                </g>

                <g transform="translate(250, 90)">
                    <rect width="80" height="50" rx="4" fill="#64748b" fillOpacity="0.1" />
                    <circle cx="40" cy="20" r="10" fill="#a855f7" fillOpacity="0.4" />
                    <path d="M25 40 C25 32 55 32 55 40" stroke="#a855f7" strokeWidth="1.5" fill="none" />
                </g>

                <g transform="translate(250, 150)">
                    <rect width="80" height="50" rx="4" fill="#64748b" fillOpacity="0.1" />
                    <circle cx="40" cy="20" r="10" fill="#06b6d4" fillOpacity="0.4" />
                    <path d="M25 40 C25 32 55 32 55 40" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
                </g>

                {/* Controls Bar */}
                <rect x="120" y="215" width="160" height="25" rx="12.5" fill="#0f172a" stroke="#334155" />
                <circle cx="140" cy="227.5" r="6" fill="#ef4444" /> {/* Mic - Muted */}
                <circle cx="160" cy="227.5" r="6" fill="#334155" />
                <circle cx="180" cy="227.5" r="6" fill="#22c55e" /> {/* Share */}
                <circle cx="200" cy="227.5" r="6" fill="#334155" />
                <rect x="230" y="220" width="40" height="15" rx="4" fill="#ef4444" /> {/* End */}

                {/* Floating Elements */}
                <g>
                    <circle cx="360" cy="100" r="15" fill="none" stroke="url(#accent-gradient)" strokeWidth="2" strokeDasharray="4 2">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 360 100"
                            to="360 360 100"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>

            </svg>
        </div>
    );
};
