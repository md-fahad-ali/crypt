const csrf = require("csurf");
const cors = require("cors");
const Joi = require("joi");
import bodyParser from "body-parser";
import handler from "../../handler";
import db from "../../db";

var csrfProtection = csrf({ cookie: true });
handler.use(csrfProtection);
let parseForm = bodyParser.urlencoded({ extended: false });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

handler.use(cors(corsOptions));

handler.get(async function (req, res) {
  console.log("Inside /api/c/[co_name]/details");
  try {
    const data = await db
      .select()
      .from("auth")
      .where("username", req.session?.passport?.user?.username);

    const connection = await db
      .select()
      .from("user_details")
      .where("username", req.session?.passport?.user?.username);
    console.log(connection);
    res.json({ session: req.session, csrf: req.csrfToken() ,user_details:data,user_connection:connection});
  } catch (error) {
    console.log(error);
    res.status(404).send("what??");
  }
});

export default handler;
