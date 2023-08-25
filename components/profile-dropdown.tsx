"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";

export function ProfileDropdown() {
  const { user: userInfo } = useUser() as any;
  const { openUserProfile } = useClerk();
  const initials =
    userInfo?.firstName?.toString()[0] + "" + userInfo?.lastName?.toString()[0];

  let fullName = "";
  if (userInfo) {
    if (userInfo.firstName && userInfo.lastName) {
      fullName = userInfo.firstName + " " + userInfo.lastName;
    } else if (userInfo.firstName && !userInfo.lastName) {
      fullName = userInfo.firstName;
    } else if (!userInfo.firstName && userInfo.lastName) {
      fullName = userInfo.lastName;
    }
  }

  if (!userInfo) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar>
          <AvatarImage src={userInfo.imageUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            {fullName != "" && (
              <span className="text-base text-card-foreground">{fullName}</span>
            )}
            <span className="text-muted-foreground">{userInfo.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <button
            onClick={() => {
              openUserProfile();
            }}
            className="flex items-center gap-2"
          >
            {/* <Icons.account className="w-4 h-4" /> */}
            <span>My Account</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton>
            <div className="flex items-center gap-2">
              {/* <Icons.signOut className="w-4 h-4" /> */}
              <span>Sign Out</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
