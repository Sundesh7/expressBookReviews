const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(req.body.username, req.body.password)) {
    const accessToken = jwt.sign({ data: username, }, "access", { expiresIn: 60 * 60, }
    );

    req.session.authorization = { accessToken, username };
    return res.status(300).json({ message: "Customer successfully logged in" });
  } else {
    return res.status(300).json({ message: "Invalid Username or Password" });
  }
})

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  books[isbn].reviews[req.session.authorization["username"]] = review;
  return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " has been added/updated." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  delete books[isbn].reviews[req.session.authorization["username"]];
  return res.status(200).json({ message: "The review for the book with ISBN " + isbn + " has been deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
