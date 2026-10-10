# FOUND — Campus Lost & Found

A mobile-first lost-and-found web app inspired by the supplied reference. It is organized as a **multi-page React application**: each main screen has its own URL, page component, and navigation entry. Item reports, search, details, and contact notes use the Express REST API. The report form supports optional photo upload and mobile camera capture.

## Stack

- **Frontend:** React 18, Vite, React Router 7
- **REST API:** Node.js + Express
- **Persistence:** JSON files in `server/data/` (created automatically on first start)

## Run locally

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` and proxies `/api` requests to Express at `http://localhost:5000`.

Production-style build:

```bash
npm run build
npm start
```

Express serves the built client from `dist/` and falls back to the React entry point for page routes. Set `PORT` to change the API/server port.

## Pages

| URL | Page |
| --- | --- |
| `/welcome` | Welcome and guest entry |
| `/home` | Searchable board, lost/found filters, categories, recent posts |
| `/report` | Create a lost or found post |
| `/item/:id` | Item details and campus map view |
| `/chat/:id` | Send a note about a post |
| `/inbox` | Notes sent from this browser |
| `/profile` | Local demo contact profile |

## REST endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `GET` | `/api/stats` | Active, lost, found, and reunited counts |
| `GET` | `/api/categories` | Available item categories |
| `GET` | `/api/items` | Search/list items; supports `q`, `type`, `category`, `status`, and `sort` |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items` | Create a lost or found post |
| `PATCH` | `/api/items/:id` | Update item details/status |
| `PATCH` | `/api/items/:id/status` | Mark a post `active` or `resolved` |
| `DELETE` | `/api/items/:id` | Delete a post |
| `POST` | `/api/items/:id/claims` | Record a message about a post |

`POST /api/items` expects `type`, `title`, `category`, `location`, `dateOccurred`, `description`, `posterName`, and `contactEmail`. It accepts `multipart/form-data` with an optional `photo` field (JPG, PNG, WebP, AVIF, or HEIC; maximum 5 MB). Uploaded photos are served from `/uploads/…` and the public item response includes `imageUrl`; contact emails remain private.

## Demo notes

- The API seeds sample campus items on first start. Posts and contact notes persist under `server/data/`; sample product photos are in `client/public/items/`.
- Profile and inbox views are local demo features. This prototype has no real authentication, authorization, or email delivery. Contact notes are saved by the API but are **not emailed** to the poster; add those services before using real student data.
