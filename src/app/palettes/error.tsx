'use client';

import ErrorTemplate from '@/components/feedback/ErrorTemplate';

const PalettesError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <ErrorTemplate
      errorMessage={error.message || 'It was not possible to load your palettes. Try again later.'}
      reset={reset}
    />
  );
};

export default PalettesError;
