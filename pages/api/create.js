const csrf = require("csurf");
const cors = require("cors");
const Joi = require("joi");
import multiparty from "multiparty";
import bodyParser from "body-parser";
import handler from "./handler";
import db from "./db";
import { uuid } from "uuidv4";

// var csrfProtection = csrf({ cookie: true });
// handler.use(csrfProtection);
handler.use(bodyParser.json());
handler.use(bodyParser.urlencoded({ extended: true }));

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(async (req, res, next) => {
  const form = new multiparty.Form();

  await form.parse(req, function (err, fields, files) {
    req.body = fields;
    req.files = files;
    next();
  });
});
// Define the route handler
handler.post(async (req, res) => {
  res.json(req.body);
  // res.json(fields, files);
});

export default handler;
