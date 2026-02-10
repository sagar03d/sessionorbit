"use client";



export const CollaborationGraphic = ({ className }: { className?: string }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <filter id="glow-collab" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Connections */}
                <path d="M100 150 L200 80 L300 150 L200 220 Z" stroke="#334155" strokeWidth="2" strokeDasharray="4 4">
                    <animate
                        attributeName="stroke-dashoffset"
                        from="100"
                        to="0"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </path>
                <path d="M100 150 L200 220" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M300 150 L200 80" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />


                {/* Nodes */}
                {/* Top Node */}
                <g filter="url(#glow-collab)">
                    <circle cx="200" cy="80" r="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    {/* Simple Avatar: Head and Shoulders */}
                    <circle cx="200" cy="75" r="8" fill="#3b82f6" opacity="0.8" />
                    <path d="M188 95 Q200 100 212 95 V90 Q200 85 188 90 Z" fill="#3b82f6" opacity="0.6" />
                    <circle cx="215" cy="65" r="8" fill="#22c55e" stroke="#0f172a" strokeWidth="2" />
                </g>

                {/* Left Node */}
                <g filter="url(#glow-collab)">
                    <circle cx="100" cy="150" r="20" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
                    <circle cx="100" cy="145" r="8" fill="#a855f7" opacity="0.8" />
                    <path d="M88 165 Q100 170 112 165 V160 Q100 155 88 160 Z" fill="#a855f7" opacity="0.6" />
                </g>

                {/* Right Node */}
                <g filter="url(#glow-collab)">
                    <circle cx="300" cy="150" r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                    <circle cx="300" cy="145" r="8" fill="#06b6d4" opacity="0.8" />
                    <path d="M288 165 Q300 170 312 165 V160 Q300 155 288 160 Z" fill="#06b6d4" opacity="0.6" />
                    <circle cx="315" cy="135" r="8" fill="#22c55e" stroke="#0f172a" strokeWidth="2" />
                </g>


                {/* Bottom Node */}
                <g filter="url(#glow-collab)">
                    <circle cx="200" cy="220" r="20" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                    <circle cx="200" cy="215" r="8" fill="#ef4444" opacity="0.8" />
                    <path d="M188 235 Q200 240 212 235 V230 Q200 225 188 230 Z" fill="#ef4444" opacity="0.6" />
                </g>

                {/* Cursors */}
                <g transform="translate(140, 110)">
                    <path d="M0 0 L15 5 L10 15 Z" fill="#3b82f6" />
                    <text x="10" y="25" fill="#3b82f6" fontSize="10" fontFamily="sans-serif">Editing</text>
                    <animateMotion path="M0 0 L20 20 L0 40 Z" dur="6s" repeatCount="indefinite" />
                </g>

                <g transform="translate(250, 180)">
                    <path d="M0 0 L15 5 L10 15 Z" fill="#06b6d4" />
                    <text x="10" y="25" fill="#06b6d4" fontSize="10" fontFamily="sans-serif">Viewing</text>
                    <animateMotion path="M0 0 L-20 -10 L0 -20 Z" dur="8s" repeatCount="indefinite" />
                </g>

            </svg>
        </div>
    );
};
