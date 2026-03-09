# Eat-Da-Burger (React + Express)

Eat-Da-Burger is a burger tracker app where users can add burgers, move them to a devoured list, and reset back to seed data.

## Architecture

- `client/`: React + Vite single-page frontend.
- `server/`: Express REST API with an in-memory burger store.
- Legacy Handlebars/MySQL files remain in the repo for reference but are not part of the active runtime.

## API Contract

Base route: `/api/burgers`

- `GET /api/burgers`: returns all burgers.
- `POST /api/burgers`: create a burger with `{ "burger_name": "..." }`.
- `PATCH /api/burgers/:id/devour`: sets `devoured` to `true` by default, optional boolean override.
- `DELETE /api/burgers/:id`: deletes a burger.
- `POST /api/burgers/reset`: restores seed burgers.

Burger shape:

```json
{
  "id": 1,
  "burger_name": "Cheese Burger",
  "devoured": false,
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z"
}
```

Errors use this structure:

```json
{
  "error": {
    "code": "INVALID_BURGER_NAME",
    "message": "burger_name cannot be empty.",
    "details": {}
  }
}
```

## Run

```bash
npm install
npm run dev
```

- React app: [http://localhost:5173](http://localhost:5173)
- API server: [http://localhost:8000](http://localhost:8000)

Single-command development is powered by `concurrently`.

## Build + Start

```bash
npm run build
npm start
```

In production mode, the Express server serves the built React app and supports both `/` and `/burgers`.

## Quality Checks

```bash
npm run lint
npm test
```

Test coverage includes:

- Backend API behavior and validation.
- Frontend rendering and error display.
- A happy-path user flow (create -> devour -> delete -> reset).

## Current Limitation

Data is stored in memory only. Restarting the server resets burgers.

## Future Migration Note

To add MySQL persistence later, replace `server/store/burgerStore.js` with a database-backed implementation while keeping API field compatibility (`burger_name`, `devoured`).
