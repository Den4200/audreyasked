declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    EMAIL_SERVER?: string;
    EMAIL_FROM?: string;
    NEXTAUTH_URL: string;
    SECRET: string;
    PORT: string;
  }
}
