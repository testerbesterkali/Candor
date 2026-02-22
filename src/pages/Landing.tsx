import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function Landing() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl text-center space-y-8">
                <h1 className="text-5xl font-extrabold text-foreground tracking-tight sm:text-7xl">
                    Your ATS tracks candidates. <br /><span className="text-primary">Candor respects them.</span>
                </h1>
                <p className="text-xl text-muted-foreground w-4/5 mx-auto">
                    Automatically generate personalized, human-sounding rejection emails, status nudges, and re-engagement messages — written in your company's specific voice.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/auth">
                        <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all h-14 px-8 text-base">
                            Start Free Trial — no credit card
                        </Button>
                    </Link>
                </div>

                {/* Mock Badge */}
                <div className="pt-16 max-w-sm mx-auto">
                    <div className="glass-panel p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl ring-4 ring-green-50">98</div>
                        <div className="text-left">
                            <p className="font-semibold text-foreground">Candor Score</p>
                            <p className="text-sm text-muted-foreground font-medium">Responds to every applicant <span className="text-primary">✓</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
