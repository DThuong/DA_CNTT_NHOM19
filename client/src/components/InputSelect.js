import React from 'react';

const InputSelect = ({ value, changevalue, option }) => {
  return (
    <select
      className="form-select bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-main"
      value={value}
      onChange={e => changevalue(e.target.value)}
    >
      <option value="" className="text-gray-500">
        --- Choose Filter ---
      </option>
      {option?.map((el) => (
        <option key={el.id} value={el.value}>
          {el.text}
        </option>
      ))}
    </select>
  );
};

export default InputSelect;
