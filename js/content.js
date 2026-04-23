var menu = document.getElementById("menu");
var content = document.getElementById("content");
var box = document.querySelectorAll(".box");
var topside = document.querySelectorAll(".topside");
var backBtn = document.querySelector(".back-btn");
var framework = document.getElementById("framework");
var cases = document.querySelectorAll(".case");

function applyMobileExpandedLayout() {
  if (window.innerWidth < 650) {
    if (framework) {
      framework.style.justifyContent = "flex-start";
    }
    cases.forEach(function(item) {
      item.style.height = "auto";
    });
  }
}

function restoreMobileDefaultLayout() {
  if (window.innerWidth < 650) {
    if (framework) {
      framework.style.justifyContent = "space-between";
    }
    cases.forEach(function(item) {
      item.style.height = "75vh";
    });
  }
}

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function backContent() {
  document.querySelectorAll(".topside, .box").forEach(function(element) {
    element.style.display = 'none';
  });
}

function m_backContent() {
    backContent();
    menu.style.display = "flex";
    content.style.display = "none";
    restoreMobileDefaultLayout();
    location.reload(true);
}

function m_Content() {
  if (window.innerWidth < 650) {
    menu.style.display = "none";
    search.style.display = "none";
    content.style.display = "inline";
    backBtn.style.display = "inline";
    applyMobileExpandedLayout();
  }
}

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
var time_box = document.getElementById("time_box");

function timeContent() {
    search.style.display = "flex"
    time_box.style.display = "flex";
}
/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function weatherContent() {
  // translate_bar.style.display = "none";
  // translate_box.style.display = "none";
  weather_bar.style.display = "flex";
  weather_box.style.display = "flex";
  
  // 自动触发天气查询（使用默认值）
  // 如果输入框为空，设置默认城市为深圳
  const cityInput = document.getElementById('city');
  if (cityInput && !cityInput.value) {
    cityInput.value = 'SHENZHEN';
  }
  
  // 创建并触发提交事件
  const submitEvent = new Event('submit');
  weather_bar.dispatchEvent(submitEvent);
}
/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function translateContent() {
  // weather_bar.style.display = "none";
  // weather_box.style.display = "none";
  translate_bar.style.display = "flex";
  translate_box.style.display = "flex";
}
/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
var bookmark_box = document.getElementById("bookmark_box")

function m_bookmarkContent() {
  var hupu = document.getElementsByClassName("hupu");
  var ithome = document.getElementsByClassName("ithome");
  var zhibo8 = document.getElementsByClassName("zhibo8");
  if ((screen.width) <= 600) {
      for (let i = 0; i < hupu.length; i++) {
          hupu[i].href = "https://m.hupu.com/";
          ithome[i].href = "https://m.ithome.com/";
          zhibo8[i].href = "https://m.zhibo8.com/";
      };
  };
}

function bookmarkContent() {
  search.style.display = "flex"
  bookmark_box.style.display = "flex";
  m_bookmarkContent();
}
/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
