import { formSchema } from "@/app/find/upload";
import { JobData } from "@/lib/types";
import { z } from "zod";
import { create } from "zustand";

export enum BotStages {
  Start,
  // LinkTwitter,
  // LinkGithub,
  UploadResume,
  FindJob,
  Message,
}

interface StoreState {
  githubForm?: z.infer<typeof formSchema>;
  setGithubForm: (githubForm: z.infer<typeof formSchema>) => void;
  linkedin?: string;
  setLinkedin: (linkedin: string) => void;
  stage: BotStages;
  setStage: (stage: BotStages) => void;
  resume?: File;
  setResume: (resume: File) => void;
  portfolio?: string;
  setPortfolio: (resume: string) => void;
  jobs: JobData[];
  setJobs: (jobs: JobData[]) => void;
}

const useUserStore = create<StoreState>((set) => ({
  github: undefined,
  setGithubForm: (githubForm) =>
    set((state) => ({
      githubForm,
    })),
  linkedin: undefined,
  setLinkedin: (linkedin) =>
    set((state) => ({
      linkedin,
    })),
  stage: BotStages.UploadResume,
  setStage: (stage) =>
    set((state) => ({
      stage,
    })),
  resume: undefined,
  setResume: (resume) =>
    set((state) => ({
      resume,
    })),
  portfolio: undefined,
  setPortfolio: (portfolio) =>
    set((state) => ({
      portfolio,
    })),
  jobs: [],
  setJobs: (jobs) =>
    set((state) => ({
      jobs,
    })),
}));

export default useUserStore;
