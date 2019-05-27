import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from "./types";



//defini dans ce fichier et appeller dans App ;plutot que de le construire dans les components


export const _setAlert = (msg, alertType, timeout = 6000) => dispatch=>{

    const id = uuid.v4();
    
    dispatch({
        type: SET_ALERT,
        payload : { msg, alertType , id }
    });
    setTimeout( ()=> dispatch({
        type: REMOVE_ALERT,
        payload: id
    }) , timeout)

};


export const _setAlerte = (msg, alertType) => {

    return function(dispatch) {

                const id = uuid.v4();

                dispatch({
                    type: SET_ALERT,
                    payload: { msg, alertType, id }
                })

    }
}
    
    