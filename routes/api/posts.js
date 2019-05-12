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

        const post = await newPost.save();

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
        console.log("get_post", err.message);
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
            //Check ownner
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





// @route    PUT api/posts/like/:id
// @desc     Like a post 
// @access   Private
router.put('/like/:id', auth, async(req, res)=>{

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({ msg: 'Sorry post not found' });

        } else {
            //Check if the post has already been liked
            if( post.likes.filter(like => like.user.toString() === req.user.id ).length > 0 ){
                return res.status(400).json({ msg : 'Post already liked'});
            }else{
                post.likes.unshift({ user: req.user.id});

                await post.save();

                res.json(post.likes);

            }
        }
        
    } catch (err) {
        console.log("like_post", err.message);
        if (err.king === "ObjectId") {
          res.status(404).send({ msg: "Sorry post not found" });
        }
        res.status(500).send("Server Error");
    }

});





// @route    PUT api/posts/unlike/:id
// @desc     unLike a post 
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({ msg: 'Sorry post not found' });

        } else {

            /**
             * Check if the post has already been liked
             * filter renvoit un [] de posts dont le like.user correspond à l'utilisateur connected 
             */  

            if (post.likes.filter(like => like.user.toString() === req.user.id ).length === 0) {

                return res.status(400).json({ msg: 'Post has not yet been liked'});

            } else {

                //remove index 
                const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

                post.likes.splice(removeIndex, 1);

                await post.save();

                res.json(post.likes);

            }
        }

    } catch (err) {
        console.log("unlike_post", err.message);
        if (err.king === "ObjectId") {
            res.status(404).send({ msg: "Sorry post not found" });
        }
        res.status(500).send("Server Error");
    }

});





// @route    PUT api/posts/comment/:id
// @desc     Comment on a Post
// @access   Private
router.put('/comment/:id', [auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {

            let post = await Post.findById(req.params.id);

            /**
             * Make sure post exists
             */
            if(!post){
                res.status(404).send({ msg: "Sorry post not found" });

            }else{

                const user = await User.findById(req.user.id).select('-password');

                /**
                 * Create Object
                 */
                const newComment = {
                    text: req.body.text,
                    name: user.name,
                    avatar: user.avatar,
                    user: req.user.id
                };

                /**
                 * Add newComment in post.comments[]
                 */
                post.comments.unshift(newComment);

                await post.save();

                res.json(post);
            }

        

        } catch (err) {
            console.log('comment_save', err.message);
            if (err.king === "ObjectId") {
                res.status(404).send({ msg: "Sorry post not found" });
            }
            res.status(500).send('Server Error')
        }


    });




// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete a comment on a Post
// @access   Private
router.delete('/comment/:post_id/:comment_id',[auth], async(req, res)=>{


    try {
        let post = await Post.findById(req.params.post_id);

        /**
         * Make sure post exists
         */
        if (!post) {
            res.status(404).send({ msg: "Sorry post not found" });

        } else {

            /**
             * Pull out comment
             */
            const comment = post.comments.find(comment => comment.id.toString() === req.params.comment_id);

            /**
             * Make sure comment exists
             */
            if (!comment) {
                return res.status(404).json({ msg: "Comment does not exist" });
            }

            /**
             * Check current user is comment user
             */
            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: "User not authorised" });
            }

            /**
             * Delete the comment
             */
            await comment.remove();

            /**
             * Save the post
             */
            await post.save();

            res.json(post.comments);


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