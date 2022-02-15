import ButtonLink from '@/components/link/ButtonLink';
import Main from '@/templates/Main';

const VerifyRequest = () => (
  <Main title="Verify email" description="Check your email.">
    <div className="flex justify-center mt-2">
      <div className="flex flex-col items-center border-2 border-pink-300 rounded bg-white p-4 space-y-4">
        <h2 className="text-2xl font-medium text-center">Check your email</h2>
        <p>A sign in link has been sent to your email address.</p>

        <ButtonLink href="/">Go back home</ButtonLink>
      </div>
    </div>
  </Main>
);

export default VerifyRequest;
