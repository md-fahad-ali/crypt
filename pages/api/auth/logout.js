

import passport, { use } from "passport";
import session from "express-session";
import { useRouter } from "next/router";
import handler from "../handler";
// import { getCookie } from "cookies-next";
// const LocalStrategy = require("passport-local").Strategy;
// import Auth from '../../../models/auth'
handler.use(passport.initialize());
handler.use(passport.session());

handler.delete((req, res) => {
  // Use the logout function with a callback
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
  res.json("logout")
});
export default handler;
