import express from "express";
import {createServer} from "node:http";

import sqlite3 from "sqlite3";

const app = express();
const server = createServer(app);

app.set("views", "../views");
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const db = new sqlite3.Database(":memory:", sqlite3.OPEN_READWRITE);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value text, 
            done boolean 
            )`);
    db.run(`INSERT INTO todos (value, done) VALUES ("First Task", true)`);
    db.run(`INSERT INTO todos (value, done) VALUES ("Second Task", false)`);
});

app.get("/", (req, res) => {
    db.all("SELECT * FROM todos", (err, rows) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.render("index", {model: rows});
    });
});

app.post("/", (req, res) => {
    const task = req.body["task"];
    if (task !== "") {
        db.run(`INSERT INTO todos (value, done) VALUES (?, false)`, task, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    res.redirect("/");
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
