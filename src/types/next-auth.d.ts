// eslint-disable-next-line unused-imports/no-unused-imports
import { Session } from 'next-auth';

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}
