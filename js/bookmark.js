// 获取页面的所有元素
var pageCount = 1;
var page = document.body.cloneNode(true);

// 长按相关配置
var longPressDuration = 800; // 长按时间阈值（毫秒）

// 全局标志：是否有长按操作正在进行（用于禁用滚动事件）
var isLongPressInProgress = false;

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

// 切换书签展开/收起状态
function toggleBookmarkExpansion(bookmarkElement) {
    // 简单切换 expanded 类，CSS 会处理所有的显示/隐藏和动画
    if (bookmarkElement.classList.contains('expanded')) {
        bookmarkElement.classList.remove('expanded');
    } else {
        bookmarkElement.classList.add('expanded');
    }
}

// 初始化单个书签的事件监听器（使用闭包隔离状态）
function initSingleBookmarkEvents(bookmark) {
    // 检查是否已经初始化过，防止重复添加事件监听器
    if (bookmark.dataset.eventsInitialized === 'true') {
        return;
    }
    
    // 标记为已初始化
    bookmark.dataset.eventsInitialized = 'true';
    
    // 使用闭包为每个书签创建独立的状态变量
    var longPressTimer = null;
    var isLongPress = false;
    
    // 获取bookmark内的主链接（.main-content中的a标签）
    var mainContent = bookmark.querySelector('.main-content');
    var mainLink = bookmark.querySelector('.main-content a');
    
    // 长按检测函数（闭包内部）
    function startLongPress() {
        isLongPress = false;
        isLongPressInProgress = true; // 设置全局标志，禁用滚动事件
        longPressTimer = setTimeout(function() {
            isLongPress = true;
            toggleBookmarkExpansion(bookmark);
        }, longPressDuration);
    }
    
    function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        // 延迟重置全局标志，确保click事件处理完成
        setTimeout(function() {
            isLongPressInProgress = false;
        }, 50);
    }
    
    // 鼠标事件
    bookmark.addEventListener('mousedown', function(e) {
        startLongPress();
    });
    
    bookmark.addEventListener('mouseup', function(e) {
        // 延迟取消，让click事件能够读取到isLongPress的状态
        setTimeout(function() {
            cancelLongPress();
        }, 10);
    });
    
    bookmark.addEventListener('mouseleave', function(e) {
        cancelLongPress();
        isLongPress = false; // 鼠标离开时重置状态
    });
    
    // 触摸事件（移动端）
    bookmark.addEventListener('touchstart', function(e) {
        startLongPress();
    }, {passive: true});
    
    bookmark.addEventListener('touchend', function(e) {
        // 延迟取消，让click事件能够读取到isLongPress的状态
        setTimeout(function() {
            cancelLongPress();
        }, 10);
    });
    
    bookmark.addEventListener('touchcancel', function(e) {
        cancelLongPress();
        isLongPress = false; // 触摸取消时重置状态
    });
    
    // 关键修复：在main-content上处理点击事件，而不仅仅是<a>标签
    // 这样可以捕获整个区域的点击，包括<a>标签和<p>标签
    if (mainContent && mainLink) {
        // 在main-content上阻止<a>标签的默认行为
        mainContent.addEventListener('mousedown', function(e) {
            // 如果点击的是<a>标签，阻止其默认行为
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
        });
        
        mainContent.addEventListener('touchstart', function(e) {
            // 如果点击的是<a>标签，阻止其默认行为
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
        }, {passive: false});
        
        // 在main-content上处理click事件
        mainContent.addEventListener('click', function(e) {
            // 总是阻止默认行为
            e.preventDefault();
            e.stopPropagation();
            
            if (isLongPress) {
                // 如果是长按，不做任何事（已经展开了sub-links）
                isLongPress = false;
            } else {
                // 短按时，手动触发导航
                window.open(mainLink.href, '_blank');
            }
        });
    }
}

// 初始化所有书签事件监听器
function initBookmarkEvents() {
    var bookmarks = document.querySelectorAll('.bookmark');
    bookmarks.forEach(function(bookmark) {
        initSingleBookmarkEvents(bookmark);
    });
}

function bottomPage() {
    // 创建新的页面元素
    var newPage = document.createElement("div");
    newPage.innerHTML = page.innerHTML;
    document.body.appendChild(newPage);
    
    // 为新添加的书签初始化事件监听器
    initBookmarkEvents();
}

// function topPage() {
//     // 创建新的页面元素
//     var newPage = document.createElement("div");
//     newPage.innerHTML = page.innerHTML;
//     document.body.insertBefore(newPage, document.body.firstChild);
// }

function initializeBookmarks() {
    m_bookmarkContent();
    initBookmarkEvents();
}

window.addEventListener("load", initializeBookmarks);
window.addEventListener("pageshow", initializeBookmarks);

if (document.readyState === "interactive" || document.readyState === "complete") {
    initializeBookmarks();
}

setTimeout(function () {
    initBookmarkEvents();
}, 0);

function handleScroll() {
    // 如果正在进行长按操作，不执行滚动触发的DOM修改
    // 这可以防止长按期间DOM被修改导致事件状态混乱
    if (isLongPressInProgress) {
        return;
    }

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight || document.body.offsetHeight;

    if (scrollTop + viewportHeight >= fullHeight - 2) {
        bottomPage();
        pageCount++;
        if ((pageCount) >= 2) {
            document.body.removeChild(document.body.firstChild);
        };
        m_bookmarkContent();
    };
    // if (scrollTop <= 0) {
    //     topPage();
    // };
}

window.addEventListener("scroll", handleScroll, { passive: true });
