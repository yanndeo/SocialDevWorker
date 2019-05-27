import React ,{ Fragment,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//Component
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
//Redux
import { Provider } from 'react-redux';
import store from './store';
import "./App.css";
//Actions
import { _loadUser } from './actions/auth';
//Utils
import setAuthToken from './utils/setAuthToken';



 if(localStorage.token){
      setAuthToken(localStorage.token);
 }

const App = () => {


  useEffect(() => {
    store.dispatch(_loadUser())
  },[]);


  console.log('truc')
  return (

    <Provider store={store} >
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )

    


}




export default App

