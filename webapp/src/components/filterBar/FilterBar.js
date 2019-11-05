import React from 'react';
import PropTypes from 'prop-types';
import Select from '../shared/select/Select';

import './FilterBar.css';

const typeOptions = ['all', 'pothole', 'crack'];
const statusOptions = ['all', 'fixed', 'not fixed'];
const priorityOptions = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['all', 'true', 'false'];


export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'all',
      status: 'all',
      priority: 'all',
      approved: 'all',
    };
  }

  handleFilter = (e) => {
    if (e.target.name === 'type') {
      this.setState({
        type: e.target.value,
      });
    }

    if (e.target.name === 'status') {
      this.setState({
        status: e.target.value,
      });
    }

    if (e.target.name === 'prio') {
      this.setState({
        priority: Number(e.target.value),
      });
    }

    if (e.target.name === 'appr') {
      this.setState({
        approved: e.target.value === 'true',
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
    const { onFilter } = this.props;
    const obj = {};
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
    }
    if (obj) {
      onFilter(obj);
    }
  };

  handleReset = () => {
    const { onFilterReset } = this.props;
    this.setState({
      type: 'all',
      status: 'all',
      priority: 'all',
      approved: 'all',
    });
    onFilterReset();
  };

  render() {
    const {
      type,
      status,
      priority,
      approved,
    } = this.state;
    return (
      <div className="filter_bar__wrapper">
        <div>
          <Select options={typeOptions} label="Type: " value={type} name="type" handleChange={this.handleFilter} />
          <Select
            options={statusOptions}
            label="Status: "
            value={status}
            name="status"
            handleChange={this.handleFilter}
          />
          <Select
            options={priorityOptions}
            label="Priority: "
            value={priority}
            name="prio"
            handleChange={this.handleFilter}
          />
          <Select options={approvedOptions} label="Approved: " value={approved} name="appr" handleChange={this.handleFilter} />
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
