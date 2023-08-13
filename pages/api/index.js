import db from "./db";
import handler from "./handler";

handler.get(async function (req, res) {
  try {
    const data = await db
      .select()
      .from("auth")
      .where("username", req.session?.passport?.user?.username);
    res.json({ session: req.session , data:data});
  } catch (error) {
    console.log(error);
    res.json({ error: "" });
  }
});

export default handler;
