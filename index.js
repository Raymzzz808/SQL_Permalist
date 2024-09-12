import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'secret',
  password: 'pw',
  port: 5432
});

db.connect();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let items = [{id: 1, title: "Buy milk"},{id: 2, title: "Finish homework"},];

app.get("/", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM permalist ORDER BY id ASC');
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Get Shit Done",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query('INSERT INTO permalist (title) VALUES ($1)',
      [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.post("/edit", async (req, res) => {
  const title = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query('UPDATE permalist SET title = ($1) WHERE id=($2)',
      [title, id]);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const del = req.body.deleteItemId;
  try {
    await db.query('DELETE FROM permalist WHERE id = $1',
      [del]);
    const result = await db.query('SELECT * FROM permalist');
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
