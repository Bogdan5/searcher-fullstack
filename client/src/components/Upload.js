import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upload: true,
      file: null,
    }

    this.onChange = this.onChange.bind(this);
    this.uploadCSV = this.uploadCSV.bind(this);
  }

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  }

  uploadCSV = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file',this.state.file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post("/api/upload-csv",formData,config)
        .then((response) => {
            alert("The file is successfully uploaded");
        }).catch((error) => {
    });

    this.props.uploaded();
    
  } 

  render() {
    return (
      <div>
        <br/>
        <form action="/api/upload-csv" encType="multipart/form-data" method="POST"
        noValidate onSubmit={this.uploadCSV}> 
          <input type="file" name="myFile" onChange={this.onChange} />
          <br/>
          <br/>
          <input type="submit" value="Upload a file"/>
        </form>
      </div>
    );
  }
}

export default Upload;
