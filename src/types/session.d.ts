export interface Session {
  user:
    | {
        id?: string | null | undefined;
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | null
    | undefined;
}
