"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Mail } from "lucide-react"

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check localStorage
        const dismissed = localStorage.getItem("newsletter_dismissed")
        const subscribed = localStorage.getItem("newsletter_subscribed")

        if (!dismissed && !subscribed) {
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 10000) // 10 seconds

            return () => clearTimeout(timer)
        }
    }, [])

    const handleDismiss = () => {
        setIsOpen(false)
        localStorage.setItem("newsletter_dismissed", "true")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (res.ok) {
                setIsSuccess(true)
                localStorage.setItem("newsletter_subscribed", "true")
                setTimeout(() => setIsOpen(false), 2000)
            } else {
                alert("Something went wrong. Please try again.")
            }
        } catch (error) {
            console.error(error)
            alert("Error subscribing.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!mounted) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
            <DialogContent className="sm:max-w-md bg-stone-900 border border-stone-800 text-white">
                <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer" onClick={handleDismiss}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </div>
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <DialogTitle className="text-center text-xl">Join the Orbit</DialogTitle>
                            <DialogDescription className="text-center text-stone-400">
                                Get access to exclusive tutoring resources, platform updates, and tips to grow your business.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <Input
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                                required
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={isSubmitting}>
                                {isSubmitting ? "Joining..." : "Subscribe Now"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="py-8 text-center space-y-4">
                        <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Welcome Aboard!</h3>
                        <p className="text-stone-400">You've been successfully added to our newsletter.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
