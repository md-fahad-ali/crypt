import cookieParser from "cookie-parser";
import { parse, serialize } from "cookie";
import { getCookie, setCookie } from "cookies-next";
import { createHash, randomBytes } from "crypto";
import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.CSRF_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60 * 60 * 1000 },
});

export function doubleCsrfToken(req, res, next) {
  const csrfToken = randomBytes(16).toString("hex");

  const csrfTokenHash = createHash("sha256")
    .update(`${process.env.CSRF_SECRET}${csrfToken}`)
    .digest("hex");

  const csrfTokenfromCookie = getCookie("csrf-token", { req, res }) || {};
  if (csrfTokenfromCookie.length > 0) {
    console.log("creating cookie");
  } else {
    const signedCookie = serialize("csrf-token", csrfTokenHash, {
      httpOnly: true,
      secure: true,
      signed: true,
      path: "/",
      maxAge: 3600 * 24,
      sameSite: "lax",
    });
    res.setHeader("Set-Cookie", signedCookie);
  }
  
}
