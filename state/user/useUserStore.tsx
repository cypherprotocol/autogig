import { PotentialJob } from "@/lib/types";
import { create } from "zustand";

export enum GigStages {
  Start,
  LinkTwitter,
  LinkGithub,
  UploadResume,
  FindJob,
  Message,
}

interface StoreState {
  socials: {
    github?: string;
    linkedin?: string;
  };
  setSocials: ({
    github,
    linkedin,
  }: {
    github?: string;
    linkedin?: string;
  }) => void;
  stage: GigStages;
  setStage: (stage: GigStages) => void;
  resume: string;
  setResume: (resume: string) => void;
  jobs: PotentialJob[];
  setJobs: (jobs: PotentialJob[]) => void;
}

const useUserStore = create<StoreState>((set) => ({
  socials: {},
  setSocials: ({ github, linkedin }) =>
    set((state) => ({
      socials: {
        github,
        linkedin,
      },
    })),
  stage: GigStages.Start,
  setStage: (stage) =>
    set((state) => ({
      stage,
    })),
  resume: "",
  setResume: (resume) =>
    set((state) => ({
      resume,
    })),
  jobs: [],
  setJobs: (jobs) =>
    set((state) => ({
      jobs,
    })),
}));

export default useUserStore;
