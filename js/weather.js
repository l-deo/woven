// 获取DOM元素
const weather = document.getElementById("weather");
const weather_bar = document.getElementById("weather_bar");
const weather_box = document.getElementById("weather_box");

/**
 * 移动设备上显示天气内容
 */
function m_weatherContent() {
    if (window.innerWidth < 650) {
        // 隐藏其他元素
        [box, search, suggestContainer, translate_bar, translate_box, menu].forEach(
            element => { if (element) element.style.display = "none"; }
        );

        // 显示天气相关元素
        if (weather_bar) weather_bar.style.display = "flex";
        if (weather_box) weather_box.style.display = "flex";
        if (backBtn) backBtn.style.display = "inline";
        if (content) content.style.display = "inline";
    }
}

/**
 * 格式化日期为星期几
 * @param {number} timestamp - UNIX时间戳
 * @return {string} 格式化后的星期几
 */
function formatWeekday(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
}

/**
 * 获取天气数据
 * @param {string} city - 城市名称
 * @param {string} unit - 温度单位
 * @return {Promise} 天气数据的Promise
 */
async function fetchWeatherData(city, unit) {
    try {
        const params = new URLSearchParams({
            city: city,
            unit: unit
        });
        const response = await fetch(`/api/weather?${params.toString()}`);
        const weatherData = await response.json();

        if (!response.ok) {
            throw new Error(weatherData.error || '无法获取天气数据');
        }

        return weatherData;
    } catch (error) {
        throw new Error(error.message || '无法获取天气数据');
    }
}

/**
 * 渲染天气数据到页面
 * @param {Object} data - 包含当前天气和预报的数据对象
 * @return {string} 天气HTML
 */
function renderWeatherData(data, unit) {
    const { currentData, forecastData } = data;

    // 处理天气预报数据 - 每8个数据点选一个（代表一天）
    const dailyForecasts = forecastData.list
        .filter((item, index) => index % 8 === 0)
        .slice(1, 4); // 只保留接下来的3天

    const tempUnit = currentData.main.temp.toFixed(0);

    // 构建天气HTML
    return `
        <div class="weather-display">
            <div class="current-weather">
                <div class="date">${formatWeekday(currentData.dt)}</div>
                <div class="condition">${currentData.weather[0].description}</div>
                <div class="temp">${tempUnit}°${unit === 'metric' ? 'C' : 'F'}</div>
            </div>
            <div class="forecast">
                ${dailyForecasts.map(day => `
                    <span class="forecast-day">
                        <div class="date">${formatWeekday(day.dt)}</div>
                        <div class="condition">${day.weather[0].description}</div>
                        <div class="temp">${Math.round(day.main.temp)}°${unit === 'metric' ? 'C' : 'F'}</div>
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

// 监听表单提交事件
if (weather_bar) {
    weather_bar.addEventListener('submit', async function (e) {
        e.preventDefault();
        const weather_body = document.getElementById('weather_body');

        // 获取输入值
        const city = document.getElementById('city')?.value || 'shenzhen';
        const unit = document.getElementById('unit')?.value || 'metric';

        try {
            // 获取天气数据
            const weatherData = await fetchWeatherData(city, unit);

            // 渲染天气数据
            if (weather_body) {
                weather_body.innerHTML = renderWeatherData(weatherData, unit);
            }
        } catch (error) {
            if (weather_body) {
                weather_body.innerHTML = '<div class="weather-display">无法获取天气信息</div>';
            }
            console.error('天气数据获取失败:', error);
        }
    });
}

// 添加窗口大小变化监听
window.addEventListener('resize', m_weatherContent);

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    m_weatherContent();
});