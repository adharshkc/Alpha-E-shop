const express = require("express");
const {User} = require("../models/user");
const Products = require("../models/product")


const home = async function(req, res){
  
  res.render('index')
}


/**********************************************GET LOGIN****************************************************************** */
const userLogin = function (req, res) {
  res.render('signin');
};

/**********************************************POST LOGIN****************************************************************** */

const user_signin = async function (req, res) {
  const {email, password} = req.body;
  const user = await User.findOne({email})
  console.log(user)
  if(user && (await user.matchPassword(password))){
    console.log("user authenticated")
    res.redirect('/')
  }else{
    
    res.redirect('/')
  }

  
};



/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  res.render("signup");
};

/**********************************************POST REGISTER****************************************************************** */

const user_registration = async function (req, res) {
  const { name, email, password, phone } = req.body;
  console.log(
    `name ${name} email:${email}, password: ${password}, phone: ${phone}`
  );
  const user = await User.findOne({ email: email });
  if (!user) {
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      phone: phone,
    });
    console.log("user registered")
    res.redirect('/')

  }else{
    res.status(404)
    res.redirect('/')
    console.log("failed to register")
  }
};


/**********************************************EDIT USER****************************************************************** */

const editUser = async function(req, res){
  const {name, phone, houseNo, city, pincode } = req.body;
  const editedUser = await User.findByIdAndUpdate({name, phone, address})
}




const logout = async function(req,res){
  res.redirect('/')
}


module.exports = { userLogin, user_signin, user_registration, userRegister, home, logout };
