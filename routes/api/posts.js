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






// @route    Get api/posts
// @desc     Get All  posts
// @access   Private
router.get('/',[auth],  async(req, res)=>{


    try {

        const posts = await Post.find().sort({ date: -1 })

        res.status(200).json(posts);
        
    } catch (err) {
        console.log("get_all_posts", err.message);
        res.status(500).send("Server Error");
    }


});


// @route    GET api/posts/:id
// @desc     Get a post by ID
// @access   Private
router.get('/:id', [auth], async (req, res) => {


    try {
        const post =  await Post.findById(req.params.id)

        if(!post){
            return res.status(404).send({ msg : 'Sorry post not found'});

        }
        res.status(200).json(post);

     
    } catch (err) {
        console.log("view_post_get", err.message);
        if(err.king === 'ObjectId'){
            res.status(404).send({ msg: 'Sorry post not found' });
        }
        res.status(500).send("Server Error");
    }


});



// @route    DELETE api/posts/:id
// @desc     Delete a post by ID
// @access   Private
router.delete('/:id', [auth], async (req, res) => {


    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({ msg: 'Sorry post not found' });

        }else{
            if (post.user.toString() !== req.user.id) {

                return res.status(401).send({ msg: 'User not authozized' });

            } else {
                await post.remove();
                res.status(200).json({ msg: 'Post removed ' });

            }
        }
    

    } catch (err) {
        console.log("delete_post", err.message);
        if (err.king === 'ObjectId') {
            res.status(404).send({ msg: 'Sorry post not found' });
        }
        res.status(500).send("Server Error");
    }


});

module.exports = router;