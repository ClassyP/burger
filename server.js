var express = require("express");
var exphbs = require("express-handlebars");
var path = require('path');
var bodyParser = require("body-parser");
var sequelize = require('sequelize');
var db = require('./models');

// Create an instance of the express app.
var app = express();
// // Specify the port.
var PORT = process.env.PORT || '8080';
//  Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views"
}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
// middlewear
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// static files
app.use(express.static('public'))
    //serve the favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Routes
// =============================================================
app.get("/",function(req,res){
  res.render("burger",{title: "phil"})

});
// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({force:false}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});