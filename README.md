# AfterClass Backend (CST3144)

Express.js REST API for the AfterClass app, using the native MongoDB Node.js driver and MongoDB Atlas.

- Hosted on Render: https://m00932446-after-school.onrender.com
- Lessons route: https://m00932446-after-school.onrender.com/lessons
- Front-end repo: https://github.com/zibawaa/afterclass-frontend

## Configuration

No credentials are stored in this repository. The server reads these environment variables
(on Render they are set in the service's Environment settings):

- `MONGODB_PREFIX` e.g. `mongodb+srv://`
- `MONGODB_USERNAME`
- `MONGODB_PASSWORD`
- `MONGODB_URL` e.g. `@cluster.xxxxx.mongodb.net/`
- `DB_NAME` (defaults to `AfterClass`)

## Run

    npm install
    node server.js

## Postman

`postman/AfterClass.postman_collection.json` and `postman/AfterClass-Render.postman_environment.json`
can be imported into Postman. The collection tests GET /lessons, the static image route (found and
not found), POST /orders and PUT /lessons/:_id. The environment sets `base_url` to the Render server.

## Database export

With the environment variables set, `node export-db.js` writes each collection to `db-export/`.
