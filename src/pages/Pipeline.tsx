import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { formatTimeAgo, cn } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Search, Filter, Mail, Clock, MoreHorizontal, X, FileText, User as UserIcon, Calendar, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'

// Define the stages
const STAGES = [
    { id: 'applied', label: 'Applied', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'screening', label: 'Screening', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'interview', label: 'Interview', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'offer', label: 'Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
]

export default function Pipeline() {
    const { company } = useAuthStore()
    const [search, setSearch] = useState('')
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

    const { data: candidates, isLoading } = useQuery({
        queryKey: ['pipelineCandidates', company?.id],
        queryFn: async () => {
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

    const filtered = candidates?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.roles?.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.status?.toLowerCase().includes(search.toLowerCase())
    ) || []

    const selectedCandidate = candidates?.find(c => c.id === selectedCandidateId)

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] animate-in fade-in duration-500 overflow-hidden relative">

            {/* Main Content Area */}
            <div className={cn("flex-1 flex flex-col h-full bg-slate-50/50 transition-all duration-300", selectedCandidateId ? "mr-[400px]" : "")}>

                {/* Header */}
                <div className="px-6 py-6 sm:py-8 border-b border-slate-200 bg-white shadow-sm z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pipeline</h1>
                            <p className="text-slate-500 mt-1">Manage candidate communication statuses across all open roles.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search candidates, roles..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all transition-colors"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="shrink-0 bg-white"><Filter className="w-4 h-4 text-slate-600" /></Button>
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 hidden-scrollbar">
                    <div className="flex gap-6 h-full min-w-max pb-4">
                        {STAGES.map(stage => {
                            const stageCandidates = filtered.filter(c => (c.status || 'applied') === stage.id)

                            return (
                                <div key={stage.id} className="w-[320px] flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200 flex-shrink-0 max-h-full">
                                    <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-100/80 rounded-t-2xl">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("px-2.5 py-1 rounded-md text-xs font-bold border", stage.color)}>
                                                {stage.label}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-500">{stageCandidates.length}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {isLoading ? (
                                            Array.from({ length: 2 }).map((_, i) => (
                                                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                                                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                                                    <div className="h-3 bg-slate-50 rounded w-1/2" />
                                                </div>
                                            ))
                                        ) : stageCandidates.length === 0 ? (
                                            <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-sm font-medium text-slate-400">
                                                No candidates
                                            </div>
                                        ) : stageCandidates.map(c => (
                                            <CandidateCard
                                                key={c.id}
                                                candidate={c}
                                                onClick={() => setSelectedCandidateId(c.id)}
                                                isSelected={selectedCandidateId === c.id}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Slide-in Side Panel */}
            <div className={cn(
                "absolute top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out z-20 flex flex-col",
                selectedCandidateId ? "translate-x-0" : "translate-x-full"
            )}>
                {selectedCandidate ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-bold shadow-inner">
                                    {selectedCandidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedCandidate.name}</h2>
                                    <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5 line-clamp-1">
                                        <Mail className="w-3.5 h-3.5" /> {selectedCandidate.email}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-200 shrink-0" onClick={() => setSelectedCandidateId(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Role / Context */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Application Details</h3>
                                <div className="bg-white border text-sm border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Role</span>
                                        <span className="font-semibold text-slate-900">{selectedCandidate.roles?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Status</span>
                                        <span className="font-semibold text-slate-900 capitalize px-2 py-0.5 bg-slate-100 rounded text-xs">{selectedCandidate.status?.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Time in Stage</span>
                                        <span className="font-semibold text-slate-900">{selectedCandidate.days_in_stage || 0} days</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resume Summary */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resume Parsing</h3>
                                {(selectedCandidate as any).tags && (selectedCandidate as any).tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedCandidate as any).tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        No skills extracted yet.
                                    </div>
                                )}
                                {selectedCandidate.resume_url && (
                                    <Button variant="outline" className="w-full mt-2 text-sm h-9 bg-white shadow-sm border-slate-200" onClick={() => window.open(selectedCandidate.resume_url as string, '_blank')}>
                                        <FileText className="w-4 h-4 mr-2 text-primary" /> View Original Resume
                                    </Button>
                                )}
                            </div>

                            {/* Communications Timeline */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Candor Activity</h3>
                                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {selectedCandidate.communications && selectedCandidate.communications.length > 0 ? (
                                        selectedCandidate.communications
                                            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                            .map((comm: any) => (
                                                <div key={comm.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border ring-4 ring-white bg-white border-slate-200 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                        {comm.status === 'sent' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <MessageSquare className="w-4 h-4 text-amber-500" />}
                                                    </div>
                                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 bg-white border border-slate-200 shadow-sm rounded-xl">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-slate-900 text-sm capitalize">{comm.type}</span>
                                                            <span className="text-[10px] font-medium text-slate-400">{formatTimeAgo(comm.created_at)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", comm.status === 'sent' ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800")}>
                                                                {comm.status}
                                                            </span>
                                                            {comm.status === 'draft' && comm.confidence_score && (
                                                                <span className="text-[10px] text-red-600 font-medium">Confidence: {Math.round(comm.confidence_score * 100)}%</span>
                                                            )}
                                                        </div>
                                                        {comm.status === 'draft' && (
                                                            <Link to={`/review/${comm.id}`} className="block mt-2">
                                                                <Button size="sm" className="w-full h-7 text-[11px] bg-primary text-white hover:bg-primary/90">
                                                                    Review Draft
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed relative z-10">
                                            No Candor communications yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
                )}
            </div>

            {/* Panel Backdrop overlay for smaller screens - functional addition for better UX */}
            {selectedCandidateId && (
                <div
                    className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-10 block sm:hidden transition-opacity"
                    onClick={() => setSelectedCandidateId(null)}
                />
            )}
        </div>
    )
}

function CandidateCard({ candidate, onClick, isSelected }: any) {
    const comms = candidate.communications || [];
    comms.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const latestComm = comms[0]

    let badgeClass = "bg-slate-100 text-slate-500 border-slate-200"
    let badgeText = ""
    let badgeIcon = null

    if (latestComm) {
        if (latestComm.status === 'sent') {
            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200"
            badgeText = "Sent"
            badgeIcon = <CheckCircle2 className="w-3 h-3 mr-1" />
        } else if (latestComm.status === 'queued') {
            badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
            badgeText = "Queued"
            badgeIcon = <Clock className="w-3 h-3 mr-1" />
        } else if (latestComm.status === 'draft') {
            badgeClass = "bg-rose-50 text-rose-700 border-rose-200"
            badgeText = "Needs Review"
            badgeIcon = <AlertTriangle className="w-3 h-3 mr-1" />
        }
    } else {
        if ((candidate.days_in_stage ?? 0) >= 7) {
            badgeClass = "bg-amber-100 text-amber-800 border-amber-200"
            badgeText = "Overdue"
            badgeIcon = <AlertTriangle className="w-3 h-3 mr-1" />
        }
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "group cursor-pointer p-4 bg-white rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md",
                isSelected ? "border-primary ring-1 ring-primary/20 shadow-md" : "border-slate-200 hover:border-slate-300"
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{candidate.name}</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider line-clamp-1">{candidate.roles?.title || 'Unknown Role'}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <Calendar className="w-3.5 h-3.5" />
                    {candidate.days_in_stage || 0}d
                </div>

                {badgeText && (
                    <span className={cn("inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", badgeClass)}>
                        {badgeIcon}
                        {badgeText}
                    </span>
                )}
            </div>
        </div>
    )
}
