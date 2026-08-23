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

# Backend (Local API + Database)

The backend is an ASP.NET Core (.NET 9) minimal API that serves articles, authors, and topics from a **MongoDB** database. For local development, MongoDB runs in Docker and is seeded automatically from the JSON fixtures in `seed/`.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — provides Docker Engine and Docker Compose
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

## 1. Start MongoDB (and seed it)

From the repo root:
```bash
docker compose up -d
```
This starts a `mongo:8` container on `localhost:27017` and runs a one-off seed container that imports `authors`, `topics`, and `articles` into the `worldsciences` database. The data persists in a Docker volume between runs.

To stop it (kept data):
```bash
docker compose down
```

## 2. Run the API

```bash
dotnet run --project backend/WorldSciences.Api
```
The API listens on `http://localhost:5156`. Verify it is up:
```bash
curl http://localhost:5156/api/health     # {"status":"ok"}
curl http://localhost:5156/api/articles
```

## 3. Run the frontend against it

The frontend reads its API base URL from `VITE_API_BASE_URL` (default `http://127.0.0.1:5156`), so with the API running, `npm run dev` fetches live data from it.

## Running the backend tests

The integration tests need the local MongoDB from step 1 running:
```bash
docker compose up -d mongo
dotnet test backend/WorldSciences.Api.Tests
```

## Configuration

MongoDB settings live under the `Mongo` section of `backend/WorldSciences.Api/appsettings.json` (`ConnectionString`, `DatabaseName`) and can be overridden with the environment variables `Mongo__ConnectionString` and `Mongo__DatabaseName`.

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

## Backend

- ASP.NET Core (.NET 9) minimal API

- MongoDB (run locally via Docker Compose, seeded from `seed/`)

## Data

- Backend API serves articles, authors, and topics from MongoDB

- Frontend fetches from the API (`VITE_API_BASE_URL`, default `http://127.0.0.1:5156`)

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

features → Active development

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
