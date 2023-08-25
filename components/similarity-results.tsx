"use client";

import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import useUserStore from "@/state/user/useUserStore";

export function SimilarityResults({
  fileName,
  email,
}: {
  fileName: string;
  email: string;
}) {
  const setJobs = useUserStore((state) => state.setJobs);
  const jobs = useUserStore((state) => state.jobs);

  const handleButtonClick = async () => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        body: JSON.stringify({
          fileName: fileName,
        }),
      });

      const responseJson = await response.json();
      setJobs(responseJson.jobs);

      // Handle response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <div className="flex w-full items-center space-x-4">
        <div className="text-lg font-semibold">{email}</div>
        <Button>Download PDF</Button>
      </div>
      <Button onClick={handleButtonClick}>Fetch</Button>
      {jobs.map((job, index) => (
        <JobCard fileName={fileName} job={job} key={index} />
      ))}
    </>
  );
}
