import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../App.scss';
import UploadWindow from './UploadWindow';
import BackgroundPopWindow from './BackgroundPopWindow';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      file: null,
      firstRowHeader: false,
      uploadedID: '',
      description: '',
      uploadSuccesful: false,
    }

    this.onChange = this.onChange.bind(this);
    this.uploadCSV = this.uploadCSV.bind(this);
    this.radioClicked = this.radioClicked.bind(this);
    this.descriptionHandler = this.descriptionHandler.bind(this);    
  }

  componentDidMount() {
    console.log('upload rendered');
  }

  onChange = (e) => {
    this.setState({ file: e.target.files[0] });
  }

  radioClicked = (e) => {
    this.setState({ firstRowHeader: true });
  }

  descriptionHandler = (e) => {
    this.setState({ description: e.target.value });
  }

  uploadCSV = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.set('firstRowHeader', this.state.firstRowHeader);
    formData.set('description', this.state.description);

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': bearer
      }
    };
    axios.post('/api/upload-csv',formData,config)
      .then((res) => {
        alert('The file is successfully uploaded - id: ', res.data._id);
        this.setState({ uploadSuccesful: true, uploadedID: res.data._id });
        this.props.uploadSuccesfulCall(res.data._id);

        // const bearer = 'Bearer ' + localStorage.getItem('token');
        // const conf = {
        //   headers: { 'Authorization': bearer }
        // };
        // axios.get(`/api/datadisplay/${res.data._id}`, conf)
        //   .then((response) => {
        //     let newHeader = [];
        //     let newBody = [];
        //     response.data.header.map(el => newHeader.push([uuid.v4(), el]));
        //     response.data.body.map(el => {
        //       let newRow = [];
        //       el.map(elem => newRow.push([uuid.v4(), elem]));
        //       return newBody.push([uuid.v4(), newRow]);
        //     });
        //     const newData = {
        //       header: newHeader,
        //       body: newBody,
        //       id: res.data._id,
        //       description: res.data.description,
        //     };
        //     this.props.uploaded(newData);
        //   })
        //   .catch((err) => console.log(`Error: ${err}`));
      })
      .catch((err) => {
        console.log('Error: ', err)
        if(err.response.status === 401) {
          console.log(`Error: ${err}`)
          this.props.history.push({pathname: '/api/users/authenticate',
          appState: {prevPath: this.props.location.pathname}});
        }
      });

  } 

  render() {
    const {uploadedID, uploadSuccesful} = this.state;
    const uploadForm = (
      <form action='/api/upload-csv' encType='multipart/form-data' method='POST'
          noValidate onSubmit={this.uploadCSV}> 
        <input type='file' name='myFile' onChange={this.onChange} />
        <p />
        <input type="checkbox" id='firstRowHeader' onChange={this.radioClicked} />
        <label htmlFor='firstRowHeader' style={{ fontSize: '14px' }}>&nbsp;The first row is the header</label>
        <p />
        <label htmlFor='description' style={{ fontSize: '14px' }}>File description&emsp;</label>
        <input type='text' name='description' onChange={this.descriptionHandler} placeholder='File description' />
        <hr/>
        <input type='submit' value='Upload a file'/>          
      </form>
    );
    const success = (
      <div>
        <NavLink to={`/api/datadisplay/${uploadedID}`} className='navLinkButton' >Display data</NavLink>
        <NavLink to={`/api/account/${this.props.userID}`} className='navLinkButton'>View account</NavLink>
      </div>
    )
    return (
      <div className="uploadContainer">
        <div className="uploadWindow">
          {uploadSuccesful ? success: uploadForm}
        </div>
      </div>
    );
  }
}

export default Upload;
