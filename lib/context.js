import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  username: null,
  email: false,
  displayName: null,
  photoURL: null,
  desc: null,
});

export const HeightContext = createContext({
  height: null,
});
