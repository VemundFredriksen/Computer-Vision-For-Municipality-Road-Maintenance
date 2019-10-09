import React from 'react';
import MapComponent from '../components/MapComponent';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      hasLoaded: false,
      objects: [],
      error: null,
    };
  }

  componentDidMount() {
    fetch('http://dewp.eu.org:4000/get-all-objects')
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

  render() {
    const { hasLoaded, objects, error } = this.state;

    if (!hasLoaded) {
      return <div>is loading..</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <MapComponent objects={objects} />
      </div>
    );
  }
}

export default HomePage;
