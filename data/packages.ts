import { Package } from "@/lib/types";

export const PACKAGES: Package[] = [
  { sku:"TKR_STANDARD", title:"Total Knee Replacement (Standard Implant)", priceUSD:5200,
    inclusions:["Surgeon fee","OR & anesthesia","3 nights private room","Standard implant","Pre-op labs & imaging","Drugs & dressings","Physio consult"],
    exclusions:["Companion stay","Implant upgrade",">3 nights LOS","Non-routine ICU","Comorbidity management"],
    addons:[{name:"Implant premium",priceUSD:900},{name:"Companion room",priceUSD:60,per:"night"}],
    losDays:3, refundPolicy:"Full refund minus documented costs if medically contraindicated.",
    milestones:["TeleConsult","Admission","Surgery","Discharge"]
  },
  { sku:"TKR_PREMIUM", title:"Total Knee Replacement (Premium Implant)", priceUSD:6100,
    inclusions:["Premium implant","Enhanced pain control","4 nights private room"], exclusions:["Companion stay"], addons:[{name:"Companion room",priceUSD:75,per:"night"}],
    losDays:4, refundPolicy:"Same as standard", milestones:["TeleConsult","Admission","Surgery","Discharge"]
  },
  { sku:"ANGIOPLASTY", title:"Coronary Angioplasty & Stent", priceUSD:6800,
    inclusions:["Surgeon fee","OR & anesthesia","2 nights ICU"], exclusions:["Companion stay","Premium stents",">2 nights LOS"],
    addons:[{name:"Premium stent",priceUSD:1500},{name:"Companion room",priceUSD:80,per:"night"}],
    losDays:2, refundPolicy:"Full refund minus costs if contraindicated.", milestones:["TeleConsult","Admission","Surgery","Recovery","Discharge"]
  },
  { sku:"ACL_ARTHRO", title:"ACL Reconstruction (Arthroscopic)", priceUSD:2900,
    inclusions:["Surgeon fee","OR","1 night"], exclusions:["ICU"], addons:[{name:"Allograft",priceUSD:450}],
    losDays:1, refundPolicy:"Refund minus costs if contraindicated.", milestones:["TeleConsult","Admission","Surgery","Discharge"]
  },
  { sku:"CARDIAC_BYPASS", title:"Cardiac Bypass Surgery", priceUSD:8500,
    inclusions:["Surgeon fee","OR & anesthesia","5 nights ICU"], exclusions:["Companion stay","Premium implants",">5 nights LOS"],
    addons:[{name:"Premium graft",priceUSD:1200},{name:"Companion room",priceUSD:80,per:"night"}],
    losDays:5, refundPolicy:"Full refund minus costs if contraindicated.", milestones:["TeleConsult","Admission","Surgery","Recovery","Discharge"]
  },
  { sku:"SPINE_FUSION", title:"Spine Fusion Surgery", priceUSD:7200,
    inclusions:["Surgeon fee","OR & anesthesia","4 nights private room"], exclusions:["Companion stay","Premium implants",">4 nights LOS"],
    addons:[{name:"Premium implants",priceUSD:1500},{name:"Private nurse",priceUSD:100,per:"night"}],
    losDays:4, refundPolicy:"Refund minus documented costs.", milestones:["TeleConsult","Admission","Surgery","Recovery","Discharge"]
  },
  { sku:"IVF_CYCLE", title:"IVF Cycle (Standard Protocol)", priceUSD:3500,
    inclusions:["Consults","Monitoring","Egg retrieval"], exclusions:["PGT","Freezing >1yr"],
    addons:[{name:"PGT-A",priceUSD:800},{name:"ICSI",priceUSD:450}],
    losDays:0, refundPolicy:"Cycle cancellation cover optional.", milestones:["TeleConsult","Admission","Surgery","Discharge"]
  },
  { sku:"THR_PREMIUM", title:"Total Hip Replacement (Premium Implant)", priceUSD:6200,
    inclusions:["Premium implant","4 nights","Enhanced physio"], exclusions:["Companion"], addons:[{name:"Private nurse",priceUSD:100,per:"night"}],
    losDays:4, refundPolicy:"Same as standard", milestones:["TeleConsult","Admission","Surgery","Discharge"]
  },
];
