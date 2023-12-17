const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore, collection } = require("firebase/firestore");

// Firebase Configurations
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_BUCKET,
  messagingSenderId: "439870881229",
  appId: process.env.FB_APP_ID,
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Express Configurations
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.json()); //!important: For request body
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

const { router } = require("./routes");

app.use("/", router);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Blogging app is running on port ${port}`);
});
