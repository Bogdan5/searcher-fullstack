import React from 'react';
// import PropTypes from 'prop-types';
import '../App.css';

class DataDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {
      prevPath: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location })
    }
  }

  render() {
    const {prevPath} = this.state;
    return (
      <div className='dataDisplay'>
        <Route render={() => (
          (prevPath === '/') ? <Table /> : <Redirect to='/' />
        )} />
      </div>
    );
  }
};

// DataDisplay.propTypes = {
//   data: PropTypes.object.isRequired
// };

export default DataDisplay;
