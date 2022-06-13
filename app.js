const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect("mongodb://localhost:27017/articlesDB")

const Article = mongoose.model("article", {
  title: String,
  content: String
})

app.route("/article")
  .get((req, res) => {
    Article.find({}, (err, data) => {
      if (err) {
        res.send(err)
      }
      else {
        res.json(data)
      }
    })
  })
  .post((req, res) => {
    const { title, content } = req.body
    const newArticle = new Article({
      title: title,
      content: content
    })
    newArticle.save((err) => {
      res.json({ "message": "Insertion success" })
    })
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      res.json({ "message": "All articles are deleted" })
    })
  });

app.route("/article/:articleTitle")
  .get((req, res) => {
    const { articleTitle } = req.params
    Article.find({ title: articleTitle }, (err, data) => {
      if (data) {
        res.json(data)
      }
      else {
        res.json({ "message": "no article found" })
      }
    })
  })
  .put((req, res) => {
    const { articleTitle } = req.params
    const { title, content } = req.body
    Article.replaceOne({ title: articleTitle },
      { title: title, content: content }, (err) => {
        if (!err) {
          res.json({ "message": "updated full record successfully" })
        }
      })
  })
  .patch((req, res) => {
    const { articleTitle } = req.params
    Article.updateOne({ title: articleTitle },
      { $set: req.body }, (err) => {
        if (!err) {
          res.json({ "message": "updated one field successfully" })
        }
      })
  })
  .delete((req, res) => {
    const { articleTitle } = req.params
    Article.deleteOne({ title: articleTitle }, (err) => {
      res.json({ "message": "deleted one record successfully" })
    })
  })
app.listen(3000, () => {
  console.log("port is running at http://localhost:3000")
})
