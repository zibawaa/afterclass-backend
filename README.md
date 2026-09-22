# AfterClass backend

AfterClass is Ali Alnabhan's CST3144 Express and native MongoDB driver API.

- Repository: https://github.com/zibawaa/afterclass-backend
- Render API: https://m00932446-after-school.onrender.com/lessons (after Render setup)
- Frontend: https://github.com/zibawaa/afterclass-frontend
- Pages: https://zibawaa.github.io/afterclass-frontend/
- Student number: M00932446

Copy `.env.example` to `.env`, fill `MONGODB_URI` with an Atlas SRV URL, run `npm run seed`, then `npm start`. The app refuses local MongoDB URLs. `npm test` runs API, validation, middleware and repository tests without Atlas.

Routes include `GET /lessons` with `q` and `teacher` filters, `GET /teachers`, `GET /enrolment/:lessonid`, `POST /orders`, mutable `PUT /lessons/:id`, static `/images/<file>`, and `GET /health`. Orders begin pending; Atlas transactions update all lesson spaces together, and request IDs make retries safe.

`render.yaml` creates `m00932446-after-school`. Add `MONGODB_URI` as a Render secret, allow Render in Atlas Network Access, and set `ALLOWED_ORIGINS=https://zibawaa.github.io`.
