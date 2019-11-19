import React from 'react';
import isSubset from 'is-subset';
<<<<<<< HEAD
import MapComponent from '../components/MapComponent';
import InfoBar from '../components/infoBar/InfoBar';
import FilterBar from '../components/filterBar/FilterBar';
=======
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import InfoBar from '../components/infoBar/InfoBar';
import FilterBar from '../components/filterBar/FilterBar';
import Button from '../components/shared/button/Button';
import MarkerColors from '../components/MarkerColors';
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      objects: [],
      error: null,
      currentObject: null,
      edit: false,
      filters: null,
<<<<<<< HEAD
=======
      workOrders: [],
      imageWithBoxes: null,
      redirect: false,
      showImage: false,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    };
  }

  componentDidMount() {
    fetch('https://api.dewp.eu.org/get-all-objects')
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
          error: 'Not able to load objects',
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
    });
  };

  handleCloseClick = () => {
    this.setState({
      currentObject: null,
      edit: false,
      imageWithBoxes: null,
    });
  };

  handleImageClick = () => {
    this.setState((prevState) => ({
      showImage: !prevState.showImage,
    }));
  };

  handleEditClick = () => {
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.setState({
        edit: true,
      });
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  handleUpdate = (object) => {
    const { objects } = this.state;
    const updatedObjects = objects.filter((item) => item._id !== object._id);
    this.setState({
      objects: [...updatedObjects, object],
      currentObject: object,
      edit: false,
    });
  };

  onFilter = (filters) => {
    this.setState({
      filters,
    });
  };

<<<<<<< HEAD
  onFilter = (filters) => {
    this.setState({
      filters,
    });
  };

=======
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
  onFilterReset = () => {
    this.setState({
      filters: null,
    });
  };

  handleDelete = (id) => {
    const { objects } = this.state;
<<<<<<< HEAD
    const obj = objects.filter((o) => o._id !== id);
    this.setState({
      objects: obj,
      currentObject: null,
    });
  };

=======
    const { loggedIn } = this.props;
    if (loggedIn) {
      const obj = objects.filter((o) => o._id !== id);
      this.setState({
        objects: obj,
        currentObject: null,
        imageWithBoxes: null,
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
      }));
    } else {
      this.setState({
        redirect: true,
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
      const { currentObject, objects } = this.state;
      const object_ids = [currentObject._id];
      fetch('https://api.dewp.eu.org/delete-workorder-by-object-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_ids,
        }),
      })
        .then((res) => (
          res.json()
        ))
        .then(() => {
          fetch(`https://api.dewp.eu.org/get-object-by-id?id=${currentObject._id}`, {
            method: 'GET',
          })
            .then((result) => (
              result.json()
            ))
            .then((data) => {
              const newObjects = objects.filter((item) => item._id !== data._id);
              this.setState({
                objects: [...newObjects, data],
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
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

      fetch('https://api.dewp.eu.org/generate-workorders-by-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_ids,
        }),
      })
        .then(() => {
          fetch('https://api.dewp.eu.org/get-objects-by-ids', {
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
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
  render() {
    const {
      hasLoaded,
      objects,
      error,
      currentObject,
      edit,
      filters,
<<<<<<< HEAD
=======
      imageWithBoxes,
      workOrders,
      redirect,
      showImage,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    } = this.state;

    if (showImage) {
      return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <button type="button" onClick={this.handleImageClick}>
            <img
              style={{ width: '100%', height: '100%' }}
              id="pothole_image"
              src={imageWithBoxes}
              alt="detected road object"
            />
          </button>
        </div>
      );
    }

    if (redirect) {
      return <Redirect to="login" />;
    }

    if (!hasLoaded) {
      return <div>is loading..</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    let obj = objects;
    if (filters) {
      obj = objects.filter((o) => isSubset(o, filters));
    }
<<<<<<< HEAD

    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
=======
    const inWOList = workOrders.some((item) => item._id === currentObject._id);
    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <Button text="Send work orders" onClick={workOrders.length > 0 ? this.handleSubmitWO : null} />
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {currentObject
            ? (
              <InfoBar
                object={currentObject}
                edit={edit}
                onCloseClick={this.handleCloseClick}
                onEditClick={this.handleEditClick}
                handleDelete={this.handleDelete}
<<<<<<< HEAD
=======
                drawBox={this.drawBox}
                imageWithBoxes={imageWithBoxes}
                handleAddWOList={this.handleAddWOList}
                inWOList={inWOList}
                handleRemoveWOList={this.handleRemoveWOList}
                handleDeleteWO={this.handleDeleteWO}
                handleUpdate={this.handleUpdate}
                handleImageClick={this.handleImageClick}
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
              />
            )
            : null}
          <div>
            <FilterBar onFilter={this.onFilter} onFilterReset={this.onFilterReset} />
            <MapComponent
              objects={obj}
              onMarkerClick={this.handleMarkerClick}
<<<<<<< HEAD
            />
=======
              workOrders={workOrders}
            />
            <MarkerColors />
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
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
