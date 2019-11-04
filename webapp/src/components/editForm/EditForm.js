import React from 'react';
import PropTypes from 'prop-types';
import Select from '../shared/select/Select';

import './EditForm.css';

const typeOptions = ['Pothole', 'Crack'];
const statusOptions = ['Fixed', 'Not fixed'];
const priorityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


export default class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      status: props.status,
      priority: props.priority,
    };
  }

  handleChange = (e) => {
    if (e.target.name === 'typ') {
      this.setState({
        type: e.target.value,
      });
    }

    if (e.target.name === 'stat') {
      this.setState({
        status: e.target.value,
      });
    }

    if (e.target.name === 'pri') {
      this.setState({
        priority: Number(e.target.value),
      });
    }
  };

  onSubmit = (e) => {
    const { type, status, priority } = this.state;
    const { id } = this.props;
    const body = JSON.stringify({
      type,
      status,
      priority,
    });
    console.log(body);
    const url = `https://api.dewp.eu.org/update-object-by-id?id=${id}`;
    e.preventDefault();
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then((res) => (
        res.json()
      ))
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { type, status, priority } = this.state;

    return (
      <form method="post" className="edit_form" onSubmit={this.onSubmit}>
        <div className="selection__wrapper">
          <Select options={typeOptions} label="Type: " value={type} name="typ" handleChange={this.handleChange} />
          <Select options={statusOptions} label="Status: " value={status} name="stat" handleChange={this.handleChange} />
          <Select options={priorityOptions} label="Priority: " value={priority.toString()} name="pri" handleChange={this.handleChange} />
        </div>
        <button className="submit_button" type="submit">Do edit</button>
      </form>
    );
  }
}

EditForm.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
};