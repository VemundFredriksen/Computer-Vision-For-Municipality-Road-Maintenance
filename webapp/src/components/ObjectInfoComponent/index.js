import React from 'react';
import PropTypes from 'prop-types';
import Button from '../shared/Button';
import CloseButton from '../shared/CloseButton';
import InfoTable from './InfoTable';
import ObjectImage from '../shared/ObjectImage';
import * as URLs from '../../utils/urls';

import './index.css';

const ObjectInfoComponent = (
  {
    object,
    onCloseClick,
    onEditClick,
    handleAddWOList,
    inWOList,
    handleRemoveWOList,
    handleDeleteWO,
    drawBox,
    imageWithBoxes,
    handleImageClick,
    error,
  },
) => {
  const determineOption = () => {
    if (object.responsible === 'statens vegvesen') {
      return <span>This object cannot be edited due to responsibility area</span>;
    }
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
      <CloseButton onClick={onCloseClick} />
      <p>{error}</p>
      <div>
        {imageWithBoxes ? (
          <ObjectImage src={imageWithBoxes} id={object.filename} onClick={handleImageClick} />
        ) : (
          <ObjectImage
            src={URLs.getImage(object.filename)}
            id={object.filename}
            crossOrigin="anonymous"
            drawBox={drawBox}
          />
        )}
      </div>
      <div className="info_table__wrapper">
        <InfoTable
          priority={object.priority}
          approved={object.approved}
          type={object.type}
          responsible={object.responsible}
          fixed={object.fixed}
        />
        <div>
          {object.responsible === 'trondheim kommune' ? <Button text="Edit" onClick={onEditClick} />
            : null}
          {determineOption()}
        </div>
      </div>
    </div>
  );
};

ObjectInfoComponent.propTypes = {
  object: PropTypes.objectOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fixed: PropTypes.bool.isRequired,
    priority: PropTypes.number.isRequired,
    imagePath: PropTypes.string.isRequired,
    responsible: PropTypes.string.isRequired,
  })).isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  drawBox: PropTypes.func.isRequired,
  imageWithBoxes: PropTypes.string,
  handleAddWOList: PropTypes.func.isRequired,
  inWOList: PropTypes.bool.isRequired,
  handleRemoveWOList: PropTypes.func.isRequired,
  handleDeleteWO: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  error: PropTypes.string,
};

ObjectInfoComponent.defaultProps = {
  imageWithBoxes: null,
  error: null,
};

export default ObjectInfoComponent;
