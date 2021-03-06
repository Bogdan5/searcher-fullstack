import React, {Component} from 'react';
import '../App.scss';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortButton from './SortButton';
import axios from 'axios';
import DataKeyAdder from './DataKeyAdder';
import DataKeyRemover from './DataKeyRemover';
var FileSaver = require('file-saver');

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
      containsActive1: false,
      filtering: props.filtering,
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.data.description !== prevProps.data.description && this.props.data.description){
      // console.log('update: ', this.props.data);
      this.setState({ data: this.props.data });
    }
    if(prevProps.conditionalButtonChanges !== this.props.conditionalButtonChanges){
      this.setState({ containsActive1: this.containsActive(this.props.listCards)})
    }
    if (prevProps.filtering !== this.props.filtering) {
      this.setState({ filtering: this.props.filtering});
    }
  }

  sorter = (direction, columnNo) => {
    let sortedArray = this.state.data.body.sort((a,b) => {
      let x, y;
      if (direction === 'up'){
        x = a[1][columnNo][1];
        y = b[1][columnNo][1];
      } else if (direction === 'down'){
        x = b[1][columnNo][1];
        y = a[1][columnNo][1];
      }
      if (y < x) { return 1 }
      else if (x === y) { return 0 }
      else { return -1 }
    });
    let newData = Object.assign({}, this.state.data, { body: sortedArray });
    this.setState({ data: newData });
  }

  typeSelector = (value, columnNo) => {
    const { data } = this.state;
    const { body } = data;
    const { columnTypes } = data;
    const newBody = Array.from(body, row => Array.from(row, (x, i) => {
      if (i === 1) {
        return Array.from(x, (y, index) => {
          if (index === columnNo) {
            return Array.from(y, (z, ix) => {
              if (ix === 1) {
                switch (value) {
                  case 'string':
                    return z + '';
                  case 'number':
                    return parseFloat(z);
                  case 'boolean':
                    return (z === 'true');
                  default:
                }
              }
              return z;
            })
          }
          return y;
        })
      }
      return x;
    }));
    const newColumnTypes = Array.from(columnTypes, (x, i) => (i === columnNo) ? value : x);
    const newData = Object.assign({}, data, {body: newBody, columnTypes: newColumnTypes });
    this.setState({ data: newData });
  }

  filterExecuted = (arr) => {
    // console.log('arr ', arr);
    const { listCards } = this.props;
    const { data, containsActive1, filtering } = this.state;
    if (filtering && containsActive1){
      for (let i of listCards){
        let filteredColumns = [...i.field];
        if (i.field.length === 0) {
          filteredColumns = Array.from(new Array(data.header.length), (x, i) => i);
          operations:
          for (let j = i.listOperations.length - 1; j>= 0; j--) {
            if (i.listOperations[j].active) {
              for (let k of filteredColumns){
                console.log('data ', arr[k][1]);
                console.log('type operation ', i.listOperations[j]);
                console.log('columnType ', data.columnTypes[k]);
                if ((i.listOperations[j].typeOperation === data.columnTypes[k]) && i.listOperations[j].func(arr[k][1])) {
                  break operations;
                }
              }
              return false;
            }
          }
        } else {
          for (let j = i.listOperations.length - 1; j>= 0; j--) {
            if (i.listOperations[j].active) {
              for (let k of filteredColumns){
                if ((i.listOperations[j].typeOperation === data.columnTypes[k]) && !i.listOperations[j].func(arr[k][1])) { 
                  return false;
                }
              }
              break;
            }
          }
        }
        
      }
      // return false;
    } 
    return true;
  }

  containsActive = (cards) => cards.reduce((accum, elem) => 
    elem.listOperations.reduce((acc, el) => el.active || acc, false) || accum, false);

  saveChanges = (e) => {
    const { fileID } = this.props;
    const { data } = this.state;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer },
    };
    const newData = {
      body: DataKeyRemover(data.body),
      columnTypes: data.columnTypes,
    }
    axios.put(`/api/datadisplay/${fileID}`, newData, conf)
      .then((response) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }

  resetChanges = () => {
    const { fileID } = this.props;
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const conf = {
      headers: { 'Authorization': bearer }
    };
    // retrieves data from csv files uploaded in the database
    axios.get(`/api/datadisplay/${fileID}`, conf)
      .then((response) => {
        this.setState({ data: DataKeyAdder(response.data) });
      })
      .catch((err) => {
        console.log('Error ', err)
        if(err.response.status === 401) {
          console.log(`Error: ${err}`)
          this.props.history.push({pathname: '/api/users/authenticate',
            appState: {prevPath: this.props.location.pathname}});
          // this.setState({ windowVisible: true, goToSignIn: true, prevPath: `/api/datadisplay/${id}` });
        }
      });
      this.setState({ filtering: false });
  }

  downloadFile = async () => {
    const { data } = this.state;
    await this.setState({ filtering: true });
    const newHeaders = Array.from(data.header, x => x[1]);
    let dataString = newHeaders.join(',') + '\n';
    data.body.forEach((el) => {
      if (el[1].length && this.filterExecuted(el[1])) {
        el[1].forEach((x, i) => dataString = dataString + x[1] + ((i === el[1].length - 1) ? '' : ','));
        dataString = dataString + '\n';
      }
    });
    const blob = new Blob([dataString], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, `download_${data.description}.txt`);
  }

  render(){
    const {header, body, description, columnTypes } = this.state.data;
    return (
      <div className="tableContainer">
        <h4>{description}</h4>
        <div className="tableButtons">
          {/* <span>{description}</span> */}
          <button
            type="button"
            className=""
            onClick={this.saveChanges}
          >Save changes</button>
          <button
            type="button"
            className=""
            onClick={this.resetChanges}
          >
            Reset type changes
          </button>
          <button
            type="button"
            onClick={this.downloadFile}
            className=""
          >
            Download file
          </button>
        </div>
        {/* <h3 className='displayTitle'>{description}</h3> */}
        <table className='dataTable'>
          <thead>
            <tr>
              {header.map((el, index) => (
                <th key={el[0]} className='headerSortButtons'>
                  <SortButton key={el[0]} name={el[1]}
                  sorter={this.sorter} columnNo={index}
                  typeHandlerTable={this.typeSelector} type={columnTypes[index]}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map(el => {
              if (el[1].length && this.filterExecuted(el[1])){
                return (
                  <tr key={el[0]} className='rowTable'>
                    {el[1].map(elem => (
                      <td key={elem[0]} className='cellTable'>{elem[1]}</td>
                    ))}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>

    );
  }
}

export default Table;
