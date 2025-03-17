'use client';

import ErrorTemplate from '@/components/feedback/ErrorTemplate';

const ImagesError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <ErrorTemplate
      errorMessage={error.message || 'It was not possible to load your images. Try again later.'}
      reset={reset}
    />
  );
};

export default ImagesError;
