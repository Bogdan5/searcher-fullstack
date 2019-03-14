import React, { Component } from 'react';
import './App.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upload: true,
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    
  } 

  render() {
    return (
      <div>
        <br/>
        <form action="/upload-csv" encType="multipart/form-data" method="POST"
        noValidate onSubmit={this.onSubmit}> 
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
