# Menugrab server

![ci](https://github.com/guillevc/menugrab-server/workflows/ci/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/guillevc/menugrab-server/branch/master/graph/badge.svg?token=KBA3MO8QZ4)](https://codecov.io/gh/guillevc/menugrab-server)

This repo contains the backend component of the __Menugrab iOS App__ (https://github.com/guillevc/menugrab-ios).

## Details

Here are some small implementation details of `menugrab-server`. For a description of the full platform, with all its features, refer to the [iOS App readme](https://github.com/guillevc/menugrab-ios).

- Node.js REST API using Fastify.
- Firestore as a database.
- Integrates with [Firebase Authentication Admin](https://firebase.google.com/docs/auth/admin) aswell, allowing authorization from the iOS app through a `Authorization: Bearer <token>` header structure holding a Firebase Authentication ID token.
- Route-specific protection for authenticated users.
- Integration with Swagger, which generates API documentation based off of defined routes and schemas. It can be accessed trough the `/docs` route.

## Requirements

- Node.js v14.x
- Firebase project for Firestore, Firebase Authentication and Firebase Cloud Messaging.

## Quick start

Add your Firebase service account  key JSON file content `base64` encoded as the `FIREBASE_CERT_FILE_BASE64` environment variable. The project uses [fastify-env](https://github.com/fastify/fastify-env), so you can create a `.env` file at the root directory of the project and set environment variables that way.

Then, simply run:

```bash
npm install
npm start
```

Serves on port `3000` by default. A different port can be specified through the `PORT` environment variable.
