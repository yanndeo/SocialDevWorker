const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const auth = require('../../middleware/auth');
const  User = require('../../models/User');


// @route    GET api/auth
// @desc     Test Route
// @access   Private
router.get('/', auth, async(req, res) => {

    try{
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user)

    }catch(err){   
        console.log(err)     
        res.status(500).send('Server error')
    }
});





// @route    POST api/auth
// @desc     Authenticate user & and get token (login)
// @access   Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],

    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { password , email} = req.body;

        try {
            //check if user exist already
            let user = await User.findOne({ email });

                if (!user) {
                    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
                }

            let isMatch = await bcrypt.compare(password, user.password);
            
                if(!isMatch){
                    return resstatus(400).json({ errors: [{ msg: 'Invalid credentials' }] });
                    
                }

                //return jsonwebtoken
                const payload = {
                    user: {
                        id: user.id
                    }
                };

                jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token)=>{
                    if (err) throw err;
                    res.status(201).json({ token })
                });


        } catch (err) {
            console.log('login_user_error:', err.message);
            res.status(500).send('Server error')
        }

    });





module.exports = router;