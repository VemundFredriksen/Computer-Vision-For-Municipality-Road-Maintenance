import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../shared/CloseButton';
import ObjectImage from '../shared/ObjectImage';
import EditForm from './EditForm';

const EditObjectComponent = (
  {
    object,
    onCloseClick,
    handleDelete,
    handleUpdate,
    handleImageClick,
    imageWithBoxes,
  },
) => (
  <div className="info_bar__wrapper">
    <CloseButton onClick={onCloseClick} />
    <div>
      <ObjectImage src={imageWithBoxes} id={object.filename} onClick={handleImageClick} />
    </div>
    <div className="info_table__wrapper">
      <EditForm
        id={object._id}
        type={object.type}
        fixed={object.fixed}
        approved={object.approved}
        priority={object.priority}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    </div>
  </div>
);

EditObjectComponent.propTypes = {
  object: PropTypes.objectOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fixed: PropTypes.bool.isRequired,
    priority: PropTypes.number,
    imagePath: PropTypes.string,
  })).isRequired,
  onCloseClick: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  imageWithBoxes: PropTypes.string.isRequired,
};

export default EditObjectComponent;
