import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';
import Table from './Table.js'

// import PropTypes from 'prop-types';
import '../App.css';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {
      prevPath: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location })
    }
  }

  componentDidMount(){
    
  }

  render() {
    const {prevPath} = this.state;
    return (
      <div className='dataDisplay'>
        <Route render={() => (
          (prevPath === '/') ? <Table /> : <Redirect to='/' />
        )} />
      </div>
    );
  }
};

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
