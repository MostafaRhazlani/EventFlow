import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        className={`input-field ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
