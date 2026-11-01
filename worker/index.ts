import {createClient} from "@supabase/supabase-js";
const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key){console.error("Worker membutuhkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.");process.exit(1);}
const db=createClient(url,key,{auth:{persistSession:false}});
async function tick(){
 const {data:tasks,error}=await db.from("ai_tasks").select("*").eq("status","queued").order("created_at",{ascending:true}).limit(10);
 if(error){console.error("Queue read error",error.message);return;}
 for(const task of tasks||[]){
  const {error:updateError}=await db.from("ai_tasks").update({status:"needs_review",updated_at:new Date().toISOString()}).eq("id",task.id);
  if(updateError)console.error("Task update failed",task.id,updateError.message);
  else console.log("Task moved to needs_review:",task.id,"type:",task.task_type);
 }
}
console.log("Suzuki AI worker started. Queue processor is in safe review mode.");
setInterval(()=>void tick(),15000);
void tick();
