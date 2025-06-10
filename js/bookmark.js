// 获取页面的所有元素
var pageCount = 1;
var page = document.body.cloneNode(true);

// 长按功能相关变量
var longPressTimer = null;
var isLongPress = false;
var pressStartTime = 0;
var LONG_PRESS_DELAY = 800; // 800ms

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

function bottomPage() {
    // 创建新的页面元素
    var newPage = document.createElement("div");
    newPage.innerHTML = page.innerHTML;
    document.body.appendChild(newPage);
    // 为新添加的元素绑定长按事件
    initLongPressEvents();
}

// 初始化长按事件监听器
function initLongPressEvents() {
    var bookmarkLinks = document.querySelectorAll('.bookmark a');
    
    bookmarkLinks.forEach(function(link) {
        // 移除之前的事件监听器（避免重复绑定）
        link.removeEventListener('pointerdown', handlePointerDown);
        link.removeEventListener('pointerup', handlePointerUp);
        link.removeEventListener('pointerleave', handlePointerLeave);
        link.removeEventListener('pointercancel', handlePointerCancel);
        link.removeEventListener('click', handleClick);
        
        // 添加新的事件监听器
        link.addEventListener('pointerdown', handlePointerDown, { passive: false });
        link.addEventListener('pointerup', handlePointerUp, { passive: false });
        link.addEventListener('pointerleave', handlePointerLeave, { passive: false });
        link.addEventListener('pointercancel', handlePointerCancel, { passive: false });
        link.addEventListener('click', handleClick, { passive: false });
    });
}

// 处理指针按下事件
function handlePointerDown(event) {
    var link = event.currentTarget;
    isLongPress = false;
    pressStartTime = Date.now();
    
    // 清除之前的计时器
    if (longPressTimer) {
        clearTimeout(longPressTimer);
    }
    
    // 设置长按计时器
    longPressTimer = setTimeout(function() {
        isLongPress = true;
        var longPressUrl = link.getAttribute('longpress-url');
        if (longPressUrl) {
            window.open(longPressUrl, '_blank');
        }
    }, LONG_PRESS_DELAY);
}

// 处理指针抬起事件
function handlePointerUp(event) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
}

// 处理指针离开事件
function handlePointerLeave(event) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    isLongPress = false;
}

// 处理指针取消事件
function handlePointerCancel(event) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    isLongPress = false;
}

// 处理点击事件
function handleClick(event) {
    // 如果是长按，则阻止默认的点击行为
    if (isLongPress) {
        event.preventDefault();
        event.stopPropagation();
        isLongPress = false;
        return false;
    }
}

// function topPage() {
//     // 创建新的页面元素
//     var newPage = document.createElement("div");
//     newPage.innerHTML = page.innerHTML;
//     document.body.insertBefore(newPage, document.body.firstChild);
// }

window.onload = function () {
    m_bookmarkContent();
    // 初始化长按事件
    initLongPressEvents();
}

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        bottomPage();
        pageCount++;
        if ((pageCount) >= 2) {
            document.body.removeChild(document.body.firstChild);
        };
        m_bookmarkContent();
    };
    // if (window.scrollY <= 0) {
    //     topPage();
    // };
}
