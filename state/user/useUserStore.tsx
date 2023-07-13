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
    logo: string;
    link: string;
    title: string;
  };
  setJob: (name: string, logo: string, link: string, title: string) => void;
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
    logo: "",
    link: "",
    title: "",
  },
  setJob: (name, logo, link, title) =>
    set((state) => ({
      job: {
        name,
        logo,
        link,
        title,
      },
    })),
}));

export default useUserStore;
