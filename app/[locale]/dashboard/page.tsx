import { Metadata } from "next";
import { z } from "zod";

import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { taskSchema } from "@/data/schema";
import supabase from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks() {
  "use server";
  const res = await supabase.from("tasks").select("*");
  return z.array(taskSchema).parse(res.data);
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ProfileDropdown />
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </>
  );
}
