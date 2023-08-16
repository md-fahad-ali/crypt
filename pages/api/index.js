import db from "./db";
import handler from "./handler";
const csrf = require("csurf");
import bodyParser from "body-parser";
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

handler.use(cors(corsOptions));

var csrfProtection = csrf({ cookie: true });
handler.use(csrfProtection);

handler.get(async function (req, res) {
  try {
    const data = await db
      .select()
      .from("auth")
      .where("username", req.session?.passport?.user?.username);
    res.json({ session: req.session , data:data,csrfToken: req.csrfToken() });
  } catch (error) {
    console.log(error);
    res.status(404).send('what???');
  }
});

export default handler;
