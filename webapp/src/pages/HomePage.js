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
    const { objects, 
      currentObject,
      imageWithBoxes
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
      imageWithBoxes: null,
    });
  };

  drawBox = (e)=>{
    const { currentObject } = this.state;
    if(!currentObject || !currentObject.bounding_box.length) {
      return;
    }

    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const img = e.target;
    console.log(img)
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    canvas.width = w;
    canvas.height = h;

    context.drawImage(img, 0, 0);
    context.strokeStyle = "red";
    context.lineWidth = 7;
    for(let i = 0; i < currentObject.bounding_box.length; i++) {
      const bb = currentObject.bounding_box[i];
      context.strokeRect(bb.x*w - bb.w*w/2,
                        bb.y*h - bb.h*h/2,
                        bb.w*w,
                        bb.h*h);
    }

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
