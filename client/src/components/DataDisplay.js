import React, {Component} from 'react';
// import { Route, Redirect } from 'react-router-dom';
import Table from './Table.js'

// import PropTypes from 'prop-types';
import '../App.css';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {
      prevPath: '',
      data: [],
    }
  }

  render() {
    // console.log('data from DataDisplay is: ', this.props.data);
    const {data} = this.props;
    return (
      <div className='dataDisplay'>
        <h3>{data.description}</h3>
        <Table data={data}/>
        {/* <Route render={() => (
          (prevPath !== '/upload-csv') ? <Table data={data}/> : <Redirect to='/' />
        )} /> */}
      </div>
    );
  }
}

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
