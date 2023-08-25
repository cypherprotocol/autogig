import {
  getProfile,
  getTask,
} from "@/app/dashboard/task/[taskId]/actions";
import { SimilarityResults } from "@/components/similarity-results";
import { taskSchema } from "@/data/schema";
import supabase from "@/lib/supabase";
import { z } from "zod";

export async function generateStaticParams() {
  const res = await supabase.from("tasks").select("*");
  const tasks = z.array(taskSchema).parse(res.data);

  console.log(tasks.map((task) => ({ taskId: task.id.toString() })));

  return tasks.map((task) => ({ taskId: task.id.toString() }));
}

export default async function TaskPage({
  params,
}: {
  params: { taskId: string };
}) {
  // const task = taskSchema.parse(params);
  const task = await getTask(parseInt(params.taskId));
  const profile = await getProfile(task);

  return (
    <>
      <SimilarityResults fileName={profile.file_name} email={profile.email} />
    </>
  );
}
