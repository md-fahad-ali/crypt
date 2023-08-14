import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import { getCookie } from "cookies-next";
import handler from "../handler";
import db from "../db";
import { getHash } from "@/lib/hash";
import { uuid } from "uuidv4";
import Web3 from "web3";
const CustomStrategy = require("passport-custom").Strategy;

const csrf = require("csurf");
const cors = require("cors");
const Joi = require("joi");

var csrfProtection = csrf({ cookie: true });
handler.use(csrfProtection);
let parseForm = bodyParser.urlencoded({ extended: false });
handler.use(passport.initialize());
handler.use(passport.session());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

handler.use(cors(corsOptions));

const sigSchema = Joi.object({
  address: Joi.string().allow(null).empty(""),
  email: Joi.string().required(),
  firstname: Joi.string().required(),
  hash: Joi.string().allow(null).empty(""),
  lastname: Joi.string().required(),
  password: Joi.string().allow(null).empty(""),
  sig: Joi.string().allow(null).empty(""),
  // type: Joi.string().required(),
  username: Joi.string().required(),
  _csrf: Joi.string().required(),
  fromSig: Joi.boolean().required(),
});

passport.use(
  new CustomStrategy(async function (req, done) {
    const web3 = new Web3("https://polygon-rpc.com");
    const fromSig = req?.body?.fromSig;
    if (fromSig == true) {
      web3.eth
        .getBlockNumber()
        .then((blockNumber) => {
          console.log(
            "Connected to Polygon network. Latest block number:",
            blockNumber
          );
        })
        .catch((error) => {
          console.error("Error connecting to Polygon network:", error);
        });

      const message = `${process.env.NEXT_PUBLIC_MESSAGE} ${req?.body?.hash}`;
      console.log(message);

      const data = await web3.eth.accounts.recover(message, req?.body?.sig);
      console.log(`${data}`);

      if (data === req?.body?.address) {
        return done(null, {
          address: data,
          username: req?.body?.username,
          fullname: `${req?.body?.firstname} ${req?.body?.lastname}`,
          email: req?.body?.email,
          // type: req?.body?.type,
        });
      } else {
        return done(null, false, { info: "Wrong Signeture" });
      }
    } else {
      return done(null, {
        address: null,
        username: req?.body?.username,
        fullname: `${req?.body?.firstname} ${req?.body?.lastname}`,
        email: req?.body?.email,
        // type: req?.body?.type,
      });
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

handler.get(parseForm, function (req, res) {
  const hash = uuid();
  res.json({ session: req?.session, csrf: req?.csrfToken(), hash: hash });
});

handler.post(parseForm, csrfProtection ,async (req, res, next) => {
  if (req.headers["x-invoke-path"] == "/api/auth/register") {
    console.log(true);
    const {
      address,
      sig,
      hash,
      username,
      firstname,
      lastname,
      // type,
      email,
      password,
      fromSig,
    } = req.body;
    console.log("I am exicuting from server side /api/metamask");
    console.log(req.body);
    if (fromSig == true) {
      const emailFind = await db.select().from("auth").where("email", email);

      const userName = await await db
        .select()
        .from("auth")
        .where("username", username);
      const wallet_address = await await db
        .select()
        .from("auth")
        .where("wallet_address", address);

      console.log(userName.length);
      if (emailFind.length != 0) {
        res.status(500).json({ error: "This email is already used" });
      } else if (userName.length == 1) {
        res.status(500).json({ error: "This username is already used" });
      } else if (wallet_address.length != 0) {
        res.status(500).json({ error: "This wallet is already used" });
      } else {
        try {
          const data = await db
            .insert({
              username: username,
              first_name: firstname,
              last_name: lastname,
              email: email,
              wallet_address: address,
              // type: type,
              password: password,
            })
            .into("auth");
          console.log(data);
          passport.authenticate("custom", (err, user, info) => {
            if (err) {
              return next(err);
            }

            if (!user) {
              return res.status(500).json(info);
            }

            req.logIn(user, async function (err) {
              if (err) {
                return next(err);
              }

              res.status(201).json({
                message: {
                  address,
                  sig,
                  hash,
                  info,
                  isAuth: req.isAuthenticated(),
                },
              });
            });
          })(req, res, next);
        } catch (error) {
          console.log(error);
          res.status(200).json(JSON.stringify(error));
        }
      }
    } else {
      const emailFind = await db.select().from("auth").where("email", email);

      const userName = await await db
        .select()
        .from("auth")
        .where("username", username);
      if (emailFind.length != 0) {
        res.status(500).json({ error: "This email is already used" });
      } else if (userName.length == 1) {
        res.status(500).json({ error: "This username is already used" });
      } else {
        try {
          const data = await db
            .insert({
              username: username,
              first_name: firstname,
              last_name: lastname,
              email: email,
              // type: type,
              password: password,
            })
            .into("auth");
          console.log(data);
          passport.authenticate("custom", (err, user, info) => {
            if (err) {
              return next(err);
            }

            if (!user) {
              return res.status(500).json(info);
            }

            req.logIn(user, async function (err) {
              if (err) {
                return next(err);
              }

              res.status(201).json({
                message: {
                  info,
                  isAuth: req.isAuthenticated(),
                },
              });
            });
          })(req, res, next);
        } catch (error) {
          console.log(error);
          res.status(200).json(JSON.stringify(error));
        }
      }
    }
  } else {
    next()
  }
});

// handler
// .use((req, res, next) => {
//       const { error } = sigSchema.validate(req.body);
//       if (error) {
//         return res.status(200).json({ error: error });
//       }
//       next();
//     })
// .post(parseForm,csrfProtection,function (req,res) {
//   const { error,value} = sigSchema.validate(req.body);
//   res.json(value)
// })

export default handler;
