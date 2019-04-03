import React, {Component} from 'react';
import '../App.css';

const Account = (props) => {

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
      <br>
      <hr>
      <br>
      <input type='button' onClick={this.props.accountExit}>Done</input>
    </div>
  );
}

export default Account;
