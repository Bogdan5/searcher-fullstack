import React from 'react';
import '../App.scss';
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

  const sorter = (direction, columnNo) => {
    console.log(direction, columnNo);
    props.sorter(direction);
  }

  return (
    <div >
      <div>
        {header.map((el, index) => (
          <div key={el[0]} className='headerSortButtons'>
            <SortButton key={el[0]} name={el[1]}
            handler={handler} sorter={sorter}
            columnNo={index} />
          </div>
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
