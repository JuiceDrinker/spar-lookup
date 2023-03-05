**SPAR Lookup API**

This API acts as as proxy to the [SPAR register service](https://www.statenspersonadressregister.se/master/start/).

### Setup

Run `npm install` to install packages. API expects to find a `/certificates` directory containing the `.crt` and `.key` files issued by the SPAR registry service. The path and names of these files can be changed in the `/clients/sparClient.ts` file.

`npm run start` initiates the server on your local 3000 port. `npm run test` runs the tests found across the codebase.

### API Endpoints

The API exposes a single endpoint - `POST /lookup-request`. The body should contain the Swedish identity number used to query the SPAR registry. The endpoint, the request body and responses are specified using OpenAPI. The specification can be found inside the `/openapi/openapi.yaml` file.
