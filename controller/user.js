const express = require("express");
const { User } = require("../models/user");
const Products = require("../models/product");
const Cart = require("../models/cart");
const { logger } = require('../utils/logger');




const home = async function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser });
  } else {
    res.render("user/index", { layout: "../layouts/layout" });
  }
};

/**********************************************GET LOGIN****************************************************************** */
const userLogin = function (req, res) {
  if (req.session.user) {
    // let isUser = true;
    res.redirect("/");
  }else if(req.session.admin){
    res.redirect("/admin")
  }
  res.render("user/login", { layout: "../layouts/layout" });
};

/**********************************************POST LOGIN****************************************************************** */

const user_signin = async function (req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // logger.info(user)
  if (user && (await user.matchPassword(password))) {
    if(user.role == 'admin'){
      req.session.admin = true
      req.session.adminid = user._id
      res.redirect("/admin")
    }else if(user.role == 'user'){
      console.log('error')
      
      req.session.user = true;
      req.session.userid = user._id
      console.log(req.session.userid)
      console.log("user authenticated");
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
};

/**********************************************GET REGISTER****************************************************************** */

const userRegister = function (req, res) {
  if (req.session.user) {
    let isUser = true;
    res.render("user/index", { layout: "../layouts/layout", isUser });
  }
  res.render("user/register", { layout: "../layouts/layout" });
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
    if (newUser) {
      const isUser = true;
      console.log("user registered");
      res.redirect("/");
    }
  } else {
    res.status(404);
    res.redirect("/");
    console.log("user already exists");
  }
};

/**********************************************EDIT USER****************************************************************** */

const user_dashboard = async function (req, res) {
  const userId = req.session.userid
  const user = await User.findOne({_id :userId}).lean()
  console.log(user)
  if (req.session.user) {
    let isUser = true;
    res.render("user/profile", {user, isUser} );
    
  }else{

    res.render("user/profile", {user} );
  }
};

const user_profile_edit = function (req, res) {
  res.render("user/edit-profile");
};

const editUser = async function (req, res) {
  const { name, phone, houseNo, city, pincode } = req.body;
  const editedUser = await User.findByIdAndUpdate({ name, phone, address });
};

const editAddress = function (req, res) {
  res.render("user/edit-address");
};


/**************************************************************GET POST CART**********************************************************/
const cart = async function(req, res){
  if (req.session.user) {
    const userId = req.session.userid
    let isUser = true;
    const cart = await Cart.findOne({user: userId}).populate('items.product').lean()
    
    res.render("user/cart", { layout: "../layouts/layout", isUser, cart: cart });
  }
  
}




const checkout = function (req, res) {
  res.render("user/checkout");
};

const logout = async function (req, res) {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  userLogin,
  user_signin,
  user_registration,
  userRegister,
  user_dashboard,
  user_profile_edit,
  editAddress,
  cart,
  checkout,
  home,
  
  logout,
};
