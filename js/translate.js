var translate = document.getElementById("translate");
var translate_bar = document.getElementById("translate_bar");
var translate_box = document.getElementById("translate_box");
const tbody = document.querySelector('#tbody');

function translateContent() {
  search.style.display = "none";
  suggestContainer.style.display = "none";
  box.style.display = "none";
  translate_bar.style.display = "flex";
  translate_box.style.display = "flex";
}

function m_translateContent() {
  if (window.innerWidth < 650) {
    box.style.display = "none";
    search.style.display = "none";
    suggestContainer.style.display = "none";
    title.style.display = "none";
    backBtn.style.display = "inline";
    content.style.display = "inline";
    translate_bar.style.display = "flex";
    translate_box.style.display = "flex";
  }
}

function isCJKCharacter(char) {
  const unicode = char.charCodeAt(0);
  return (
    (unicode >= 0x4E00 && unicode <= 0x9FFF) || // 中文
    (unicode >= 0x3040 && unicode <= 0x30FF) || // 日文
    (unicode >= 0xAC00 && unicode <= 0xD7AF)    // 韩文
  );
}

function isCJKText(text) {
  for (const char of text) {
    if (isCJKCharacter(char)) {
      return true;
    }
  }
  return false;
}

function calculateFontSize(textLength, isMobile, isCJK) {
  let fontSize;

  if (isCJK) {
    fontSize = isMobile ? (Math.max(32 - 0.5 * textLength, 10)) : (Math.max(12 - 0.25 * textLength, 5));
  } else if (isMobile) {
    fontSize = Math.max(35 - 0.5 * textLength, 10);
  } else {
    fontSize = Math.max(15 - 0.25 * textLength, 5);
  }

  return fontSize;
}

function adjustFontSize() {
  const element = document.getElementById("td");
  const text = element.innerText;
  const textLength = text.length;
  const isMobile = window.innerWidth <= 650;
  const isCJK = isCJKText(text);
  const newFontSize = calculateFontSize(textLength, isMobile, isCJK);
  element.style.fontSize = `${newFontSize}vw`;
}


translate_bar.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(translate_bar);
  const text = formData.get('text');
  const targetLang = formData.get('targetLang');

  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetLang }),
  });
  const result = await response.json();
  const translation = result.translation;

  // 在表格中显示翻译结果
  tbody.innerHTML = '';
  const newRow = document.createElement('tr');

  const translationCell = document.createElement('td');
  translationCell.id = 'td'; // 添加一个 ID 以便在 adjustFontSize 中使用
  translationCell.textContent = translation;
  newRow.appendChild(translationCell);

  tbody.appendChild(newRow);

  // 调用 adjustFontSize 函数
  adjustFontSize();
});
