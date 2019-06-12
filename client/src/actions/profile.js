import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR } from './types';
//Other actions
import { _setAlert } from "./alert";
//Utils


/**
 * Get current user profile
 */
export const _getCurrentProfile = () => async dispatch => {

   /*  if (localStorage.token) {
        setAuthToken(localStorage.token);
    } */

    try {
        const res = await axios.get('/api/profile/me');
        console.log('my_profile',res.data)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (error) {
        console.log('get_current_profile_action',error)
      
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: error.response.statusText , status: error.response.status }
        });
    }

 }





 /**
  * Create or Update Profile
  */
 export const _createProfile = (formData, history, edit=false) => async dispatch =>{

    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        };

        console.log('data',formData)

        const res = await axios.post('/api/profile', formData, config);
        
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch( _setAlert( edit ? 'Profile Updated' :  'Profile Created' , 'success') );

        
        if(!edit){  //creation
            history.push('/dashboard')
        }

    } catch(error) {

        console.log('create_profile_action', error)
        const errors = error.response.data.errors;
        if (errors){
            errors.forEach(err => {
                dispatch(_setAlert(err.msg, 'danger'))
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }
 } 