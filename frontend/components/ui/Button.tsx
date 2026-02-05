import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
}

export function Button({ 
  children, 
  className = "", 
  variant = "primary",  
  ...props 
}: ButtonProps) {
  
  const baseStyles = "transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "btn-primary", // Defined in globals.css
    outline: "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button className={combinedClassName.trim()} {...props}>
      {children}
    </button>
  );
}
