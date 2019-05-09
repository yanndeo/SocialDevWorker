const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//SETTER 
function toLower(v) {
    return v.toLowerCase();
}

const UserSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true
    },
    email:{
        type: String,
        required :true,
        unique: true,
       // lowercase: true
        set: toLower
    },
    password : {
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,

    },
    data:{
        type: Date, 
        default: Date.now
    }
});


UserSchema.pre('save', async function (next) {

    const user = this;

    if (!user.isModified || !user.isNew) {
        next();

    } else {
        
        try{
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            next();

        }catch(err){
            console.log('hash_pwd_error:', err.message);
            res.status(500).send('could not hash password ')
        }
    }


}); 








module.exports = User = mongoose.model('user', UserSchema);