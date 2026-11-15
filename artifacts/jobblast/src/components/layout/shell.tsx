import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ListTodo,
  Briefcase,
  UserCircle,
  LogOut,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/queue", label: "Queue", icon: ListTodo },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, signOut, signInAsGuest, renderGoogleButton, isGoogleConfigured } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user && isGoogleConfigured && googleBtnRef.current) {
      renderGoogleButton(googleBtnRef.current);
    }
  }, [user, isGoogleConfigured, renderGoogleButton]);

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg leading-none shadow-sm">
              JB
            </div>
            <span className="font-bold text-lg tracking-tight text-sidebar-foreground">JobBlast</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth Section */}
        <div className="p-4 border-t border-sidebar-border/50 space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-col flex min-w-0">
                  <span className="text-sm font-medium truncate text-sidebar-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground text-xs"
                onClick={signOut}
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div ref={googleBtnRef} className="flex justify-center" />
              {!isGoogleConfigured && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs justify-center"
                  onClick={signInAsGuest}
                >
                  <LogIn className="w-3.5 h-3.5 mr-2" />
                  Continue as Guest
                </Button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
