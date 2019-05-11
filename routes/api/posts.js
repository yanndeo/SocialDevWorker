const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");



// @route    POST api/posts
// @desc     Create a Post
// @access   Private
router.post('/',[auth, 
    [
        check('text', 'Text is required').not().isEmpty()
    ]
],
async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try{


        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save(newPost);

        res.json(post);

        
      
    }catch(err){
        console.log('post_save', err.message);
        res.status(500).send('Server Error')
    }


});

module.exports = router;