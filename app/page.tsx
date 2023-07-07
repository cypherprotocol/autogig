"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const hoverAnimation = {
    scale: 1.1, // increased scale for a more pronounced effect
    transition: {
      type: "spring",
      stiffness: 240, // Lower stiffness
    },
  };

  const [stage, setStage] = useState(0);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        {(() => {
          switch (stage) {
            case 0:
              return (
                <motion.div
                  onClick={() => setStage(1)}
                  whileHover={{
                    scale: 1.05, // increased scale for a more pronounced effect
                  }}
                  whileTap={{
                    scale: 1, // increased scale for a more pronounced effect
                  }}
                  className="clickable flex h-[42rem] w-[42rem] cursor-pointer flex-col items-center justify-center rounded-full p-4 shadow-zen transition hover:shadow-zenny"
                >
                  <p className="text-8xl font-medium text-white">Find a job</p>
                </motion.div>
              );
            case 1:
              return (
                <>
                  <p className="mb-8 text-6xl font-medium text-white">
                    Upload your resume
                  </p>
                  <motion.div
                    whileHover={{
                      scale: 1.05, // increased scale for a more pronounced effect
                    }}
                    whileTap={{
                      scale: 1, // increased scale for a more pronounced effect
                    }}
                    onClick={() => setStage(2)}
                    className="clickable flex h-[24rem] w-[24rem] cursor-pointer flex-col items-center justify-center rounded-full p-4 shadow-zen transition hover:shadow-zenny"
                  >
                    <p className="text-4xl font-medium text-white">Upload</p>
                  </motion.div>
                </>
              );
          }
        })()}
        <FileText className="absolute -bottom-16 -left-16 h-96 w-96 -rotate-12 stroke-white stroke-1 opacity-10" />
        <div className="mt-8 flex space-x-8">
          {Array(stage)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="clickable h-4 w-4 rounded-full shadow-zen"
              />
            ))}
          {Array(3 - stage)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-4 w-4 rounded-full bg-white/10" />
            ))}
        </div>
      </div>
    </div>
  );
}
