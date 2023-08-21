const csrf = require("csurf");
const cors = require("cors");
const Joi = require("joi");
import bodyParser from "body-parser";
import handler from "../../handler";
import db from "../../db";
import { uuid } from "uuidv4";

var csrfProtection = csrf({ cookie: true });
handler.use(csrfProtection);
let parseForm = bodyParser.urlencoded({ extended: false });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

handler.use(cors(corsOptions));

handler.get(parseForm, function (req, res) {
  res.json({
    session: req?.session,
    csrf: req?.csrfToken(),
    warn: "from details",
  });
});

handler.post(parseForm, csrfProtection, async function (req, res) {
  try {
    const connection = await db
      .select()
      .from("user_details")
      .where("username", req.session?.passport?.user?.username)
      .andWhere("company_name", req?.query?.co_name);
    console.log(connection);
    if (connection.length > 0) {
      console.log("Connection");
    } else {
      if (req.session?.passport?.user?.username == req?.body?.username) {
        const data = await db
          .insert({
            username: req?.body?.username,
            company_name: req?.body.company_name,
            company_slug: req?.body?.company_slug,
            company_picture: req?.body?.company_picture,
          })
          .into("user_details");

        console.log("No connection");
        res.json(data);
      } else {
        res.json({ error: "error" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "error" });
  }
});

handler.put(parseForm, csrfProtection, async function (req, res) {
  const connection = await db
    .select()
    .from("user_details")
    .where("username", req.session?.passport?.user?.username)
    .andWhere("company_name", req?.query?.co_name);
  if (connection.length > 0) {
    const result = await db
      .select()
      .from("user_details")
      .where("username", req.session?.passport?.user?.username)
      .andWhere("company_name", req?.query?.co_name)
      .del();
    res.json(result);
  } else {
    res.json({ error: "You are already connected" });
  }
});

export default handler;
