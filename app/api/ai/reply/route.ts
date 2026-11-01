import {NextResponse} from "next/server";
import {z} from "zod";
import {generateSalesReply} from "@/lib/ai";
const schema=z.object({message:z.string().min(1).max(4000),context:z.array(z.string().max(1000)).max(10).optional()});
export async function POST(req:Request){try{const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:"Pesan tidak valid."},{status:400});const result=await generateSalesReply(p.data.message,p.data.context||[]);return NextResponse.json(result);}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"AI sedang tidak tersedia."},{status:500});}}
