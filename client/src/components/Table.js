import React from 'react';
import '../App.css';

const Table = (props) => {
  const {header, body} = props.data;
  // console.log('header: ', props.data2.header);
  // console.log('body: ', props.data2.body);
  return (
    <table>
      <thead>
        <tr>
          {header.map((el) => (<th key={el[0]}>{el[1]}</th>))}
        </tr>
      </thead>
      <tbody>
        {body.map(el => (
          <tr key={el[0]}>
            {el[1].map(elem => (
              <td key={elem[0]}>{elem[1]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
