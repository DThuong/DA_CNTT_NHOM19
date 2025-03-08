import React, { memo } from "react";
import clsx from "clsx";

const InputForm = ({
  label,
  name,
  type = "text",
  register,
  error,
  defaultValue,
  rules,
  placeholder,
  style,
  textarea
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full p-2 border rounded-md"
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full p-2 border rounded-md"
        />
      )}
      {error && <p className="text-red-500 text-xs italic">{error.message}</p>}
    </div>
  );
};

export default memo(InputForm);
