# Scott Thomas Furniture

This is the code repository for example.notacms.com

## Getting Started

You need to create a `config.json` file (or `config-dev.json` file for dev mode) with the following contents:

```json
{
  "space": "contentful-space-id-here",
  "accessToken": "contentful-access-token-here",
  "mongo": "mongodb://db:27017/lightspeedhosting"
}
```

From there you can run `npm run web` or `npm run dev` if pointed to a db.

If you fancy using docker, you can run `docker-compose up dev` or `docker-compose up prod`.

## Content Types

This repository utilizes three different content types as examples of what can be done:

* Page
* Product
* Redirect