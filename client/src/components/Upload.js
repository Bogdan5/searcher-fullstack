import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upload: true,
      file: null,
      firstRowHeader: false,
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
    formData.append('file',this.state.file);
    formData.set('firstRowHeader', this.state.firstRowHeader);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post('/api/upload-csv',formData,config)
        .then((response) => {
            alert('The file is successfully uploaded');
        }).catch((error) => {console.log('Error: ', error)}
    );

    this.props.uploaded();
  } 

  render() {
    return (
      <div>
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
