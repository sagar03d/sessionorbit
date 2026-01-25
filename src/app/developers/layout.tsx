import Link from 'next/link';
import { Book, Key, Server, Database, Activity } from 'lucide-react';

export default function DeveloperLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-neutral-950 min-h-screen text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-800 h-screen sticky top-0 hidden md:flex flex-col p-6 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        SessionOrbit Devs
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">v1.0.0</p>
                </div>

                <nav className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Getting Started</h3>
                        <a href="#overview" className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-900">
                            <Book className="w-4 h-4" />
                            <span>Overview</span>
                        </a>
                        <a href="#authentication" className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-900">
                            <Key className="w-4 h-4" />
                            <span>Authentication</span>
                        </a>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Core API</h3>
                        <a href="#api-reference" className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-900">
                            <Activity className="w-4 h-4" />
                            <span>Health & Meetings</span>
                        </a>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Resources</h3>
                        <a href="#resources" className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-neutral-900">
                            <Database className="w-4 h-4" />
                            <span>Course Management</span>
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen scroll-smooth">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
