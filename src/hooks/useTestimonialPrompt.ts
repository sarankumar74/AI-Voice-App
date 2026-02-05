import { useState, useCallback } from "react";
 
 type TestimonialStatus = "pending" | "submitted" | "skipped";
 
 interface TestimonialPromptState {
   shouldShow: boolean;
   status: TestimonialStatus;
   markAsSubmitted: () => void;
   markAsSkipped: () => void;
   triggerPrompt: () => void;
 }
 
 export const useTestimonialPrompt = (): TestimonialPromptState => {
   const [status, setStatus] = useState<TestimonialStatus>("pending");
   const [shouldShow, setShouldShow] = useState(false);
 
   const triggerPrompt = useCallback(() => {
     if (status === "pending") {
       setShouldShow(true);
     }
   }, [status]);
 
   const markAsSubmitted = useCallback(() => {
     setStatus("submitted");
     setShouldShow(false);
   }, []);
 
   const markAsSkipped = useCallback(() => {
     setStatus("skipped");
     setShouldShow(false);
   }, []);
 
   return {
     shouldShow,
     status,
     markAsSubmitted,
     markAsSkipped,
     triggerPrompt,
   };
 };