'use client';

import ErrorTemplate from '@/components/feedback/ErrorTemplate';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <ErrorTemplate
      errorMessage={error.message || 'Something went wrong. Please try again later.'}
      reset={reset}
    />
  );
};

export default Error;
