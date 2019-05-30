
import axios from 'axios';
//Types
import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED,
    AUTH_ERROR ,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, 
    CLEAR_PROFILE} from "./types";
//Other Action
import { _setAlert } from './alert';
//Utils
import setAuthToken from "../utils/setAuthToken";




/**
 * Load USer
 */
export const _loadUser=()=> async dispatch =>{

    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type:USER_LOADED,
            payload: res.data
        });

    } catch (error) {
        
        dispatch({
            type:AUTH_ERROR,
        })
    }



}




/**
 * Register USer action creator 
 */

export const _register = (name, email, password) => async dispatch => {

    const config ={
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const userData = JSON.stringify({ name, email, password });

    console.log(userData)

   try {
       const res = await axios.post('/api/users', userData, config); 

       dispatch({
           type: REGISTER_SUCCESS,
           payload: res.data
       });

       dispatch(_loadUser());
 

   } catch (error) {

    const errors =error.response.data.errors;
    if(errors){
        errors.forEach(err => {
            dispatch(_setAlert(err.msg, 'danger'))
        });
    }
       dispatch({
           type: REGISTER_FAIL,
       })
   }


}



/**
 * LOGIN USer action creator 
 */

export const _login = ({ email, password }) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const userData = JSON.stringify({  email, password });

    console.log(userData)

    try {
        const res = await axios.post('/api/auth', userData, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(_loadUser());
    } catch (error) {

        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(err => {
                dispatch(_setAlert(err.msg, 'danger'))
            });
        }
        dispatch({
            type: LOGIN_FAIL,
        })
    }


}


/**
 * Logout User  /clear profile
 */
export const _logout = () => dispatch =>{

    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });


}