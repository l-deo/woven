// 获取页面的所有元素
var pageCount = 1;
var page = document.body.cloneNode(true);

// 切换书签展开/收起状态
function toggleBookmarkExpansion(bookmarkElement) {
    // 简单切换 expanded 类，CSS 会处理所有的显示/隐藏和动画
    if (bookmarkElement.classList.contains("expanded")) {
        bookmarkElement.classList.remove("expanded");
    } else {
        bookmarkElement.classList.add("expanded");
    }
}

// 初始化单个书签的事件监听器（使用闭包隔离状态）
function initSingleBookmarkEvents(bookmark) {
    // 检查是否已经初始化过，防止重复添加事件监听器
    if (bookmark.dataset.eventsInitialized === "true") {
        return;
    }

    // 标记为已初始化
    bookmark.dataset.eventsInitialized = "true";

    // 获取bookmark内的主链接（.main-content中的a标签）
    var mainContent = bookmark.querySelector(".main-content");
    var mainLink = bookmark.querySelector(".main-content a");
    var subLinks = bookmark.querySelector(".sub-links");

    // 点击 .bookmark：未展开时展开；展开时收起（点击链接除外）
    bookmark.addEventListener("click", function (e) {
        var link = e.target.closest("a");
        if (link) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        toggleBookmarkExpansion(bookmark);
    });

    // 点击 mainLink：跳转到 mainLink.href
    if (mainLink) {
        mainLink.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(mainLink.href, "_blank");
        });
    }

    // 点击 subLinks 中的 a.xxx：跳转到对应链接
    if (subLinks) {
        subLinks.addEventListener("click", function (e) {
            var link = e.target.closest("a");
            if (!link) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            window.open(link.href, "_blank");
        });
    }
}

// 初始化所有书签事件监听器
function initBookmarkEvents() {
    var bookmarks = document.querySelectorAll(".bookmark");
    bookmarks.forEach(function (bookmark) {
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

if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
) {
    initializeBookmarks();
}

setTimeout(function () {
    initBookmarkEvents();
}, 0);

function handleScroll() {
    var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    var viewportHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    var fullHeight =
        document.documentElement.scrollHeight ||
        document.body.scrollHeight ||
        document.body.offsetHeight;

    if (scrollTop + viewportHeight >= fullHeight - 2) {
        bottomPage();
        pageCount++;
        if (pageCount >= 2) {
            document.body.removeChild(document.body.firstChild);
        }
        m_bookmarkContent();
    }
    // if (scrollTop <= 0) {
    //     topPage();
    // };
}

window.addEventListener("scroll", handleScroll, { passive: true });
