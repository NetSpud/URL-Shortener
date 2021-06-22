const express = require("express");
const { nanoid } = require("nanoid");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
// await db.exec(
//   "CREATE TABLE data (id varchar, URL text, slug varchar, secret varchar, PRIMARY KEY (id))"
// );

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "pug");

const addhttp = (url) => {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
};

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/urls", (req, res) => {
  res.render("urls");
});

app.get("/all", (req, res) => {
  open({
    filename: "./database.db",
    driver: sqlite3.Database,
  })
    .then((db) => {
      return db.all("select * from data");
    })
    .then((d) => {
      console.log(d);
      d.map((x) => (x.URL = addhttp(x.URL)));
      res.json(d);
    })
    .catch((err) => res.json(err));
});

app.post("/create", (req, res) => {
  const secret = nanoid(16);

  if (req.body.url === undefined || req.body.url === "") {
    res.json({ err: `Please provide the URL` });
    return;
  }
  if (req.body.slug === undefined || req.body.slug === "") {
    res.json({ err: `Please provide your URL slug` });
    return;
  }

  const checkExists = (slug) => {
    return new Promise((resolve, reject) => {
      open({
        filename: "./database.db",
        driver: sqlite3.Database,
      })
        .then((db) => {
          return db.all("select id from data where slug = ?", slug);
        })
        .then((d) => {
          if (d.length > 0) {
            reject(`Slug already in use`);
          } else {
            resolve(true);
          }
        })
        .catch((err) => reject(err));
    });
  };

  const addNew = () => {
    return new Promise((resolve, reject) => {
      open({
        filename: "./database.db",
        driver: sqlite3.Database,
      })
        .then((db) => {
          return db.run(
            "insert into data (id, url, slug, secret) values (?,?,?,?)",
            uuidv4(),
            req.body.url,
            req.body.slug,
            secret
          );
        })

        .then(() => {
          resolve(true);
        })
        .catch((err) => reject(err));
    });
  };

  checkExists(req.body.slug)
    .then(() => {
      return addNew(req.body.slug, req.body.url);
    })
    .then((d) => {
      console.log(d);
      res.json({ success: `Action completed successfully` });
    })
    .catch((err) => res.json({ err: String(err) }));
});
app.delete("/delete", (req, res) => {
  if (req.body.secret === undefined || req.body.secret === "") {
    res.json({ err: `Secret not provided - unable to delete slug` });
  }
  (async () => {
    // open the database
    open({
      filename: "./database.db",
      driver: sqlite3.Database,
    })
      .then((db) => {
        return db.run("delete from data where secret = ?", req.body.secret);
      })
      .then(() => {
        res.json({ success: `Deleted URL successfully!` });
      })
      .catch((err) => console.log(err));
  })();
});
app.get("/url/:slug", (req, res) => {
  const getDataIfExists = (slug) => {
    return new Promise((resolve, reject) => {
      open({
        filename: "./database.db",
        driver: sqlite3.Database,
      })
        .then((db) => {
          return db.all("select URL from data where slug = ?", slug);
        })

        .then((d) => {
          if (d.length > 0) {
            console.log(d);
            resolve(d[0]);
          }
        })
        .catch((err) => reject(err));
    });
  };

  getDataIfExists(req.params.slug)
    .then((d) => {
      console.log(d);
      res.redirect(addhttp(d.URL));
    })
    .catch((err) => {
      res.json({ err });
    });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
