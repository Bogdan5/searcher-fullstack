import React, {Component} from 'react';
import '../App.css';

const Account = (props) => {
  const {data} = props;

  const handler = () => {
    this.props.accountExit();
  }

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
          {/* {data.map((el, index) => (
            <tr>
              <td>index</td>
              <td>el.filename</td>
              <td>el.date</td>
              <td></td>
            </tr>
          ))} */}
        </body>
      </table>
      <hr/>
      <input type='button' onClick={handler}>Done</input>
    </div>
  );
}

export default Account;
