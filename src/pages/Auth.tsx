import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Activity, ArrowRight, CheckCircle2, Mail, Lock, User, Building } from 'lucide-react'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError
                navigate('/dashboard')
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            company_name: companyName
                        }
                    }
                })
                if (signUpError) throw signUpError
                setMessage('Please check your email for a confirmation link.')
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">

            {/* Left side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative bg-white">

                {/* Brand Logo - Top Left */}
                <div className="absolute top-8 left-8 sm:left-16 lg:left-24 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">Candor.</span>
                </div>

                <div className="max-w-sm w-full mx-auto mt-16 lg:mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h1>
                        <p className="text-slate-500">
                            {isLogin
                                ? 'Enter your details to access your workspace.'
                                : 'Start delivering a world-class candidate experience.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 focus-within:text-primary text-slate-500 transition-colors">
                                    <label className="text-xs font-semibold uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                            placeholder="Jane Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 focus-within:text-primary text-slate-500 transition-colors">
                                    <label className="text-xs font-semibold uppercase tracking-wider">Company</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building className="h-4 w-4" />
                                        </div>
                                        <Input
                                            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                            placeholder="Acme Inc."
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5 focus-within:text-primary text-slate-500 transition-colors">
                            <label className="text-xs font-semibold uppercase tracking-wider">Work Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    type="email"
                                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    placeholder="jane@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:text-primary text-slate-500 transition-colors">
                            <label className="text-xs font-semibold uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <Input
                                    type="password"
                                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {isLogin && (
                                <div className="flex justify-end pt-1">
                                    <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium flex items-start gap-2 animate-in fade-in">
                                <Activity className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {message && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium flex items-start gap-2 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{message}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 mt-4 group" disabled={loading}>
                            {loading ? (
                                'Processing...'
                            ) : (
                                <span className="flex items-center justify-center">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="ml-2 w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                                setMessage(null)
                            }}
                            className="ml-1.5 font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                            {isLogin ? 'Sign up for free' : 'Sign in instead'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Right side: Branding/Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-l border-slate-200 overflow-hidden items-center justify-center p-12 lg:p-24">

                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3" />
                </div>

                {/* Glass Mockup Container */}
                <div className="relative z-10 w-full max-w-lg">

                    <div className="mb-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md mb-4 shadow-xl">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            Candor Engine v1.0
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                            Stop tracking candidates.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Start building relationships.</span>
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed font-light">
                            Candor seamlessly syncs with your ATS to send ultra-personalized, context-aware updates to every applicant.
                        </p>
                    </div>

                    {/* Floating UI Elements matching the product feel */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
                                    A
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Alex Chen</p>
                                    <p className="text-xs text-slate-300">Frontend Engineer</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold">
                                92% Match
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-xl shadow-xl ml-8 opacity-80 flex gap-3 mix-blend-plus-lighter">
                            <Mail className="w-5 h-5 text-indigo-300 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-white mb-1">Outreach Drafted</p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    "Hi Alex, your React experience at Acme Corp aligns perfectly with..."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03] z-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />

            </div>
        </div>
    )
}
