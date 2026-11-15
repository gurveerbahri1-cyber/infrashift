import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Zap, Target, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { user, isGoogleConfigured, renderGoogleButton, signInAsGuest } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user && isGoogleConfigured && googleBtnRef.current) {
      renderGoogleButton(googleBtnRef.current);
    }
  }, [user, isGoogleConfigured, renderGoogleButton]);

  const handleStart = () => {
    if (!user && !isGoogleConfigured) {
      signInAsGuest();
    }
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <header className="container mx-auto px-4 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg leading-none">
            JB
          </div>
          <span className="font-bold text-xl tracking-tight">JobBlast</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded shadow-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div ref={googleBtnRef} />
              <Button
                variant="default"
                size="sm"
                onClick={handleStart}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-4">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <Zap className="w-4 h-4" />
            <span>The ultimate job application power tool</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-foreground">
            Apply to 50 jobs a day.<br/>
            <span className="text-primary">Without burning out.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            JobBlast is a command center for the urgent job seeker. We combine AI resume tailoring, fast queue-based reviewing, and pipeline tracking so you can hit your numbers and get hired faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded shadow-lg gap-2"
              onClick={handleStart}
            >
              Start Blasting <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rapid Review Queue</h3>
            <p className="text-muted-foreground leading-relaxed">
              Don't browse endlessly. JobBlast builds a ranked queue of matched jobs. Press A to approve, S to skip. Fly through leads in seconds.
            </p>
          </div>
          
          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Tailoring</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate custom resume bullets and cover letters tuned to the specific job description in one click. Stand out automatically.
            </p>
          </div>

          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Command Center</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track applications, interview conversion rates, and follow-ups on a dense dashboard. Hit your daily volume goals with a satisfying streak system.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t bg-muted/20 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} JobBlast. Equip yourself.
        </div>
      </footer>
    </div>
  );
}
