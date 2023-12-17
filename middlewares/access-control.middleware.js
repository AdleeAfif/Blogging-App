const expressAsyncHandler = require("express-async-handler");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} = require("firebase/auth");

const auth = getAuth();

const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password, cPassword } = req.body;

  if (!(email && password)) {
    res.status(400).redirect("/register");
    throw new Error("Required fields is/are missing");
  }

  if (password !== cPassword) {
    res.status(400).redirect("/register");
    throw new Error("Passwords are not the same!");
  }

  const created = await createUserWithEmailAndPassword(auth, email, password);

  console.log(`Account ${created.user.uid} has been created successfully!`);
  next();
});

const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    res.status(400).json({ msg: "Please enter all fields!" });
    throw new Error("Required fields is/are missing");
  }

  const login = await signInWithEmailAndPassword(auth, email, password);

  req.session.userId = login.user.uid;
  req.session.email = email;
  res.cookie("user_session", req.sessionID, {
    httpOnly: true,
    maxAge: 3600000, // Session expiration time (1 hour)
  });

  console.log(`User ${login.user.uid} logged in successfully`);
  next();
});

const authorizeUser = (req, res, next) => {
  const sessionId = req.cookies.user_session;
  if (sessionId && req.session.userId) {
    next();
  } else {
    res.status(401).redirect("/");
    throw new Error("Unauthorized Access");
  }
};

const signOutUser = (req, res) => {
  req.session.destroy(() => {
    res.status(200).redirect("/");
  });
};

module.exports = { registerUser, loginUser, authorizeUser, signOutUser };
