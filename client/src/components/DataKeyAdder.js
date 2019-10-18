import uuid from 'uuid';

export default (data) => {
  let newHeader = [];
  let newBody = [];
  data.header.forEach(el => newHeader.push([uuid.v4(), el]));
  data.body.forEach((el, index) => {
    let newRow = [];
    el.forEach(elem => newRow.push([uuid.v4(), elem]));
    newBody.push([uuid.v4(), newRow, index]);
  });
  return {
    header: newHeader,
    body: newBody,
    description: data.description,
  };
};
