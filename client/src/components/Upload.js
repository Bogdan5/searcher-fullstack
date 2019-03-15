import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upload: true,
    }

    this.uploadCSV = this.uploadCSV.bind(this);
  }

  uploadCSV = (e) => {
    e.preventDefault();
    this.props.uploaded();
  } 

  render() {
    return (
      <div>
        <br/>
        <form action="/api/upload-csv" encType="multipart/form-data" method="POST"
        noValidate onSubmit={this.uploadCSV}> 
          <input type="file" name="myFile" />
          <br/>
          <br/>
          <input type="submit" value="Upload a file"/>
        </form>
      </div>
    );
  }
}

export default Upload;
