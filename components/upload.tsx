import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import useUserStore, { GigStages } from "@/state/user/useUserStore";
import React, { useRef } from "react";

export function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setSocials = useUserStore((state) => state.setSocials);
  const setResume = useUserStore((state) => state.setResume);
  const setStage = useUserStore((state) => state.setStage);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    if (file.type === "application/pdf") {
      // Generate a random string to be used as the file name.
      const randomString =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const fileExtension = file.type.split("/")[1];
      const newFileName = `${randomString}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from("autogig")
        .upload(`resumes/${newFileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.log(error);
        return;
      }
    } else {
      const reader = new FileReader();

      if (file) {
        reader.onload = (e) => {
          const content = e.target?.result;

          const githubRegex = /github\.com\/([a-zA-Z0-9]+)/g;
          const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/g;

          if (typeof content === "string") {
            const githubUsernames = Array.from(
              content.matchAll(githubRegex),
              (match) => match[1]
            );
            const linkedinUsernames = Array.from(
              content.matchAll(linkedinRegex),
              (match) => match[1]
            );

            const githubUsername = githubUsernames[0] || null;
            const linkedinUsername = linkedinUsernames[0] || null;

            console.log("GitHub Username:", githubUsername);
            console.log("LinkedIn Username:", linkedinUsername);

            if (githubUsername && linkedinUsername) {
              setSocials(githubUsername, linkedinUsername);
            }

            setResume(content);
            setStage(GigStages.FindJob);
          }
        };

        reader.readAsText(file);
      }
    }
  };

  return (
    <>
      <h3 className="mb-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Upload your resume
      </h3>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={uploadPhoto}
        ref={fileInputRef}
        accept=".txt, .pdf"
      />
      <Button onClick={handleFileClick} className="mb-2">
        Upload
      </Button>
      <p className="text-sm text-muted-foreground">
        Accept .txt and .pdf files
      </p>
    </>
  );
}
