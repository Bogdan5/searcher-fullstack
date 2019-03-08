import React from 'react';

const ComponentChildAdder = (WrappedComponent, addedElement, position) => (props) => {
  const { children } = props;
  const childrenArray = React.Children.toArray(children);
  childrenArray.splice(position, 0, addedElement);
  return (
    <WrappedComponent>
      {childrenArray}
    </WrappedComponent>
  );
}

export default ComponentChildAdder;
