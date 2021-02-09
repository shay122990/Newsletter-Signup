//jshint esversion: 6
//Requiring Modules for the app... Don't forget to install required node modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

//Initializing express, body-parser,
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
// Setting a public folder for CSS & Images.
app.use(express.static("public"));

//Send signup page as soon as the request is made on port 3000.
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  apiKey: "", //personal API from mailchimp
  server: "us7", //own server id- last three characters of apiKey
});

//Execute below when user has subscribed.
app.post("/", function(req, res) {
  //Requiring the users input.
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  //My list id from mailchimp.
  const listId = "";//UNIQUE ID LIST NUMBER FROM MAILCHIMP

  //Create object with the user data.
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  //Using created object to upload the data.
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      }
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
  response.id
  }.`
    );
  }
  //Running the function and catching the errors (if any)
  run().catch(e => res.sendFile(__dirname + "/failure.html"));

}); //end of app.post

//A post request tp redirect a user to the home route once the button "Try Again", has been executed
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Setup for Heroku server and local server. log if all is good.
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running at port 3000");
});
