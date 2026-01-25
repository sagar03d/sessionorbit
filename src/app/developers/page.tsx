'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Server, Key, Shield, ExternalLink, Database } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function DeveloperPortal() {
    const [token, setToken] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setToken(session.access_token);
            }
        };
        fetchSession();
    }, []);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Header / Overview */}
                <section id="overview" className="space-y-4 pt-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        SessionOrbit Developer Portal
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Build powerful integrations with our robust API. Access your meetings, manage sessions, and automate your workflow programmatically.
                    </p>
                </section>

                {/* Authentication Section */}
                <section id="authentication" className="space-y-6 scroll-mt-24">
                    <div className="border border-neutral-800 bg-neutral-900/50 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center space-x-3 text-blue-400 mb-4">
                            <Key className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold text-white">Authentication</h2>
                        </div>
                        <p className="text-neutral-300 mb-4">
                            All API requests must be authenticated using a Bearer Token. Include the token in the <code className="bg-neutral-800 px-2 py-1 rounded text-orange-300">Authorization</code> header.
                        </p>

                        {token ? (
                            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 relative group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-neutral-500 uppercase tracking-wider font-mono">Your Current Session Token</span>
                                    <button
                                        onClick={() => copyToClipboard(token, 'token')}
                                        className="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        {copied === 'token' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="font-mono text-sm text-green-400 break-all line-clamp-2 hover:line-clamp-none transition-all cursor-pointer" onClick={() => copyToClipboard(token, 'token')}>
                                    {token}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950/90 pointer-events-none group-hover:opacity-0 transition-opacity" />
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 rounded-lg">
                                Please sign in to view your access token.
                            </div>
                        )}
                    </div>
                </section>

                {/* API Reference */}
                <section id="api-reference" className="space-y-8 scroll-mt-24">
                    <div className="flex items-center space-x-3 text-purple-400">
                        <Server className="w-6 h-6" />
                        <h2 className="text-2xl font-semibold text-white">Core API</h2>
                    </div>

                    {/* Health Endpoint */}
                    <ApiEndpoint
                        method="GET"
                        path="/api/v1/health"
                        description="Check the operational status of the API."
                        baseUrl={baseUrl}
                        copyToClipboard={copyToClipboard}
                        copied={copied}
                    />

                    {/* List Meetings Endpoint */}
                    <ApiEndpoint
                        method="GET"
                        path="/api/v1/meetings"
                        description="Retrieve a list of all active meetings for the authenticated user."
                        baseUrl={baseUrl}
                        copyToClipboard={copyToClipboard}
                        copied={copied}
                        requiresAuth
                    />

                    {/* Create Meeting Endpoint */}
                    <ApiEndpoint
                        method="POST"
                        path="/api/v1/meetings"
                        description="Create a new meeting session."
                        baseUrl={baseUrl}
                        copyToClipboard={copyToClipboard}
                        copied={copied}
                        requiresAuth
                        body={`{
  "name": "My API Meeting"
}`}
                    />
                </section>

                {/* --- Resource Management Endpoints --- */}
                <section id="resources" className="space-y-8 scroll-mt-24">
                    <div className="pt-8 border-t border-neutral-800">
                        <div className="flex items-center space-x-3 text-pink-400 mb-6">
                            <Database className="w-6 h-6" />
                            <h2 className="text-2xl font-semibold text-white">Resource Management</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Courses */}
                            <ApiEndpoint
                                method="GET"
                                path="/api/v1/courses"
                                description="List all courses."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                            />
                            <ApiEndpoint
                                method="POST"
                                path="/api/v1/courses"
                                description="Create a new course."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                                body={`{
  "name": "Advanced React",
  "code": "REACT-201"
}`}
                            />

                            {/* Batches */}
                            <ApiEndpoint
                                method="GET"
                                path="/api/v1/batches?courseId=UUID"
                                description="List batches for a specific course."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                            />
                            <ApiEndpoint
                                method="POST"
                                path="/api/v1/batches"
                                description="Create a new batch."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                                body={`{
  "courseId": "UUID",
  "name": "Morning Batch",
  "code": "BATCH-A"
}`}
                            />

                            {/* Schedules */}
                            <ApiEndpoint
                                method="GET"
                                path="/api/v1/schedules?batchId=UUID"
                                description="List schedules for a batch."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                            />
                            <ApiEndpoint
                                method="POST"
                                path="/api/v1/schedules"
                                description="Create a class schedule."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                                body={`{
  "batchId": "UUID",
  "startTime": "2024-01-25T10:00:00Z",
  "endTime": "2024-01-25T11:00:00Z"
}`}
                            />

                            {/* Students */}
                            <ApiEndpoint
                                method="GET"
                                path="/api/v1/students?query=John"
                                description="Search for students."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                            />
                            <ApiEndpoint
                                method="POST"
                                path="/api/v1/students"
                                description="Create a new student."
                                baseUrl={baseUrl}
                                copyToClipboard={copyToClipboard}
                                copied={copied}
                                requiresAuth
                                body={`{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890"
}`}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function ApiEndpoint({ method, path, description, baseUrl, copyToClipboard, copied, requiresAuth, body }: any) {
    const isGet = method === 'GET';
    const colorClass = isGet ? 'text-blue-400' : 'text-green-400';
    const bgClass = isGet ? 'bg-blue-400/10 border-blue-400/20' : 'bg-green-400/10 border-green-400/20';

    const curlCommand = `curl -X ${method} "${baseUrl}${path}" \\
${requiresAuth ? '  -H "Authorization: Bearer YOUR_TOKEN" \\\n' : ''}${body ? `  -H "Content-Type: application/json" \\
  -d '${body}'` : ''}`;

    return (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
            <div className={`px-6 py-4 border-b border-neutral-800 flex items-center justify-between`}>
                <div className="flex items-center space-x-4">
                    <span className={`font-mono font-bold px-3 py-1 rounded text-sm ${bgClass} ${colorClass}`}>
                        {method}
                    </span>
                    <span className="font-mono text-neutral-300">{path}</span>
                </div>
                {requiresAuth && (
                    <div className="flex items-center space-x-1 text-xs text-neutral-500 border border-neutral-800 px-2 py-1 rounded-full">
                        <Shield className="w-3 h-3" />
                        <span>Authenticated</span>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                <p className="text-neutral-400">{description}</p>

                <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
                        <div className="flex items-center space-x-2 text-neutral-500">
                            <Terminal className="w-4 h-4" />
                            <span className="text-xs font-mono">cURL</span>
                        </div>
                        <button
                            onClick={() => copyToClipboard(curlCommand, path)}
                            className="text-neutral-400 hover:text-white transition-colors"
                        >
                            {copied === path ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-neutral-300">
                        {curlCommand}
                    </pre>
                </div>
            </div>
        </div>
    );
}
