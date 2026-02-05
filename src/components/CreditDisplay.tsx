 import { Zap } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface CreditDisplayProps {
   credits: number;
   maxCredits: number;
   className?: string;
 }
 
 export const CreditDisplay = ({ credits, maxCredits, className }: CreditDisplayProps) => {
   const isLow = credits <= 2;
   const isEmpty = credits === 0;
 
   return (
     <div
       className={cn(
         "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
         isEmpty
           ? "bg-destructive/10 text-destructive"
           : isLow
           ? "bg-warning/10 text-warning"
           : "bg-primary/10 text-primary",
         className
       )}
     >
       <Zap className="h-4 w-4" />
       <span>
         Free credits: {credits} / {maxCredits}
       </span>
     </div>
   );
 };