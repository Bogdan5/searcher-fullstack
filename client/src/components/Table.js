import React from 'react';
import '../App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SortButton from './SortButton';

const Table = (props) => {
  const {header, body} = props.data;
  // console.log('header: ', props.data2.header);
  // console.log('body: ', props.data2.body);

  const handler =  (option) => { 
    props.fromSortButton(option);
  }

  return (
    <div >
      <div>
        {header.map((el) => (
          <SortButton key={el[0]} name={el[1]}
            handler={handler} />
        ))}

      </div>
    </div>

    // <table>
    //   <thead>
    //     <tr>
    //       {header.map((el) => (<th key={el[0]}>{el[1]}</th>))}
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {body.map(el => (
    //       <tr key={el[0]}>
    //         {el[1].map(elem => (
    //           <td key={elem[0]}>{elem[1]}</td>
    //         ))}
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
}

export default Table;
