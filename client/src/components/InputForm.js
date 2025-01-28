import React from "react";

const InputForm = ({
  label,
  name,
  type = "text",
  register,
  error,
  defaultValue,
  rules,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        defaultValue={defaultValue}
        {...register(name, rules)} // Áp dụng quy tắc validate
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="text-red-500 text-xs italic">{error.message}</p>}
    </div>
  );
};

export default InputForm;
