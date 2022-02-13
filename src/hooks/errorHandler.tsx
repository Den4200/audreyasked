import { createContext, ReactNode, useContext, useState } from 'react';

import ax from 'axios';
import ErrorPage from 'next/error';

type Error = {
  status: number;
  message: string;
};

type ErrorHandlerContextType = {
  error: Error | null;
  setError: (error: Error) => void;
};

type ErrorHandlerProviderProps = {
  children: ReactNode;
};

const ErrorHandlerContext = createContext<ErrorHandlerContextType>(undefined!);

export const ErrorHandlerProvider = (props: ErrorHandlerProviderProps) => {
  const [error, setError] = useState<Error | null>(null);

  const setGenericError = (err: any) => {
    if (ax.isAxiosError(err)) {
      switch (err.response?.status) {
        case 404: {
          setError({ status: 404, message: 'This page could not be found' });
          break;
        }

        default:
          break;
      }
    } else if (
      typeof err.status === 'number' &&
      typeof err.message === 'string'
    ) {
      setError(err as Error);
    }
  };

  return (
    <ErrorHandlerContext.Provider value={{ error, setError: setGenericError }}>
      {error ? (
        <ErrorPage statusCode={error.status} title={error.message} />
      ) : (
        props.children
      )}
    </ErrorHandlerContext.Provider>
  );
};

export const useErrorHandler = () => useContext(ErrorHandlerContext);
