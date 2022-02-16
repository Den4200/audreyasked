import { useEffect } from 'react';

import { signIn, useSession } from 'next-auth/react';

import Button from '@/components/Button';
import ConfettiForm from '@/components/ConfettiForm';
import Loading from '@/components/Loading';
import TextInput from '@/components/TextInput';
import useUser from '@/hooks/useUser';
import Main from '@/templates/Main';

const Settings = () => {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated: signIn,
  });
  const { user, setUser, setUserId, updateUser } = useUser();

  useEffect(() => {
    if (session) {
      setUserId(session.user.id);
    }
  }, [session, setUserId]);

  if (status === 'loading' || !session || !user) {
    return <Loading />;
  }

  return (
    <Main title="Settings" description="Update your account settings.">
      <div className="grid grid-cols-2 border-2 border-pink-300 bg-white rounded p-4">
        <img
          className="w-40 mx-auto rounded-full border-4 border-pink-300 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          src={user.image || undefined}
          alt=""
        />
        <div className="w-full">
          <h2 className="text-2xl text-center font-semibold">User Profile</h2>
          <hr className="my-2" />
          <div className="space-y-4 flex flex-col items-center">
            <fieldset className="w-11/12 border-2 border-pink-300 rounded">
              <legend className="text-pink-400 font-semibold ml-1 -mb-3 px-1 pb-1">
                Name
              </legend>
              <TextInput
                className="w-full pl-2 border-0 focus:ring-0 bg-transparent"
                value={user.name}
                onChange={(event) =>
                  setUser({ ...user, name: event.target.value })
                }
              />
            </fieldset>
            <ConfettiForm onSubmit={updateUser}>
              <Button>Save Profile</Button>
            </ConfettiForm>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Settings;
