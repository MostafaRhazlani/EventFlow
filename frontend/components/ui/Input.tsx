import React, { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

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
