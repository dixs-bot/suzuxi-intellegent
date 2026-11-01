import {NextResponse} from "next/server";
import {z} from "zod";
import {requireApiUser} from "@/lib/auth";
const schema=z.object({title:z.string().min(2).max(200),content:z.string().min(1).max(50000),source_type:z.string().max(40).optional(),source_url:z.string().url().optional().or(z.literal("")),is_verified:z.boolean().optional()});
export async function GET(){const {context,response}=await requireApiUser();if(response)return response;const {data,error}=await context.supabase.from("knowledge_documents").select("*").order("created_at",{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({data});}
export async function POST(req:Request){const {context,response}=await requireApiUser(["admin","sales"]);if(response)return response;const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:"Data tidak valid",details:p.error.flatten()},{status:400});const {data,error}=await context.supabase.from("knowledge_documents").insert(p.data).select().single();if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({data},{status:201});}
