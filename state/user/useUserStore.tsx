import { create } from "zustand";

interface StoreState {
  socials: {
    github: string;
    linkedin: string;
  };
  setSocials: (github: string, linkedin: string) => void;
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
}));

export default useUserStore;
