import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { cn } from '../lib/utils'
import { Building2, Link as LinkIcon, Mic2, Bell, Users, CreditCard, Sparkles, AlertCircle, Save } from 'lucide-react'

const TABS = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'ats', label: 'ATS Integration', icon: LinkIcon },
    { id: 'voice', label: 'Voice & Tone', icon: Mic2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function Settings() {
    const { company } = useAuthStore()
    const [activeTab, setActiveTab] = useState('general')
    const [tone, setTone] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (company?.voice_profile) {
            setTone((company.voice_profile as any).explanation_style || 'professional')
        }
    }, [company])

    const handleSave = async () => {
        if (!company) return
        setSaving(true)

        const vp = (company.voice_profile as any) || {}
        vp.explanation_style = tone

        await supabase
            .from('companies')
            .update({ voice_profile: vp })
            .eq('id', company.id)

        setSaving(false)
        alert('Settings saved successfully!')
    }

    return (
        <div className="animate-in fade-in p-8 pb-20">

            {/* Header */}
            <div className="mb-6 pb-5 border-b border-slate-200">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workspace Settings</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage your company profile, integrations, and team.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <nav className="flex md:flex-col gap-1 md:w-64 shrink-0 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hidden-scrollbar">
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 transparent border border-transparent"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader>
                                    <CardTitle>Company Profile</CardTitle>
                                    <CardDescription>This information is used in your candidate communications.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace Name</label>
                                            <Input defaultValue={company?.name || ''} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Website</label>
                                            <Input placeholder="https://..." className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500/20" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ATS Tab */}
                    {activeTab === 'ats' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Applicant Tracking Systems</CardTitle>
                                            <CardDescription className="mt-1">Connect your ATS to automatically ingest candidates and trigger workflows.</CardDescription>
                                        </div>
                                        <div className="hidden sm:inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                            Pro Feature
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {['Greenhouse', 'Lever', 'Ashby', 'Workable'].map(ats => (
                                            <div key={ats} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 bg-white shadow-sm transition-all">
                                                <span className="font-semibold text-slate-700">{ats}</span>
                                                <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 hover:bg-slate-50">Connect</Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 text-sm text-slate-600 rounded-xl flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-slate-900 mb-1">Using the fallback CSV importer</p>
                                            <p>Since no direct ATS is connected, Candor is currently resolving candidate updates via manual CSV imports.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Voice Tab */}
                    {activeTab === 'voice' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-500" />
                                        <CardTitle>Voice Profile Engine</CardTitle>
                                    </div>
                                    <CardDescription>Control how Candor represents your brand during automated or manual outreach.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-900 block">Baseline Tone Signature</label>
                                        <select
                                            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-all"
                                            value={tone}
                                            onChange={e => setTone(e.target.value)}
                                        >
                                            <option value="professional">Professional & Direct</option>
                                            <option value="warm_direct">Warm & Empathetic</option>
                                            <option value="casual">Casual & Relaxed</option>
                                        </select>
                                        <p className="text-xs text-slate-500">
                                            The Neural Engine uses your specific manual edits in the "Needs Review" queue to continuously override and improve this baseline tone over time.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                                        <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4" /> Recalibrate Voice Model
                                        </h4>
                                        <p className="text-xs text-amber-700/80 mb-3">
                                            If Candor's outputs feel misaligned, you can force a full model recalibration by supplying 3 new email examples.
                                        </p>
                                        <Button size="sm" variant="outline" className="bg-white text-amber-700 border-amber-200 hover:bg-amber-50">
                                            Run Recalibration...
                                        </Button>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm" onClick={handleSave} disabled={saving}>
                                            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Preferences</>}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Determine how Candor alerts you about pipeline health.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Daily Digest Email</h4>
                                            <p className="text-sm text-slate-500 mt-1">Receive a morning summary of emails queued for review and overdue candidates.</p>
                                        </div>
                                        <div className="flex items-center h-6 bg-indigo-600 rounded-full w-11 px-0.5 justify-end cursor-pointer shrink-0">
                                            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between p-4 border border-slate-100 rounded-xl">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Slack Alerts</h4>
                                            <p className="text-sm text-slate-500 mt-1">Send immediate alerts to a designated Slack channel for critical escalations.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="shrink-0 border-slate-200 text-slate-600">Connect Slack</Button>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <label className="text-sm font-semibold text-slate-900">Escalation Threshold</label>
                                        <p className="text-xs text-slate-500">How many days should a candidate sit in a stage before Candor marks them Overdue?</p>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" defaultValue="7" className="w-24 bg-slate-50 border-slate-200 focus:bg-white" />
                                            <span className="text-sm text-slate-600 font-medium">days</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Team Management</CardTitle>
                                        <CardDescription>Invite hiring managers and recruiters to your workspace.</CardDescription>
                                    </div>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 shrink-0"><Users className="w-4 h-4 mr-2" /> Invite Member</Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                    ME
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">You</p>
                                                    <p className="text-xs text-slate-500">Owner</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">Admin</Badge>
                                        </div>
                                        <div className="p-8 text-center bg-slate-50 text-slate-500 text-sm">
                                            Upgrade your plan to invite unlimited team members.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader>
                                    <CardTitle>Billing & Subscription</CardTitle>
                                    <CardDescription>Manage your Candor plan and payment methods.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <CreditCard className="w-24 h-24" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Current Plan</h3>
                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-3xl font-bold whitespace-nowrap">Starter Trial</span>
                                            </div>
                                            <p className="text-sm text-indigo-100/80 mb-6 max-w-sm">
                                                You are currently in the 14-day free trial. Upgrade to a paid plan to unlock ATS integrations and multi-seat support.
                                            </p>
                                            <Button className="bg-white text-indigo-900 hover:bg-slate-50 font-bold border-0">Upgrade to Pro</Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-3">Invoice History</h4>
                                        <div className="text-sm text-slate-500 p-4 border border-slate-200 border-dashed rounded-xl text-center bg-slate-50">
                                            No billing history available yet.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
