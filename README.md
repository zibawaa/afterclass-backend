# AfterClass Backend (CST3144)

Express.js REST API for the AfterClass app, using the native MongoDB Node.js driver and MongoDB Atlas.

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
