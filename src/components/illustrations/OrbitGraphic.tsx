"use client";



export const OrbitGraphic = ({ className }: { className?: string }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="orbit-gradient" x1="0" y1="0" x2="400" y2="400">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="planet-gradient" x1="180" y1="180" x2="220" y2="220">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* Central Planet */}
                <circle cx="200" cy="200" r="40" fill="url(#planet-gradient)">
                    <animate
                        attributeName="opacity"
                        values="0.8;1;0.8"
                        dur="4s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Inner Orbit Ring */}
                <circle cx="200" cy="200" r="100" stroke="url(#orbit-gradient)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 200 200"
                        to="360 200 200"
                        dur="20s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Middle Orbit Ring */}
                <circle cx="200" cy="200" r="150" stroke="url(#orbit-gradient)" strokeWidth="1.5" opacity="0.3">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360 200 200"
                        to="0 200 200"
                        dur="30s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Outer Orbit Ring */}
                <circle cx="200" cy="200" r="190" stroke="url(#orbit-gradient)" strokeWidth="0.5" strokeDasharray="8 8" opacity="0.2">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 200 200"
                        to="360 200 200"
                        dur="60s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Orbiting Bodies */}
                <g>
                    <circle cx="200" cy="100" r="8" fill="#06b6d4" fillOpacity="0.8">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="20s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>

                <g>
                    <circle cx="200" cy="350" r="12" fill="#6366f1" fillOpacity="0.6">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="360 200 200"
                            to="0 200 200"
                            dur="30s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>

                <g>
                    <circle cx="390" cy="200" r="4" fill="#a855f7" fillOpacity="0.4">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 200 200"
                            to="360 200 200"
                            dur="60s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>

            </svg>
        </div>
    );
};
