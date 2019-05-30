import React, {Fragment} from 'react'
import { Link } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
//Actions
import { _logout } from '../../actions/auth';


const Navbar = ({ auth:{ isAuthentificated, loading}, _logout}) => {

    const authLinks = (
            <ul>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user"></i>
                    <span className="hide-sm">Dashboard </span>
                </Link>
            </li>
                <li>
                    <a href="#!" onClick={ _logout } >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="hide-sm">LOGOUT </span> 
                    </a>
                </li>
            </ul>
        );


    const normalLinks = (
            <ul>
                <li><Link to="#!">Developers</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login"> Login</Link></li>
            </ul>
    );



    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> Social Dev Worker</Link>
            </h1>

            {!loading && (<Fragment>{isAuthentificated ? authLinks : normalLinks} </Fragment>)}

        </nav>
    )
}


Navbar.propTypes = {
    _logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}


const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps,{_logout})(Navbar);