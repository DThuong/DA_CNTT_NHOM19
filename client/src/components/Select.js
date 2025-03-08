import React, { memo } from 'react'
import clsx from 'clsx'

const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  rules,
  style,
  fullwidth,
  defaultValue
}) => {
  return (
    <div
      className={clsx('select-container', {
        'w-full': fullwidth,
        'error': errors?.[id]
      })}
      style={style}
    >
      {label && <label htmlFor={id} className="select-label">{label}</label>}
      <select
        id={id}
        {...register(id, { rules })}
        defaultValue={defaultValue}
        className={clsx('select-input', {
          'error-input': errors?.[id]
        })}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors?.[id] && <span className="error-message">{errors[id].message}</span>}
    </div>
  )
}

export default memo(Select)
