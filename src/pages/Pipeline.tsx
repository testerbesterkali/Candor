import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Search, Filter, Mail, Clock, MoreHorizontal } from 'lucide-react'

export default function Pipeline() {
    const { company } = useAuthStore()
    const [search, setSearch] = useState('')

    const { data: candidates, isLoading } = useQuery({
        queryKey: ['pipelineCandidates', company?.id],
        queryFn: async () => {
            // For MVP, join candidates with their communications and role
            const { data, error } = await supabase
                .from('candidates')
                .select(`
          *,
          roles(title),
          communications(id, type, status, confidence_score, sent_at, created_at)
        `)
                .eq('company_id', company!.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        },
        enabled: !!company
    })

    // Basic client side filter
    const filtered = candidates?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.roles?.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.status?.toLowerCase().includes(search.toLowerCase())
    ) || []

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Pipeline</h1>
                    <p className="text-muted-foreground">Manage candidate communication statuses across all open roles.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search candidates, roles..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4 text-slate-600" /></Button>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Candidate</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">ATS Status</th>
                                <th className="px-6 py-4 font-semibold">Candor Action</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                        <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No candidates found. Sync your ATS or add via CSV.
                                    </td>
                                </tr>
                            ) : filtered.map(c => {
                                // Calculate the most relevant comm
                                const comms = c.communications || [];
                                comms.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                const latestComm = comms[0]

                                let actionBadge = <Badge variant="secondary" className="bg-slate-100 text-slate-500">No Action Needed</Badge>
                                let highlightNeedsReview = false

                                if (latestComm) {
                                    if (latestComm.status === 'sent') {
                                        actionBadge = <Badge variant="success" className="bg-green-100 text-green-700">Email Sent</Badge>
                                    } else if (latestComm.status === 'queued') {
                                        actionBadge = <Badge variant="warning" className="bg-amber-100 text-amber-700 flex items-center gap-1"><Clock className="w-3 h-3" /> Queued</Badge>
                                    } else if (latestComm.status === 'draft') {
                                        actionBadge = <Badge variant="destructive" className="bg-red-100 text-red-700 flex items-center gap-1">Review Required</Badge>
                                        highlightNeedsReview = true
                                    }
                                } else {
                                    // check if overdue
                                    if ((c.days_in_stage ?? 0) >= 7) {
                                        actionBadge = <Badge variant="warning" className="bg-orange-100 text-orange-800">Overdue (Nudge)</Badge>
                                    }
                                }

                                return (
                                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{c.name}</span>
                                                <span className="text-xs text-muted-foreground">{c.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                                            {c.roles?.title || 'Unknown Role'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                {(c.status || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                            {(c.days_in_stage ?? 0) > 0 && <p className="text-[10px] text-muted-foreground mt-1">for {c.days_in_stage} days</p>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {actionBadge}
                                            {latestComm?.confidence_score !== undefined && latestComm?.confidence_score !== null && latestComm.status === 'draft' && (
                                                <p className="text-[10px] text-red-500 mt-1 font-medium">Confidence: {Math.round(latestComm.confidence_score * 100)}%</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {highlightNeedsReview && latestComm ? (
                                                    <Link to={`/review/${latestComm.id}`}>
                                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-8 text-xs px-3 shadow-md" onClick={(e) => e.stopPropagation()}>
                                                            <Mail className="w-3 h-3 mr-1.5" /> Review Draft
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
