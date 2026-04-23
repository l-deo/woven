var translate = document.getElementById("translate");
var translate_bar = document.getElementById("translate_bar");
var translate_box = document.getElementById("translate_box");
const translate_body = document.querySelector('#translate_body');

function m_translateContent() {
    if (window.innerWidth < 650) {
        box.style.display = "none";
        search.style.display = "none";
        suggestContainer.style.display = "none";
        weather_bar.style.display = "none";
        weather_box.style.display = "none";
        menu.style.display = "none";
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
  if (!element) {
    return;
  }

  const text = element.innerText;
  const textLength = text.length;
  const isMobile = window.innerWidth <= 650;
  const isCJK = isCJKText(text);
  const newFontSize = calculateFontSize(textLength, isMobile, isCJK);
  element.style.fontSize = `${newFontSize}vw`;
}

function renderTranslationRow(message, isError) {
  if (!translate_body) {
    return;
  }

  translate_body.innerHTML = '';
  const newRow = document.createElement('tr');
  const cell = document.createElement('td');

  cell.id = 'td';
  cell.textContent = message;

  if (isError) {
    cell.style.color = 'red';
  }

  newRow.appendChild(cell);
  translate_body.appendChild(newRow);
  adjustFontSize();
}

if (translate_bar) {
  translate_bar.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // 获取表单数据
    const formData = new FormData(translate_bar);
    const text = formData.get('text');
    const targetLang = formData.get('targetLang');
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: typeof text === 'string' ? text.trim() : '',
          targetLang: typeof targetLang === 'string' ? targetLang : ''
        })
      });
      const result = await response.json().catch(function () {
        return {};
      });
      
      if (!response.ok) {
        throw new Error(result.error || `API请求失败: ${response.status}`);
      }

      const translation = result.translations && result.translations[0]
        ? result.translations[0].text
        : '';

      if (!translation) {
        throw new Error('翻译结果为空');
      }
      
      renderTranslationRow(translation, false);
    } catch (error) {
      console.error('翻译请求出错:', error);
      renderTranslationRow(`翻译失败: ${error.message}`, true);
    }
  });
}
  