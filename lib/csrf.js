import cookieParser from "cookie-parser";
import { parse, serialize } from "cookie";
import { getCookie, setCookie } from "cookies-next";
import { createHash, randomBytes } from "crypto";
import session from "express-session";

function generateToken(req, res, next) {
  const csrfToken = randomBytes(16).toString("hex");

  // console.log(csrfTokenfromCookie);
  let csrfTokenHash;

  return { csrfToken };
}

const sessionMiddleware = session({
  secret: process.env.CSRF_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60 * 60 * 1000 }, // Adjust the cookie settings as needed
});

export function doubleCsrfToken(req, res, next) {
  const { csrfToken } = req?.session?.csrfToken || generateToken(req, res, next);

  const csrfTokenHash = createHash("sha256")
    .update(`${process.env.CSRF_SECRET}${csrfToken}`)
    .digest("hex");

  const csrfTokenfromCookie = getCookie("csrf-token", { req, res }) || {};
  if (csrfTokenfromCookie.length > 0) {
  } else {
    const signedCookie = serialize("csrf-token", csrfTokenHash, {
      httpOnly: true,
      secure: true,
      signed: true,
      path: "/",
      maxAge: 3600 * 24,
      sameSite: "strict",
    });
    res.setHeader("Set-Cookie", signedCookie);
  }
  console.log(`${csrfToken}, ${csrfTokenHash}`);
  sessionMiddleware(req, res, () => {
    req.session.csrfToken = csrfToken;
  });

  req.csrfToken = () => {
    return req.session.csrfToken;
  };
  console.log("x-csrf-token");
  console.log(req.headers["x-csrf-token"]);

  const protectedMethods = ["GET", "OPTION"];
  console.log(req.headers["x-csrf-token"] === csrfTokenfromCookie);

  if (protectedMethods.includes(req.method)) {
    next == undefined ? "" : next();
  } else {
    if (req.headers["x-csrf-token"] === undefined) {
      res.status(403).json({
        message: "Invalid csrf token",
      });
    } else if (req.headers["x-csrf-token"] === csrfTokenfromCookie) {
      if (req.body?.csrfToken != csrfToken) {
        console.log("not ok");
        console.log(req.body?.csrfToken, " check ", csrfToken);
      } else {
        console.log("ok");
      }
      next == undefined ? "" : next();
    } else {
      res.status(403).json({
        message: "Invalid csrf token",
      });
    }
  }
  // this cookie have to send as header name x-csrf-token :)
}
