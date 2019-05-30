import { GET_PROFILE, PROFILE_ERROR , CLEAR_PROFILE} from '../actions/types'



const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}


export default function(state = initialState, action) {

    const { type, payload } = action;

    let nextState ;

    switch(type){

        case GET_PROFILE: 
            return nextState= {
                ...state,
                profile: payload,
                loading: false
            };

        case PROFILE_ERROR:
            return nextState = {
                ...state,
                loading:false,
                error: payload,
                
            };
            
        case CLEAR_PROFILE:
            return nextState = {
                ...state,
                loading: false,
                profile: null,
                repos: [],
            };    

        default:
            return nextState || state;   
    }

}