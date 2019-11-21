import React from 'react';
import PropTypes from 'prop-types';

const CloseButton = ({ onClick }) => (
  <span className="close_icon__container">
    <button type="button" className="close_button" onClick={onClick}>
      <CloseIcon />
    </button>
  </span>
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142
      1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12
      10.5858z"
    />
  </svg>
);

export default CloseButton;
