import React ,{Fragment, useState} from 'react'
import {Link, Redirect} from 'react-router-dom'

//Redux
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
//Actions
import { _login } from "../../actions/auth";





const Login = ({ _login, isAuthentificated}) => {


    const [formData, setFormData ] = useState({
        password: '',
        email: '',
    });

    const { password, email } = formData;

    const onChange=(e)=>{
        setFormData({ ...formData, [e.target.name]:e.target.value }) ;
    };

    const onSubmit = async(e)=>{
        e.preventDefault();
        const user = { email,  password };
        _login(user)       

    };

    //Redirect if logged in

  if (isAuthentificated){
    return <Redirect to="/dashboard" />
  }


    
    return (
      
      <Fragment>

        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user" /> Sign into Your Account
        </p>

        <form className="form" onSubmit={e => onSubmit(e)} noValidate>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => onChange(e)}
              name="password"
            />
          </div>

          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </Fragment>
    );
}


Login.propTypes = {
  _login: PropTypes.func.isRequired,
  isAuthentificated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthentificated: state.auth.isAuthentificated
});
export default connect(mapStateToProps , {_login})(Login)