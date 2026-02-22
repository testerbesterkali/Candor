import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Database, MessageSquare, Star, Activity, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

export default function Landing() {
    return (
        <div className="min-h-screen bg-white selection:bg-primary/20">
            {/* Top Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tight text-primary">Candor</div>
                <div className="flex items-center gap-4">
                    <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Log in</Link>
                    <Link to="/auth">
                        <Button className="rounded-full shadow-sm">
                            Start Free Trial
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -z-10 pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 ring-1 ring-primary/20">
                        <SparklesIcon className="w-4 h-4" /> Introducing Candor
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                        Your ATS tracks candidates. <br className="hidden md:block" />
                        <span className="text-primary relative inline-block">
                            Candor respects them.
                            <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-4 text-emerald-400 opacity-60 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 w-full md:w-3/4 mx-auto leading-relaxed">
                        The candidate experience automation platform for growing teams. Candor plugs into your ATS, auto-generates personalized emails, and builds a living talent bank of warm candidates.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <Link to="/auth" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all h-14 px-8 text-base font-semibold group">
                                Start Free Trial <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <p className="text-sm text-slate-500 sm:hidden">No credit card required</p>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14-day free trial</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
                    </div>

                    {/* Mock Badge Showcase */}
                    <div className="pt-20 max-w-md mx-auto animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">What candidates see on your careers page</p>
                        <div className="bg-white p-5 rounded-3xl shadow-2xl ring-1 ring-slate-200/50 flex items-center space-x-5 hover:scale-105 transition-transform duration-500 cursor-default">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-black text-2xl ring-8 ring-green-50/50 shadow-inner">
                                98
                            </div>
                            <div className="text-left flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-slate-900 text-lg">Candor Score</p>
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-tight">
                                    This company responds to <span className="text-slate-900 font-bold">100%</span> of applicants.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Strip */}
            <section className="border-y border-slate-100 bg-slate-50 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center md:text-left shrink-0">Trusted by teams that care</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <span className="text-xl font-bold font-serif text-slate-800">Acme Corp</span>
                        <span className="text-xl font-black tracking-tighter text-slate-800">GLOBEX</span>
                        <span className="text-xl font-bold font-mono text-slate-800">Initech</span>
                        <span className="text-xl font-extrabold italic text-slate-800">Soylent</span>
                        <span className="text-xl font-bold text-slate-800">Umbrella</span>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                The Ghosting Epidemic is costing you great talent.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                When a growing company receives hundreds of applications, personal replies become impossible. Standard ATS templates feel cold and robotic.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                The result? <span className="font-bold text-slate-900">72% of candidates report being ghosted</span>, leading to negative Glassdoor reviews and a damaged employer brand that makes future hiring harder.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-orange-50 blur-3xl -z-10 rounded-full opacity-50" />
                            <div className="bg-white border text-center border-slate-200 rounded-3xl p-10 shadow-xl relative">
                                <div className="text-amber-500 flex justify-center mb-4">
                                    <Star className="w-8 h-8 fill-current" /><Star className="w-8 h-8 fill-current" /><Star className="w-8 h-8 fill-current text-slate-200" /><Star className="w-8 h-8 fill-current text-slate-200" /><Star className="w-8 h-8 fill-current text-slate-200" />
                                </div>
                                <h3 className="text-6xl font-black text-slate-900 mb-2">2.4</h3>
                                <p className="text-slate-500 font-medium">Average Glassdoor rating drop <br /> after a poor candidate experience.</p>

                                <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left">
                                    <div className="flex items-start gap-3">
                                        <Activity className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <p className="text-sm font-semibold text-emerald-800">
                                            Candor users see an average <span className="font-black">+0.4 star improvement</span> on Glassdoor within 60 days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl opacity-30 pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How Candor Works</h2>
                        <p className="text-xl text-slate-400">A seamless workflow that runs entirely in the background.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent border-dashed" />

                        <div className="space-y-6 text-center relative">
                            <div className="w-24 h-24 mx-auto bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                                <Database className="w-10 h-10 text-primary" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">1</div>
                            </div>
                            <h3 className="text-2xl font-bold">Connect your ATS</h3>
                            <p className="text-slate-400 leading-relaxed">
                                We plug directly into Greenhouse, Lever, Ashby, or Workable. As you move candidates in your ATS, Candor listens.
                            </p>
                        </div>

                        <div className="space-y-6 text-center relative">
                            <div className="w-24 h-24 mx-auto bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                                <MessageSquare className="w-10 h-10 text-emerald-400" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">2</div>
                            </div>
                            <h3 className="text-2xl font-bold">Set your Voice</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Provide 3 past rejection emails. Our AI calibrates to your exact structural and lexical habits to sound remarkably human.
                            </p>
                        </div>

                        <div className="space-y-6 text-center relative">
                            <div className="w-24 h-24 mx-auto bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                                <Zap className="w-10 h-10 text-amber-400 fill-amber-400/20" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">3</div>
                            </div>
                            <h3 className="text-2xl font-bold">Candor Automates</h3>
                            <p className="text-slate-400 leading-relaxed">
                                When a candidate is rejected, Candor drafts a hyper-personalized email referencing their exact resume and queues it for send.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 bg-slate-50" id="pricing">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Simple, transparent pricing</h2>
                        <p className="text-xl text-slate-600">Invest in your employer brand for less than a job board posting.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                        {/* Starter */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                            <p className="text-slate-500 text-sm mb-6 h-10">Perfect for founders hiring their first few team members.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black text-slate-900">$99</span>
                                <span className="text-slate-500 font-medium">/mo</span>
                            </div>
                            <Link to="/auth" className="block w-full mb-8">
                                <Button variant="outline" className="w-full rounded-2xl h-12">Start 14-day trial</Button>
                            </Link>
                            <div className="space-y-4 flex-1">
                                <PricingFeature text="Up to 3 active roles" />
                                <PricingFeature text="ATS Integration" />
                                <PricingFeature text="AI Email Generation" />
                                <PricingFeature text="Candor Score Widget" />
                            </div>
                        </div>

                        {/* Growth */}
                        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
                            <p className="text-slate-400 text-sm mb-6 h-10">For scaling startups with continuous hiring needs.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black text-white">$249</span>
                                <span className="text-slate-400 font-medium">/mo</span>
                            </div>
                            <Link to="/auth" className="block w-full mb-8">
                                <Button className="w-full rounded-2xl h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 text-base">Start 14-day trial</Button>
                            </Link>
                            <div className="space-y-4 flex-1">
                                <PricingFeature text="Unlimited active roles" light />
                                <PricingFeature text="Everything in Starter" light />
                                <PricingFeature text="Automated Status Nudges" light />
                                <PricingFeature text="Basic Talent Bank" light />
                            </div>
                        </div>

                        {/* Scale */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Scale</h3>
                            <p className="text-slate-500 text-sm mb-6 h-10">For larger teams with dedicated recruiters.</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black text-slate-900">$499</span>
                                <span className="text-slate-500 font-medium">/mo</span>
                            </div>
                            <Link to="/auth" className="block w-full mb-8">
                                <Button variant="outline" className="w-full rounded-2xl h-12">Start 14-day trial</Button>
                            </Link>
                            <div className="space-y-4 flex-1">
                                <PricingFeature text="Multi-seat access (5 users)" />
                                <PricingFeature text="Everything in Growth" />
                                <PricingFeature text="Advanced Talent Bank Search" />
                                <PricingFeature text="Re-engagement automation" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-6">
                        <FAQItem
                            question="How does Candor know what to say in the rejection email?"
                            answer="Candor uses GPT-4o Vision to securely parse the candidate's original resume, matching their skills to the role they applied for. Relying on the voice profile you set during onboarding, the AI drafts an email that specifies exactly why their background didn't align with this specific role, making it feel deeply personal and not like a form letter."
                        />
                        <FAQItem
                            question="Do emails send automatically?"
                            answer="By default, Candor uses a confidence scoring system. If the AI is highly confident in its draft, it gets queued for sending after a 2-hour delay window (giving you time to cancel). If the AI is unsure, it flags the email in your dashboard as 'Needs Review' so you can approve it manually."
                        />
                        <FAQItem
                            question="What happens to candidate data?"
                            answer="Candidate PII is fully encrypted. We are GDPR compliant and candidates can request data deletion at any time. Importantly, your candidate data is siloed to your company—we do not use it to cross-train models for other Candor users."
                        />
                        <FAQItem
                            question="What ATS platforms do you support?"
                            answer="Currently, we integrate seamlessly with Greenhouse, Lever, Ashby, and Workable via API webhooks. If you use a different system, you can upload a CSV export to utilize the email generation and talent bank tracking."
                        />
                    </div>
                </div>
            </section>

            {/* Footer CTA & Links */}
            <footer className="bg-slate-950 text-slate-400 py-16 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center border-b border-slate-800 pb-16 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to fix your candidate experience?</h2>
                        <p className="text-lg">Set up takes less than 5 minutes.</p>
                    </div>
                    <div className="flex md:justify-end">
                        <Link to="/auth">
                            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white h-14 px-8 text-base font-semibold">
                                Get Started Today
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-bold text-white tracking-tight">Candor</div>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="mailto:hello@candor.app" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                    <div className="text-sm">
                        © {new Date().getFullYear()} Candor Technologies Inc.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function SparklesIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    )
}

function PricingFeature({ text, light = false }: { text: string, light?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className={cn("w-5 h-5 shrink-0", light ? "text-emerald-400" : "text-primary")} />
            <span className={cn("text-sm font-medium", light ? "text-slate-300" : "text-slate-600")}>{text}</span>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-all duration-300">
            <button
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-bold text-lg text-slate-900 pr-8">{question}</h4>
                <div className={cn("w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-300 bg-white", isOpen ? "rotate-45" : "")}>
                    <Plus className="w-4 h-4 text-slate-500" />
                </div>
            </button>
            <div className={cn("px-6 overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0")}>
                <p className="text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                    {answer}
                </p>
            </div>
        </div>
    )
}
