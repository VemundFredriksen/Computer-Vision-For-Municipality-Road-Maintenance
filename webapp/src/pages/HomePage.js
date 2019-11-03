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

  render() {
    const {
      hasLoaded,
      objects,
      error,
      currentObject,
      edit,
      filters,
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {currentObject
            ? (
              <InfoBar
                object={currentObject}
                edit={edit}
                onCloseClick={this.handleCloseClick}
                onEditClick={this.handleEditClick}
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
