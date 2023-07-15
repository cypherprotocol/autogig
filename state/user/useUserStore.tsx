import { PotentialJob } from "@/lib/types";
import { create } from "zustand";

export enum GigStages {
  Start,
  // LinkTwitter,
  // LinkGithub,
  UploadResume,
  FindJob,
  Message,
}

interface StoreState {
  github?: string;
  setGithub: (github: string) => void;
  linkedin?: string;
  setLinkedin: (linkedin: string) => void;
  stage: GigStages;
  setStage: (stage: GigStages) => void;
  resume?: string;
  setResume: (resume: string) => void;
  portfolio?: string;
  setPortfolio: (resume: string) => void;
  jobs: PotentialJob[];
  setJobs: (jobs: PotentialJob[]) => void;
}

const useUserStore = create<StoreState>((set) => ({
  github: undefined,
  setGithub: (github) =>
    set((state) => ({
      github,
    })),
  linkedin: undefined,
  setLinkedin: (linkedin) =>
    set((state) => ({
      linkedin,
    })),
  stage: GigStages.Start,
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
