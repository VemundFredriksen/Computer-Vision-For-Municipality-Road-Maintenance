import React from 'react';
import isSubset from 'is-subset';
import MapComponent from '../components/MapComponent';
import InfoBar from '../components/infoBar/InfoBar';
import FilterBar from '../components/filterBar/FilterBar';

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
      imageWithBoxes: null,
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
    const { objects } = this.state;
    const object = objects.filter((obj) => obj._id === id);

    this.setState({
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

  handleEditClick = () => {
    this.setState({
      edit: true,
    });
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

  handleDelete = (id) => {
    const { objects } = this.state;
    const obj = objects.filter((o) => o._id !== id);
    this.setState({
      objects: obj,
      currentObject: null,
    });
  };

  drawBox = (e)=>{
    console.log(e);
    const { currentObject } = this.state;
    console.log(currentObject);
    /*if(!currentObject || !currentObject.length) {
      return;
    }*/

    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const img = e.target;

    canvas.width = img.width;
    canvas.height = img.height;

    context.drawImage(img, 0, 0);
    context.strokeStyle = "red";
    context.strokeWidth = 10;
    context.strokeRect(10, 10, 10, 10);
    //for testing
    //img.src = canvas.toDataURL();
    this.setState({
      imageWithBoxes: canvas.toDataURL(),
    })
  };

  render() {
    const {
      hasLoaded,
      objects,
      error,
      currentObject,
      edit,
      filters,
      imageWithBoxes,
    } = this.state;

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

    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {currentObject
            ? (
              <InfoBar
                object={currentObject}
                edit={edit}
                onCloseClick={this.handleCloseClick}
                onEditClick={this.handleEditClick}
                handleDelete={this.handleDelete}
                drawBox={this.drawBox}
                imageWithBoxes={imageWithBoxes}
              />
            )
            : null}
          <div>
            <FilterBar onFilter={this.onFilter} onFilterReset={this.onFilterReset} />
            <MapComponent
              objects={obj}
              onMarkerClick={this.handleMarkerClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
