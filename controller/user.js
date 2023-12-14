const express = require("express");
const {User} = require("../models/user");


const home = function(req, res){
  res.render('home')
}


/**********************************************GET LOGIN****************************************************************** */
const userLogin = function (req, res) {
  res.render('index');
};

/**********************************************POST LOGIN****************************************************************** */

const user_signin = async function (req, res) {
  const {email, password} = req.body;
  const user = await User.findOne({email})
  console.log(user)
  if(user && (await user.matchPassword(password))){
    res.json("user authenticated")
  }else{
    res.json("user not found")
  }

  
};



/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  res.send("welcome register page");
};

/**********************************************POST REGISTER****************************************************************** */

const user_registration = async function (req, res) {
  const { name, email, password, phone } = req.body;
  // console.log(
  //   `name ${name} email:${email}, password: ${password}, phone: ${phone}`
  // );
  const user = await User.findOne({ email: email });
  if (!user) {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      phone: phone,
    });
    res.json("user created successfully")
  }else{
    res.status(404)
    res.json("user already exists")
  }
};


/**********************************************EDIT USER****************************************************************** */

const editUser = async function(req, res){
  const {name, phone, houseNo, city, pincode } = req.body;
  const editedUser = await User.findByIdAndUpdate({name, phone, address})
}

module.exports = { userLogin, user_signin, user_registration, userRegister, home };
