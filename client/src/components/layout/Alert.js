import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


//2- Destructuring des du state placé en props.
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
  ));
  
 

Alert.propTypes = {
alerts: PropTypes.array.isRequired
}

//1- mappons le state dans les props

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps, null)(Alert);
