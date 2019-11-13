import React from 'react';
import isSubset from 'is-subset';
import MapComponent from '../components/MapComponent';
import InfoBar from '../components/infoBar/InfoBar';
import FilterBar from '../components/filterBar/FilterBar';
import Button from '../components/shared/button/Button';
import MarkerColors from '../components/MarkerColors';

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
      workOrders: [],
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

  handleDelete = (id) => {
    const { objects } = this.state;
    const obj = objects.filter((o) => o._id !== id);
    this.setState({
      objects: obj,
      currentObject: null,
    });
  };

  handleAddWOList = () => {
    const { currentObject } = this.state;
    this.setState((prevState) => ({
      workOrders: [...prevState.workOrders, currentObject],
    }));
  };

  handleRemoveWOList = () => {
    const { currentObject } = this.state;
    this.setState((prevState) => ({
      workOrders: prevState.workOrders.filter((item) => item._id !== currentObject._id),
    }));
  };

  handleDeleteWO = () => {
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
  };

  handleSubmitWO = () => {
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
  };

  render() {
    const {
      hasLoaded,
      objects,
      error,
      currentObject,
      edit,
      filters,
      workOrders,
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
    const inWOList = workOrders.some((item) => item._id === currentObject._id);
    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <Button text="Send work orders" onClick={workOrders.length > 0 ? this.handleSubmitWO : null} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {currentObject
            ? (
              <InfoBar
                object={currentObject}
                edit={edit}
                onCloseClick={this.handleCloseClick}
                onEditClick={this.handleEditClick}
                handleDelete={this.handleDelete}
                handleAddWOList={this.handleAddWOList}
                inWOList={inWOList}
                handleRemoveWOList={this.handleRemoveWOList}
                handleDeleteWO={this.handleDeleteWO}
              />
            )
            : null}
          <div>
            <FilterBar onFilter={this.onFilter} onFilterReset={this.onFilterReset} />
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

export default HomePage;
