var suggestContainer = document.getElementsByClassName("suggest")[0];
var searchInput = document.getElementsByClassName("search_input")[0];
var search = document.getElementById("search");
var searchResult = document.getElementById("search_result");

// 清除建议框内容
const clearContent = () => {
  while (searchResult.firstChild) {
    searchResult.removeChild(searchResult.firstChild);
  }
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const handleKeyUp = (e) => {
  suggestContainer.style.display = "block";

  // 如果输入框内容为空，清除内容且无需跨域请求
  if (e.target.value.length === 0) {
    clearContent();
    return;
  }

  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
    // 创建script标签JSONP跨域
    const script = document.createElement("script");
    script.src = `https://www.baidu.com/su?&wd=${encodeURI(e.target.value.trim())}&p=3&cb=handleSuggestion`;
    document.body.appendChild(script);
  }
};

// 使用debounce函数节流优化
searchInput.addEventListener('keyup', debounce(handleKeyUp, 130));

// 回调函数处理返回值
const handleSuggestion = (res) => {
  // 清空之前的数据
  clearContent();
  const result = res.s.slice(0, 7);

  // 动态创建li标签
  result.forEach(item => {
    const liObj = document.createElement("li");
    liObj.textContent = item;
    searchResult.appendChild(liObj);
  });

  // 删除用于跨域的script标签
  const scriptElements = document.querySelectorAll('script');
  for (let i = 1; i < scriptElements.length; i++) {
    document.body.removeChild(scriptElements[i]);
  }
};


function jumpPage() {
  window.open(document.getElementById("search_web").value + document.getElementById("search_input").value);
}

// 事件委托 点击li标签或者点击搜索按钮跳转到搜索页面
search.addEventListener("click", function (e) {
  if (e.target.nodeName.toLowerCase() === 'li') {
    var keywords = e.target.innerText;
    searchInput.value = keywords;
    jumpPage();
  } else if (e.target.id === 'search_submit') {
    jumpPage();
  }
}, false);

// 搜索框键盘事件
let selectedIndex = 0;
let directionFlag = 1;

function handleKeyDown(e) {
  const resultListSize = searchResult.childNodes.length;

  if (e.key === "Enter") {
    jumpPage();
  } else if (e.key === "ArrowDown") {
    if (directionFlag === 0) {
      selectedIndex += 2;
    }
    directionFlag = 1;
    e.preventDefault();

    if (selectedIndex >= resultListSize) {
      selectedIndex = 0;
    }

    searchInput.value = searchResult.childNodes[selectedIndex++].innerText;

  } else if (e.key === "ArrowUp") {
    if (directionFlag === 1) {
      selectedIndex -= 2;
    }
    directionFlag = 0;
    e.preventDefault();

    if (selectedIndex < 0) {
      selectedIndex = resultListSize - 1;
    }

    searchInput.value = searchResult.childNodes[selectedIndex--].innerText;
  }
}

search.addEventListener("keydown", handleKeyDown, false);


// 点击页面任何其他地方 搜索结果框消失
document.onclick = () => clearContent()
