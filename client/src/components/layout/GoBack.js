import React from 'react'
import { Link } from 'react-router-dom';

const Goback = () => {
    return (
        <Link 
          className="btn btn-light my-1" 
          to="/dashbord"> Go Back 
          </Link>

    )
}

export default Goback