import { useState, useCallback } from "react";

 const MAX_CREDITS = 5;
 
 interface CreditSystem {
   credits: number;
   maxCredits: number;
   hasCredits: boolean;
   useCredit: () => boolean;
   isInitialized: boolean;
 }
 
 export const useCreditSystem = (): CreditSystem => {
   const [credits, setCredits] = useState<number>(MAX_CREDITS);
 
   const useCredit = useCallback((): boolean => {
     if (credits <= 0) return false;
    setCredits((prev) => prev - 1);
     return true;
   }, [credits]);
 
   return {
     credits,
     maxCredits: MAX_CREDITS,
     hasCredits: credits > 0,
     useCredit,
    isInitialized: true,
   };
 };