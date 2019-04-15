import React, {Component} from 'react';
// import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import uuid from 'uuid';
import Table from './Table.js';

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

  componentDidMount() {
    const { id } = this.props;
    console.log('datadisplay rendered');
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    axios.get(`/api/datadisplay/${id}`, conf)
      .then(async (response) => {
        console.log('get data start');
        console.log('data is: ', response);
        let newHeader = [];
        let newBody = [];
        response.data.header.map(el => newHeader.push([uuid.v4(), el]));
        response.data.body.map(el => {
          let newRow = [];
          el.map(elem => newRow.push([uuid.v4(), elem]));
          return newBody.push([uuid.v4(), newRow]);
        });
        const newData = {
          header: newHeader,
          body: newBody,
          id,
          description: response.data.description,
        };
        await this.setState({ data: newData });
        // console.log('new Data is: ', this.state.data);
      })
      .catch((err) => {
        if(err.response.status === 401) {
          console.log(`Error: ${err}`)
          // this.setState({ windowVisible: true, goToSignIn: true, prevPath: `/api/datadisplay/${id}` });
        }
      });
  }

  render() {
    console.log('data from DataDisplay is: ', this.props.data);
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
