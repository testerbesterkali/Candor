import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Activity, ShieldCheck, Clock, Layers } from 'lucide-react'

export default function Score() {
    const { company } = useAuthStore()

    const { data: snapshot } = useQuery({
        queryKey: ['candorScore', company?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('score_snapshots')
                .select('*')
                .eq('company_id', company!.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            return data
        },
        enabled: !!company
    })

    const currentScore = company?.candor_score || 0
    const isGood = currentScore >= 70

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-16">

            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full mb-6 relative">
                    <div className="absolute inset-0 border-[6px] border-primary/20 rounded-full animate-ping opacity-20" />
                    <Activity className={`w-12 h-12 ${isGood ? 'text-green-600' : 'text-primary'}`} />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Candor Score</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    A real-time reflection of your candidate experience. Calculated across responsiveness, follow-through, and email quality.
                </p>
            </div>

            <div className="glass-panel p-8 border-t-8 border-t-primary shadow-xl rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="text-center md:text-left">
                        <p className="uppercase tracking-widest text-slate-500 font-bold text-sm mb-2">Overall Score</p>
                        <h2 className={`text-7xl font-black ${isGood ? 'text-green-600' : 'text-slate-900'} tracking-tighter`}>{currentScore}</h2>
                        <p className="mt-4 font-medium text-slate-600 max-w-xs">
                            {isGood ? "You provide an exceptional candidate experience." : "There is room for improvement in your hiring process."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full md:w-auto">
                        <ScoreDetail label="Speed Score" value={snapshot?.speed_score || 0} icon={Clock} />
                        <ScoreDetail label="Quality Score" value={snapshot?.quality_score || 0} icon={ShieldCheck} />
                        <ScoreDetail label="Follow-through" value={snapshot?.followthrough_score || 0} icon={Layers} />
                        <ScoreDetail label="Re-engagement" value={snapshot?.reengage_score || 0} icon={Activity} />
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="font-bold text-lg mb-4">How is this calculated?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold block mb-1">Speed (25%)</span>
                        <span className="text-sm text-slate-600">Average time from candidate creation to first outreach. 100 points for &lt;24hrs.</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold block mb-1">Quality (35%)</span>
                        <span className="text-sm text-slate-600">The average specificity and human-feel score of all sent emails.</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold block mb-1">Follow-through (25%)</span>
                        <span className="text-sm text-slate-600">Percentage of candidates that receive a final decision or update.</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold block mb-1">Re-engagement (15%)</span>
                        <span className="text-sm text-slate-600">Percentage of Talent Bank matches uniquely engaged for new roles.</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

function ScoreDetail({ label, value, icon: Icon }: any) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Icon className="w-4 h-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{value}</span>
                <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
        </div>
    )
}
