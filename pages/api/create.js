const cors = require("cors");
const Joi = require("joi");
import multiparty from "multiparty";
import bodyParser from "body-parser";
import handler from "./handler";
import { promises as fs } from "fs";
import db from "./db";
const path = require("path");
import { uuid } from "uuidv4";

import session from "express-session";

import { serialize } from "cookie";
import { doubleCsrfToken } from "@/lib/csrf";
// handler.use(csrfProtection);
handler.use(bodyParser.json());
handler.use(bodyParser.urlencoded({ extended: true }));

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(doubleCsrfToken);

handler.use(cors());

handler.get(function (req, res, next) {
  res.json({
    csrfToken: req.session.csrfToken,
  });
});

function generateNewFileName() {
  const t = new Date();
  const timestamp = `${t.getDate()}-${t.getMonth()}-${t.getFullYear()}`;
  return `${t.getTime()}_${timestamp}.png`;
}

const filePath = path.join(process.cwd(), "public", "uploads");

// handler.use(async (req, res, next) => {
const middleWar = async (req, res, next) => {
  const filePath = path.join(process.cwd(), "public", "uploads");
  console.log(filePath);
  try {
    var EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/g;
    const option = {
      uploadDir: filePath,
      maxFilesSize: 2 * 1024 * 1024,
      renameFile: (name, file) => {
        console.log(name, file);
      },
    };
    const form = new multiparty.Form(option);
    form.on("file", (name, file) => {
      fs.rename(file.path, `${filePath}/${generateNewFileName()}`);
    });

    await form.parse(req, function (err, fields, files) {
      req.body = fields;
      req.files = files;

      next();
    });
  } catch (error) {
    console.log(error);
    res.json({ error: "Cant upload the file.File size must be 2mb" });
  }
};

// handler.post(middleWar, async (req, res, next) => {
//   const uploadedPath = `${filePath}/${generateNewFileName()}`;
//   try {
//     const isExists = await db
//       .select()
//       .from("company_details")
//       .where("slug", req?.body?.company_slug?.toString());
//     if (isExists.length == 0) {
//       const data = await db
//         .insert({
//           name: req?.body.name.toString(),
//           slug: req?.body?.company_slug.toString(),
//           image: uploadedPath,
//           created_by: req.session?.passport?.user?.username,
//         })
//         .into("company_details");
//       console.log("No company");
//     } else {
//       res.json({ message: "Already existing company" });
//       console.log("Found company");
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   res.json(req.body);

//   // res.json(fields, files);
// });

handler.post(async (req, res, next) => {
  
  res.json({
    message: "Hello, world",
    client:req.body.csrfToken,
    server:req.csrfToken()
  })
});

export default handler;
