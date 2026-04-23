// 获取页面的所有元素
var pageCount = 1;
var page = document.body.cloneNode(true);

// 长按相关配置
var longPressDuration = 2000; // 长按时间阈值（毫秒）

// 全局标志：是否有长按操作正在进行（用于禁用滚动事件）
var isLongPressInProgress = false;

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
    var subLinks = bookmark.querySelector('.sub-links');
    
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
    
    // 长按检测与点击处理：仅作用于 .main-content（含其中的 <a> 与 <p>）
    // 这样长按 .sub-links 不会触发展开/收起
    if (mainContent && mainLink) {
        // 鼠标事件
        mainContent.addEventListener('mousedown', function(e) {
            // 如果按下的是 <a>，先阻止其默认导航，否则按住时浏览器可能直接拖拽/导航
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
            startLongPress();
        });

        mainContent.addEventListener('mouseup', function(e) {
            // 延迟取消，让 click 事件能够读取到 isLongPress 的状态
            setTimeout(function() {
                cancelLongPress();
            }, 10);
        });

        mainContent.addEventListener('mouseleave', function(e) {
            cancelLongPress();
            isLongPress = false; // 鼠标离开时重置状态
        });

        // 触摸事件（移动端）
        mainContent.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
            }
            startLongPress();
        }, {passive: false});

        mainContent.addEventListener('touchend', function(e) {
            setTimeout(function() {
                cancelLongPress();
            }, 10);
        });

        mainContent.addEventListener('touchcancel', function(e) {
            cancelLongPress();
            isLongPress = false; // 触摸取消时重置状态
        });

        // 在 main-content 上统一处理 click，覆盖 <a> 和 <p> 等任意子元素
        mainContent.addEventListener('click', function(e) {
            // 总是阻止默认行为（防止 <a> 直接导航）
            e.preventDefault();
            e.stopPropagation();

            if (isLongPress) {
                // 长按已经触发了展开/收起，这里仅重置标志
                isLongPress = false;
            } else {
                // 短按：打开主链接
                window.open(mainLink.href, '_blank');
            }
        });
    }

    // .sub-links：长按任意位置（含子链接 <a>）收起；短按 <a> 仍正常跳转
    if (subLinks) {
        // 鼠标
        subLinks.addEventListener('mousedown', function(e) {
            startLongPress();
        });

        subLinks.addEventListener('mouseup', function(e) {
            setTimeout(function() {
                cancelLongPress();
            }, 10);
        });

        subLinks.addEventListener('mouseleave', function(e) {
            cancelLongPress();
            isLongPress = false;
        });

        // 触摸
        subLinks.addEventListener('touchstart', function(e) {
            startLongPress();
        }, {passive: true});

        subLinks.addEventListener('touchend', function(e) {
            setTimeout(function() {
                cancelLongPress();
            }, 10);
        });

        subLinks.addEventListener('touchcancel', function(e) {
            cancelLongPress();
            isLongPress = false;
        });

        // 关键：在捕获阶段拦截 click，长按时阻止 <a> 跳转，短按则放行
        subLinks.addEventListener('click', function(e) {
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
                isLongPress = false;
            }
            // 非长按场景不做任何处理，让 <a target="_blank"> 自然跳转
        }, true);
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
