import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useFeatureFlagVariantKey, usePostHog } from "posthog-js/react";

export default function Offer() {
  const t = useTranslations("Home");
  const posthog = usePostHog();

  const variant = useFeatureFlagVariantKey("home-copy");

  return (
    <div className="w-full max-w-5xl grow flex-col items-center justify-center px-4 py-24 md:flex-row md:justify-start md:py-28">
      <div className="mb-16 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div className="relative flex w-full flex-col items-start md:flex-row md:items-center">
          <div className="mr-0 flex w-full flex-col md:mr-8">
            <h1 className="mb-4 scroll-m-20 font-wagmi text-5xl font-extrabold tracking-tight lg:text-7xl">
              {t("title")}
              <br />
              <span className="text-[#5c5bee]">{t("title-2")}</span>
            </h1>
            <p className="mb-4 text-muted-foreground md:mb-0 md:text-xl">
              {variant === "test" ? (
                <>
                  Don't have time to send 700 applications but want to test the
                  waters? Handle everything job search with Autogig.
                </>
              ) : (
                <>
                  Tired of applying to 700+ jobs and not hearing back?
                  <br />
                  We've been there too. Handle everything job search with
                  Autogig.
                </>
              )}
              <span className="font-medium text-[#5c5bee]">
                {" "}
                Free for the first 100 interviews.
              </span>
            </p>
            {
              <Link href={"/find"} className="mt-8 h-16 w-48">
                <Button
                  onClick={() => {
                    posthog.capture("cta");
                  }}
                  className="h-full w-full bg-[#ffc434] text-primary hover:bg-[#ffc43495] dark:text-black"
                >
                  Try it free!
                </Button>
              </Link>
            }
          </div>
          <div className="relative hidden h-36 w-36 shrink-0 md:block md:h-80 md:w-80">
            <Image
              src="/fullcolor-retro-dudes-laptop.svg"
              fill
              className="object-contain"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex h-full w-full">
        <div className="h-[36rem] w-full overflow-hidden rounded-md bg-slate-800">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="https://res.cloudinary.com/autogig/video/upload/v1692686209/Autogig-site_c4lspg.mp4"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
