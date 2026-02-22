import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Star, Zap, UserPlus } from 'lucide-react'

export default function TalentBank() {
    const { company } = useAuthStore()

    const { data: matches, isLoading } = useQuery({
        queryKey: ['talentMatches', company?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('talent_bank_matches')
                .select(`
          *,
          candidates(name, email, last_status_change),
          roles(title)
        `)
                .eq('company_id', company!.id)
                .order('match_score', { ascending: false })

            if (error) throw error
            return data || []
        },
        enabled: !!company
    })

    return (
        <div className="space-y-6 animate-in fade-in pb-16">

            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                    Talent Bank <Badge variant="secondary" className="bg-primary/10 text-primary uppercase text-[10px] tracking-widest"><Zap className="w-3 h-3 mr-1 inline" /> Auto-Matching</Badge>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Candor scans previous silver-medalist candidates against new open roles and surfaces high-affinity matches.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)
                ) : matches?.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        No active matches found. Check back when you open new roles!
                    </div>
                ) : matches?.map(m => (
                    <div key={m.id} className="glass-panel p-6 flex flex-col justify-between border-slate-200">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg">
                                    {m.candidates?.name?.charAt(0) || '?'}
                                </div>
                                <Badge variant={(m.match_score ?? 0) >= 0.85 ? 'success' : 'secondary'} className={(m.match_score ?? 0) >= 0.85 ? 'bg-green-100/50 text-green-700' : ''}>
                                    {Math.round((m.match_score ?? 0) * 100)}% Match
                                </Badge>
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-0.5">{m.candidates?.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{m.candidates?.email}</p>

                            <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Matched Role</p>
                                <p className="text-sm font-medium text-slate-800">{m.roles?.title}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                            <Button className="flex-1" disabled={m.actioned ?? false}>
                                <UserPlus className="w-4 h-4 mr-2" /> {m.actioned ? 'Contacted' : 'Draft Outreach'}
                            </Button>
                            {!m.actioned && <Button variant="outline" size="icon"><Star className="w-4 h-4 text-slate-400 hover:text-amber-400" /></Button>}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
