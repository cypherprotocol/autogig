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
}));

export default useUserStore;
