const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const config = require('config')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
//@route   GET api/auth
//@desc    Authenticate user and get token
//@access  Public
router.get('/',auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})
router.post('/',
[
    check('email','Please include the valid email').isEmail(),
    check('password','Password is required').exists()

],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
const { email, password} = req.body;
//if user exits
try{
    let user = await User.findOne({email})

    if(!user){
        res.status(400).json({errors:[{msg: "Invalid credentials"}]});
    }
    //Get user Gravatar



await user.save();

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
    res.status(400).json({errors:[{msg: "Invalid credentials"}]});
}
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