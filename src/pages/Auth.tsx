import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { LogIn, UserPlus } from 'lucide-react'

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
                setMessage('Check your email for the confirmation link.')
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{isLogin ? 'Welcome back to Candor' : 'Create your Candor account'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Enter your credentials to access your dashboard' : 'Your ATS tracks candidates. Candor respects them.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Company Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Work Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        {message && <p className="text-sm text-green-600 font-medium">{message}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? <><LogIn className="mr-2 h-4 w-4" /> Sign In</> : <><UserPlus className="mr-2 h-4 w-4" /> Sign Up</>)}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-sm">
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
