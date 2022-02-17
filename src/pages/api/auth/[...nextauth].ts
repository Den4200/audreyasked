import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

import prisma from '@/lib/prisma';
import { verificationEmail } from '@/utils/email';

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
        sendVerificationRequest: async ({
          identifier: email,
          url,
          expires,
          provider: { server, from },
        }) => {
          const transport = nodemailer.createTransport(server);
          await transport.sendMail({
            to: email,
            from,
            ...verificationEmail(email, url, expires),
          });
        },
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
    pages: {
      signIn: '/auth/signin',
      verifyRequest: '/auth/verify-request',
    },
  });
export default authHandler;
