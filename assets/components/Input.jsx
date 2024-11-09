import React from "react";

function Input({ type, placeholder, className, value, onChange }) {
  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;
