import handler from "./handler";
import db from "./db";

handler.get(async function (req, res) {
  const result = await db.select().from("auth");
  
  // console.log(req.csrfToken());
  // console.log(process.env.CSRF_SECRET);

  res.json(result);
});

export default handler;
