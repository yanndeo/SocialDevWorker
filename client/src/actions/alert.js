import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from "./types";

import axios from "axios";








//defini dans ce fichier et appeller dans App ;plutot que de le construire dans les components


export const _setAlert = (msg, alertType) => dispatch=>{

    const id = uuid.v4();
    
    dispatch({
        type: SET_ALERT,
        payload : { msg, alertType , id }
    })

}