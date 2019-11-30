const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = 3212;
const FILE = "./feedbacks.json";

async function writeToFile(body) {
  const comments = await readFromFile();
  comments.push(body);
  const error = fs.writeFileSync(FILE, JSON.stringify(comments));
  return error;
}

async function readFromFile() {
  const rawdata = await fs.readFileSync(FILE);
  const comments = JSON.parse(rawdata);

  return comments;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // to load .css

const router = express.Router();

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
  //res.sendFile(path.join(__dirname + "/styles.css"));
  //else if (req.url === "/styles.css")
  //__dirname : It will resolve to your project folder.

  //console.log(req.url);
});

app.post("/feedbacks", async function(req, res) {
  await writeToFile(req.body);
  res.redirect("/"); // Redirect to new same page
  // res.json({
  //   success: true,
  //   body: req.body
  // });
});

app.get("/feedbacks", async function(req, res) {
  res.json({
    success: true,
    body: await readFromFile()
  });
});

app.use("/", router);
app.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`));
