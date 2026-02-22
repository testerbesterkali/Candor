import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
// useAuthStore unused
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react'

// Removed unused Communication Interface

export default function Review() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [isSending, setIsSending] = useState(false)

    const { data: communication, isLoading } = useQuery<any>({
        queryKey: ['communication', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('communications')
                .select('*, candidates(name, email, roles(title))')
                .eq('id', id as string)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!id
    })

    useEffect(() => {
        if (communication) {
            setSubject(communication.subject || '')
            setBody(communication.body || '')
        }
    }, [communication])

    if (isLoading) return <div className="p-8">Loading draft...</div>
    if (!communication) return <div className="p-8">Draft not found.</div>

    const isEdited = subject !== communication.subject || body !== communication.body
    const breakdown = (communication.confidence_breakdown as any) || {}

    const handleSend = async () => {
        setIsSending(true)
        try {
            // 1. Update communication explicitly if edited
            if (isEdited) {
                await supabase
                    .from('communications')
                    .update({ subject, body, edited: true })
                    .eq('id', communication.id)
            }

            // 2. Invoke send-email edge function
            const { error } = await supabase.functions.invoke('send-email', {
                body: { communication_id: communication.id }
            })

            if (error) throw error

            navigate('/pipeline')
        } catch (err) {
            console.error(err)
            alert("Failed to send email.")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in p-8 pb-20">

            <button onClick={() => navigate(-1)} className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to pipeline
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Review Draft</h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        To: <span className="font-medium text-slate-700">{communication.candidates?.name}</span> ({communication.candidates?.email})
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Save & Close</Button>
                    <Button onClick={handleSend} disabled={isSending || communication.status === 'sent'} className="shadow-md">
                        {isSending ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Approve & Send</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Editor */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-6 space-y-4 shadow-sm border border-slate-200">

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Subject</label>
                            <Input
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="font-medium text-slate-900 bg-white"
                            />
                        </div>

                        <div className="border-t border-slate-100 my-4" />

                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Message Body</label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                className="w-full min-h-[400px] p-4 text-sm leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                            />
                        </div>

                    </div>
                </div>

                {/* AI Analysis Sidecar */}
                <div className="space-y-6">

                    <Card className="glass-panel border-hidden shadow-lg shadow-blue-900/5 bg-gradient-to-b from-blue-50/50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-slate-900 flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse" /> AI Analysis
                                </h3>
                                <span className="text-2xl font-bold text-blue-600">{Math.round((communication.confidence_score || 0) * 100)}%</span>
                            </div>

                            <div className="space-y-4">
                                <ScoreBar label="Specificity Check" score={breakdown.specificity || 0} />
                                <ScoreBar label="Voice Match" score={breakdown.voice_match || 0} />
                                <ScoreBar label="Safety Check" score={breakdown.safety || 0} />
                                <ScoreBar label="Length" score={breakdown.length || 0} />
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200/60">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {breakdown.explanation || "This draft matches your company's tone and safely details candidate specificity."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {isEdited && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-amber-900">Manual edits detected</h4>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">Changes will be fed back into your Voice Profile for future drafts automatically.</p>
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>
    )
}

function ScoreBar({ label, score }: { label: string, score: number }) {
    const percentage = Math.round(score * 100)
    const isHigh = score >= 0.8
    const isMedium = score >= 0.5 && score < 0.8

    return (
        <div>
            <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">{label}</span>
                <span className="font-semibold text-slate-900">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${isHigh ? 'bg-green-500' : isMedium ? 'bg-yellow-400' : 'bg-red-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
