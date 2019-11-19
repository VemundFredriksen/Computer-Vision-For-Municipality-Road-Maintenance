import React from 'react';
import PropTypes from 'prop-types';

<<<<<<< HEAD
const Select = (
  {
    options,
    label,
=======
import './Select.css';

const Select = (
  {
    options,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    value,
    name,
    handleChange,
  },
) => (
<<<<<<< HEAD
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
=======
  <select value={value} name={name} onChange={handleChange}>
    {options.map((opt) => (
      <option value={opt}>
        {opt}
      </option>
    ))}
  </select>
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
);

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
<<<<<<< HEAD
  label: PropTypes.string.isRequired,
=======
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Select;
