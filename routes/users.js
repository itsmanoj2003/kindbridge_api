var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
const { default: userModel } = require('../models/userModel');


router.post('/createuser', async (req, res) => {

  try {
    const { userName, age, mobileNumber, maritalStatus, gender, companionName, aadharNumber, email, password } = req.body

    const existUser = await userModel.findOne({ email })
    if (existUser) {
      return res.status(409).json({ message: "User Already Exist" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new userModel({
      userName,
      age,
      mobileNumber,
      maritalStatus,
      gender,
      companionName,
      aadharNumber,
      email,
      password: hashedPassword
    })

    await newUser.save()

    // const transport = nodemailer.createTransport({
    //   host:'sandbox.smtp.mailtrap.io',
    //   port:2525,
    //   secure:false,
    //   auth:{
    //     user:process.env.EMAIL,
    //     pass:process.env.PASSWORD
    //   }
    // })

    // const token = jwt.sign({email},process.env.SECRET_KEY,{expiresIn:'1h'})
    // const verificationLink = `http://localhost:3001/users/verify/${token}`;

    // await transport.sendMail({
    //   from:'KindBridge',
    //   to:email,
    //   subject:"Verification email from KindBridge",
    //   html:`<a href="${verificationLink}">Click to Verify</a>`
    // })


    return res.status(200).json({ message: 'New User Created & Activation Link Send' })
  }
  catch (error) {
    return res.status(500).json({ message: 'Server Error', error })
    }
})


router.get('/verify/:token', async(req,res)=>{
  const {token} = req.params

  const decode = jwt.verify(token,process.env.SECRET_KEY)

  const user = await userModel.findOne({email:decode.email})

  if(!user){
    return res.status(404).json({message:"Invalid Token"})
  }
  user.isVerified = true;
  await user.save()
  res.status(200).json({message:"Verification Successfull"})

})


router.post('/userlogin', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not Found" })
    }

    // if(!user.isVerified){
    //   return res.status(409).json({message:"User is not verified"})
    // }

    const validatePassword = await bcrypt.compare(password, user.password)
    if (!validatePassword) {
      return res.status(401).json({ message: "Incorrect Password" })
    }

    const updatedUser = user.toObject()
    delete updatedUser.password
    return res.status(200).json({ message: "Login Successful", updatedUser })
  }
  catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
})

module.exports = router;
