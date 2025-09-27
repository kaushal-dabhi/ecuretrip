import { Surgeon } from "@/lib/types";

export const SURGEONS: Surgeon[] = [
  { slug:"dr-amit-kumar", name:"Dr. Amit Kumar", specialty:"Orthopedics — TKR/THR", casesPerYear:180, languages:["English","Arabic"],
    facilities:[{name:"City Premium Hospital",city:"Gurugram",priceUSD:5200},{name:"City Value Hospital",city:"Faridabad",priceUSD:4500}],
    training:["Fellowship — Joint Replacement, XYZ"], outcomes:{instrument:"OKS",D30:32,D90:40,n:56}, acceptsComorbidities:["Diabetes","Hypertension"]
  },
  { slug:"dr-rhea-shah", name:"Dr. Rhea Shah", specialty:"Orthopedics — ACL/Arthroscopy", casesPerYear:210, languages:["English","Hindi"],
    facilities:[{name:"Green Spine & Sports",city:"Bengaluru",priceUSD:2900},{name:"Metro Ortho Institute",city:"New Delhi",priceUSD:3050}],
    training:["Fellowship — Sports Medicine"], outcomes:{instrument:"IKDC",D30:62,D90:78,n:73}
  },
  { slug:"dr-rajesh-verma", name:"Dr. Rajesh Verma", specialty:"Cardiology — Interventional", casesPerYear:195, languages:["English","Hindi"],
    facilities:[{name:"Heart Care Institute",city:"Mumbai",priceUSD:4800}], training:["Fellowship — Interventional Cardiology"], outcomes:{instrument:"MLHFQ",D30:45,D90:62,n:89}
  },
  { slug:"dr-ali-hasan", name:"Dr. Ali Hasan", specialty:"Orthopedics — Hip & Knee", casesPerYear:160, languages:["English","Arabic"],
    facilities:[{name:"City Premium Hospital",city:"Gurugram",priceUSD:5400}], training:["FRCS (Tr&Orth)"], outcomes:{instrument:"HOOS",D30:58,D90:72,n:44}
  },
  { slug:"dr-meera-jain", name:"Dr. Meera Jain", specialty:"Reproductive Medicine — IVF/ICSI", casesPerYear:260, languages:["English","Gujarati"],
    facilities:[{name:"Lotus Women's Hospital",city:"Ahmedabad",priceUSD:4300}], training:["Fellowship — ART"], outcomes:{instrument:"CPR",D30:0.41,n:150}
  },
  { slug:"dr-kabir-singh", name:"Dr. Kabir Singh", specialty:"Sports Ortho — ACL/Multiligament", casesPerYear:185, languages:["English","Punjabi"],
    facilities:[{name:"Green Spine & Sports",city:"Bengaluru",priceUSD:3350}], training:["Fellowship — Knee Sports"], outcomes:{instrument:"IKDC",D30:60,D90:80,n:61}
  },
];
