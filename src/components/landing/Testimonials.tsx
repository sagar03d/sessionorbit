"use client"

import { Star, Quote, TrendingUp, Users, Clock, Shield } from "lucide-react"

export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Mitchell",
            role: "Math Tutor, 5 years experience",
            image: "👩‍🏫",
            quote: "I save 45 minutes after every session. The AI lesson reports are so detailed, parents think I'm typing them myself!",
            rating: 5
        },
        {
            name: "James Chen",
            role: "ESL Teacher",
            image: "👨‍🏫",
            quote: "No more 'Can you hear me?' at the start of class. The AI help desk fixed my students' audio issues before I even joined.",
            rating: 5
        },
        {
            name: "Maria Rodriguez",
            role: "Parent of 3",
            image: "👩",
            quote: "Finally, I can see what my kids actually learned today. The summaries are clear and professional—worth every penny.",
            rating: 5
        }
    ]

    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Loved by <span className="text-indigo-400">10,000+</span> Educators
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    See why tutors and parents are switching to SessionOrbit
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-indigo-500/30 transition-all">
                            <Quote className="w-8 h-8 text-indigo-400/30 mb-4" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-slate-300 mb-6 leading-relaxed">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{testimonial.image}</div>
                                <div>
                                    <p className="text-white font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
