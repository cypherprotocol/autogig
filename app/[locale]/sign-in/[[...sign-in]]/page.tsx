import { SignIn } from "@clerk/nextjs";
import { useLocale } from "next-intl";

export default function Page() {
  const locale = useLocale();

  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
      <SignIn
        routing="path"
        path={locale === "en" ? "/sign-in" : `/${locale}/sign-in`}
      />
    </div>
  );
}
