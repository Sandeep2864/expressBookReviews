const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 let result={};
 users.filter((user) => {
    if(user.username===username) {
        result.push(user);
    }
});
 if(result.length>0) {
    return false;
 }
 else {
    return true;
 }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user=users.find((user) => user.username===username);
  
  if(!user) return false;

  return (user.password===password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username=req.body.username;
    const password=req.body.password;
    if(username && password) {
        if(authenticatedUser(username,password)) {
                let accesstoken=jwt.sign({data:password},"secret-key",{expiresIn:36000});
                req.session.authorization={accesstoken,username};
                return res.status(200).send("successfully login into account:"+username);
            }
            else {
                return res.status(404).send("user was not authenticated: "+username);
            }
        }
        else {
            return res.status(404).send("user was not logged in: "+username);
        }
    });


// Add a book review
regd_users.put("/auth/reviews/:isbn", (req, res) => {

    const isbn=req.params.isbn;
    const username=req.session.authorization.username;
    const reviews=req.query.reviews;

    //if username was not there
    if(!reviews) {
     return res.statusus(404).json({message:"review can't be empty"});
    }

    if(!books[isbn]) {
       return res.status(404).json({message:"Book was not found"});     
    }

    if(!books[isbn].reviews) {
       books[isbn].reviews={};
    }

    books[isbn].reviews[username]=reviews;

   return res.status(200).json({message:"Review added/updated successfully!",reviews:books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
