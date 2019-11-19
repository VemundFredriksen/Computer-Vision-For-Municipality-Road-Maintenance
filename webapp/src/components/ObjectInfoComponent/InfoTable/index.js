import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const InfoTable = (
  {
    type,
    fixed,
    priority,
    approved,
    responsible,
  },
) => (
  <table>
    <tbody>
      <tr>
        <td>Type:</td>
        <td>{type}</td>
      </tr>
      <tr>
        <td>Fixed:</td>
        <td>{fixed ? 'yes' : 'no'}</td>
      </tr>
      <tr>
        <td>Priority:</td>
        <td>{priority}</td>
      </tr>
      <tr>
        <td>Approved:</td>
        <td>{approved ? 'yes' : 'no'}</td>
      </tr>
      <tr>
        <td>Responsible:</td>
        <td>{responsible}</td>
      </tr>
    </tbody>
  </table>
);

InfoTable.propTypes = {
  type: PropTypes.string.isRequired,
  fixed: PropTypes.bool.isRequired,
  priority: PropTypes.number.isRequired,
  approved: PropTypes.bool.isRequired,
  responsible: PropTypes.string.isRequired,
};

export default InfoTable;
