import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      file: null,
      firstRowHeader: false,
      uploadedID: '',
    }

    this.onChange = this.onChange.bind(this);
    this.uploadCSV = this.uploadCSV.bind(this);
    this.radioClicked = this.radioClicked.bind(this);    
  }

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  }

  radioClicked = (e) => {
    this.setState({ firstRowHeader: true });
  }

  uploadCSV = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.set('firstRowHeader', this.state.firstRowHeader);

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': bearer
      }
    };
    axios.post('/api/upload-csv',formData,config)
      .then((res) => {
        alert('The file is successfully uploaded');
        this.setState({ uploaded: true, uploadedID: res.data._id });
        this.props.uploaded(res.data._id);
      })
      .catch((error) => {console.log('Error: ', error)});

  } 

  render() {
    const {uploaded} = this.state;
    return (
      <div>
        {/* <Route path='/api/upload-csv' render={() => (uploaded ? 
            (<Redirect to={`/api/datadisplay/${this.state.uploadedID}`} />) : null)
          }/> */}
        <br/>
        <form action='/api/upload-csv' encType='multipart/form-data' method='POST'
        noValidate onSubmit={this.uploadCSV}> 
          <input type='file' name='myFile' onChange={this.onChange} />
          <br/>
          <input type="checkbox" id='firstRowHeader' onChange={this.radioClicked} />
          <label htmlFor='firstRowHeader'>The first row is the header</label>
          <br/>
          <input type='submit' value='Upload a file'/>          
        </form>
      </div>
    );
  }
}

export default Upload;
