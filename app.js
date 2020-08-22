//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useUnifiedTopology: true, useNewUrlParser:true });

const articleSchema= {
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){

    Article.find({}, function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        }else{
            res.send(err);
        }
    });

})

.post(function(req,res){

    const newArticle = new Article({
        title:req.body.title,
        content : req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new Article");
        }
        else{
            res.send(err);
        }
    });

})

.delete(function(req,res){

    Article.deleteMany({}, function(err){

            if(!err){
                res.send("Succefully deleted everything,")
            }else{
                res.send(err);
            }
});
});

app.route("/articles/:articletitle")

.get(function(req,res){

    let titlename = req.params.articletitle;

    Article.find({title : titlename}, function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article matching.");
        }
    });
})

.put(function(req,res){

    Article.update(
        {title : req.params.articletitle},
        {title:req.body.title,content : req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Succesfully Changed title");
            }else{
                res.send(err);
            }
        });
})

.patch(function(req,res){

    Article.update(
        {title : req.params.articletitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Succcefuuly update article");
            }else{
                res.send(err);
            }
        });

})

.delete(function(req,res){

    Article.deleteOne({title: req.params.articletitle}, function(err){

            if(!err){
                res.send("Succefully deleted article");
            }else{
                res.send(err);
            }
        });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});