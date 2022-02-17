import React from 'react';

import {
  render,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlAttributes,
  MjmlAll,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlDivider,
  MjmlImage,
  MjmlButton,
} from 'mjml-react';

export const verificationEmail = (
  email: string,
  url: string,
  expires: Date
) => ({
  subject: `Sign in to ${new URL(url).host}`,
  html: render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>Audrey Asked | Email Verification</MjmlTitle>
        <MjmlAttributes>
          <MjmlAll fontFamily="Ubuntu, Lato, sans-serif" />
        </MjmlAttributes>
      </MjmlHead>
      <MjmlBody>
        <MjmlSection backgroundColor="#FDF2F8">
          <MjmlColumn width={600}>
            <MjmlText align="center" fontSize={40} fontWeight={600}>
              Audrey Asked
            </MjmlText>
            <MjmlText align="center" fontSize={16} paddingTop={0}>
              A poll website inspired by Audrey!
            </MjmlText>

            <MjmlDivider
              borderWidth={1}
              borderStyle="solid"
              borderColor="#D1D5DB"
            />
            <MjmlImage src="https://audreyasked.com/assets/banner.png" />
            <MjmlDivider
              borderWidth={1}
              borderStyle="solid"
              borderColor="#D1D5DB"
            />

            <MjmlText align="center" fontSize={18}>
              Please sign in as{' '}
              {React.createElement('strong', {
                dangerouslySetInnerHTML: {
                  __html: email.replace(/\./g, '&#8203;.'),
                },
                style: { color: '#EC4899' },
              })}{' '}
              below.
            </MjmlText>
            <MjmlButton
              backgroundColor="#F472B6"
              fontSize={16}
              fontWeight={600}
              color="#FFFFFF"
              href={url}
            >
              Sign in
            </MjmlButton>

            <MjmlText align="center" fontSize={16} color="#1F2937">
              Your sign in link will expire on {expires.toUTCString()}.
            </MjmlText>
            <MjmlDivider
              borderWidth={1}
              borderStyle="solid"
              borderColor="#D1D5DB"
            />
            <MjmlText align="center" fontSize={16} color="#4B5563">
              If you did not request this email, you can safely ignore it.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  ).html,
  text: `Sign in to Audrey Asked below.\n${url}\n\n`,
});
