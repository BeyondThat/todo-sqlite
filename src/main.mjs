import express from "express";
import {createServer} from "node:http";

import sqlite3 from "sqlite3";

const app = express();
const server = createServer(app);

app.set("views", "../views");
app.set("view engine", "ejs");
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({extended: true}));

const db = new sqlite3.Database(":memory:", sqlite3.OPEN_READWRITE);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value TEXT, 
            done INTEGER
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

app.delete("/:id", (req, res) => {
    const task = req.params.id;
    db.run(
        `DELETE FROM todos WHERE id = ?`,
        task,

        (err) => {
            if (err) {
                console.error(err);
            }
        },
    );
    res.end();
});

app.patch("/:id", (req, res) => {
    const task = req.params.id;
    db.run(
        `UPDATE todos SET done = CASE done WHEN 1 THEN 0 ELSE 1 END WHERE id = ?`,
        task,

        (err) => {
            if (err) {
                console.error(err);
            }
        },
    );
    res.end();
});


server.listen(app.get("port"), () => {
    console.log("server running at http://localhost:3000");
});
