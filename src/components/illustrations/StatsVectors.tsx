"use client";

export const ReportVector = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="25" y="20" width="50" height="60" rx="4" fill="#6366f1" fillOpacity="0.1" stroke="#6366f1" strokeWidth="2" />
        <path d="M35 35 H65" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 45 H65" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 55 H55" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        <circle cx="70" cy="70" r="12" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
        <path d="M66 70 L69 73 L74 68" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TechVector = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M30 70 L40 40 L60 60 L70 30" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="70" r="3" fill="#a855f7" />
        <circle cx="40" cy="40" r="3" fill="#a855f7" />
        <circle cx="60" cy="60" r="3" fill="#a855f7" />
        <circle cx="70" cy="30" r="3" fill="#a855f7" />
        <path d="M20 80 Q50 20 80 80" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
    </svg>
);

export const PrepVector = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="25" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" />
        <path d="M50 35 V45" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 55 V65" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 50 H55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 50 H35" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="8" fill="#10b981" fillOpacity="0.2" />
    </svg>
);

export const GradingVector = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="28" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="2" />
        <path d="M35 50 L45 60 L65 40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 30 L75 35" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M75 25 L80 30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
);
