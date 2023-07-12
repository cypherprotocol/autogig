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
  job: {
    name: string;
    link: string;
    description: string;
  };
  setJob: (name: string, link: string, description: string) => void;
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
  job: {
    name: "",
    link: "",
    description: "",
  },
  setJob: (name, link, description) =>
    set((state) => ({
      job: {
        name,
        link,
        description,
      },
    })),
}));

export default useUserStore;
