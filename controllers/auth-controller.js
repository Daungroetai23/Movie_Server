const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const db = require("../models/db");

exports.register = async (req, res, next) => {
  const {password, confirmPassword, email ,username,phone,role} = req.body;
  try {
    // validation
    if (!(email && password && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      password : hashedPassword,
      email,
      username,
      phone,
      role
    };

    const rs = await db.user.create({ data  })
    console.log(rs)

    res.json({ msg: 'Register successful' })
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const {email, password} = req.body
  try {
    // validation
    if( !(email.trim() && password.trim()) ) {
      throw new Error('username or password must not blank')
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where : { email }})
    // check password
    const pwOk = await bcrypt.compare(password, user.password)
    if(!pwOk) {
      throw new Error('invalid login')
    }
    // issue jwt token 
    const payload = { user: user.email ,role:user.role}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    // console.log(token)
    res.json({token : token,user:user,payload:payload})
  }catch(err) {
    next(err)
  }
};

exports.getProfile = (req,res,next) => {
  res.json(req.user)
}