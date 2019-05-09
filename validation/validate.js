const express = require('express');
const { check, validationResult } = require("express-validator/check");


 const userValidation = ()=>{

     [
        check('name', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter password with 4 or more characters').isLength({ min: 4 })
    ]

};

module.exports = userValidation;