# World Sciences Redesign

A modern redesign of the World Sciences website built with React and Material UI. The goal of this project is to create a scalable publication platform with improved UX, responsive design, article discovery, and future CMS support.

# Getting Started

To start, clone the repo using 
```bash
git clone https://github.com/kuchekalikurosh/world-sciences.git
```

Then, go into the folder and install all packages using
```bash
npm install 
```

To test on local machine, use this command
```bash
npm run dev 
```

# Tech Stack

## Frontend

- React 19

- Vite

- Material UI (MUI v7)

- React Router DOM

## Styling

- Material UI Theme System

- Material UI sx styling

- CssBaseline

## Data (Current)

- Mock JavaScript data (articles.js, authors.js)

## Planned Backend

- ASP.NET Core Web API

- PostgreSQL

- Entity Framework Core

## Planned Features
- [x] Article search
- [x] Topic filtering
- [x] Author pages
- [x] Featured articles
- [ ] Admin dashboard
- [ ] CRUD operations
- [ ] Authentication & authorization
- [ ] Rich text editor
- [ ] Image uploads

# Branch Strategy

main → Stable/approved version

develop → Active development

# Project Structure

src/ - contains all folders of the project

assets/ - contains all image data such as profiles
  
components/ - contains all components and respective CSS files, seperated in folders of their own
  
data/ - contains mock .js files for as data
  
layouts/ - MaterialUI layout
  
pages/ - different pages of the site sit here
  
theme/ - MaterialUI theme definition

App.jsx - root component of the application (this is where the routing takes place as well)

main.jsx - entry point of the web app
