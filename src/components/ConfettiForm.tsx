import React, { ComponentPropsWithRef, forwardRef, useCallback } from 'react';

import confetti from 'canvas-confetti';

type ConfettiFormProps = ComponentPropsWithRef<'form'>;

const ConfettiForm = forwardRef<HTMLFormElement, ConfettiFormProps>(
  ({ children, onSubmit, ...rest }, ref) => {
    const onSubmitWithConfetti = useCallback(
      (event) => {
        event.preventDefault();

        if (onSubmit !== undefined) {
          onSubmit(event);
        }

        for (let y = 0; y <= 1; y++) {
          for (let x = 0; x <= 1; x++) {
            confetti({
              angle: 315 - 270 * y - 90 * x + 180 * x * y,
              particleCount: 100,
              spread: 90,
              origin: { x, y },
            });
          }
        }
      },
      [onSubmit]
    );
    return (
      <form ref={ref} onSubmit={onSubmitWithConfetti} {...rest}>
        {children}
      </form>
    );
  }
);

export default ConfettiForm;
