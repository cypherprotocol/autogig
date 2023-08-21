"use client";
import { SignIn, useClerk } from "@clerk/nextjs";
import { CheckSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useFeatureFlagVariantKey, usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function Page() {
  const locale = useLocale();
  const { client } = useClerk();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("sign-in");
  }, [posthog]);

  const variant = useFeatureFlagVariantKey("sign-in-copy");
  const t = useTranslations("SignIn");

  return (
    <div className="relative z-10 flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      <div className="absolute h-full w-full">
        <Image src="/images/bg.svg" fill className="object-cover" alt="" />
      </div>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex h-[36rem] w-full max-w-4xl rounded-md p-1">
          <div className="mr-8 hidden h-full w-96 grow flex-col rounded-md rounded-r-none p-8 md:flex">
            <Image
              src="/logo_2.svg"
              width={80}
              height={32}
              className="mb-8 ml-6 object-contain"
              alt=""
            />
            {/* <div className="mb-8 h-[36rem] w-full overflow-hidden rounded-md bg-slate-800">
              <video
                autoPlay
                loop
                muted
                playsInline
                src="https://res.cloudinary.com/autogig/video/upload/v1691369376/Autogig-v2-web_asjahe.mp4"
                className="h-full w-full object-cover"
              />
            </div> */}
            <div className="flex flex-col space-y-4 rounded-md p-4">
              <div className="flex items-start">
                <CheckSquare className="mr-2 h-4 w-4 shrink-0 text-[#5c5bee]" />
                <div className="flex flex-col">
                  <p className="font-medium text-[#5c5bee]">
                    {t("bullet-1.title", { variant })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("bullet-1.description", { variant })}
                  </p>
                </div>
              </div>
              <div className="flex items-start text-[#5c5bee]">
                <CheckSquare className="mr-2 h-4 w-4 shrink-0 text-[#5c5bee]" />
                <div className="flex flex-col">
                  <p className="font-medium">
                    {t("bullet-2.title", { variant })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("bullet-2.description", { variant })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckSquare className="mr-2 h-4 w-4 shrink-0 text-[#5c5bee]" />
                <div className="flex flex-col">
                  <p className="font-medium text-[#5c5bee]">
                    {t("bullet-3.title", { variant })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("bullet-3.description", { variant })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <SignIn
            routing="path"
            path={locale === "en" ? "/sign-in" : `/${locale}/sign-in`}
            appearance={{
              elements: {
                card: "rounded-md h-full mr-0",
                formButtonPrimary: "bg-[#5c5bee]",
                footerActionLink: "text-[#5c5bee]",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
