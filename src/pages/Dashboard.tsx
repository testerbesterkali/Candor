import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { formatTimeAgo, cn } from '../lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Send, Clock, Users, Activity, ArrowRight } from 'lucide-react'

export default function Dashboard() {
    const { company } = useAuthStore()

    // 1. Stats Query
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats', company?.id],
        queryFn: async () => {
            const now = new Date()
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

            const { count: emailsSent } = await supabase
                .from('communications')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('status', 'sent')
                .gte('sent_at', startOfMonth)

            const { count: talentBank } = await supabase
                .from('candidates')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('added_to_talent_bank', true)

            return {
                emailsSent: emailsSent || 0,
                talentBank: talentBank || 0,
                avgResponseTime: '24 hours', // Mocked calculation for MVP until edge function populates it accurately
                candorScore: company!.candor_score || 0
            }
        },
        enabled: !!company
    })

    // 2. Needs Attention Query
    const { data: needsAttention, isLoading: attentionLoading } = useQuery({
        queryKey: ['needsAttention', company?.id],
        queryFn: async () => {
            const { count: drafts } = await supabase
                .from('communications')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('status', 'draft')

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const { count: overdue } = await supabase
                .from('candidates')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .gte('days_in_stage', 7) // Or test via last_status_change
                .not('status', 'in', '("rejected","archived")')

            const { count: unactionedMatches } = await supabase
                .from('talent_bank_matches')
                .select('*', { count: 'exact', head: true })
                .eq('company_id', company!.id)
                .eq('actioned', false)

            return {
                drafts: drafts || 0,
                overdue: overdue || 0,
                unactionedMatches: unactionedMatches || 0
            }
        },
        enabled: !!company
    })

    // 3. Recent Activity Query
    const { data: activity, isLoading: activityLoading } = useQuery({
        queryKey: ['recentActivity', company?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('communications')
                .select('*, candidates(name)')
                .eq('company_id', company!.id)
                .order('created_at', { ascending: false })
                .limit(10)
            return data || []
        },
        enabled: !!company
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Here is what's happening across your active hiring pipeline today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Emails sent this month"
                    value={stats?.emailsSent}
                    icon={Send}
                    loading={statsLoading}
                />
                <StatCard
                    title="Avg response time"
                    value={stats?.avgResponseTime}
                    icon={Clock}
                    loading={statsLoading}
                />
                <StatCard
                    title="Candidates in talent bank"
                    value={stats?.talentBank}
                    icon={Users}
                    loading={statsLoading}
                />
                <StatCard
                    title="Candor Score"
                    value={stats?.candorScore}
                    icon={Activity}
                    loading={statsLoading}
                    valueColor={
                        (stats?.candorScore || 0) >= 70 ? 'text-green-600' :
                            (stats?.candorScore || 0) >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Needs Attention Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Needs Your Attention</h2>

                    <div className="grid gap-4">
                        <AttentionCard
                            count={needsAttention?.drafts}
                            loading={attentionLoading}
                            title="Emails pending review"
                            description="AI generated emails that did not meet the exact confidence threshold."
                            linkTo="/pipeline"
                        />
                        <AttentionCard
                            count={needsAttention?.overdue}
                            loading={attentionLoading}
                            title="Overdue candidates"
                            description="Candidates residing in the same stage for more than 7 days without a status nudge."
                            linkTo="/pipeline"
                        />
                        <AttentionCard
                            count={needsAttention?.unactionedMatches}
                            loading={attentionLoading}
                            title="Unactioned talent matches"
                            description="We found past candidates perfectly matching your new roles."
                            linkTo="/talent-bank"
                        />
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                    <Card className="glass-panel overflow-hidden">
                        <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                            {activityLoading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
                                </div>
                            ) : activity?.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    No recent activity to display.
                                </div>
                            ) : activity?.map(entry => (
                                <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <p className="text-sm font-medium text-foreground">
                                        {entry.candidates?.name || 'Unknown Candidate'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {entry.status === 'sent' ? `Email sent - ${entry.type}` : `Email drafted (${entry.type})`}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2 font-mono">
                                        {formatTimeAgo(entry.created_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, loading, valueColor = "text-foreground" }: any) {
    return (
        <Card className="glass-panel overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                ) : (
                    <div className={cn("text-3xl font-bold", valueColor)}>
                        {value !== undefined ? value : '—'}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function AttentionCard({ count, loading, title, description, linkTo }: any) {
    if (loading) {
        return <Card className="glass-panel h-24 animate-pulse bg-slate-50" />
    }

    const isZero = count === 0;

    return (
        <Link to={linkTo} className={cn("block transition-transform hover:-translate-y-1", isZero && "opacity-60 hover:translate-y-0 pointer-events-none")}>
            <Card className={cn(
                "glass-panel border-l-4 overflow-hidden",
                isZero ? "border-l-slate-200" : "border-l-amber-400 hover:shadow-md"
            )}>
                <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                            isZero ? "bg-slate-100 text-slate-400" : "bg-amber-100 text-amber-700 font-extrabold ring-4 ring-amber-50"
                        )}>
                            {count}
                        </div>
                        <div>
                            <h3 className={cn("font-semibold text-lg leading-none mb-1.5", isZero ? "text-slate-600" : "text-foreground")}>{title}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {!isZero && <ArrowRight className="text-slate-300 w-5 h-5 flex-shrink-0" />}
                </CardContent>
            </Card>
        </Link>
    )
}
