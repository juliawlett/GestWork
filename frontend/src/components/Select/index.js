import React from 'react';

function Select({ className, label, options, name, value, handleChange }) {
  return (
    <div className="mb-3">
      <label className="form-label w-50">{label}</label>
      <select
        className={className}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
