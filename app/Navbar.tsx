"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4">
      <Link href="/">
        <div className="flex cursor-pointer items-center">
          <Image
            src="/fullcolor-retro-dudes-laptop.svg"
            width={32}
            height={32}
            className="mr-2"
            alt=""
          />
          <p className="font-medium">Autogig</p>
        </div>
      </Link>
      <div className="flex flex-row space-x-4">
        <Link href="/find">
          <Button className="bg-[#ffc434] text-primary hover:bg-[#fed46f]">
            Find jobs
          </Button>
        </Link>
        {/* <Link href="/pending">
          <Button variant={"secondary"}>
            <Briefcase className="mr-2 h-4 w-4" />
            My gigs
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant={"outline"}>Look for talent</Button>
        </Link> */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default Navbar;
