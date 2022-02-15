import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';

import prisma from '@/lib/prisma';

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      Discord({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      }),
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
    callbacks: {
      session: async ({ session, user }) => {
        session.user.id = user.id; // eslint-disable-line no-param-reassign
        return Promise.resolve(session);
      },
    },
  });
export default authHandler;
