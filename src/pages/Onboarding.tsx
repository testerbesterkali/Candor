import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Building2, MessageSquare, BellRing, CheckCircle2, Sparkles } from 'lucide-react'

const TONES = [
    { id: 'professional', label: 'Professional', sample: 'We appreciate your interest and have decided to move forward with other candidates.' },
    { id: 'warm_direct', label: 'Warm & Direct', sample: 'We really appreciated your application — this one wasn\'t the right fit, but here\'s why.' },
    { id: 'casual', label: 'Casual', sample: 'Hey — thanks so much for applying. We ended up going a different direction this time.' }
]

export default function Onboarding() {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    const { company, setCompany } = useAuthStore()

    // Step 2 State
    const [tone, setTone] = useState('warm_direct')
    const [samples, setSamples] = useState('')
    const [voiceProfile, setVoiceProfile] = useState<any>(null)
    const [isExtracting, setIsExtracting] = useState(false)

    // Step 3 State
    const [frequency, setFrequency] = useState('daily')
    const [slackUrl, setSlackUrl] = useState('')

    const handleSkipATS = async () => {
        if (!company) return
        await supabase.from('companies').update({ ats_connected: true }).eq('id', company.id)
        setCompany({ ...company, ats_connected: true })
        setStep(2)
    }

    const handleExtractVoice = async () => {
        if (!company) return
        setIsExtracting(true)
        try {
            const { data, error } = await supabase.functions.invoke('extract-voice-profile', {
                body: {
                    tone_class: tone,
                    sample_emails: samples.split('\n\n').filter(Boolean),
                    company_id: company.id
                }
            })
            if (error) throw error
            setVoiceProfile(data.data) // Edge function returns { success: true, data: voiceProfile }
        } catch (err) {
            console.error(err)
            alert("Failed to extract voice profile. Check console.")
        } finally {
            setIsExtracting(false)
        }
    }

    const handleFinish = async () => {
        if (!company) return
        await supabase.from('companies').update({
            notification_frequency: frequency as any,
            slack_webhook_url: slackUrl
        }).eq('id', company.id)

        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-3xl mb-8 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>1</div>
                    <span className={`font-medium ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>Connection</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-4" />
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>2</div>
                    <span className={`font-medium ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>Voice</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-4" />
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-200'}`}>3</div>
                    <span className={`font-medium ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>Settings</span>
                </div>
            </div>

            <Card className="w-full max-w-3xl glass-panel border border-slate-200/60 shadow-xl shadow-slate-200/40">

                {step === 1 && (
                    <>
                        <CardHeader className="text-center pb-2">
                            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-2xl">Connect your hiring tool</CardTitle>
                            <CardDescription>We integrate directly to monitor stage changes and fetch candidates automatically.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                {['Greenhouse', 'Lever', 'Ashby', 'Workable'].map(ats => (
                                    <div key={ats} className="border rounded-xl p-4 flex items-center justify-between bg-white opacity-50 cursor-not-allowed">
                                        <span className="font-semibold text-slate-700">{ats}</span>
                                        <Badge variant="secondary">Coming Soon</Badge>
                                    </div>
                                ))}
                                <div className="border rounded-xl p-4 flex items-center justify-between border-primary/50 bg-primary/5">
                                    <span className="font-semibold text-primary">CSV Upload</span>
                                    <Button variant="outline" size="sm" onClick={() => alert("CSV Upload modal would open here")}>Connect</Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                            <div />
                            <Button variant="ghost" className="text-primary hover:bg-primary/5 hover:text-primary" onClick={handleSkipATS}>Skip for now &rarr;</Button>
                        </CardFooter>
                    </>
                )}

                {step === 2 && (
                    <>
                        <CardHeader className="text-center pb-2">
                            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-2xl">Let's learn how you communicate</CardTitle>
                            <CardDescription>Candor generates emails that sound like you. Let's calibrate your voice.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 py-6">

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">1. Select a baseline tone</h4>
                                <div className="grid gap-4">
                                    {TONES.map(t => (
                                        <div
                                            key={t.id}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${tone === t.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 bg-white'}`}
                                            onClick={() => setTone(t.id)}
                                        >
                                            <h5 className="font-semibold text-foreground mb-1">{t.label}</h5>
                                            <p className="text-sm text-muted-foreground italic">"{t.sample}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">2. Provide sample emails (Optional)</h4>
                                <p className="text-sm text-muted-foreground">Paste 1-3 rejection emails you've written before. We'll extract your structural and lexical habits.</p>
                                <textarea
                                    className="w-full h-32 rounded-md border border-slate-300 p-3 text-sm focus:outline-primary focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-slate-300"
                                    placeholder="Hey Sarah, thanks so much for taking the time to chat with us..."
                                    value={samples}
                                    onChange={e => setSamples(e.target.value)}
                                />
                            </div>

                            {voiceProfile && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 pt-6 border-t border-slate-100">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        3. Review your Voice Profile
                                    </h4>
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-1 ring-indigo-200">
                                                {(company?.name || 'C').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 leading-none mb-0.5">{company?.name || 'Your Company'}</p>
                                                <p className="text-xs text-slate-500 leading-none">To: Sarah Jenkins</p>
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-4 bg-white">
                                            <p className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">Update on your application for Product Designer</p>
                                            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pb-2 font-medium">
                                                {`Hi Sarah,\n\n${tone === 'professional' ? 'Thank you for taking the time to apply and speak with our team. While we were impressed by your background, we have decided to move forward with another candidate whose experience better aligns with our current needs.' :
                                                        tone === 'casual' ? 'Thanks so much for chatting with us! We loved getting to know you, but we\'ve decided to go in a different direction for this role right now.' :
                                                            'We really appreciated the time you spent interviewing with us. While your skills are strong, we felt another candidate was a slightly closer match for what we need at this stage.'
                                                    }\n\nWe wish you the best of luck in your job search.\n\n${voiceProfile?.sign_off || 'Best regards'},\n${company?.name || 'The Team'}`}
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50/50 border-t border-emerald-100 px-4 py-3 flex items-start gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-800">Voice Profile Extracted Successfully</p>
                                                <p className="text-xs text-emerald-700/80 mt-0.5">Average length: {voiceProfile.avg_length_words} words. Lexical tone matched to {TONES.find(t => t.id === tone)?.label}.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                            <Button variant="ghost" onClick={() => setStep(1)}>&larr; Back</Button>
                            {!voiceProfile ? (
                                <Button onClick={handleExtractVoice} disabled={isExtracting}>
                                    {isExtracting ? 'Analyzing...' : 'Generate Profile'}
                                </Button>
                            ) : (
                                <Button onClick={() => setStep(3)}>Looks good &rarr;</Button>
                            )}
                        </CardFooter>
                    </>
                )}

                {step === 3 && (
                    <>
                        <CardHeader className="text-center pb-2">
                            <BellRing className="w-12 h-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-2xl">Stay in the loop</CardTitle>
                            <CardDescription>Configure how you want to be notified of pending actions and updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 py-6">

                            <div className="space-y-3">
                                <label className="font-semibold text-sm text-foreground">Email Digest</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-primary"
                                    value={frequency}
                                    onChange={e => setFrequency(e.target.value)}
                                >
                                    <option value="daily">Daily summary</option>
                                    <option value="weekly">Weekly summary</option>
                                    <option value="off">Off</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="font-semibold text-sm text-foreground">Slack Webhook URL (Optional)</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://hooks.slack.com/services/..."
                                        value={slackUrl}
                                        onChange={e => setSlackUrl(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={() => alert("Test ping sent!")}>Test</Button>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                            <Button variant="ghost" onClick={() => setStep(2)}>&larr; Back</Button>
                            <Button size="lg" onClick={handleFinish}>Go to Dashboard</Button>
                        </CardFooter>
                    </>
                )}

            </Card>
        </div>
    )
}
