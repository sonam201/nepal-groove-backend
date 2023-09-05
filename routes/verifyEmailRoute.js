const jwt = require('jsonwebtoken')
const connectDB = require('../db/connect');
const User = require('../models/user');

const verifyEmailRoute = {
    path:"/api/verifyemail",
    method:"put",
    handler:async (req,res)=>{
        const {verificationString} = req.body;
        console.log(req.body)
        const db =connectDB(process.env.MONGO_URI);
        const result = await User.findOne({
            verificationString,
        })
        if(!result) return res.status(401).json({message:'The email verification code is incorrect'})
        const {_id:id,email} = result;
        await User.updateOne({_id:id},{
            $set : {isVerified:true}
        });
        jwt.sign({id, email, isVerified:true},process.env.JWT_SECRET,{expiresIn:'2'},(err,token)=>{

           if(err) return res.sendStatus(500);
           res.status(200).json({token})
        });
    }
}

module.exports = verifyEmailRoute
