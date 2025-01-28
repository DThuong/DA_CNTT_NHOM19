import React from "react";

const InputFields = ({ value, setValue, nameKey, type }) => {
  const handleChange = (e) => {
    const normalizedKey = nameKey.toLowerCase().replace(" ", "");
    setValue((prev) => ({
      ...prev,
      [normalizedKey]: e.target.value,
    }));
  };

  const formattedNameKey = nameKey.slice(0, 1).toUpperCase() + nameKey.slice(1);

  return (
    <div className="w-full relative flex flex-col mb-2">
      {value && (
        <label
          htmlFor={nameKey}
          className="text-[10px] absolute top-[-8px] left-[12px] bg-white px-1 animate-slide-top-sm"
        >
          {formattedNameKey}
        </label>
      )}
      <input
        id={nameKey}
        type={type || "text"}
        className="px-4 py-2 rounded-md placeholder:text-sm placeholder:italic border w-full my-2"
        placeholder={formattedNameKey}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputFields;
