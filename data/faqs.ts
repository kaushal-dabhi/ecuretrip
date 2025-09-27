import { FAQ } from "@/lib/types";

export const FAQS: FAQ[] = [
  { id:"k1", treatmentSlug:"knee-replacement", q:"How long is hospital stay for TKR?", a:"Typically 3–4 nights with early mobilization from Day 1." },
  { id:"k2", treatmentSlug:"knee-replacement", q:"When can I fly back?", a:"Most patients fly 10–14 days after discharge, subject to surgeon clearance." },
  { id:"a1", treatmentSlug:"acl-surgery", q:"Is ACL done as day-care?", a:"Often 1 night stay; return to desk work in ~1–2 weeks with brace." },
  { id:"a2", treatmentSlug:"acl-surgery", q:"Autograft vs Allograft?", a:"Autograft is standard; allograft may reduce harvest pain but can increase cost." },
  { id:"i1", treatmentSlug:"ivf", q:"What is the success rate?", a:"Depends on age and diagnosis; our clinics report 35–45% clinical pregnancy per cycle in <35." },
  { id:"i2", treatmentSlug:"ivf", q:"Is PGT necessary?", a:"Not mandatory; recommended for recurrent loss or advanced maternal age." },
];

