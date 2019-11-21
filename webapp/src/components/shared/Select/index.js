import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const Select = (
  {
    options,
    value,
    name,
    handleChange,
  },
) => (
  <select value={value} name={name} onChange={handleChange}>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Select;
