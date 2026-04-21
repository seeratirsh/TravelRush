if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
app.set("trust proxy", 1);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/travelrush";

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
  console.log("connected to mongo DB");
})
.catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Session Store Configuration: using connect-mongo to store session data in MongoDB. This is more scalable and secure than the default in-memory store, especially for production environments. The touchAfter option is set to 24 hours, which means that the session will only be updated in the database if it has been modified or if it has been more than 24 hours since the last update. This can help reduce the number of writes to the database and improve performance.
const store = new MongoStore({
  mongoUrl: dbUrl,
  crypto: {
    secret:  process.env.SECRET,
  },
  touchAfter: 24 * 3600 , // time period in seconds
});

store.on("error", function(e) {
  console.log("Mongo Session Store Error!", e);
});


// Session Configuration: added cookie expiration and maxAge to ensure the session lasts for 7 days
const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
   secure: true,
   expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
   httpOnly: true, // Mitigate XSS attacks by preventing client-side access to the cookie
  }
};

// Root Route
// app.get("/", (req, res) => {
//   res.send("Hello I am Travel Rush server");
// });

// Middleware to make flash messages available in all templates
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration for Authentication

passport.use(new LocalStrategy(User.authenticate())); // This line tells Passport how to serialize and deserialize user instances to and from the session. The serializeUser method determines which data of the user object should be stored in the session, while the deserializeUser method retrieves the user data from the session and makes it available as req.user in subsequent requests.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize()); // This line initializes Passport and allows it to be used in the application. It sets up the necessary middleware for handling authentication, such as parsing the request body and managing sessions.
app.use(passport.session()); // This line sets up Passport to use the LocalStrategy for authentication, and it uses the authenticate method provided by the User model (which is added by passport-local-mongoose) to handle the authentication process.

// This middleware runs on every request and sets res.locals.success to the value of req.flash("success"). This way, you can access the success flash message in any EJS template using <%= success %>.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // This line makes the currently authenticated user (if any) available in all EJS templates as currUser. This is useful for conditionally rendering content based on whether a user is logged in or not.
  next();
});

// This route is for testing purposes. It creates a new user with the email "
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "demo@gmail.com",
//     username: "demoUser",
//   });

//   let registeredUser =await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// Listings and Reviews Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// This route is for testing purposes. It creates a new listing with the specified details and saves it to the database. After saving, it logs a message to the console and sends a response indicating that the test was successful.
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing ({
//     title: "Loreal The Villa",
//     description: "By the Ocean",
//     price: 3500,
//     location: "Damam",
//     country: "Saudi Arabia",
//   });
//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successfully tested");
// });

app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong!"} = err;
  res.status(statusCode).render("listings/error.ejs", {err});
  // res.status(statusCode).send(message);
}); 

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});