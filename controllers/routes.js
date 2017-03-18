const express = require ('express'),
      router = express.Router(),
      db = require('../db/db');

// get route for /
router.get("/", function(req,res){
  console.log("render index file");
  res.render('index');
})

// get route for people, will render the index file in people folder in views
router.get("/people",function(req,res){
  // pulls information from database, in this case, getting all the db info from the table people
  db.any("SELECT * FROM people")
  .then(function(data){
    // insert information into an object, so we can render it with mustache
    var peopleInfo= {'people': data};
    res.render('people/index', peopleInfo);
  })
})

// post route for people, will add a user
router.post("/people", function(req,res){
  // grabs form data from index.html in views/people
  people = req.body;
  // inserts the form data into database
  var insertItem = db.none('INSERT INTO people (name, favoriteCity) VALUES ($1, $2)',
    [people.name, people.favoriteCity])
  // after data is inserted, hit the get route
  insertItem.then(function(){
    res.redirect('/people')
  })
})

// get route for individual person, id will bring user to show page for individual user info
router.get("/people/:id",function(req,res){
  id = req.params.id;
  db.one("SELECT * FROM people WHERE id=$1",
    [req.params.id]).then(function(data){
      var personId = {'people':data};
      res.render('people/show', personId)
    }
  )
})



module.exports = router;
