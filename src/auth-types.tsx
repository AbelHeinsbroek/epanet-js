import { Plan } from "./user-plan";
import { Locale } from "./infra/i18n/locale";

export type User = {
  id: string | null;
  email: string;
  firstName?: string;
  lastName?: string;
  plan: Plan;
  getLocale?: () => Locale | undefined;
  setLocale?: (locale: Locale) => Promise<void>;
};

export const nullUser: User = {
  id: null,
  email: "",
  firstName: undefined,
  lastName: undefined,
  plan: "free",
  getLocale: undefined,
  setLocale: undefined,
};

export type UseAuthHook = () => {
  isLoaded: boolean;
  isSignedIn?: boolean;
  userId: string | null | undefined;
  user: User;
  signOut: ({ redirectUrl }: { redirectUrl?: string }) => void;
};
