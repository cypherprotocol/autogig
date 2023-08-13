import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
      <SignUp />
    </div>
  );
}
