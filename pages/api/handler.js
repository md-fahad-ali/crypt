import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import nc from "next-connect";
import knex from "./db";
var session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const KnexSessionStore = require("connect-session-knex")(session);
const csrf = require("csurf");
const cors = require("cors");

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

// var csrfProtection = csrf({ cookie: true });

const store = new KnexSessionStore({
  knex,
  tablename: "sessions",
});

handler.use(
  cors({
    origin: ["http://localhost:3000","http://crypt-86b9026558ca.herokuapp.com"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
handler.use(cookieParser());
// handler.use(csrfProtection)
// handler.use(bodyParser.urlencoded({ extended: false }));
handler.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 },
    store,
  })
);

export default handler;
