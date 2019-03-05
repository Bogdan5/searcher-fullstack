import React from 'react';

const ComponentChildAdder = (WrappedComponent, addedElement, position) => (props) => {
  console.log('Wrapped Component', WrappedComponent);
  const { children } = props;
  const childrenArray = React.Children.toArray(children);
  childrenArray.splice(position, 0, addedElement);
  console.log('childrenArray', childrenArray);
  return (
    <WrappedComponent>
      {childrenArray}
    </WrappedComponent>
  );
}

export default ComponentChildAdder;
