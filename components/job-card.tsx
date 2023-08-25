import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobData } from "@/lib/types";
import { useState } from "react";

export function JobCard({ fileName, job }: { fileName: string; job: JobData }) {
  const [coverLetter, setCoverLetter] = useState<string>("");

  const handleButtonClick = async () => {
    try {
      const response = await fetch("/api/coverletter", {
        method: "POST",
        body: JSON.stringify({
          job: job,
          fileName: fileName,
        }),
      });

      const responseJson = await response.json();
      setCoverLetter(responseJson.coverLetter);

      // Handle response
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex w-full items-center">
          <div className="flex w-full flex-col">
            <CardTitle>{job.company_name}</CardTitle>
            <CardDescription>{job.title}</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <a href={job.job_link} target="_blank" rel="noreferrer">
              <Button>Apply</Button>
            </a>
            <Button onClick={handleButtonClick}>Generate</Button>
          </div>
          {/* <div className="flex items-center">
                            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#5c5bee]">
                              {index === 0
                                ? "$75,000"
                                : index === 1
                                ? "$125,000"
                                : "$110,000"}
                            </h4>
                            <p className="ml-1 text-sm text-muted-foreground">
                              /yr
                            </p>
                          </div> */}
        </div>
      </CardHeader>

      {coverLetter && (
        <CardContent>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{coverLetter}</p>
        </CardContent>
      )}
    </Card>
  );
}
