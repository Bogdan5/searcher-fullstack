import React from 'react';
import '../App.css';

const Table = (props) => {
  const {header, body} = this.props.data;
  return (
    <table>
      <tr>
        {header.map((el) => (<th>{el}</th>))}
      </tr>
      {body.map(el => (
        <tr>
          {el.map(elem => (
            <td>{elem}</td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default Table;
