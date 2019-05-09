const  express = require('express');
const gravatar = require('gravatar');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require("config");
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

 
// @route    POST api/users
// @desc     Register Route
// @access   Public
router.post('/', [
    check('name', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 4 or more characters').isLength({ min: 4 })
],

async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, password} = req.body;
    const email = req.body.email.toLowerCase();

    try{
        //check if user exist already
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ errors: [{msg: 'User already exist'}] } );
        }

        //Get users gravatar
        var avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt paassword
        //const salt = await bcrypt.genSalt(10);
        //user.password = await bcrypt.hash(password, salt);

        await user.save();

        //return jsonwebtoken
        const payload = {
            user: { 
                id: user.id
            }
        };

      let token= await jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 } );

        res.status(201).json({token})

    }catch(err){
        console.log('save_user_error:',err.message);
        res.status(500).send('Server error')
    }

});




module.exports = router;