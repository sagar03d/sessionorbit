import { Search, Book, MessageCircle, FileText, Zap, Laptop } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
    const categories = [
        {
            icon: Laptop,
            title: "Getting Started",
            description: "Everything you need to know to set up your classroom.",
            count: "12 articles"
        },
        {
            icon: Zap,
            title: "Features & Tools",
            description: "Deep dive into whiteboards, quizzes, and AI tools.",
            count: "24 articles"
        },
        {
            icon: FileText,
            title: "Account & Billing",
            description: "Manage your subscription, invoices, and profile.",
            count: "8 articles"
        },
        {
            icon: MessageCircle,
            title: "Troubleshooting",
            description: "Solutions to common audio, video, and connection issues.",
            count: "15 articles"
        },
        {
            icon: Book,
            title: "Student Guides",
            description: "Resources to share with your students.",
            count: "6 articles"
        }
    ]

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Search Section */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6">How can we help you?</h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search for articles, guides, and more..."
                            className="w-full pl-12 py-6 bg-slate-900/50 border-white/10 text-white rounded-xl focus-visible:ring-indigo-500 placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categories.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <div key={index} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer">
                                <Icon className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                                <p className="text-slate-400 mb-4 h-12">{category.description}</p>
                                <span className="text-sm text-indigo-400 font-medium group-hover:underline">
                                    {category.count}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* FAQ / Contact Section */}
                <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Our support team is available 24/7 to assist you with any technical issues or implementation questions.
                    </p>
                    <div className="flex justify-center gap-4">
                        {/* Chat removed as per request */}
                        <Button className="bg-white text-black hover:bg-slate-200" onClick={() => window.location.href = '/contact?type=support'}>
                            Submit a Ticket
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
