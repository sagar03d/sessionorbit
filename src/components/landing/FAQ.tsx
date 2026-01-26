"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "Do I need to install any software?",
            answer: "No! SessionOrbit runs entirely in your browser. Just click a link and you're in class—no downloads, no updates, no hassle."
        },
        {
            question: "What happens to my data?",
            answer: "Your data is encrypted and stored securely. We never sell your information. Lesson recordings and transcripts are yours to download or delete anytime."
        },
        {
            question: "Can I try it before paying?",
            answer: "Absolutely! Every plan includes a 14-day free trial with full access to all features. No credit card required to start."
        },
        {
            question: "What if my internet connection is poor?",
            answer: "Our Smooth-Stream technology automatically adapts to your bandwidth. Lessons continue even on weak connections by switching to audio-only mode."
        },
        {
            question: "How does the AI Help Desk work?",
            answer: "When a student has audio/video issues, our AI assistant speaks to them directly with step-by-step troubleshooting—so you can focus on teaching, not tech support."
        },
        {
            question: "Can I cancel anytime?",
            answer: "Yes! No long-term contracts. Cancel with one click from your dashboard. You'll have access until the end of your billing period."
        }
    ]

    return (
        <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-400">
                    Everything you need to know about SessionOrbit
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden hover:border-indigo-500/30 transition-all">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
