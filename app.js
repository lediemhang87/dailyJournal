//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
const dailyJournal = [];


const homeStartingContent = "Welcome to my dailyJournal. This is a simple web application made by Ashley Le through the instruction of Angela Yu from App Brewery Course. This web app is going to be updated for a newer version soon. Thank you for visiting and I hope you enjoy the experience through this website.";
const aboutStartingContent = "My name is Ashley Le. I am a Computer Science major student. I enjoy the experience of making a product, especially producing an interface for user. I hope I can get better in the future.";
const contactStartingContent = "You can contact me through my email: lediemhang87@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-ashley:behang@cluster0.6ivlj.mongodb.net/dailyJournal?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });

const postsSchema = {
  title: String,
  content: String
}

const Post = mongoose.model ("Post", postsSchema);

const welcome = new Post({title: "Welcome to dailyJournal", content: "Create your own journal here"});
const defaultPost = [welcome];

app.get("/", function(req,res){

  Post.find({}, function(err, foundItems){
  if (foundItems.length === 0)
  {
    Post.insertMany(defaultPost, function(err){})
    res.render("home", {homeContent: homeStartingContent, dailyJournalContent: defaultPost});
  } else {
    res.render("home", {homeContent: homeStartingContent, dailyJournalContent: foundItems});
  }
})
})

app.get("/about", function(req,res){
  res.render("about", {aboutContent: aboutStartingContent});
})

app.get("/contact", function(req,res){
  res.render("contact", {contactContent: contactStartingContent});
})

app.get("/compose", function(req,res){
  res.render("post");
})

app.get("/post/:topic", function(req,res){


  Post.find({}, function(err, foundItems){
    for (var i = 0; i < foundItems.length; i++)
    {
      if (_.lowerCase(req.params.topic) === _.lowerCase(foundItems[i].title))
      {
        res.render("compose", {title: foundItems[i].title, content: foundItems[i].content })
        break;
      }
    }
  })
})

app.post("/post/:topic", function(req,res){
  res.redirect("/compose");
})

app.post("/compose", function(req,res){

  var post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }
  if (post.title !== undefined && post.content !== undefined)
  {
    const postTitle = req.body.postTitle;
    const postContent = req.body.postBody;

    const newPost = new Post({
      title: postTitle,
      content: postContent
    })


    newPost.save();
    // res.redirect("/todolist");
  }
  // console.log(dailyJournal);
  res.redirect("/");
})

app.post("/", function(req,res){
    const postTitle = req.body.posTitle;

    Post.remove({title: postTitle}, function(err) {
    if (!err) {
      console.log("Successfully remove" + postTitle);
    }
    else {
      console.log(err);
    }
  });
  res.redirect("/");
})

app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});
