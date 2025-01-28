import React, { memo } from "react";

const Button = ({
  name,
  handleOnClick,
  style,
  iconBefore,
  iconAfter,
  type = "button",
}) => (
  <button
    type={type}
    className={style || "px-4 py-2 rounded-md text-white bg-main text-semibold w-full outline-none"}
    onClick={() => {
      handleOnClick && handleOnClick();
    }}
  >
    {iconBefore}
    <span>{name}</span>
    {iconAfter}
  </button>
);

export default memo(Button);
