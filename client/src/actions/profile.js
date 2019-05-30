import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR } from './types';

//Other actions
import { _setAlert } from "./alert";
import setAuthToken from '../utils/setAuthToken';


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
        console.log(error)
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: error.response.statusText , status: error.response.status }
        });
    }

 }