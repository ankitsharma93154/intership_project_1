import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];


app.get("/", async(req, res) => {
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch (err) {
    console.log(err);
  }
  
});

app.post("/add", async(req, res) => {
  try{
   await db.query("INSERT INTO items (title,description) VALUES ($1, $2)",[req.body.newItem, req.body.newDescription])
   res.redirect("/");
  }catch (err) {
    console.log(err);
  }
  // const item = req.body.newItem;
  // items.push({ title: item });

});

app.post("/edit", async(req, res) => {
 const id = req.body.updatedItemId;
 const item = req.body.updatedItemTitle;
 const text = req.body.updatedItemDescription;
 console.log(text);
 console.log(item);

  try{
    await db.query("UPDATE items SET title = ($1),description = ($2) WHERE id = $3",[item,text,id]);
    res.redirect("/");
   }catch (err) {
     console.log(err);
   }

});

app.post("/delete", async(req, res) => {
  console.log(req.body.deleteItemId);
  try {
    await db.query("DELETE FROM items WHERE id = $1",[req.body.deleteItemId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
