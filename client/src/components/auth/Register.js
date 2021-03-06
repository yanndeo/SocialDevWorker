import React ,{Fragment, useState} from 'react'
import { Link ,Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//Action :_xxYYYY
import { _setAlert } from "../../actions/alert";
import { _register } from '../../actions/auth';




const Register = ({ _setAlert, _register, isAuthentificated}) => {

    //Definition du state : Hook[state, setState ] =  useSate(initialize)
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        password2: ''
    });


  // const { name, email, password, password2 } = this.state;
    const { name, email, password, password2 } = formData;
 


    const onChange = (e)=>{
        
        setFormData({ ...formData, [e.target.name]: e.target.value })
        //setState({ x : newValue})
    };


    const onSubmit = async(e)=>{

        e.preventDefault();
       
        //Check matching password
        if(password !== password2){
            _setAlert('password no correspondance', 'danger');
        }else{
            _register(name, email, password)
            console.log('SUCCESS',formData);

        }
    };

    if (isAuthentificated){
        return <Redirect to="/dashboard" />;
    }


    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

            <form className="form" onSubmit = { e=> onSubmit(e) } noValidate >
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => onChange(e)}
                        required />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                         placeholder="Email Address" 
                         name="email"
                         value={email} 
                         onChange= {e=> onChange(e)}
                         required
                         />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                        minLength="6"
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>

            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    );
};


 Register.propTypes = {
    _setAlert : PropTypes.func.isRequired,
    _register: PropTypes.func.isRequired,
     isAuthentificated: PropTypes.bool,
}


const mapStateToProps = state => ({
    isAuthentificated: state.auth.isAuthentificated
});
export default connect(mapStateToProps, { _setAlert, _register}) (Register)