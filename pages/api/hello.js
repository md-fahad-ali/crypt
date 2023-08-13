import handler from "./handler";



handler.get(async function (req, res) {
  
  res.json({hello:"world"});
});

export default handler;
