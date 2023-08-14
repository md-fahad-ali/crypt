import db from "./db";
import handler from "./handler";
const csrf = require("csurf");
const cors = require("cors");
const Joi = require("joi");
import bodyParser from "body-parser";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

handler.use(cors(corsOptions));

const sigSchema = Joi.object({
  // address: Joi.string().allow(null).empty(""),
  email: Joi.string().allow(null).empty(""),
  first_name: Joi.string().allow(null).empty(""),
  last_name: Joi.string().allow(null).empty(""),
  username: Joi.string().allow(null).empty(""),
  _csrf: Joi.string().required(),
});

handler.use(cors(corsOptions));
var csrfProtection = csrf({ cookie: true });
handler.use(csrfProtection);
let parseForm = bodyParser.urlencoded({ extended: false });

handler.get(async function (req, res) {
  try {
    const data = await db
      .select()
      .from("auth")
      .where("username", req.session?.passport?.user?.username);
    res.json({ session: req.session, data: data });
  } catch (error) {
    console.log(error);
    res.json({ error: "" });
  }
});

handler.post(parseForm, csrfProtection, async function (req, res, next) {
  
  const { error, value } = sigSchema.validate(req.body);
  console.log(value?.username);
  try {
    const data = await db("auth").where({ username:value?.username }).update({
      username: value?.username,
      first_name: value?.first_name,
      last_name: value?.last_name,
      email: value?.email,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
  
});

export default handler;
