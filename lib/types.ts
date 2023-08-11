import { Json } from "@/lib/types/supabase";
import { type Message } from "ai";
import { z } from "zod";

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export interface Repositories {
  name: string | null;
  language_data: Json | null;
  description: string | null;
}

export interface JobData {
  title: string;
  company_name: string;
  location: string;
  via: string;
  description: string;
  job_highlights: {
    title: string;
    items: string[];
  }[];
  related_links: {
    links: string;
    text: string;
  }[];
  extensions: string[];
  detected_extensions: {
    schedule_type: string;
    work_from_home: boolean;
  }[];
  job_id: string;
  job_link: string;
}
export const formSchema = z.object({
  username: z.string().min(1, "Github is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  address: z.string().min(1, "Address is required"),
});
