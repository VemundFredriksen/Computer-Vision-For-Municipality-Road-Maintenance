import React from 'react';
import PropTypes from 'prop-types';

const Select = (
  {
    options,
    label,
    value,
    name,
    handleChange,
  },
) => (
  <label>
    {label}
    <select value={value} name={name} onChange={handleChange}>
      {options.map((opt) => (
        <option value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Select;
