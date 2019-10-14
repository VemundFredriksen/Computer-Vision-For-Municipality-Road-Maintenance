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
      chosenObject: null,
    };

    this.handleMarkerClick = this.handleMarkerClick.bind(this);
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
      chosenObject: object[0],
    });
  };

  render() {
    const {
      hasLoaded,
      objects,
      error,
      chosenObject,
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
          {chosenObject
            ? (
              <InfoBar
                type={chosenObject.type}
                status={chosenObject.status}
                priority={chosenObject.priority}
              />
            )
            : null }
          <MapComponent objects={objects} onMarkerClick={this.handleMarkerClick} />
        </div>
      </div>
    );
  }
}

export default HomePage;
