import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Languages, Mic, FileSearch, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    icon: Languages,
    title: "Select Voice Context",
    description:
      "Our AI model adapts its analysis based on the language. Choose the appropriate language for the most accurate results.",
  },
  {
    icon: Mic,
    title: "Provide Audio Input",
    description:
      "Upload an MP3/WAV file or use the built-in recorder to capture live speech. We process audio in high-fidelity to detect synthetic micro-jitters.",
  },
  {
    icon: FileSearch,
    title: "Review Forensic Report",
    description:
      "Get detailed analysis including confidence scores, naturalness markers, and expert reasoning explaining how the classification was determined.",
  },
];

export const DemoModal = ({ open, onOpenChange }: DemoModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(0);
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 rounded-2xl">
        <div className="flex min-h-[400px]">
          {/* Left Panel - Purple */}
          <div className="hidden w-[200px] flex-shrink-0 flex-col justify-between gradient-primary p-6 text-primary-foreground md:flex">
            <div>
              <h2 className="mb-2 text-xl font-bold">Voice Guide</h2>
              <p className="text-sm opacity-80">
                Quick walk-through of our forensic analysis technology.
              </p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-3">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-all",
                      index === currentStep
                        ? "bg-primary-foreground text-primary"
                        : index < currentStep
                        ? "bg-primary-foreground/30 text-primary-foreground"
                        : "border border-primary-foreground/30 text-primary-foreground/50"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-all",
                      index <= currentStep
                        ? "bg-primary-foreground"
                        : "bg-primary-foreground/20"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="relative flex flex-1 flex-col p-8">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CurrentIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                {currentStep + 1}. {steps[currentStep].title}
              </h3>
              <p className="max-w-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(currentStep === 0 && "invisible")}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="rounded-full gradient-primary">
                {currentStep === steps.length - 1 ? "Get Started" : "Next Step"}
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="ml-1 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
