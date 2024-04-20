import express from "express";
import {createServer} from "node:http";
import {fileURLToPath} from "node:url";

import sqlite3 from "sqlite3";

const app = express();
const server = createServer(app);


app.set('views', "../views");
app.set("view engine", "ejs");

const db = new sqlite3.Database(
    "../db/todos.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) {
            console.error(err);
        }
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo text, 
            done boolean 
            )`);
        //db.run(`INSERT INTO todos (todo, done) VALUES (1, true)`);

    },
);

app.get("/", (req, res) => {
    db.all("SELECT * FROM todos", (err, rows) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

     //   res.json({
     //       message: "success",
      //      data: rows,
     //   });
        //res = res.json();
        res.render("index", {model:rows});
    });

    //res.sendFile(join(__dirname, "index.html"));
});

//db.close((err) => {
//    if (err) {
//        console.error(err);
//    }
//});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
