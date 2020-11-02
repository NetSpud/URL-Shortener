const express = require('express');
const { nanoid } = require("nanoid");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const mysql = require("mysql");

const app = express();
const port = 3000;


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "urlgenerator"
});
console.log("Program Booted Successfully.");

app.use(express.json());
app.use(express.static('public'));


function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}



app.get('/url/*', (req, res) => {
    console.log("requested");

    const slug = encodeURIComponent(req.params[0]);
    // const slug = req.params[0];
    con.query(`SELECT * FROM urlgenerator where slug = '${slug}'`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result.length < 1) {
            res.send("URL Not Found.");
            return;
        }
        s = result[0].url;

        res.redirect(addhttp(s));

    });


});
app.delete('/delete', (req, res) => {
    console.log("delete request received.");
    var sql = `DELETE FROM urlgenerator WHERE secret = '${req.body.token}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
    res.json({
        "success": "Delete Successful",
    });

});

app.post('/list', (req, res) => {
console.log("postedLIST");
    con.query("SELECT * FROM urlgenerator", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);



    });


});



app.post('/create', (req, res) => {
    let url = req.body.url.trim();
    let slug = req.body.slug.trim();
    const secret = nanoid(20);
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    var t = url;

    if (t.match(regex)) {
        console.log(`valid url for ${url}`);
        if(slug === "") {
            slug = nanoid();
        }





        // con.connect(function (err) {
            // if (err) throw err;
            con.query(`SELECT count(*) FROM urlgenerator where slug = '${slug}'`, function (err, result, fields) {
                // if (err) throw err;
                console.log(result);
                if(result[0]['count(*)'] === 1) {
                    console.log("slug in use, please use different slug.");
                    res.send({
                        "err": "X001: slug in use, please use different slug."
                    });

                } else {
                    // con.connect(function (err) {
                        if (err) throw err;
                        console.log("Connected!");
                    var sql = `INSERT INTO urlgenerator (url, slug, secret) VALUES ('${url}', '${slug}', '${secret}')`;
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    // });


                    res.json({
                        "url": url,
                        "slug": slug,
                        "secret": secret
                    });


                }
            });


    } else {
        console.log(`Invalid url for "${url}". Please try again - console`);
        res.json({
            "err": `X002: Invalid url for ${url}`,
        });
    }



    // console.log(nanoid());
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})