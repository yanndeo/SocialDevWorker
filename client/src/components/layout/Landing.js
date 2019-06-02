import React from 'react'
import { Link, Redirect } from 'react-router-dom';
//Redux
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';




const Landing = ({ isAuthentificated }) => {

    if(isAuthentificated){
       return <Redirect to="/dashboard" />;
    }


  return (

        <section className="landing">
        <div className="dark-overlay">
            <div className="landing-inner">
            <h1 className="x-large">Social Dev Worker </h1>
            <p className="lead">
                Create a developer profile/portfolio, share posts and get help from
                other developers
            </p>
            <div className="buttons">
                <Link to="/register" className="btn btn-primary">
                Sign Up
                </Link>
                <Link to="/login" className="btn btn-light">
                Login
                </Link>
            </div>
            </div>
        </div>
        </section>
  );
};



Landing.propTypes = {
  isAuthentificated : PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthentificated: state.auth.isAuthentificated
});

export default connect(mapStateToProps, {})(Landing);
