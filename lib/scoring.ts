export function scoreLead(input:{buying_intent?:string;purchase_timeline?:string;budget_confirmed?:boolean;contact_consent?:boolean}) {
 let score=20;
 if(input.buying_intent==="high") score+=35;
 if(input.buying_intent==="medium") score+=18;
 if(input.purchase_timeline==="0-1_month") score+=25;
 if(input.purchase_timeline==="1-3_months") score+=15;
 if(input.budget_confirmed) score+=10;
 if(input.contact_consent) score+=10;
 score=Math.min(100,score);
 return {score,temperature:score>=75?"hot":score>=45?"warm":"cold"};
}
