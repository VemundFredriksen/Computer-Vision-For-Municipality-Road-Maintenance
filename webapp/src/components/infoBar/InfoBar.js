import React from 'react';
import PropTypes from 'prop-types';
import Button from '../shared/button/Button';
import EditForm from '../editForm/EditForm';

import './InfoBar.css';

const InfoBar = (
  {
    object,
    edit,
    onCloseClick,
    onEditClick,
    handleDelete,
    handleAddWOList,
    inWOList,
    handleRemoveWOList,
    handleDeleteWO,
  },
) => {
  const determine = () => {
    if (object.work_order) {
      return <Button text="Delete work order" onClick={handleDeleteWO} />;
    }
    if (inWOList) {
      return <Button text="Remove from list" onClick={handleRemoveWOList} />;
    }
    if (object.approved && !object.fixed) {
      return <Button text="Add to work order list" onClick={handleAddWOList} />;
    }
    return <span>Object needs to be approved and not fixed to add to work orders</span>;
  };
  return (
    <div className="info_bar__wrapper">
      <span className="close_icon__container">
        <button type="button" className="close_button" onClick={onCloseClick}>
          <CloseIcon />
        </button>
      </span>
      <div className="image__container">
        <img
          src={`https://api.dewp.eu.org/get-image?filename=${object.filename}`}
          alt="detected road object"
          className="object_image"
        />
      </div>
      {
        edit ? (
          <EditForm
            id={object._id}
            type={object.type}
            status={object.fixed}
            priority={object.priority}
            approved={object.approved}
            handleDelete={handleDelete}
          />
        ) : (
          <div className="info__container">
            <span className="object_info">
              {`Type: ${object.type}`}
            </span>
            <span className="object_info">
              {`Fixed: ${object.fixed ? 'yes' : 'no'}`}
            </span>
            <span className="object_info">
              {`Priority: ${object.priority}`}
            </span>
            <span className="object_info">
              {`Approved: ${object.approved ? 'yes' : 'no'}`}
            </span>
            <Button text="Edit" onClick={onEditClick} />
            {determine()}
          </div>
        )
      }
    </div>
  );
};

InfoBar.propTypes = {
  object: PropTypes.objectOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fixed: PropTypes.bool.isRequired,
    priority: PropTypes.number,
    imagePath: PropTypes.string,
  })).isRequired,
  edit: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func,
  onEditClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddWOList: PropTypes.func.isRequired,
  inWOList: PropTypes.bool.isRequired,
  handleRemoveWOList: PropTypes.func.isRequired,
  handleDeleteWO: PropTypes.func.isRequired,
};

InfoBar.defaultProps = {
  onCloseClick: null,
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

export default InfoBar;
