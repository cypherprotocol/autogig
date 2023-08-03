import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs";
import { Coins, Link, Target, Twitter } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function PendingGigs() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("applicant", user.id)
    .eq("is_approved", true);

  let pendingGigs: any[] = [];

  if (data) {
    const ids = data.map((chat) => chat.gig);
    const gig = await supabase
      .from("gigs")
      .select(
        "title, description, skills, url, compensation, company_name, company_logo, contact"
      )
      .in("id", ids);

    if (gig.data) {
      for (let i = 0; i < gig.data.length; i++) {
        pendingGigs.push({
          ...gig.data[i],
          compensation: data[i].compensation,
        });
      }
    }
  }

  console.log(pendingGigs);

  return (
    <>
      <div className="mb-8 flex w-full items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your gig search.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* <Input
            placeholder="Filter tasks..."
            className="h-8 w-[150px] lg:w-[250px]"
          /> */}
          {/* {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )} */}
          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-1 p-2">
              {pendingGigs?.map((gig, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <Button
                      key={`${gig.title}-${i}`}
                      variant="ghost"
                      className="w-full justify-start font-normal"
                    >
                      <Target className="mr-2 h-4 w-4" />
                      {gig.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <div className="relative h-12 w-12">
                        <Image
                          src={gig.company_logo ?? "/robot.png"}
                          fill
                          className="object-contain"
                          alt=""
                        />
                      </div>
                      <DialogTitle>{gig.title}</DialogTitle>
                      <DialogDescription>
                        {gig.description.slice(0, 500)}
                      </DialogDescription>
                    </DialogHeader>
                    <Alert>
                      <Coins className="h-4 w-4" />
                      <AlertTitle>Compensation</AlertTitle>
                      <AlertDescription>{gig.compensation}</AlertDescription>
                    </Alert>
                    <div className="flex space-x-4">
                      <a href={gig.url} target={"_blank"} rel="noreferrer">
                        <Button>
                          <Link className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </a>
                      <a
                        target={"_blank"}
                        href={`https://twitter.com/${gig.contact}`}
                        rel="noreferrer"
                      >
                        <Button variant={"secondary"}>
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </Button>
                      </a>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
