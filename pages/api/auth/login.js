import handler from "../handler";
import passport, { use } from "passport";
import session from "express-session";
import { getCookie } from "cookies-next";
const CustomStrategy = require("passport-custom").Strategy;
import db from "../db";
import { getHash } from "@/lib/hash";
import { uuid } from "uuidv4";
import Web3 from "web3";
import bodyParser from "body-parser";

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
  email: Joi.string().allow(null).empty(""),
  hash: Joi.string().allow(null).empty(""),
  password: Joi.string().allow(null).empty(""),
  sig: Joi.string().allow(null).empty(""),
  _csrf: Joi.string().required(),
  fromSig: Joi.boolean().required(),
});

passport.use(
  new CustomStrategy(async (req, done) => {
    const { email, password, fromSig, adress } = req.body;
    const { error,value } = sigSchema.validate(req.body);
    if (error) {
      console.log(error);
      return done(null, false, { info: "error" });
    }
    if (fromSig == true) {
      console.log(fromSig);
      const web3 = new Web3("https://polygon-rpc.com");
      const message = `${process.env.NEXT_PUBLIC_MESSAGE} ${req?.body?.hash}`;
      try {
        const data = await web3.eth.accounts.recover(message, req?.body?.sig);
        if (data === req?.body?.address) {
          const result = await db
            .select()
            .from("auth")
            .where("wallet_address", req?.body?.address);
            // console.log(result);
          if (result.length != 1) {
            return done(null, false, { info: "You are not a valid user" });
          } else {
            return done(null, {
              info: result[0].email,
              name: `${result[0]?.first_name} ${result[0]?.last_name}`,
              username: result[0].username,
            });
          }
        } else {
          return done(null, false, { info: "Wrong Signeture" });
        }
      } catch (error) {
        return done(null, false, { info: "Wrong Signeture" });
      }
    } else {
      console.log(fromSig);
      const result = await db.select().from("auth").where("email", email);
      console.log("result");
      // console.log(result[0]?.first_name);
      if (result.length != 1) {
        return done(null, false, { info: "You are not a valid user" });
      } else {
        if (result[0]?.password == password) {
          return done(null, {
            info: result[0].email,
            name: `${result[0]?.first_name} ${result[0]?.last_name}`,
          });
        } else {
          return done(null, false, { info: "Wrong email/password" });
        }
      }
    }
  })
);

passport.serializeUser(function (user, done) {
  // console.log(user);
  console.log(`from serialize ${user.info}`);
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  try {
    if (id?.info != undefined) {
      console.log("deserializeUser (lookup) " + JSON.stringify(id?.info));
      const result = await db.select().from("auth").where("email", id.info);
      console.log("info");
      done(null, result);
      
    }else{
      done(null, id);
    }

  } catch (error) {
    console.log(error);
    done(null, id);
  }
});

handler.post(parseForm, csrfProtection, async function (req, res, next) {
    console.log(req.body);
    const { error, value } = sigSchema.validate(req.body);
    passport.authenticate("custom", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(500).json(info);
      }

      req.logIn(user, async function (err) {
        if (err) {
          console.log(err);
          // return next(err);
        }

        return res
          .status(200)
          .json({
            info: info,
            data: req.session,
            isAuth: req.isAuthenticated(),
          });
      });
    })(req, res, next);
  });

handler.get(parseForm, function (req, res) {
  const hash = uuid();
  res.json({ session: req?.session, csrf: req?.csrfToken(), hash: hash });
});

export default handler;
