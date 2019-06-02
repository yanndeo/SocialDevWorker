const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require("express-validator/check");
const config = require('config');
const request = require('request');
const Profile = require('../../models/Profile');
const User = require('../../models/User');




// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {

  try{

      let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

      if(!profile) {
          return res.status(404).json({ msg: 'There is not profile for this user' })
      }else{
          return res.status(200).json({ profile })

      }
  }catch(err){
        console.log('profile_user', err.message);
        res.status(500).json({ msg: 'Server error' })


  }

});





// @route    POST api/profile
// @desc     Create or update profile
// @access   Private
router.post('/', [auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty(),
    ],
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('validation_error', errors.array())
        return res.status(422).json({ errors: errors.array() });
    }

    const { company, website, location, bio, status, githubusername,skills, youtube, facebook, twitter, instagram,linkedin } = req.body;

        //Build profile objet
        let profileFields = {};

        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
    
        if(skills){
           profileFields.skills = skills.split(',').map(skill => skill.trim()); //slpit ma chaine de carac via un separateur , renvoie un [] .. ensuite parcours chaque item en suppr les espaces.
        }

        //Build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try{

            let profile = await Profile.findOne({ user: req.user.id });

            if(profile){
                //UPDATE
                profile = await Profile.findOneAndUpdate(
                                         {user: req.user.id},
                                         {$set: profileFields},
                                         {new: true });  //??
              
                return res.status(200).json(profile);

            }else{
                //CREATE 
                profile = new Profile(profileFields); //new Schema({objet})
                
                await profile.save();
                return res.json(profile);

            }

        }catch(err){

            console.log('profile_user_save',err.message);
            res.status(500).send('Server Error')
        }

        console.log(profileFields.social)

        res.send('okay good');

});




// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {

    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.status(200).json(profiles);

        
    } catch (error) {
        console.log('get_profile_all', err.message);
        res.status(500).send('Server Error')
    }
});






// @route    GET api/profile/user/user_id
// @desc     Get profile by user
// @access   Public
router.get('/user/:user_id', async (req, res) => {

    try {

        const profile = await Profile.find({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
        if (!profile) {
            return res.status(400).json({ msg: "There is not profile for this user" });

        }else{
            return res.status(200).json(profile);

        }

    } catch (err) {
        console.log('get_profile_by_user', err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: "There is not profile for this user.." });

        }
        res.status(500).send('Server Error')
    }
});







// @route    DELETE api/profile
// @desc     Delete profile , user & posts
// @access   Private
router.delete('/', auth , async (req, res) => {

    try {

        //@ --remove users post 

        //Remove profile
      let profile= await Profile.findOneAndRemove({ user: req.user.id})

        //Remove user

       let user = await User.findOneAndRemove({ _id: req.user.id })

        if (!profile && !user){
            return res.status(200).json({ msg: 'User doesnt exist' });

        }
        return res.status(200).json({msg :  'User deleted'});


    } catch (err) {
        console.log('delete_profile', err.message);
        res.status(500).send('Server Error')
    }
});









// @route    PUT api/profile/experience
// @desc     Add Experience into profile user
// @access   Private
router.put('/experience', [ auth , 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),   
        check('from', 'From is required').not().isEmpty(),   

    ],
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description} = req.body;

    try {
        
        let profile = await Profile.findOne({ user: req.user.id });

        let newExperience = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        profile.experience.unshift(newExperience); //le tableau experience de notre object profile

        let profilUpdated =  await profile.save();

        res.status(200).json(profilUpdated)

    } catch (err) {
        console.log("add_experience_profile_user", err.message);
        res.status(500).send("Server Error");
    }

});







// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile 
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user : req.user.id }) ;

        //profile.experience.filter(experience => experience._id.toString() !== req.params.exp_id );

        let indexElement = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        if(indexElement >= 0) {
            profile.experience.splice(indexElement, 1);
            await profile.save();
            res.status(200).json(profile);
            
        }else{
            return res.status(200).json({ msg: 'Experience doesnt exist' });

        }
       
    } catch (err) {
        console.log('delete_profile_experience', err.message);
        res.status(500).send('Server Error')
    }
});







// @route    PUT api/profile/education
// @desc     Add Education into profile user
// @access   Private
router.put('/education', [ auth,
    [
        check('school', 'School is required').not().isEmpty(),
        check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('from', 'From is required').not().isEmpty(),

    ],
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;


    try {
          let profile = await Profile.findOne({ user: req.user.id });

          let newEducationItem = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
          };

        profile.education.unshift(newEducationItem); //le tableau education de notre ojbect profile

          let profilUpdated = await profile.save();

          res.status(200).json(profilUpdated);

        } catch (err) {
        console.log("add_education_profile_user", err.message);
        res.status(500).send("Server Error");
    }

});







// @route    DELETE api/profile/education/:edu_id
// @desc     Delete Education from profile 
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        let indexElement = profile.education.map(item => item.id).indexOf(req.params.edu_id);
                                            //[_id, _id,_id ]
        if (indexElement >= 0) {

            profile.education.splice(indexElement, 1);

            console.log(indexElement);

            await profile.save();

            res.status(200).json(profile);

        } else {
            return res.status(200).json({ msg: 'Education doesnt exist' });
        }

    } catch (err) {
        console.log('delete_profile_education', err.message);
        res.status(500).send('Server Error')
    }
});








// @route    GET api/profile/github/:username
// @desc     Get profile github'user 
// @access   Public
router.get('/github/:username', (req, res) => {

    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'Not Github profile' })
            }

            res.json(JSON.parse(body));

        });
    } catch (err) {
        console.log("get_github_profile_user", err.message);
        res.status(500).send("Server Error");
    }

});


module.exports = router;