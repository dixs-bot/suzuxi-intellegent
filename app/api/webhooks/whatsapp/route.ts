import {NextResponse} from "next/server";
export async function GET(req:Request){const u=new URL(req.url);if(u.searchParams.get("hub.mode")==="subscribe"&&u.searchParams.get("hub.verify_token")===process.env.WHATSAPP_VERIFY_TOKEN){return new Response(u.searchParams.get("hub.challenge")||"",{status:200});}return NextResponse.json({error:"Verification failed"},{status:403});}
export async function POST(req:Request){const body=await req.json(); // TODO: validate and map incoming WhatsApp messages to the inbox/consent workflow.
return NextResponse.json({received:true,processed:false,object:body.object||null});}
