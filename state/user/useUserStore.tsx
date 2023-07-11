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
    github: string;
    linkedin: string;
  };
  setSocials: (github: string, linkedin: string) => void;
  stage: GigStages;
  setStage: (stage: GigStages) => void;
  resume: string;
  setResume: (resume: string) => void;
}

const useUserStore = create<StoreState>((set) => ({
  socials: {
    github: "",
    linkedin: "",
  },
  setSocials: (github, linkedin) =>
    set((state) => ({
      socials: {
        github,
        linkedin,
      },
    })),
  stage: 0,
  setStage: (stage) =>
    set((state) => ({
      stage,
    })),
  resume: "",
  setResume: (resume) =>
    set((state) => ({
      resume,
    })),
}));

export default useUserStore;
