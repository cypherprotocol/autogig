"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Bot, PackageSearch } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <Link href="/">
        <div className="flex cursor-pointer items-center">
          <Bot className="mr-2 h-6 w-6" />
          {/* <p className="text-xs uppercase tracking-widest">Autogig</p> */}
        </div>
      </Link>
      <div className="flex flex-row space-x-4">
        <Link href="/find">
          <Button>
            <PackageSearch className="mr-2 h-4 w-4" />
            Find gigs
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
