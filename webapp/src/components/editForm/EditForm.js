import React from 'react';
import PropTypes from 'prop-types';
import Select from '../shared/select/Select';

import './EditForm.css';

const typeOptions = ['pothole', 'crack'];
const statusOptions = ['fixed', 'not fixed'];
const priorityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['true', 'false'];


export default class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      status: props.status,
      priority: props.priority,
      approved: props.approved.toString(),
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
    if (e.target.name === 'appr') {
      this.setState({
        approved: e.target.value,
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const {
      type,
      status,
      priority,
      approved,
    } = this.state;
    const { id } = this.props;
    const body = JSON.stringify({
      type,
      status,
      priority,
      approved: approved === 'true',
    });
    const url = `https://api.dewp.eu.org/update-object-by-id?id=${id}`;
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

  onDelete = (e) => {
    e.preventDefault();
    const { id, handleDelete } = this.props;
    const body = JSON.stringify({
      id,
    });
    const url = `https://api.dewp.eu.org/delete-object-by-id?id=${id}`;
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
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
    handleDelete(id);
  };

  render() {
    const {
      type,
      status,
      priority,
      approved,
    } = this.state;

    return (
      <form method="post" className="edit_form" onSubmit={this.onSubmit}>
        <div className="selection__wrapper">
          <Select options={typeOptions} label="Type: " value={type} name="typ" handleChange={this.handleChange} />
          <Select options={statusOptions} label="Status: " value={status} name="stat" handleChange={this.handleChange} />
          <Select options={priorityOptions} label="Priority: " value={priority.toString()} name="pri" handleChange={this.handleChange} />
          <Select options={approvedOptions} label="Approved: " value={approved.toString()} name="appr" handleChange={this.handleChange} />
        </div>
        <button className="edit_button" type="submit">Update</button>
        <button className="edit_button" type="button" onClick={this.onDelete}>Delete</button>
      </form>
    );
  }
}

EditForm.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  approved: PropTypes.bool.isRequired,
};
