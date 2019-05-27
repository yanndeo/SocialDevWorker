import { SET_ALERT,REMOVE_ALERT } from "../actions/types";

const initialState = [];  //init

export default function(state=initialState , action ){

    let nextState;

    const { type, payload } = action ;

    switch(type){

        case SET_ALERT:
            return nextState = [ ...state, payload ];
        
        case REMOVE_ALERT:
            return nextState = state.filter(alert => alert.id !== payload )

        default:
            return nextState || state;

    }


}


/**
 * 1-on construit une fonction 
 * qui retourne un objet
 * qui va être un bout du state de l'application
 * 
 */

 /**
  * 2-Un reducer est donc une fonction qui
  *  modifie le state de votre application 
  *  en fonction d'une action.
  */

  /**
   * 3-le state doit toujours rester immuable.
   * Si vous souhaitez modifier un objet immuable, 
   * il faut créer une copie de cet objet (donc créer un nouvel objet) 
   * et y appliquer vos modifications.
   * 
   */