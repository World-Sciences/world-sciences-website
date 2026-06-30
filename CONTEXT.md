# World Sciences Project Context

## Project Purpose

World Sciences is an online publication. This repository is currently a React frontend redesign prototype for the site.

The immediate goal is to make the frontend feel professional, stable, and maintainable before starting backend work.

## Collaboration Preference

The user wants to learn the codebase and write most implementation changes themselves.

Codex should act primarily as a senior developer, code reviewer, and coach:

- Explain the architecture and code clearly.
- Review user-written changes when asked.
- Identify bugs, dead code, poor structure, and technical debt.
- Suggest ordered cleanup/refactoring tasks.
- Ask before making large or structural changes.
- Do not rewrite the whole project unless explicitly asked.

Small safe fixes are acceptable when requested, but default to teaching and reviewing.

## Current Frontend Stack

- React
- Vite
- Material UI
- React Router
- Fuse.js for article search
- Static/mock article and author data
- Article body content stored as `contentBlocks` in `src/content`

## Current Architecture

Entry flow:

```txt
index.html
  -> src/main.jsx
    -> ThemeProvider + CssBaseline + BrowserRouter
      -> src/App.jsx
        -> MainLayout
          -> Navbar
          -> route page
          -> Footer
```

Routes:

```txt
/                 Home.jsx
/articles         Articles.jsx
/articles/:slug   ArticleDetail.jsx
/about            About.jsx
```

Data flow:

```txt
src/data/articles.generated.js
  -> imports article content arrays from src/content/*.js

src/data/articleMetadata.js
  -> manually adds extra topics/search terms keyed by article slug

src/data/authors.js
  -> author metadata used by article cards and detail pages

src/services/articlesService.js
  -> enriches generated article data with manual metadata and author search fields
```

Article import flow:

```txt
scripts/articleUrls.js
  -> scripts/importArticles.js
    -> generates src/content/*.js
    -> generates src/data/articles.generated.js
```

There is no backend yet. Contact and newsletter forms are frontend-only UI for now.

## Important Files

- `src/main.jsx`: Initializes React, MUI theme, CSS baseline, and React Router.
- `src/App.jsx`: Defines the route table.
- `src/layouts/MainLayout.jsx`: Wraps pages with `Navbar` and `Footer`.
- `src/pages/Home.jsx`: Homepage hero, featured article, latest articles, newsletter signup.
- `src/pages/Articles.jsx`: Article search/filter page.
- `src/pages/ArticleDetail.jsx`: Full article page using `contentBlocks`.
- `src/pages/About.jsx`: About section and contact form.
- `src/components/article_card/ArticleCard.jsx`: Reusable article card.
- `src/components/navbar/Navbar.jsx`: Top navigation with animated underline.
- `src/components/newsletter/NewsletterSignUp.jsx`: Newsletter signup UI.
- `src/components/footer/Footer.jsx`: Site footer.
- `src/theme/theme.js`: MUI theme.
- `src/data/articles.generated.js`: Generated article metadata.
- `src/data/articleMetadata.js`: Manual article topics and search terms that should survive scraper regeneration.
- `src/data/authors.js`: Author metadata.
- `src/services/articlesService.js`: Shared enriched article data helpers used by pages and search.
- `scripts/importArticles.js`: Scrapes article pages and regenerates static content.
- `scripts/articleUrls.js`: Source URLs for article import.

## Known Issues And Technical Debt

High priority:

- `scripts/importArticles.js` is fragile and should be cleaned up before relying on it.
- Generated article content has data-quality issues, including encoding artifacts, duplicated captions, and odd slugs.
- Article content rendering is embedded directly inside `ArticleDetail.jsx`.
- Author/date/read-time UI is duplicated across `Home.jsx`, `ArticleCard.jsx`, and `ArticleDetail.jsx`.

Medium priority:

- Contact and newsletter forms look real but do not submit anywhere yet.
- README is still the default Vite README and should be replaced with project-specific docs.
- Page components contain lots of inline `sx` styling and could be organized into reusable components.
- Build output warns that the main JS bundle is larger than 500 kB.

## Recent Cleanup Already Done

Codex made a small low-risk frontend cleanup pass:

- Fixed the `NewsletterSignUp.jsx` import casing in `Home.jsx`.
- Updated the browser tab title to `World Sciences`.
- Fixed `Halventica` typo to `Helvetica` in `theme.js`.
- Changed global MUI border radius from `10` to `8`.
- Removed awkward letter spacing from navbar brand/home overline.
- Replaced visible date separators with plain `|`.
- Replaced footer copyright symbol with plain ASCII text.
- Verified `npm run lint`, `npm run build`, and a browser smoke test.

Note: `scripts/articleUrls.js` and `scripts/importArticles.js` had pre-existing modifications before that cleanup pass.

Additional frontend progress:

- Added `src/components/article_by_line/ArticleByLine.jsx` and use it in article cards/pages.
- Homepage now uses `src/assets/images/ws_logo.jpg` for the hero image with `objectFit: "contain"`.
- Homepage and article listing display newest articles first while keeping generated article data order intact.
- Added `src/data/articleMetadata.js` for manual per-article `topics` and `searchTerms`.
- Replaced the hand-rolled fuzzy search helper with Fuse.js.
- The articles page now uses weighted Fuse.js keys for title, excerpt, extra topics, search terms, author name, author slug, and author bio.
- The articles search input uses MUI `Autocomplete` in `freeSolo` mode.
- Search suggestions are ranked with Fuse.js, capped to six visible suggestions, and only appear after the user types at least two characters.
- Visible suggestions are articles, topics, and authors; manual `searchTerms` are used as hidden keywords to improve matching without cluttering the dropdown.
- Topic chips on the articles page use a wrapping flex layout so the filter list can span multiple lines.
- Removed `src/utils/search.js` after switching to Fuse.js.
- Added `src/services/articlesService.js` so Home, Articles, ArticleDetail, and ArticleCard share enriched article metadata.
- Article cards and detail pages now display metadata-backed topic tags instead of the generated single `topic` value.

## Recommended Next Frontend Exercises

1. Extract `ArticleContent`.
   - Suggested path: `src/components/article_content/ArticleContent.jsx`
   - Move `contentBlocks.map(...)` rendering out of `ArticleDetail.jsx`.

2. Clean generated article data and scraper behavior.
   - Fix malformed URLs.
   - Avoid duplicate caption paragraphs.
   - Avoid importing author/avatar images as article images.
   - Normalize text encoding.

3. Replace the default Vite README with real project documentation.

## Backend Direction

Backend work should start after the frontend feels stable.

Likely backend stack:

- ASP.NET Core Web API
- PostgreSQL
- Entity Framework Core

Future backend capabilities:

- Articles
- Authors
- Topics/categories
- Newsletter subscribers
- Contact submissions
- Admin login
- Create/edit/delete articles
- Image uploads
- Rich text/article content management
- Role-based permissions for admins/authors

Possible first backend phases:

```txt
Phase 1: Public read APIs for articles, authors, and topics
Phase 2: Newsletter signup and contact submissions
Phase 3: Admin authentication and article CRUD
Phase 4: Image uploads and rich content editing
```

The frontend currently uses structured `contentBlocks`. Preserve that shape until there is a clear reason to switch to Markdown, HTML, or a richer editor format.
