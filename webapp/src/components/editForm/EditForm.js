import React from 'react';
import PropTypes from 'prop-types';
import Select from '../shared/select/Select';

import './EditForm.css';

const typeOptions = ['pothole', 'crack'];
<<<<<<< HEAD
const statusOptions = ['fixed', 'not fixed'];
const priorityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['true', 'false'];
=======
const statusOptions = ['yes', 'no'];
const priorityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['yes', 'no'];
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25


export default class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
<<<<<<< HEAD
      status: props.status,
      priority: props.priority,
      approved: props.approved.toString(),
=======
      fixed: props.fixed ? 'yes' : 'no',
      priority: props.priority,
      approved: props.approved ? 'yes' : 'no',
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
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
<<<<<<< HEAD
        status: e.target.value,
=======
        fixed: e.target.value,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
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
<<<<<<< HEAD
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
=======
      fixed,
      priority,
      approved,
    } = this.state;
    const { id, handleUpdate } = this.props;
    const body = JSON.stringify({
      type,
      fixed: fixed === 'yes',
      priority,
      approved: approved === 'yes',
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
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
<<<<<<< HEAD
      .then((data) => {
        console.log(data);
=======
      .then(() => {
        fetch(`https://api.dewp.eu.org/get-object-by-id?id=${id}`, {
          method: 'GET',
        })
          .then((res) => (
            res.json()
          ))
          .then((resJson) => {
            handleUpdate(resJson);
          })
          .catch((error) => {
            console.log(error);
          });
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
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
<<<<<<< HEAD
      status,
=======
      fixed,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
      priority,
      approved,
    } = this.state;

    return (
      <form method="post" className="edit_form" onSubmit={this.onSubmit}>
<<<<<<< HEAD
        <div className="selection__wrapper">
          <Select options={typeOptions} label="Type: " value={type} name="typ" handleChange={this.handleChange} />
          <Select options={statusOptions} label="Status: " value={status} name="stat" handleChange={this.handleChange} />
          <Select options={priorityOptions} label="Priority: " value={priority.toString()} name="pri" handleChange={this.handleChange} />
          <Select options={approvedOptions} label="Approved: " value={approved.toString()} name="appr" handleChange={this.handleChange} />
        </div>
=======
        <table className="selection__wrapper">
          <tr>
            <td>Type</td>
            <td>
              <span>
                <Select options={typeOptions} value={type} name="typ" handleChange={this.handleChange} />
              </span>
            </td>
          </tr>
          <tr>
            <td>Fixed</td>
            <td>
              <Select options={statusOptions} value={fixed} name="stat" handleChange={this.handleChange} />
            </td>
          </tr>
          <tr>
            <td>Priority</td>
            <td>
              <Select options={priorityOptions} value={priority.toString()} name="pri" handleChange={this.handleChange} />
            </td>
          </tr>
          <tr>
            <td>Approved</td>
            <td>
              <Select options={approvedOptions} value={approved} name="appr" handleChange={this.handleChange} />
            </td>
          </tr>
        </table>
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
        <button className="edit_button" type="submit">Update</button>
        <button className="edit_button" type="button" onClick={this.onDelete}>Delete</button>
      </form>
    );
  }
}

EditForm.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
<<<<<<< HEAD
  status: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  approved: PropTypes.bool.isRequired,
=======
  fixed: PropTypes.bool.isRequired,
  priority: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  approved: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func.isRequired,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
};
