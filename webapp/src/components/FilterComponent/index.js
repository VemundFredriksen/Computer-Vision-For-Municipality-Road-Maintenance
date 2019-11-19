import React from 'react';
import PropTypes from 'prop-types';
import Index from '../shared/Select';

import './FilterBar.css';

const typeOptions = ['-- type --', 'pothole', 'crack'];
const fixedOptions = ['-- fixed --', 'yes', 'no'];
const priorityOptions = ['-- priority --', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const approvedOptions = ['-- approved --', 'yes', 'no'];


export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '-- type --',
      fixed: '-- fixed --',
      priority: '-- priority --',
      approved: '-- approved --',
    };
  }

  handleFilter = (e) => {
    if (e.target.name === 'type') {
      this.setState({
        type: e.target.value,
      });
    }

    if (e.target.name === 'fixed') {
      this.setState({
        fixed: e.target.value,
      });
    }

    if (e.target.name === 'prio') {
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
    const { onFilter } = this.props;
    const obj = {};
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
    }
    if (obj) {
      onFilter(obj);
    }
  };

  handleReset = () => {
    const { onFilterReset } = this.props;
    this.setState({
      type: '-- type --',
      fixed: '-- fixed --',
      priority: '-- priority --',
      approved: '-- approved --',
    });
    onFilterReset();
  };

  render() {
    const {
      type,
      fixed,
      priority,
      approved,
    } = this.state;
    return (
      <div className="filter_bar__wrapper">
        <div>
          <Index options={typeOptions} value={type} name="type" handleChange={this.handleFilter} />
          <Index
            options={fixedOptions}
            value={fixed}
            name="fixed"
            handleChange={this.handleFilter}
          />
          <Index
            options={priorityOptions}
            value={priority}
            name="prio"
            handleChange={this.handleFilter}
          />
          <Index options={approvedOptions} value={approved} name="appr" handleChange={this.handleFilter} />
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
