const mysql = require("../db/mysql")
const btoa = require("btoa")

/* SQL Table:

id
image

*/

exports.insertImage = (image) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("INSERT INTO images (mimetype, img) VALUES (?, ?)",
        [image.mimetype, btoa(image.image)], (error) => {
            if (error) {
                console.log("MySQL query (INSERT INTO images (mimetype, img) VALUES ('" + image.mimetype + "', '...')) finished with error: " + error.code)

                resolve({ error: true, data: null })
            } else {
                console.log("MySQL query (INSERT INTO images (mimetype, img) VALUES ('" + image.mimetype + "', '...')) successfully done.")

                var query = mysql.connection.query("SELECT LAST_INSERT_ID()", (error, row) => {
                    if (error) {
                        console.log("MySQL query (" + query.sql + ") finished with error: " + error.code)

                        resolve({ error: true, data: null })
                    } else {
                        console.log("MySQL query (" + query.sql + ") successfully done.")

                        resolve({ error: false, data: row })
                    }
                })
            }
        })
    })
}

exports.selectImages = (whereString = null) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("SELECT * FROM images " + (whereString != null ? whereString : ""), (error, rows) => {
            if (error) {
                console.log("MySQL query (" + query.sql + ") finished with error: " + error.code)

                resolve({ error: true, data: null })
            } else {
                console.log("MySQL query (" + query.sql + ") successfully done.")

                resolve({ error: false, data: rows })
            }
        })
    })
}