// Элементы меню админки
var menuElems = document.querySelectorAll(".menu li")
// Элементы контента (меню, статьи, новости)
var contentElems = document.querySelector(".content-wrapper").children

for(var i = 0; i < menuElems.length; i++) {
    menuElems[i].onclick = () => { showContentElem() }
}

// Показать элемент контента
function showContentElem() {
    localStorage.setItem("openedElem", event.target.getAttribute("href"))

    for(var i = 0; i < contentElems.length; i++) {
        contentElems[i].style.display = "none";

        if(contentElems[i].className == localStorage.getItem("openedElem")) {
            contentElems[i].style.display = "block";
        }
    }
}

if (localStorage.getItem("openedElem") == null) localStorage.setItem("openedElem", "menu-wrapper")

for(var i = 0; i < contentElems.length; i++) {
    contentElems[i].style.display = "none";

    if(contentElems[i].className == localStorage.getItem("openedElem")) {
        contentElems[i].style.display = "block";
    }
}