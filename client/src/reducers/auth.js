import { REGISTER_SUCCESS ,REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from "../actions/types";

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
            localStorage.setItem('token', payload.token)

            return nextState = {
                ...state,
                ...payload , //Token
                isAuthentificated :true,
                loading: false,
            };
        

        case REGISTER_FAIL:
        case AUTH_ERROR:
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