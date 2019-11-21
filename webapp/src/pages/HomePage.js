import React from 'react';
import isSubset from 'is-subset';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import ObjectInfoComponent from '../components/ObjectInfoComponent';
import EditObjectComponent from '../components/EditObjectComponent';
import FilterComponent from '../components/FilterComponent';
import Button from '../components/shared/Button';
import MarkerColors from '../components/MarkerColors';
import ObjectImage from '../components/shared/ObjectImage';
import * as URLs from '../utils/urls';

import './HomePage.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      objects: [],
      loadError: null,
      currentObject: null,
      edit: false,
      filters: null,
      workOrders: [],
      imageWithBoxes: null,
      redirect: false,
      showImage: false,
      error: null,
    };
  }

  componentDidMount() {
    fetch(URLs.getAllObjects)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          hasLoaded: true,
          objects: responseJson,
        });
      })
      .catch(() => {
        this.setState({
          hasLoaded: true,
          loadError: 'Not able to load objects',
        });
      });
  }

  handleMarkerClick = (id) => {
    const {
      objects,
      currentObject,
      imageWithBoxes,
    } = this.state;
    const object = objects.filter((obj) => obj._id === id);
    this.setState({
      imageWithBoxes: currentObject === object[0] ? imageWithBoxes : null,
      currentObject: object[0],
      edit: false,
      error: null,
    });
  };

  handleCloseClick = () => {
    this.setState({
      currentObject: null,
      edit: false,
      imageWithBoxes: null,
      error: null,
    });
  };

  handleImageClick = () => {
    this.setState((prevState) => ({
      showImage: !prevState.showImage,
      error: null,
    }));
  };

  handleEditClick = () => {
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.setState({
        edit: true,
        error: null,
      });
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  onFilter = (filters) => {
    this.setState({
      filters,
    });
  };

  onFilterReset = () => {
    this.setState({
      filters: null,
    });
  };

  handleUpdate = (id, body) => {
    fetch(URLs.updateObjectById(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(() => {
        this.getObjectById(id);
      })
      .catch(() => {
        this.setState({
          error: 'Could not update object',
        });
      });
  };

  getObjectById = (id) => {
    const { objects } = this.state;
    fetch(URLs.getObjectById(id), {
      method: 'GET',
    })
      .then((res) => (
        res.json()
      ))
      .then((resJson) => {
        const updatedObjects = objects.filter((item) => item._id !== resJson._id);
        this.setState({
          objects: [...updatedObjects, resJson],
          currentObject: resJson,
          edit: false,
          error: null,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Could not fetch updated object',
        });
      });
  };

  handleDelete = (id) => {
    const { objects } = this.state;
    const { loggedIn } = this.props;
    if (loggedIn) {
      fetch(URLs.deleteObjectById(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      })
        .then(() => {
          const obj = objects.filter((item) => item._id !== id);
          this.setState({
            objects: obj,
            currentObject: null,
            imageWithBoxes: null,
            error: null,
          });
        })
        .catch(() => {
          this.setState({
            error: 'Could not delete object',
          });
        });
    } else {
      this.setState({
        redirect: true,
      });
    }
  };


  drawBox = (e) => {
    const { currentObject } = this.state;
    if (!currentObject || !currentObject.bounding_box.length) {
      return;
    }

    const canvas = document.createElement('CANVAS');
    const context = canvas.getContext('2d');
    const img = e.target;
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    context.drawImage(img, 0, 0);
    context.strokeStyle = 'red';
    context.lineWidth = 7;
    for (let i = 0; i < currentObject.bounding_box.length; i += 1) {
      const bb = currentObject.bounding_box[i];
      context.strokeRect(bb.x * w - bb.w * (w / 2),
        bb.y * h - bb.h * (h / 2),
        bb.w * w,
        bb.h * h);
    }

    this.setState({
      imageWithBoxes: canvas.toDataURL(),
    });
  };

  handleAddWOList = () => {
    const { currentObject } = this.state;
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.setState((prevState) => ({
        workOrders: [...prevState.workOrders, currentObject],
        error: null,
      }));
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  handleRemoveWOList = () => {
    const { currentObject } = this.state;
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.setState((prevState) => ({
        workOrders: prevState.workOrders.filter((item) => item._id !== currentObject._id),
        error: null,
      }));
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  handleSubmitWO = () => {
    const { loggedIn } = this.props;
    if (!loggedIn) {
      this.setState({
        redirect: true,
      });
    } else {
      const { workOrders, objects } = this.state;
      const object_ids = workOrders.map((item) => item._id);
      const ids = workOrders.map((item) => item._id);

      fetch(URLs.generateWorkOrdersByIds, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_ids,
        }),
      })
        .then(() => {
          fetch(URLs.getObjectByIds, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ids,
            }),
          })
            .then((result) => (
              result.json()
            ))
            .then((data) => {
              const newObjects = objects.filter((item) => !(ids.includes(item._id)));
              this.setState({
                objects: [...newObjects, ...data],
                currentObject: null,
                error: null,
                workOrders: [],
              });
            })
            .catch(() => {
              this.setState({
                error: 'Could not fetch updated objects',
                workOrders: [],
              });
            });
        })
        .catch(() => {
          this.setState({
            error: 'Could not generate work order',
          });
        });
    }
  };

  handleDeleteWO = () => {
    const { loggedIn } = this.props;
    if (!loggedIn) {
      this.setState({
        redirect: true,
      });
    } else {
      const { currentObject } = this.state;
      const object_ids = [currentObject._id];
      fetch(URLs.deleteWorkOrdersByIds, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_ids,
        }),
      })
        .then(() => {
          this.getObjectById(currentObject._id);
        })
        .catch(() => {
          this.setState({
            error: 'Could not delete work order',
          });
        });
    }
  };

  render() {
    const {
      hasLoaded,
      objects,
      loadError,
      currentObject,
      edit,
      filters,
      imageWithBoxes,
      workOrders,
      redirect,
      showImage,
      error,
    } = this.state;

    if (showImage) {
      return (
        <div className="image__wrapper">
          <ObjectImage
            src={imageWithBoxes}
            id={currentObject.filename}
            onClick={this.handleImageClick}
          />
        </div>
      );
    }

    if (redirect) {
      return <Redirect to="login" />;
    }
    if (!hasLoaded) {
      return <div>is loading..</div>;
    }
    if (loadError) {
      return <div>{loadError}</div>;
    }
    let obj = objects;
    if (filters) {
      obj = objects.filter((o) => isSubset(o, filters));
    }
    const inWOList = workOrders.some((item) => item._id === currentObject._id);
    return (
      <div className="homepage__container">
        <div>
          <Button text="Send work orders" onClick={workOrders.length > 0 ? this.handleSubmitWO : null} />
        </div>
        <div className="main_content__container">
          {currentObject && !edit
            ? (
              <ObjectInfoComponent
                object={currentObject}
                onCloseClick={this.handleCloseClick}
                onEditClick={this.handleEditClick}
                drawBox={this.drawBox}
                imageWithBoxes={imageWithBoxes}
                handleAddWOList={this.handleAddWOList}
                inWOList={inWOList}
                handleRemoveWOList={this.handleRemoveWOList}
                handleDeleteWO={this.handleDeleteWO}
                handleImageClick={this.handleImageClick}
                error={error}
              />
            ) : null }
          {currentObject && edit
            ? (
              <EditObjectComponent
                object={currentObject}
                handleImageClick={this.handleImageClick}
                onCloseClick={this.handleCloseClick}
                imageWithBoxes={imageWithBoxes}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
              />
            )
            : null}
          <div>
            <FilterComponent onFilter={this.onFilter} onFilterReset={this.onFilterReset} />
            <MapComponent
              objects={obj}
              onMarkerClick={this.handleMarkerClick}
              workOrders={workOrders}
            />
            <MarkerColors />
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default HomePage;
