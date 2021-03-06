const mysql = require("../db/mysql")

/* SQL Table:

id
title
addDate
html
docx
+ mainImage
+ subImages

*/

exports.insertNews = (news) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("INSERT INTO news (title, addDate, html, docx) VALUES (?, ?, ?, ?)",
        [news.title, news.addDate, news.html, news.docx], (error) => {
            if (error) {
                console.log("MySQL query (INSERT INTO news (title, addDate, html, docx) VALUES ('" + 
                news.title + "', '" + news.addDate + "', '...', '...') finished with error: " + error.code)

                resolve(true)
            } else {
                console.log("MySQL query (INSERT INTO news (title, addDate, html, docx) VALUES ('" + 
                news.title + "', '" + news.addDate + "', '...', '...') successfully done.")

                resolve(false)
            }
        })
    })
}

exports.selectNews = (limit) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("SELECT * FROM news ORDER BY addDate DESC LIMIT " + limit, (error, rows) => {
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

exports.selectNewsWithoutImgs = (limit) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("SELECT id, title, addDate FROM news ORDER BY addDate DESC LIMIT " + limit, (error, rows) => {
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

exports.selectNewsById = (id) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("SELECT * FROM news WHERE id = " + id, (error, rows) => {
            if (error) {
                console.log("MySQL query (" + query.sql + ") finished with error: " + error.code)

                resolve({ error: true, data: null })
            } else {
                console.log("MySQL query (" + query.sql + ") successfully done.")

                resolve({ error: false, data: rows[0] })
            }
        })
    })
}

exports.updateNews = (news) => {
    return new Promise((resolve) => {
        var values = "title = '" + news.title + 
        "', addDate = ?" +
        (news.html != null ? ", html = '" + news.html + "'" : "") +
        (news.docx != null ? ", docx = ?" : "")

        var query = mysql.connection.query("UPDATE news SET " + values + " WHERE id = " + news.id, [news.addDate, news.docx], (error, result) => {
            if (error) {
                // console.log("MySQL query (UPDATE news SET title = '" + 
                // news.title + "', date = '" + news.addDate + "', html = '...', docx = '...' WHERE id = " + news.id + ") finished with error: " + error.code)
                console.log("MySQL query (" + query.sql + ") finished with error: " + error.code)

                resolve({ error: true, data: 0 })
            } else {
                console.log("MySQL query (UPDATE news SET title = '" + 
                news.title + "', date = '" + news.addDate + "', html = '...', docx = '...' WHERE id = " + news.id + ") successfully done.")

                resolve({ error: false, data: result.affectedRows })
            }
        })
    })
}

exports.deleteNews = (id) => {
    return new Promise((resolve) => {
        var query = mysql.connection.query("DELETE FROM news WHERE id = " + id, (error, result) => {
            if (error) {
                console.log("MySQL query (" + query.sql + ") finished with error: " + error.code)

                resolve({ error: true, data: 0 })
            } else {
                console.log("MySQL query (" + query.sql + ") successfully done.")

                resolve({ error: false, data: result.affectedRows })
            }
        })
    })
}