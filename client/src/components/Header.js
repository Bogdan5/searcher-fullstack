import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const Header = (props) => {
  const { title } = props;
  return (<div className='headerClass'>{title}</div>);
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
