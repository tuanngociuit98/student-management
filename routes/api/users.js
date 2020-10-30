const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
//@route   GET api/users
//@desc    Test route
//@access  Public
const User = require('../../models/User')
router.post('/',
[check('name','Name is required').not().isEmpty(),
    check('email','Please include the valid email').isEmail(),
    check('password','Please enter a password with 6 and with more characters').isLength({min:6})

],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
const {name, email, password} = req.body;
//if user exits
try{
    let user = await User.findOne({email})

    if(user){
        res.status(400).json({errors:[{msg: "Users already exits"}]});
    }
    //Get user Gravatar
const avatar = gravatar.url(email,{
    s : '200',
    r:'pg',
    d:'404'
})
user = new User({
    name,
    email,
    avatar,
    password
})
//Encrypt password
const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(password, salt);

await user.save();
//Return jsonwebtoken
    const payload ={
        user:{
            id: user.id
        }
    }
    jwt.sign(payload, config.get('jwtSecret'),{
        expiresIn:360000
    },(err, token)=>{
        if(err) throw err;
        res.json({token})
    } )

} catch(err){
    console.log(err.message)
}

})
module.exports = router