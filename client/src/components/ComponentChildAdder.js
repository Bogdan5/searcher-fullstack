import React from 'react';

const ComponentChildAdder = (WrappedComponent, addedElement, position) => (props) => {
  const { children } = props;
  children.splice(position, addedElement);
  return (
    <WrappedComponent>
      {children}
    </WrappedComponent>
  );
}

export default ComponentChildAdder;
