import handler from "../../handler";
const cors = require("cors");
const Joi = require("joi");
import bodyParser from "body-parser";
import { uuid } from "uuidv4";
import db from "../../db";
import { doubleCsrfToken } from "@/lib/csrf";

const whitelist = ["http://localhost:3000", "http://0.0.0.0:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const err = new Error("You are not allowed to access this page. ");
      err.stack = "";
      console.log(err.name);
      callback(err);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);


handler.use((req, res, next, err) => {
  corsMiddleware(
    req,
    res,
    (err) => {
      if (err) {
        res.status(403).json({ error: err.message });
      } else {
        next();
      }
    },
    {
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }
  );
});





handler.get(function (req, res) {
  // console.log(req.session);
  res.json({
    session: req.session || null,
    csrf: "",
    warn: "from details",
  });
});

handler.post(function (req, res) {
  console.log(req.body.csrfToken);
  res.json(req.body);
});

handler.put(function (req, res) {
  res.json(req.body);
});

export default handler;
