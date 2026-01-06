// Enable dotenv only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");

const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewsRouter = require("./routes/review.js");

// ----------------------
// Database connection
// ----------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error:", err));

// ----------------------
// App config
// ----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ----------------------
// Session & Flash config
// ----------------------
const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

// ----------------------
// Passport config
// ----------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----------------------
// Global middleware (flash + user)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ----------------------
// Routes
// ----------------------
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/", userRouter);
app.use("/", reviewsRouter);

// ----------------------
// 404 Handler
// ----------------------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ----------------------
// Centralized Error Handler
// ----------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// ----------------------
// Start server
// ----------------------
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});










