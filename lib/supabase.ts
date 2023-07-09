import { Database } from "@/lib/types/supabase";
import { createClient } from "@supabase/supabase-js";

export default createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
