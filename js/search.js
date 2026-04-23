var suggestContainer = document.getElementsByClassName("suggest")[0];
var searchInput = document.getElementsByClassName("search_input")[0];
var search = document.getElementById("search");
var searchResult = document.getElementById("search_result");

const corsProxy = 'https://cors.l-deo.de/';
// 清除建议框内容
const clearContent = () => {
  // 循环删除搜索结果中的所有子元素
  while (searchResult.firstChild) {
    searchResult.removeChild(searchResult.firstChild);
  }
}

const debounce = (func, wait) => {
  // 定义一个定时器变量
  let timeout;
  return (...args) => {
    // 清除之前的定时器
    clearTimeout(timeout);
    // 设置新的定时器
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const handleKeyUp = (e) => {
  // 显示建议框
  suggestContainer.style.display = "block";

  // 如果输入框内容为空，清除内容且无需跨域请求
  if (e.target.value.length === 0) {
    clearContent();
    return;
  }

  // 如果按键不是箭头键，则进行搜索建议请求
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
    console.log('handleKeyUp called with value:', e.target.value);
    suggestContainer.style.display = "block";
    console.log('suggestContainer display set to block');
    // 使用Bing API获取搜索建议
    fetch(`${corsProxy}https://api.bing.com/osjson.aspx?query=${encodeURI(e.target.value.trim())}`)
      .then(response => {
        console.log('Fetch response:', response);
        return response.json();
      })
      .then(data => handleSuggestion(data))
      .catch(error => console.error('Error fetching suggestions:', error));
  }
};

// 使用debounce函数节流优化
searchInput.addEventListener('keyup', debounce(handleKeyUp, 130));

// 回调函数处理返回值
const handleSuggestion = (data) => {
  console.log('handleSuggestion called with data:', data);
  if (data && Array.isArray(data[1])) {
    // 清空之前的数据
    clearContent();
    const result = data[1].slice(0, 7);

    // 动态创建li标签
    result.forEach(item => {
      const liObj = document.createElement("li");
      liObj.textContent = item;
      console.log('Appending suggestion:', item);
      searchResult.appendChild(liObj);
    });
    console.log('Suggestions appended to searchResult:', searchResult.innerHTML);
  } else {
    console.error('Unexpected data structure:', data);
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
    e.preventDefault(); // 阻止默认的表单提交行为
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