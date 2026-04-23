var title = document.querySelector(".menu");
var content = document.querySelector(".content");
var box = document.querySelector(".box");
var backBtn = document.querySelector(".back-btn");
var bookmark_box = document.getElementById("bookmark_box")

function toggleContent() {
  if (window.innerWidth < 650) {
    title.style.display = "none";
    content.style.display = "inline";
    backBtn.style.display = "inline";
  }
}

function back() {
  box.style.display = "flex";
  search.style.display = "flex";
  suggestContainer.style.display = "inline";
  translate_bar.style.display = "none";
}

function m_back() {
    title.style.display = "flex";
    content.style.display = "none";
    backBtn.style.display = "none";
    search.style.display = "flex";
    suggestContainer.style.display = "inline";
    translate_bar.style.display = "none";
    location.reload(true);
}

function m_bookmarkContent() {
    if (window.innerWidth >= 650) return;

    var mobileMap = {
        "hupu": "https://m.hupu.com/",
        "ithome": "https://m.ithome.com/",
        "zhibo8": "https://m.zhibo8.cc/"
    };

    Object.keys(mobileMap).forEach(function (className) {
        var nodes = document.getElementsByClassName(className);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].href = mobileMap[className];
        }
    });
}

window.onload = function () {
  if (window.innerWidth < 650) {
    var titles = document.getElementsByClassName("titles");
    for (let i = 0; i < titles.length; i++) {
      titles[i].target = "_blank";
    };
  };
}

