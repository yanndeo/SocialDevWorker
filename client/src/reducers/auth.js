import { REGISTER_SUCCESS ,REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types";

const initiaState ={
    token: localStorage.getItem('token'),
    isAuthentificated : null,
    loading: true,
    user: null
};


export default function(state = initiaState , action){

    const {payload , type} = action;

    let nextState;

    switch(type){

        case USER_LOADED:
            return nextState= {
                ...state,
                isAuthentificated:true,
                loading:false,
                user:payload
            };

        case REGISTER_SUCCESS: 
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)

            return nextState = {
                ...state,
                ...payload , //Token
                isAuthentificated :true,
                loading: false,
            };
        

        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token')
            return nextState = {
                ...state,
                token :null,
                isAuthentificated: false,
                loading: false
            };


        default:
            return nextState || state
    }




}