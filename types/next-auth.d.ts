import { DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultUser & {
      id: string;
      name: string;
      image: string;
      createdAt: string;
      updatedAt: string;
      username: string;
    };
  }
}
