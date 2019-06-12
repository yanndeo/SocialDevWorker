import React, { Fragment,useEffect} from 'react'
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types'
import { connect } from 'react-redux';

//Component
import Spinner from '../layout/Spinner'
//Actions
import { _getCurrentProfile } from '../../actions/profile';
import DashboardActions from './DashboardAction';



 
const Dashboard = ({ _getCurrentProfile, auth: {user }, profile: { profile, loading} }) => {


    useEffect(()=>{

        _getCurrentProfile()
        // eslint-disable-next-line
    }, []) ; 

    return loading && profile === null 
        ? <Spinner/> 

        : <Fragment> 
            <h1 className="large text-primary"> Dashboard </h1>
            <p className = "lead">
            <i className="fa fa-user"> </i> Welcome { user && user.name} </p>

            { profile === null    //if user profile is null
                ? <Fragment> 
                    <p> You have not yet setup a profile , please add some info</p>
                    <Link to='/create-profile' className="btn btn-primary my-1"> Create Profile </Link>
                 </Fragment>
            
                : <Fragment> <DashboardActions/>  </Fragment>
            }

        </Fragment>

}






Dashboard.propTypes = {
    _getCurrentProfile : PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile_r,
});
export default connect(mapStateToProps,{_getCurrentProfile})(Dashboard)