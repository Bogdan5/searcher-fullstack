import React, {Component} from 'react';
import '../App.css';

class Account extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    }
  }

  render() {
    const {data} = this.props;
    return (
      <div>
        <h3>Uploaded files</h3>
        <table>
          <head>
            <th>#</th>
            <th>File name</th>
            <th>Upload date</th>
            <th>Delete file?</th>
          </head>
          <body>
            {data.map((el, index) => (
              <tr>
                <td>index</td>
                <td>el.filename</td>
                <td>el.date</td>
                <td></td>
              </tr>
            ))}
          </body>
        </table>
      </div>    
    );
  }
}

export default Account;
