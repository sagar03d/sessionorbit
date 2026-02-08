import Link from 'next/link';
import { Twitter, Github, Linkedin, Disc } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Company: [
            { name: 'About', href: '/about' },
            // { name: 'Careers', href: '/careers' },
            { name: 'Blog', href: '/blog' },
            // { name: 'Contact', href: '/contact' },
        ],
        Resources: [
            { name: 'Documentation', href: '/docs' },
            { name: 'Help Center', href: '/help' },
            { name: 'Status', href: '/status' },
        ],
        Legal: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Security', href: '/security' },
        ],
    };

    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="orbit-container">
                                    <div className="orbiting-dot" />
                                </div>
                                <img
                                    src="/logo.png"
                                    alt="SessionOrbit Logo"
                                    className="w-full h-full object-contain relative z-10"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-deep-indigo to-orbit-cyan bg-clip-text text-transparent">
                                SessionOrbit
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-6">
                            Empowering educators with advanced AI tools for seamless online teaching and student engagement.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/sessionorbit" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/sessionorbit" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-white mb-4">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} SessionOrbit. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
