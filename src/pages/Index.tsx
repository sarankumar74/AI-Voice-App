import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AnalyzerSection } from "@/components/AnalyzerSection";
import { RecentScans } from "@/components/RecentScans";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: string;
  timestamp: Date;
  language: string;
  languageSource: "detected" | "selected";
  classification: "human" | "ai";
  confidence: number;
  reasoning: string;
  markers: {
    prosody: number;
    breath: number;
    emotion: number;
    fluency: number;
  };
  keyIndicators: string[];
  riskLevel: "Low" | "Medium" | "High";
  recommendedActions: string[];
}

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [recentScans, setRecentScans] = useState<AnalysisResult[]>([]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setRecentScans((prev) => [result, ...prev].slice(0, 10));
  };

  const handleClearHistory = () => {
    setRecentScans([]);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />

      {!showAnalyzer ? (
        <HeroSection
          onAnalyze={() => setShowAnalyzer(true)}
          onWatchDemo={() => setShowDemo(true)}
        />
      ) : (
        <AnalyzerSection onAnalysisComplete={handleAnalysisComplete} />
      )}

      {recentScans.length > 0 && (
        <RecentScans scans={recentScans} onClear={handleClearHistory} />
      )}

      <Footer />

      <DemoModal open={showDemo} onOpenChange={setShowDemo} />
    </div>
  );
};

export default Index;
