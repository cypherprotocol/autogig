import useUserStore from "@/state/user/useUserStore";
import { useChat } from "ai/react";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export function UploadUnstyled() {
  const { messages, input, setInput, handleSubmit } = useChat();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setSocials = useUserStore((state) => state.setSocials);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = event.target.files?.[0];
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
        }

        const question =
          "Can you concisely and accurately summarize this persons expertise based off of their resume.";
        const message = `${question}\n${content}`;
        setInput(message);
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className="flex w-full max-w-md flex-col text-white">
        {messages.map(
          (m) => m.role !== "user" && <div key={m.id}>{m.content}</div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center"
      >
        <p className="mb-8 text-lg text-black">Upload your resume</p>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          ref={fileInputRef}
          accept=".txt, .csv"
        />
        <motion.button
          onClick={handleFileClick}
          className="mb-4 rounded-md bg-sky-400 px-3 py-1 text-white"
        >
          Upload
        </motion.button>
        <button type="submit" className="text-black">
          Submit
        </button>
      </form>
    </>
  );
}
