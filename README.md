# Woven

A minimal personal homepage — no images, no heavy frameworks, just plain HTML / CSS / JavaScript.

---

## Features

| Module | Description |
|--------|-------------|
| 🔍 **Search** | Multi-engine web search (Bing, Baidu, DuckDuckGo, Google) with live suggestions |
| 🌤 **Weather** | City-based current weather and forecast, °C / °F toggle, powered by OpenWeatherMap |
| 🌐 **Translate** | Multi-language translation (EN, ZH, JA, KO, FR, DE, ES), powered by DeepL |
| 🕐 **Time** | Live clock + calendar with weekday and year-progress display |
| 🔖 **Bookmarks** | Curated site shortcuts with expandable sub-links |

## Running Locally

```/dev/null/sh#L1-5
# Clone the repo
git clone https://github.com/<your-username>/woven.git
cd woven

# Serve with any static file server, e.g.:
npx serve .
```

> The weather and translation features rely on Serverless functions. To test them locally, use the Vercel CLI:
> ```/dev/null/sh#L1-2
> npm i -g vercel
> vercel dev
> ```

## Deployment

1. Import the repository into Serverless Server e.g.:  [Vercel](https://vercel.com/)/[Railway](https://railway.com/).
2. Add the following environment variables under **Project Settings → Environment Variables**:

   | Variable | Description |
   |----------|-------------|
   | `OPENWEATHER_API_KEY` | API key from [OpenWeatherMap](https://openweathermap.org/api) |
   | `DEEPL_API_KEY` | API key from [DeepL](https://www.deepl.com/pro-api) (free tier works) |

3. Deploy — then point your custom domain via CNAME.

## Project Structure

```/dev/null/tree#L1-20
woven/
├── index.html          # Main entry point
├── bookmark.html       # Bookmarks panel
├── time.html           # Clock / calendar panel
├── api/
│   ├── weather.js      # Weather serverless function
│   └── translate.js    # Translation serverless function
├── css/
│   ├── style.css       # Global styles
│   ├── searcher.css    # Search bar styles
│   ├── weather.css     # Weather module styles
│   ├── translate.css   # Translate module styles
│   ├── bookmark.css    # Bookmark module styles
│   └── time.css        # Time module styles
└── js/
    ├── search.js       # Search logic
    ├── weather.js      # Weather logic
    ├── translate.js    # Translation logic
    ├── time.js         # Clock / calendar logic
    ├── bookmark.js     # Bookmark interactions
    └── content.js      # Panel switching logic
```

## License

MIT
