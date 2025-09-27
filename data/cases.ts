import { Case } from "@/lib/types";

export const CASES: Case[] = [
  { id:"c1", quoteId:"q1", status:"Visa", documents:["passport.pdf","ecg.jpg"], timeline:[{at:"2025-06-01",event:"Tele-consult"},{at:"2025-06-02",event:"Deposit paid"},{at:"2025-06-02",event:"Visa letter issued"}] },
  { id:"c2", quoteId:"q2", status:"TeleConsult", documents:["mri.zip"], timeline:[{at:"2025-05-18",event:"Intake submitted"}] },
  { id:"c3", quoteId:"q3", status:"Rehab", documents:["discharge.pdf"], timeline:[{at:"2025-04-03",event:"Surgery completed"}] },
];

