import React from 'react';
import PropTypes from 'prop-types';
import Select from '../shared/select/Select';

import './FilterBar.css';

<<<<<<< HEAD
const typeOptions = ['all', 'pothole', 'crack'];
const statusOptions = ['all', 'fixed', 'not fixed'];
const priorityOptions = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['all', 'true', 'false'];
=======
const typeOptions = ['-- type --', 'pothole', 'crack'];
const fixedOptions = ['-- fixed --', 'yes', 'no'];
const priorityOptions = ['-- priority --', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['-- approved --', 'yes', 'no'];
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25


export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
      type: 'all',
      status: 'all',
      priority: 'all',
      approved: 'all',
=======
      type: '-- type --',
      fixed: '-- fixed --',
      priority: '-- priority --',
      approved: '-- approved --',
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    };
  }

  handleFilter = (e) => {
    if (e.target.name === 'type') {
      this.setState({
        type: e.target.value,
      });
    }

<<<<<<< HEAD
    if (e.target.name === 'status') {
      this.setState({
        status: e.target.value,
=======
    if (e.target.name === 'fixed') {
      this.setState({
        fixed: e.target.value,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
      });
    }

    if (e.target.name === 'prio') {
      this.setState({
        priority: Number(e.target.value),
      });
    }

    if (e.target.name === 'appr') {
      this.setState({
<<<<<<< HEAD
        approved: e.target.value === 'true',
=======
        approved: e.target.value,
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
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
    const { onFilter } = this.props;
    const obj = {};
<<<<<<< HEAD
    if (type !== 'all') {
      obj.type = type;
    }
    if (status !== 'all') {
      obj.status = status;
    }
    if (priority !== 'all') {
      obj.priority = priority;
    }
    if (approved !== 'all') {
      obj.approved = approved;
=======
    if (type !== '-- type --') {
      obj.type = type;
    }
    if (fixed !== '-- fixed --') {
      obj.fixed = fixed === 'yes';
    }
    if (priority !== '-- priority --') {
      obj.priority = priority;
    }
    if (approved !== '-- approved --') {
      obj.approved = approved === 'yes';
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    }
    if (obj) {
      onFilter(obj);
    }
  };

  handleReset = () => {
    const { onFilterReset } = this.props;
    this.setState({
<<<<<<< HEAD
      type: 'all',
      status: 'all',
      priority: 'all',
      approved: 'all',
=======
      type: '-- type --',
      fixed: '-- fixed --',
      priority: '-- priority --',
      approved: '-- approved --',
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
    });
    onFilterReset();
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
      <div className="filter_bar__wrapper">
        <div>
<<<<<<< HEAD
          <Select options={typeOptions} label="Type: " value={type} name="type" handleChange={this.handleFilter} />
          <Select
            options={statusOptions}
            label="Status: "
            value={status}
            name="status"
=======
          <Select options={typeOptions} value={type} name="type" handleChange={this.handleFilter} />
          <Select
            options={fixedOptions}
            value={fixed}
            name="fixed"
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
            handleChange={this.handleFilter}
          />
          <Select
            options={priorityOptions}
<<<<<<< HEAD
            label="Priority: "
=======
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
            value={priority}
            name="prio"
            handleChange={this.handleFilter}
          />
<<<<<<< HEAD
          <Select options={approvedOptions} label="Approved: " value={approved} name="appr" handleChange={this.handleFilter} />
=======
          <Select options={approvedOptions} value={approved} name="appr" handleChange={this.handleFilter} />
>>>>>>> 0f321dba9b6f9e6f1bafbac75ede5ed3db546e25
        </div>
        <div>
          <button className="filter_button" type="submit" onClick={this.onSubmit}>Filter</button>
          <button className="filter_button" type="button" onClick={this.handleReset}>Reset</button>
        </div>
      </div>
    );
  }
}

FilterBar.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onFilterReset: PropTypes.func.isRequired,
};
