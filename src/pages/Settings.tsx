import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Settings() {
    const { company } = useAuthStore()
    const [tone, setTone] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (company?.voice_profile) {
            // Just extract basic info for MVP
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

        // A real implementation would re-run the edge function or update the Zustand store directly.
        setSaving(false)
        alert('Voice settings updated!')
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in pb-16">

            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your company profile and communication preferences.</p>
            </div>

            <Card className="glass-panel">
                <CardHeader>
                    <CardTitle>Voice & Tone</CardTitle>
                    <CardDescription>Adjust the baseline communication style of your AI drafts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Primary Tone Setup</label>
                        <select
                            className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 focus:outline-primary focus:ring-1 focus:ring-primary"
                            value={tone}
                            onChange={e => setTone(e.target.value)}
                        >
                            <option value="professional">Professional & Direct</option>
                            <option value="warm_direct">Warm & Empathetic</option>
                            <option value="casual">Casual & Relaxed</option>
                        </select>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Note: The AI deeply calibrates its generator using your previous feedback and specific edits. This primary tone simply serves as a baseline mapping.
                    </p>
                    <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Preferences'}</Button>
                </CardContent>
            </Card>

            <Card className="glass-panel opacity-60">
                <CardHeader>
                    <CardTitle>ATS Integrations</CardTitle>
                    <CardDescription>Direct integrations require an Enterprise plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-center">
                        <Input value="CSV Upload Only" disabled />
                        <Button variant="outline" disabled>Upgrade</Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
