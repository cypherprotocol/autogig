"use client";

import { UploadStyled } from "@/components/upload-styled";
import useUserStore from "@/state/user/useUserStore";
import { motion } from "framer-motion";
import { Construction, FileText, Mailbox } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [dots, setDots] = useState(".");
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const socials = useUserStore((state) => state.socials);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        return prevDots.length >= 3 ? "." : prevDots + ".";
      });
    }, 500); // 500ms delay

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const [stage, setStage] = useState(2);

  const maxStage = 5;

  useEffect(() => {
    if (stage === maxStage - 1 && session) {
      console.log(session);
      (async function findGig() {
        const res = await fetch(
          "/api/gig?" +
            new URLSearchParams({
              twitter: session?.user?.name ?? "",
              github: socials.github,
              linkedin: socials.linkedin,
            })
        ).then(() => {
          setStage(maxStage);
          console.log("done");
        });
      })();
    }
  }, [stage, session]);

  useEffect(() => {
    if (session) {
      console.log(session);
      setStage(4);
    }
  }, [session]);

  return (
    <div>
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#00b1e9]">
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
                    Link your twitter
                  </p>
                  <motion.div
                    whileHover={{
                      scale: 1.05, // increased scale for a more pronounced effect
                    }}
                    whileTap={{
                      scale: 1, // increased scale for a more pronounced effect
                    }}
                    onClick={() => signIn("twitter")}
                    className="clickable flex h-[24rem] w-[24rem] cursor-pointer flex-col items-center justify-center rounded-full p-4 shadow-zen transition hover:shadow-zenny"
                  >
                    <p className="text-4xl font-medium text-white">Link</p>
                  </motion.div>
                </>
              );
            case 2:
              return (
                <>
                  <p className="mb-8 text-6xl font-medium text-white">
                    Link your Github
                  </p>
                  <motion.div
                    whileHover={{
                      scale: 1.05, // increased scale for a more pronounced effect
                    }}
                    whileTap={{
                      scale: 1, // increased scale for a more pronounced effect
                    }}
                    onClick={() => signIn("github")}
                    className="clickable flex h-[24rem] w-[24rem] cursor-pointer flex-col items-center justify-center rounded-full p-4 shadow-zen transition hover:shadow-zenny"
                  >
                    <p className="text-4xl font-medium text-white">Link</p>
                  </motion.div>
                </>
              );
            case 3:
              return <UploadStyled />;

            case 4:
              return (
                <p className="mb-8 text-6xl font-medium text-white">
                  Finding your job{dots}
                </p>
              );
            case 5:
              return (
                <>
                  <p className="mb-8 text-6xl font-medium text-white">
                    Message crafted!
                  </p>
                  <div className="rounded-lg bg-white p-4 shadow-zen">
                    <p className="text-2xl font-medium text-black">
                      Your message has been crafted and sent to the company.
                    </p>
                  </div>
                </>
              );
          }
        })()}
        {(() => {
          switch (stage) {
            case 3:
              return (
                <FileText className="absolute -bottom-16 -left-16 h-96 w-96 -rotate-12 stroke-white stroke-1 opacity-10" />
              );
            case 4:
              return (
                <Construction className="absolute -bottom-16 left-1/2 h-96 w-96 -translate-x-1/2 stroke-white stroke-1 opacity-10" />
              );

            case 5:
              return (
                <Mailbox className="absolute -bottom-32 -right-16 h-96 w-96 -translate-x-1/2 stroke-white stroke-1 opacity-10" />
              );
          }
        })()}
        {stage !== 0 && (
          <div className="absolute bottom-16 flex space-x-8">
            {Array(stage)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="clickable flex h-6 w-6 items-center justify-center rounded-full shadow-zen"
                >
                  <p className="text-xs text-white">{i + 1}</p>
                </div>
              ))}
            {Array(maxStage - stage)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10"
                >
                  <p className="text-xs text-white">{i + stage + 1}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
