import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

import { Button } from '../components/ui/Button'
import { Star, Zap, UserPlus, X, Mail, Sparkles, Send, CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/utils'

export default function TalentBank() {
    const { company } = useAuthStore()
    const queryClient = useQueryClient()

    // Modal State
    const [selectedMatch, setSelectedMatch] = useState<any>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [draftText, setDraftText] = useState('')

    const { data: matches, isLoading } = useQuery({
        queryKey: ['talentMatches', company?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('talent_bank_matches')
                .select(`
                    *,
                    candidates(name, email, last_status_change, tags),
                    roles(title)
                `)
                .eq('company_id', company!.id)
                .order('match_score', { ascending: false })

            if (error) throw error
            return data || []
        },
        enabled: !!company
    })

    const markActionedMutation = useMutation({
        mutationFn: async (matchId: string) => {
            const { error } = await supabase
                .from('talent_bank_matches')
                .update({ actioned: true })
                .eq('id', matchId)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['talentMatches'] })
            setSelectedMatch(null)
        }
    })

    const handleDraftOutreach = (match: any) => {
        setSelectedMatch(match)
        setIsGenerating(true)
        setDraftText('')

        // Mocking the AI generation delay
        setTimeout(() => {
            setDraftText(`Hi ${match.candidates?.name.split(' ')[0]},\n\nI hope you're doing well!\n\nWe really enjoyed talking to you previously. Your background in ${match.candidates?.tags?.[0] || 'your field'} stood out to us, even though the timing wasn't right before.\n\nWe just opened a new ${match.roles?.title} role and I immediately thought of you. I'd love to reconnect and share some details if you're open to exploring new opportunities.\n\nLet me know if you have a few minutes to chat next week.\n\nBest,\n${company?.name} Team`)
            setIsGenerating(false)
        }, 1500)
    }

    const handleSend = () => {
        markActionedMutation.mutate(selectedMatch.id)
    }

    return (
        <div className="space-y-6 animate-in fade-in p-8 pb-20">

            {/* Sleek Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Talent Bank</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Rediscover past candidates for new roles.</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-[300px] bg-white border border-slate-200 rounded-2xl shadow-sm animate-pulse p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                                <div className="w-20 h-6 bg-slate-100 rounded-full" />
                            </div>
                            <div className="h-5 bg-slate-100 rounded w-2/3 mb-2" />
                            <div className="h-4 bg-slate-50 rounded w-1/2 mb-6" />
                            <div className="h-16 bg-slate-50 rounded-xl mb-4" />
                        </div>
                    ))
                ) : matches?.length === 0 ? (
                    <div className="col-span-full py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No active matches found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Check back when you open new roles. Candor will automatically surface candidates here.</p>
                    </div>
                ) : matches?.map((m: any) => (
                    <div key={m.id} className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                        <div>
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl shadow-inner ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all">
                                    {m.candidates?.name?.charAt(0) || '?'}
                                </div>
                                <div className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
                                    (m.match_score ?? 0) >= 0.85
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                                        : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                )}>
                                    {(m.match_score ?? 0) >= 0.85 && <Sparkles className="w-3 h-3 text-emerald-500" />}
                                    {Math.round((m.match_score ?? 0) * 100)}% Match
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{m.candidates?.name}</h3>
                            <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {m.candidates?.email}</p>

                            <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-4 group-hover:bg-indigo-50/50 group-hover:border-indigo-100/50 transition-colors">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Matched Role</p>
                                <p className="text-sm font-semibold text-slate-800">{m.roles?.title}</p>
                            </div>

                            {m.candidates?.tags && m.candidates.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {m.candidates.tags.slice(0, 3).map((tag: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                            <Button
                                className={cn("flex-1 h-10 shadow-sm", m.actioned ? "bg-slate-100 text-slate-500 hover:bg-slate-100" : "")}
                                disabled={m.actioned ?? false}
                                onClick={() => handleDraftOutreach(m)}
                            >
                                {m.actioned ? (
                                    <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Contacted</span>
                                ) : (
                                    <span className="flex items-center"><UserPlus className="w-4 h-4 mr-2" /> Draft Outreach</span>
                                )}
                            </Button>
                            {!m.actioned && (
                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-slate-200">
                                    <Star className="w-4 h-4 text-slate-400 hover:text-amber-400 transition-colors" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Re-engage Modal */}
            {selectedMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedMatch(null)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 leading-none mb-1">Re-engage {selectedMatch.candidates?.name.split(' ')[0]}</h2>
                                    <p className="text-xs text-slate-500 font-medium">Inviting to apply for <span className="text-indigo-600 font-semibold">{selectedMatch.roles?.title}</span></p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-slate-600" onClick={() => setSelectedMatch(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            {isGenerating ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-400 rounded-full blur animate-pulse" />
                                        <div className="relative bg-white w-12 h-12 rounded-full border-2 border-indigo-100 flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-900">Drafting personalized outreach...</p>
                                        <p className="text-xs text-slate-500 mt-1">Referencing their past application context.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2.5 text-sm text-blue-800">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <p><strong>AI Context applied:</strong> Acknowledged past interaction, referenced specific skill ({selectedMatch.candidates?.tags?.[0] || 'general'}), and introduced the new role seamlessly.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full text-sm font-semibold text-slate-900 border-none bg-slate-50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                                            defaultValue={`New opening at ${company?.name}: ${selectedMatch.roles?.title}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message Body</label>
                                        </div>
                                        <textarea
                                            className="w-full h-[240px] text-sm text-slate-700 bg-slate-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none resize-none"
                                            value={draftText}
                                            onChange={(e) => setDraftText(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <Button variant="outline" className="border-slate-200" onClick={() => setSelectedMatch(null)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                                disabled={isGenerating || markActionedMutation.isPending}
                                onClick={handleSend}
                            >
                                {markActionedMutation.isPending ? (
                                    "Sending..."
                                ) : (
                                    <><Send className="w-4 h-4 mr-2" /> Send Email</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
