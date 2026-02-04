import { Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onAnalyze: () => void;
  onWatchDemo: () => void;
}

export const HeroSection = ({ onAnalyze, onWatchDemo }: HeroSectionProps) => {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              VoiceDetector.ai
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Detect AI vs Human
            <br />
            <span className="text-gradient">Voice Instantly</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Unmask deepfakes and verify audio authenticity. The professional tool
            for content creators, HR teams, and media organizations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={onAnalyze}
              size="lg"
              className="h-12 min-w-[180px] rounded-full gradient-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all"
            >
              Analyze Audio Now
            </Button>
            <Button
              onClick={onWatchDemo}
              variant="outline"
              size="lg"
              className="h-12 min-w-[180px] rounded-full border-border bg-card shadow-sm hover:bg-muted transition-all"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Watch Tutorial
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16">
            <p className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
              {["ACCENTURE", "META", "NVIDIA", "HBO"].map((brand) => (
                <span
                  key={brand}
                  className="text-lg font-bold tracking-wide text-foreground"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
