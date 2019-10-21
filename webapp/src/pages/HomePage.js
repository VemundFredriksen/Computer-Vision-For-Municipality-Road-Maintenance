import React from 'react';
import MapComponent from '../components/MapComponent';
import InfoBar from '../components/infoBar/InfoBar';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      objects: [],
      error: null,
      currentObject: null,
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
    });
  };

  handleCloseClick = () => {
    this.setState({
      currentObject: null,
    });
  };

  render() {
    const {
      hasLoaded,
      objects,
      error,
      currentObject,
    } = this.state;

    if (!hasLoaded) {
      return <div>is loading..</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {currentObject
            ? (
              <InfoBar
                type={currentObject.objecttype}
                status={currentObject.status}
                priority={currentObject.priority}
                imagePath={`https://api.dewp.eu.org/get-image?filename=${currentObject.filename}`}
                onCloseClick={this.handleCloseClick}
              />
            )
            : null }
          <MapComponent
            objects={objects}
            onMarkerClick={this.handleMarkerClick}
          />
        </div>
      </div>
    );
  }
}

export default HomePage;
