import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            VoiceDetector.AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">BACKEND ONLINE</span>
          </div>
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Analyzer
          </Link>
          <Link
            to="/api"
            className={`text-sm font-medium transition-colors ${location.pathname === '/api' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            API Docs
          </Link>
        </nav>

        <Link
          to="https://voicedetectorai-lp.vercel.app/"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
        >
          Console
        </Link>
      </div>
    </header>
  );
};
