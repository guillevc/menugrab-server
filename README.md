![Test](https://github.com/guillevc/menugrab-server/workflows/Test/badge.svg?branch=master)

# Menugrab server
This repo contains the backend component of the __Menugrab iOS App__ (https://github.com/guillevc/menugrab-ios).

## Details
Here are some small implementation details of `menugrab-server`. For a description of the full app, with all its features, refer to the [iOS App readme](https://github.com/guillevc/menugrab-ios).

- Node.js REST API using Fastify.
- Uses Firestore as a database, so it could be considered a middleware.
- Integrates with Firebase Authentication aswell, allowing authentication from the client through a `Bearer <token>` header structure holding a Firebase Authentication token.
- Route-specific protection for authenticated users.
- Integration with Swagger, which generates API documentation based off of defined routes and schemas. It can be accessed trough the `/docs` route.

## Run locally

Add your Firebase service account  key JSON file content `base64` encoded as the `FIREBASE_CERT_FILE_BASE64` environment variable. The project uses [firebase-env](https://github.com/fastify/fastify-env), so you can create a `.env` file at the root of the project and set environment variables that way.

Then, simply run:
```
npm install
npm start
```
Serves on port `3000` by default.
