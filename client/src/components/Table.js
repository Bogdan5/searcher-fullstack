import React, {Component} from 'react';
import '../App.scss';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SortButton from './SortButton';

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: props.data
    }
  }
  // console.log('header: ', props.data2.header);
  // console.log('body: ', props.data2.body);

  // const handler =  (direction, buttonNumber) => { 
  //   props.fromSortButton(direction, buttonNumber);
  // }

  sorter = (direction, columnNo) => {
    console.log(direction, columnNo);
    let sortedArray = dataBody.sort((a,b) => (direction === 'up') ?
      a[1][columnNo][1] - b[1][columnNo][1] : b[1][columnNo][1] - a[1][columnNo][1]);
    this.setState({ data: sortedArray });
  }

  return (
    <div >
      <div>
        {header.map((el, index) => (
          <div key={el[0]} className='headerSortButtons'>
            <SortButton key={el[0]} name={el[1]}
            sorter={sorter} columnNo={index} />
          </div>
        ))}
      </div>
      <div className='tableData'>
        {body.map(el => (
          <div key={el[0]} className='rowTable'>
            {el[1].map(elem => (
              <div key={elem[0]} className='cellTable'>{elem[1]}</div>
            ))}
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
