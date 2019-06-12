import React, { useState, Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {  withRouter } from "react-router-dom";
import Goback from "../layout/GoBack";
//Actions
import { _createProfile, _getCurrentProfile } from '../../actions/profile';


const EditProfile = ({ profile: { profile, loading }  , _createProfile, _getCurrentProfile, history }) => {

  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });


  //Show or display social fields inputs
  const [displaySocialInputs, toggleSocialInputs] = useState(false);


  useEffect(() => {

    _getCurrentProfile(); //Fill the form with the profile values

        setFormData({
          status: loading || !profile.status ? "" : profile.status,
          company: loading || !profile.company ? "" : profile.company,
          website: loading || !profile.website ? "" : profile.website,
          location: loading || !profile.location ? "" : profile.location,
          bio: loading || !profile.bio ? "" : profile.bio,
          githubusername: loading || !profile.githubusername ? "" : profile.githubusername,
          skills: loading || !profile.skills ? "" : profile.skills.join(","),
          twitter: loading || !profile.social ? "" : profile.social.twitter,
          youtube: loading || !profile.social ? "" : profile.social.youtube,
          linkedin: loading || !profile.social ? "" : profile.social.linkedin,
          instagram: loading || !profile.social ? "" : profile.social.instagram,
          facebook: loading || !profile.social ? "" : profile.social.facebook
        });
    
    // eslint-disable-next-line
  }, [loading]);


  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

console.log('okok',status)

  //On change value set state
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("state", formData);





  //Send Datas
  const onSubmitData = e => {
    console.log("profile_data", formData);
    e.preventDefault();
    _createProfile(formData, history, true);
  };





  return (




    <Fragment>
      <h1 className="large text-primary"> Create Your Profile </h1>
      <p className="lead">
        <i className="fas fa-user" /> Let's get some information to make your profile stand out
      </p>
      <small> * = required field</small>

      <form className="form" onSubmit={e => onSubmitData(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e => onChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            Please use comma separated values (eg.HTML,CSS,JavaScript,PHP)
          </small>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>

        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={e => onChange(e)}
          />
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {/* if true then display(Fragment) */}


        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x" />
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={e => onChange(e)}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-success my-1" value="Update" />
        <Goback/>
        {/* <Link className="btn btn-light my-1" to="#"> Go Back </Link> */}
      </form>
    </Fragment>
  );
};

//PropType
EditProfile.propTypes = {
  _createProfile: PropTypes.func.isRequired,
  _getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile : state.profile_r,
   //loading: state.profile_r.profile.loading,
})

export default connect(mapStateToProps, { _createProfile, _getCurrentProfile })(withRouter(EditProfile))
//rafcp