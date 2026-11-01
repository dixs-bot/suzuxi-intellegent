export async function sendWhatsAppText(to:string,text:string) {
 const token=process.env.WHATSAPP_ACCESS_TOKEN, phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID;
 if(!token || !phoneId) throw new Error("WhatsApp belum dikonfigurasi.");
 const res=await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`,{
  method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},
  body:JSON.stringify({messaging_product:"whatsapp",to,type:"text",text:{body:text}})
 });
 const data=await res.json();
 if(!res.ok) throw new Error(data.error?.message || "Gagal mengirim WhatsApp");
 return data;
}
