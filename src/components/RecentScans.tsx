import { useState } from "react";
import { AnalysisResult } from "@/pages/Index";
import { ShieldCheck, Bot, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnalysisReport } from "./AnalysisReport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecentScansProps {
  scans: AnalysisResult[];
  onClear: () => void;
}

export const RecentScans = ({ scans, onClear }: RecentScansProps) => {
  const [selectedScan, setSelectedScan] = useState<AnalysisResult | null>(null);

  return (
    <>
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Scans
                </h3>
                <button
                  onClick={onClear}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  CLEAR HISTORY
                </button>
              </div>

              <div className="divide-y divide-border">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-muted/50 -mx-2 px-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          scan.classification === "human"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        )}
                      >
                        {scan.classification === "human" ? (
                          <ShieldCheck className="h-5 w-5 text-success" />
                        ) : (
                          <Bot className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {scan.fileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(scan.timestamp, "MM/dd/yyyy, h:mm:ss a")} • {scan.language}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-lg font-bold",
                          scan.classification === "human"
                            ? "text-success"
                            : "text-destructive"
                        )}
                      >
                        {scan.confidence}%
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      <Dialog open={!!selectedScan} onOpenChange={() => setSelectedScan(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Analysis Report: {selectedScan?.fileName}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedScan && (
            <AnalysisReport state="complete" result={selectedScan} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
