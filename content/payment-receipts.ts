export interface PaymentReceipt {
  id: string;
  amount: string;
  amountNumber: number;
  currency: string;
  date: string;
  platform: string;
  status: "Verified & Cleared";
  serviceCategory: string;
  clientType: string;
  milestoneTitle: string;
  chatQuote: string;
  dialogueNote: string;
  imageSrc: string;
  badge: string;
  whatsappMessage: string;
}

export const PAYMENT_RECEIPTS: PaymentReceipt[] = [
  {
    id: "receipt-5000-retainer",
    amount: "₹5,000",
    amountNumber: 5000,
    currency: "INR",
    date: "02 Nov 2026, 12:13 PM",
    platform: "Paytm UPI",
    status: "Verified & Cleared",
    serviceCategory: "Full Monthly Management",
    clientType: "Enterprise Retail Brand",
    milestoneTitle: "Monthly Meta Ads Campaign Retainer",
    chatQuote: "“10 min me ho jaega” → “ok mam thankyou”",
    dialogueNote: "Full monthly campaign retainer paid via Paytm with instant client confirmation.",
    imageSrc: "/images/receipts/receipt-2.webp",
    badge: "⭐ Full Retainer Advance",
    whatsappMessage: "Hi Digitrust Solutions, I saw your ₹5,000 Monthly Retainer payment proof on your website. I want to discuss full-month campaign management for my business."
  },
  {
    id: "receipt-1999-trial",
    amount: "₹1,999",
    amountNumber: 1999,
    currency: "INR",
    date: "06 Nov 2026, 2:02 PM",
    platform: "PhonePe UPI",
    status: "Verified & Cleared",
    serviceCategory: "7-Day Risk-Free Trial",
    clientType: "E-Commerce & D2C Brand",
    milestoneTitle: "7-Day Meta Ads Trial Activation",
    chatQuote: "“Done” → “ok sir thankyou, m start krwadeta hu”",
    dialogueNote: "Client paid the standard ₹1,999 7-day trial fee; campaign launch initiated within 5 minutes.",
    imageSrc: "/images/receipts/receipt-5.webp",
    badge: "⚡ 7-Day Trial Onboarding",
    whatsappMessage: "Hi Digitrust Solutions, I saw your ₹1,999 7-Day Trial payment receipt with instant campaign launch. I want to start my 7-day trial."
  },
  {
    id: "receipt-2800-scaling",
    amount: "₹2,800",
    amountNumber: 2800,
    currency: "INR",
    date: "18 Nov 2026, 4:02 PM",
    platform: "Navi UPI",
    status: "Verified & Cleared",
    serviceCategory: "Campaign Scaling Retainer",
    clientType: "Commercial Service Client",
    milestoneTitle: "Ad Account Scaling & Audience Expansion",
    chatQuote: "“Verified Client paid ₹2,800” → “Digitrust Support: Okay”",
    dialogueNote: "Direct settlement into Digitrust agency merchant account for campaign scaleup.",
    imageSrc: "/images/receipts/receipt-4.webp",
    badge: "📈 Scaling Milestone",
    whatsappMessage: "Hi Digitrust Solutions, I saw your ₹2,800 verified scaling payment proof on your website. Let's discuss ad scaling for my business."
  },
  {
    id: "receipt-1000-instant-start",
    amount: "₹1,000",
    amountNumber: 1000,
    currency: "INR",
    date: "28 Oct 2026, 6:11 PM",
    platform: "PhonePe UPI",
    status: "Verified & Cleared",
    serviceCategory: "Rapid Ad Launch",
    clientType: "Local Service Business",
    milestoneTitle: "Immediate Campaign Execution Advance",
    chatQuote: "“So when u will start work ?” → “Already started sir”",
    dialogueNote: "Client questioned work timeline immediately after payment — team was already actively in Ads Manager.",
    imageSrc: "/images/receipts/receipt-6.webp",
    badge: "🚀 Instant Execution",
    whatsappMessage: "Hi Digitrust Solutions, I saw your 'Already started sir' ₹1,000 payment proof. I love your speed of execution. Let's start for my brand."
  },
  {
    id: "receipt-1000-campaign-advance",
    amount: "₹1,000",
    amountNumber: 1000,
    currency: "INR",
    date: "13 Nov 2026, 1:43 PM",
    platform: "Navi UPI",
    status: "Verified & Cleared",
    serviceCategory: "Lead Gen Campaign",
    clientType: "Healthcare / D2C Brand",
    milestoneTitle: "Campaign Setup & Creative Optimization",
    chatQuote: "“Payment done, check and confirm”",
    dialogueNote: "Lightning-fast 1.4-second UPI clearance confirming creative copywriting and ad angles.",
    imageSrc: "/images/receipts/receipt-3.webp",
    badge: "🎯 Setup Milestone",
    whatsappMessage: "Hi Digitrust Solutions, I saw your ₹1,000 verified payment proof on your website. Can we talk about Meta lead generation for my clinic/brand?"
  },
  {
    id: "receipt-999-academy",
    amount: "₹999",
    amountNumber: 999,
    currency: "INR",
    date: "24 Oct 2026, 6:31 PM",
    platform: "PhonePe UPI",
    status: "Verified & Cleared",
    serviceCategory: "Creative Campaign Setup",
    clientType: "Multimedia Academy",
    milestoneTitle: "Student Admissions Ad Campaign Launch",
    chatQuote: "“okay Thankyou mam”",
    dialogueNote: "PhonePe transaction successful for student intake campaign targeting Delhi-NCR.",
    imageSrc: "/images/receipts/receipt-1.webp",
    badge: "🎓 Admissions Intake",
    whatsappMessage: "Hi Digitrust Solutions, I saw your ₹999 verified payment receipt for multimedia academy ads. Let's discuss campaign setup for my business."
  }
];
