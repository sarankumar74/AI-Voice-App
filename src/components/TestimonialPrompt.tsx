 import { useState } from "react";
 import { Star, X, Send } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerTitle,
 } from "@/components/ui/drawer";
 import { useIsMobile } from "@/hooks/use-mobile";
 import { cn } from "@/lib/utils";
 import { useToast } from "@/hooks/use-toast";
 
 interface TestimonialPromptProps {
   open: boolean;
   onSubmit: () => void;
   onSkip: () => void;
 }
 
 export const TestimonialPrompt = ({ open, onSubmit, onSkip }: TestimonialPromptProps) => {
   const isMobile = useIsMobile();
   const { toast } = useToast();
   const [rating, setRating] = useState<number>(0);
   const [hoveredRating, setHoveredRating] = useState<number>(0);
   const [feedback, setFeedback] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
 
   const handleSubmit = async () => {
     if (rating === 0) {
       toast({
         title: "Please select a rating",
         description: "Choose 1-5 stars before submitting.",
         variant: "destructive",
       });
       return;
     }
 
     setIsSubmitting(true);
     
     // Store testimonial anonymously (could be sent to backend in future)
     try {
       const testimonial = {
         rating,
         feedback: feedback.trim() || null,
         timestamp: new Date().toISOString(),
       };
       
       // Store locally for now (anonymous, no personal data)
       const existingTestimonials = JSON.parse(
         localStorage.getItem("voicedetector_testimonials") || "[]"
       );
       existingTestimonials.push(testimonial);
       localStorage.setItem(
         "voicedetector_testimonials",
         JSON.stringify(existingTestimonials)
       );
 
       toast({
         title: "Thank you for your feedback!",
         description: "Your testimonial helps us improve.",
       });
       
       onSubmit();
     } catch (error) {
       console.error("Failed to save testimonial:", error);
       toast({
         title: "Submission failed",
         description: "Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const StarRating = () => (
     <div className="flex justify-center gap-2">
       {[1, 2, 3, 4, 5].map((star) => (
         <button
           key={star}
           type="button"
           onClick={() => setRating(star)}
           onMouseEnter={() => setHoveredRating(star)}
           onMouseLeave={() => setHoveredRating(0)}
           className="transition-transform hover:scale-110 focus:outline-none"
         >
           <Star
             className={cn(
               "h-8 w-8 transition-colors",
               (hoveredRating || rating) >= star
                 ? "fill-warning text-warning"
                 : "text-muted-foreground"
             )}
           />
         </button>
       ))}
     </div>
   );
 
   const Content = () => (
     <div className="space-y-6">
       <div className="text-center">
         <p className="text-sm text-muted-foreground">
           How was your experience with VoiceDetector.ai?
         </p>
       </div>
 
       <StarRating />
 
       <div className="space-y-2">
         <label className="text-sm font-medium text-foreground">
           Share your thoughts (optional)
         </label>
         <Textarea
           placeholder="Tell us what you think..."
           value={feedback}
           onChange={(e) => setFeedback(e.target.value)}
           className="min-h-[100px] resize-none"
           maxLength={500}
         />
         <p className="text-xs text-muted-foreground text-right">
           {feedback.length}/500
         </p>
       </div>
 
       <div className={cn("flex gap-3", isMobile ? "flex-col" : "flex-row justify-end")}>
         <Button
           variant="outline"
           onClick={onSkip}
           disabled={isSubmitting}
           className={cn(isMobile && "w-full")}
         >
           <X className="mr-2 h-4 w-4" />
           Skip
         </Button>
         <Button
           onClick={handleSubmit}
           disabled={isSubmitting}
           className={cn("gradient-primary", isMobile && "w-full")}
         >
           <Send className="mr-2 h-4 w-4" />
           {isSubmitting ? "Submitting..." : "Submit"}
         </Button>
       </div>
 
       <p className="text-center text-xs text-muted-foreground">
         Your feedback is anonymous and helps us improve.
       </p>
     </div>
   );
 
   if (isMobile) {
     return (
       <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
         <DrawerContent className="px-4 pb-8">
           <DrawerHeader className="text-center">
             <DrawerTitle>Share Your Experience</DrawerTitle>
           </DrawerHeader>
           <Content />
         </DrawerContent>
       </Drawer>
     );
   }
 
   return (
     <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle className="text-center">Share Your Experience</DialogTitle>
         </DialogHeader>
         <Content />
       </DialogContent>
     </Dialog>
   );
 };