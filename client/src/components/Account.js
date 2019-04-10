import React from 'react';
import '../App.css';

const Account = (props) => {
  const {accData} = props;

  const handler = () => {
    this.props.accountExit();
  }

  return (
    <div>
      <h3>Uploaded files</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>File name</th>
            <th>Upload date</th>
            <th>Delete file?</th>
          </tr>
        </thead>
        <tbody>
          {accData.map((el, index) => (
            <tr key={el._id}>
              <td>{index}</td>
              <td>{el.description}</td>
              <td>{el.created_at}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr/>
      <button type='button' onClick={handler}>Done</button>
    </div>
  );
}

export default Account;
