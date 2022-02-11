declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    NEXTAUTH_URL: string;
    SECRET: string;
    PORT: string;
  }
}
