import React from "react";
import "./index.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled = false }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
