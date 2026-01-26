export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">
                    Terms of Service
                </h1>

                <div className="space-y-8 text-slate-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                            In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules
                            applicable to such services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on SessionOrbit's
                            website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
                            and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on SessionOrbit's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on SessionOrbit's website are provided on an 'as is' basis. SessionOrbit makes no warranties,
                            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                            implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                            of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Limitations</h2>
                        <p>
                            In no event shall SessionOrbit or its suppliers be liable for any damages (including, without limitation,
                            damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                            to use the materials on SessionOrbit's website.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
