import handler from "./handler";


handler.get(async function (req, res) {
  
  
  res.json(process.env);
});

export default handler;
