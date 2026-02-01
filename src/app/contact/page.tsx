"use client"

import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#0B0C15] text-white py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Info Side */}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-6">
                            Get in <span className="text-indigo-400">Touch</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-12">
                            Have questions about SessionOrbit? Our team is here to help you get the most out of your virtual classroom experience.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-1">Email Us</h3>
                                    <p className="text-slate-400 mb-2">For general inquiries and support</p>
                                    <a href="mailto:hello@sessionorbit.com" className="text-indigo-400 hover:text-indigo-300">hello@sessionorbit.com</a>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-1">Visit Us</h3>
                                    <p className="text-slate-400">
                                        123 Innovation Drive<br />
                                        Tech City, TC 94043
                                    </p>
                                </div>
                            </div>

                            {/* <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-1">Call Us</h3>
                                    <p className="text-slate-400 mb-2">Mon-Fri from 9am to 6pm EST</p>
                                    <a href="tel:+15550000000" className="text-indigo-400 hover:text-indigo-300">+1 (555) 000-0000</a>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="first-name" className="text-sm font-medium text-slate-300">First Name</label>
                                            <Input id="first-name" placeholder="John" className="bg-slate-800 border-slate-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="last-name" className="text-sm font-medium text-slate-300">Last Name</label>
                                            <Input id="last-name" placeholder="Doe" className="bg-slate-800 border-slate-700" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                                        <Input id="email" type="email" placeholder="john@example.com" className="bg-slate-800 border-slate-700" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your inquiry..."
                                            className="min-h-[150px] bg-slate-800 border-slate-700"
                                        />
                                    </div>

                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Send className="w-4 h-4 mr-2" />
                                        SendMessage
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
