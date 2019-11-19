import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../shared/Select';

import './index.css';

const typeOptions = ['pothole', 'crack'];
const statusOptions = ['yes', 'no'];
const priorityOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['yes', 'no'];


export default class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      fixed: props.fixed ? 'yes' : 'no',
      priority: props.priority,
      approved: props.approved ? 'yes' : 'no',
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
        fixed: e.target.value,
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
    });
    handleUpdate(id, body);
  };

  onDelete = (e) => {
    e.preventDefault();
    const { id, handleDelete } = this.props;
    handleDelete(id);
  };

  render() {
    const {
      type,
      fixed,
      priority,
      approved,
    } = this.state;

    return (
      <form method="post" className="edit_form" onSubmit={this.onSubmit}>
        <table className="selection__wrapper">
          <tbody>
            <tr>
              <td>Type</td>
              <td>
                <Select options={typeOptions} value={type} name="typ" handleChange={this.handleChange} />
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
          </tbody>
        </table>
        <button className="edit_button" type="submit">Update</button>
        <button className="edit_button" type="button" onClick={this.onDelete}>Delete</button>
      </form>
    );
  }
}

EditForm.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fixed: PropTypes.bool.isRequired,
  approved: PropTypes.bool.isRequired,
  priority: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};
