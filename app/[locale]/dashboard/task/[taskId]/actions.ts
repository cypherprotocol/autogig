"use server";

import { Task } from "@/data/schema";
import supabase from "@/lib/supabase";

export async function getTask(taskId: number): Promise<any> {
  const res = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  return res.data;
}

export async function getProfile(task: Task): Promise<any> {
  console.log("data", task.profile);
  const res = await supabase
    .from("profiles")
    .select("*")
    .eq("id", task.profile)
    .single();

  console.log(res);

  return res.data;
}

export async function getFile(fileName: string): Promise<Blob | null> {
  console.log(fileName);
  const { data, error } = await supabase.storage
    .from("autogig")
    .download(`resumes/${fileName}`);

  return data;
}
