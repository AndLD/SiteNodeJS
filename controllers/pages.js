// Подключаем модели
var menuModel = require("../models/menu")
var articleModel = require("../models/article")
var newsModel = require("../models/news")
var userModel = require("../models/user")
var subjectModel = require("../models/subject")
var materialModel = require("../models/material")

// Подключаем хелперы для страниц
var pagesHelpers = require("../helpers/pages")

// ! ОБЩИЕ СТРАНИЦЫ

// Главная страница
exports.indexController = async (req, res) => {
    // Получаем меню
    var selectedResult = await menuModel.selectMenu()
    if (selectedResult.error) {
        res.sendStatus(400)
    }

    var menu = pagesHelpers.adaptateMenu(selectedResult.data)

    // Получаем последние новости
    var selectedNewsResult = await newsModel.selectNews(3)
    if (selectedNewsResult.error) {
        res.sendStatus(400)
    }

    var news = pagesHelpers.adaptateNews(selectedNewsResult.data)

    res.render("index", { menu: menu, news: news })
}

// Страница статьи
exports.articleController = async (req, res) => {
    // Получаем меню
    var selectedMenuResult = await menuModel.selectMenu()
    if (selectedMenuResult.error) {
        res.sendStatus(400)
    }

    var menu = pagesHelpers.adaptateMenu(selectedMenuResult.data)

    // Получаем последние новости
    var selectedNewsResult = await newsModel.selectNews(8)
    if (selectedNewsResult.error) {
        res.sendStatus(400)
    }

    var news = pagesHelpers.adaptateNews(selectedNewsResult.data)

    // Получаем статью
    var selectedArticleResult = await articleModel.selectArticleById(req.params.id)
    if (selectedArticleResult.error) {
        return res.sendStatus(400)
    }
    if (selectedArticleResult.data == null) {
        return res.sendStatus(204)
    }

    var article = selectedArticleResult.data
    article.type = "article"

    // Определение, к какому элементу главного меню относится данная статья
    var currentMainMenu
    
    for(var i = 0; i < menu.main.length; i++) {

        if (currentMainMenu != null) break

        var splittedMainElem = menu.main[i].link.split("/")
        if (splittedMainElem[splittedMainElem.length - 1] == article.id) {
            currentMainMenu = menu.main[i]
            break
        }

        for(var j = 0; j < menu.drop.length; j++) {

            if (menu.drop[j].parentId == menu.main[i].id) {

                if (currentMainMenu != null) break

                var splittedDropElem = menu.drop[j].link.split("/")
                if (splittedDropElem[splittedDropElem.length - 1] == article.id) {
                    currentMainMenu = menu.main[i]
                    break
                }

                for(var k = 0; k < menu.deepDrop.length; k++) {

                    if (menu.deepDrop[k].parentId == menu.drop[j].id) {
                        
                        if (currentMainMenu != null) break
                    
                        var splittedDeepDropElem = menu.deepDrop[k].link.split("/")
                        if (splittedDeepDropElem[splittedDeepDropElem.length - 1] == article.id) {
                            currentMainMenu = menu.main[i]
                            break
                        }
                    }

                }
            }
        }
    }

    res.render("page", { menu: menu, currentMainMenu: currentMainMenu, data: article, news: news })
}

// Страница новости
exports.singleNewsController = async (req, res) => {
    // Получаем меню
    var selectedMenuResult = await menuModel.selectMenu()
    if (selectedMenuResult.error) {
        res.sendStatus(400)
    }

    var menu = pagesHelpers.adaptateMenu(selectedMenuResult.data)

    // Получаем последние новости
    var selectedNewsResult = await newsModel.selectNews(8)
    if (selectedNewsResult.error) {
        res.sendStatus(400)
    }

    var news = pagesHelpers.adaptateNews(selectedNewsResult.data)

    // Получаем новость
    var selectedSingleNewsResult = await newsModel.selectNewsById(req.params.id)
    if (selectedSingleNewsResult.error) {
        return res.sendStatus(400)
    }
    if (selectedSingleNewsResult.data == null) {
        return res.sendStatus(204)
    }

    var singleNews = selectedSingleNewsResult.data
    singleNews.addDate = pagesHelpers.adaptateDate(singleNews.addDate)
    singleNews.type = "news"

    res.render("page", { menu: menu, data: singleNews, news: news })
}

// Страница новостей
exports.newsController = async (req, res) => {
    // Получаем меню
    var selectedMenuResult = await menuModel.selectMenu()
    if (selectedMenuResult.error) {
        res.sendStatus(400)
    }

    var menu = pagesHelpers.adaptateMenu(selectedMenuResult.data)

    // Получаем новости
    var selectedNewsResult = await newsModel.selectNews(50)
    if (selectedNewsResult.error) {
        return res.sendStatus(400)
    }

    var news = pagesHelpers.adaptateNews(selectedNewsResult.data)

    res.render("news", { menu: menu, news: news })
}

// ! РЕГИСТРАЦИЯ И АВТОРИЗАЦИЯ

// Страница регистрации
exports.registerController = (req, res) => {
    res.render("user/register", { message: null })
}

// Страница авторизации 1 фактор
exports.loginController = (req, res) => {
    res.render("user/login")
}

// Страница авторизации 2 фактор
exports.loginOtpController = (req, res) => {
    res.render("user/login-otp")
}

// ! СЛУЖЕБНЫЕ СТРАНИЦЫ

// Профиль
exports.profileController = async (req, res) => {
    if (req.user.userrole == "admin") {
        // Получаем меню сайта
        var selectedMenuResult = await menuModel.selectMenu()
        if (selectedMenuResult.error) {
            res.sendStatus(400)
        }

        var menu = pagesHelpers.adaptateMenu(selectedMenuResult.data)

        // Получаем статьи
        var selectedArticlesResult = await articleModel.selectArticles()
        if (selectedArticlesResult.error) {
            return res.sendStatus(400)
        }

        var articles = selectedArticlesResult.data

        // Получаем новости
        var selectedNewsResult = await newsModel.selectNews(200)
        if (selectedNewsResult.error) {
            return res.sendStatus(400)
        }

        var news = pagesHelpers.adaptateNews(selectedNewsResult.data)
    }

    if (req.user.userrole == "admin" || req.user.userrole == "moderator") {
        // Получаем пользователей
        var selectedUsersResult = await userModel.selectUsers( (req.user.userrole == "admin" ? null : "group") )
        if (selectedUsersResult.error) {
            return res.sendStatus(400)
        }

        var users = selectedUsersResult.data

        // Получаем предметы
        var selectedSubjectsResult = await subjectModel.selectSubjects()
        if (selectedSubjectsResult.error) {
            return res.sendStatus(400)
        }

        var subjects = selectedSubjectsResult.data
    }

    if (req.user.userrole == "admin" || req.user.userrole == "moderator" || req.user.userrole == "group") {
        // Получаем материалы
        var selectedMaterialsResult = await materialModel.selectMaterials(
            null, // группа
            null, // предмет
            null, // семестр
            null // тип материала (лекция / ЛР / ПР / ...)
        )
        if (selectedMaterialsResult.error) {
            return res.sendStatus(400)
        }

        var materials = selectedMaterialsResult.data
    }

    res.render("profile", { user: req.user, menu: menu, articles: articles, news: news, users: users, subjects: subjects, materials: materials })
}