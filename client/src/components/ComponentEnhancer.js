import React from 'react';

// HOC that adds a new function as a prop to a component
const ComponentEnhancer = (WrappedComponent, propertiesObj) => (props) => {
  const newProps = Object.assign({ ...props }, propertiesObj);
  return <WrappedComponent {...newProps} />;
};

export default ComponentEnhancer;