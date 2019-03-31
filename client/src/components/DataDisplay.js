import React, {Component} from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import Table from './Table.js'

// import PropTypes from 'prop-types';
import '../App.css';
// import axios from 'axios';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {
      prevPath: '',
      data: [],
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location !== this.props.location) {
  //     this.setState({ prevPath: this.props.location })
  //   }
  // }

  // componentDidMount(){
  //   const {uploadedID} = this.props;
  //   if (uploadedID) {
  //     const bearer = 'Bearer ' + localStorage.getItem('token');
  //     const config = {
  //       headers: { 'Authorization': bearer }
  //     };
  //     axios.get(`/api/datadisplay/${uploadedID}`, config)
  //       .then((response) => {
  //         console.log('response axios get: ', response);
  //         // this.setState({ data: response});
  //       })
  //       .catch((err) => console.log(`Error: ${err}`));
  //   }
  // }

  render() {
    // const {prevPath, data} = this.state;
    return (
      <div className='dataDisplay'>
        Stuff
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
