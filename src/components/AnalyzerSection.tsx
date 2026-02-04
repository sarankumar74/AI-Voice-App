import { useState, useRef, useCallback } from "react";
import { Upload, Link2, Mic, Music, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnalysisResult } from "@/pages/Index";
import { AnalysisReport } from "./AnalysisReport";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { id: "auto", label: "Auto-Detect" },
  { id: "english", label: "English" },
  { id: "tamil", label: "Tamil" },
  { id: "malayalam", label: "Malayalam" },
  { id: "telugu", label: "Telugu" },
  { id: "hindi", label: "Hindi" },
];

const AUDIO_SOURCES = [
  { id: "upload", label: "Upload File", icon: Upload },
  { id: "link", label: "Paste Link", icon: Link2 },
  { id: "record", label: "Record Live", icon: Mic },
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_RECORD_DURATION = 60; // 60 seconds
const SUPPORTED_FORMATS = ["audio/mpeg", "audio/wav", "audio/x-m4a", "audio/mp4", "audio/webm"];

interface AnalyzerSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const AnalyzerSection = ({ onAnalysisComplete }: AnalyzerSectionProps) => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [audioSource, setAudioSource] = useState<"upload" | "link" | "record">("upload");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioLink, setAudioLink] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisState, setAnalysisState] = useState<"idle" | "ready" | "analyzing" | "complete" | "failed">("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isReady = audioFile !== null || audioLink.trim() !== "";

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError("Unsupported format. Please upload MP3, WAV, or M4A files.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 25MB.");
      return;
    }

    setAudioFile(file);
    setAudioLink("");
    setAnalysisState("ready");
    setAnalysisResult(null);
  }, []);

  const handleLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioLink(e.target.value);
    setError(null);
    if (e.target.value.trim()) {
      setAudioFile(null);
      setAnalysisState("ready");
      setAnalysisResult(null);
    } else {
      setAnalysisState("idle");
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        setAudioFile(file);
        setAnalysisState("ready");
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORD_DURATION - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError("Could not access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    setAudioLink("");
    setAnalysisState("idle");
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const runAnalysis = async () => {
    setAnalysisState("analyzing");
    setError(null);

    try {
      // Convert audio file to base64 if available
      let audioData: string | null = null;
      if (audioFile) {
        const reader = new FileReader();
        audioData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(audioFile);
        });
      }

      // Call the edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          audioData,
          audioUrl: audioLink || null,
          language: selectedLanguage,
          fileName: audioFile?.name || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
      }

      const analysisData = await response.json();

      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        fileName: audioFile?.name || (audioLink ? new URL(audioLink).pathname.split("/").pop() : "audio") || "audio",
        fileSize: audioFile ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB` : "N/A",
        timestamp: new Date(),
        language: analysisData.language || (selectedLanguage === "auto" ? "Unknown" : LANGUAGES.find((l) => l.id === selectedLanguage)?.label || selectedLanguage),
        languageSource: analysisData.languageSource || (selectedLanguage === "auto" ? "detected" : "selected"),
        classification: analysisData.classification,
        confidence: analysisData.confidence,
        reasoning: analysisData.reasoning,
        markers: analysisData.markers,
        keyIndicators: analysisData.keyIndicators || [],
        riskLevel: analysisData.riskLevel || (analysisData.classification === "ai" ? "High" : "Low"),
        recommendedActions: analysisData.recommendedActions || [],
      };

      setAnalysisResult(result);
      setAnalysisState("complete");
      onAnalysisComplete(result);

      toast({
        title: "Analysis Complete",
        description: `Voice classified as ${result.classification === "human" ? "Human" : "AI-Generated"} with ${result.confidence}% confidence.`,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisState("failed");
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");

      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,450px]">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                1. Audio Language
              </h2>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      selectedLanguage === lang.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Source */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                2. Provide Audio Source
              </h2>

              {/* Source Tabs */}
              <div className="mb-6 inline-flex rounded-full border border-border bg-muted p-1">
                {AUDIO_SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => {
                      setAudioSource(source.id as typeof audioSource);
                      clearAudio();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      audioSource === source.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <source.icon className="h-4 w-4" />
                    {source.label}
                  </button>
                ))}
              </div>

              {/* Upload Area */}
              {audioSource === "upload" && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
                    audioFile
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/50 hover:border-primary/30 hover:bg-muted"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.m4a"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {audioFile ? (
                    <div className="flex flex-col items-center gap-3 p-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Music className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAudio();
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          Drop audio file here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          MP3, WAV, M4A up to 25MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Link Input */}
              {audioSource === "link" && (
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="https://example.com/audio.mp3"
                      value={audioLink}
                      onChange={handleLinkChange}
                      className="h-12 rounded-xl border-border bg-muted/50 pr-10"
                    />
                    {audioLink && (
                      <button
                        onClick={clearAudio}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: Analysis works best with direct upload for secure processing.
                  </p>
                </div>
              )}

              {/* Recording */}
              {audioSource === "record" && (
                <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-6">
                  {audioFile && !isRecording ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Music className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={clearAudio}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Record again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div
                          className={cn(
                            "flex h-16 w-16 items-center justify-center rounded-full",
                            isRecording
                              ? "bg-destructive/10"
                              : "bg-primary/10"
                          )}
                        >
                          {isRecording && (
                            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-destructive/20" />
                          )}
                          <Mic
                            className={cn(
                              "h-8 w-8",
                              isRecording ? "text-destructive" : "text-primary"
                            )}
                          />
                        </div>
                      </div>
                      <p className="mb-2 font-medium text-foreground">
                        {isRecording
                          ? `Recording... ${recordingTime}s / ${MAX_RECORD_DURATION}s`
                          : "Live Voice Recording"}
                      </p>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Capture up to {MAX_RECORD_DURATION} seconds of live speech
                      </p>
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={cn(
                          "rounded-full",
                          isRecording
                            ? "bg-destructive hover:bg-destructive/90"
                            : "gradient-primary"
                        )}
                      >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              onClick={runAnalysis}
              disabled={!isReady || analysisState === "analyzing"}
              size="lg"
              className="h-14 w-full rounded-xl gradient-primary text-lg font-semibold shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {analysisState === "analyzing" ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Run Forensic Analysis"
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <AnalysisReport
              state={analysisState}
              result={analysisResult}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
