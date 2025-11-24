import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '../components/ui/button';

export interface ButtonProps extends Omit<ShadcnButtonProps, 'children'> {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** Button contents */
  label: string;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'default',
  variant,
  label,
  ...props
}: ButtonProps) => {
  // Map primary prop to variant for backwards compatibility
  const buttonVariant = variant || (primary ? 'default' : 'secondary');
  
  return (
    <ShadcnButton
      variant={buttonVariant}
      size={size}
      {...props}
    >
      {label}
    </ShadcnButton>
  );
};
