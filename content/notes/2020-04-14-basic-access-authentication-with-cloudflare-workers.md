---
title: Basic Access Authentication With Cloudflare Workers
date: 2020-04-14T18:14:56Z
tags: ["cloudflare", "cloudflare/workers", "http/basicauth", "javascript", "javascript/serviceworkerapi"]
---

Basic access authentication is a method for enforcing access controls to resources on the World Wide Web. For
authorization a **client** needs to provide an _Authorization_ header with an authentication method _Basic_ and
credentials encoded as Base64, I.e. `Basic username:password`. On unauthorized requests the **server** should return a
response whose header contains a HTTP _401 Unauthorized_ status, and a _WWW-Authenticate_ field with method _Basic_ (see
[Wikipedia][en.wikipedia.org:basic-access-authentication]).

Caution. Basic access authentication just encodes the transmitted credentials, to add confidentiality a secure
transportation protocol like TLS(HTTPS) is required.

Cloudflare workers implement the [Service Worker API][developer.mozilla.org:web:api:service-worker-api], therefore it's
straight forward to implement basic access authentication in JavaScript.

```javascript
const authorization = "Basic dXNlcm5hbWU6cGFzc3dvcmQ=";

const handle = async function (request) {
  if (request.headers.get("Authorization") !== authorization) {
    return new Response(null, {
      status: "401",
      statusDescription: "Unauthorized",
      body: "Unauthorized",
      headers: {
        "WWW-Authenticate": "Basic",
      },
    });
  }

  return await fetch(request);
};

addEventListener("fetch", function (event) {
  event.respondWith(handle(event.request));
});
```

The authorization string from the preceding snippet can be generated as follows.

```bash
printf "Basic %s\n" $(printf "%s" "username:password" | base64)
# Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

[en.wikipedia.org:basic-access-authentication]: https://en.wikipedia.org/wiki/Basic_access_authentication
[developer.mozilla.org:web:api:service-worker-api]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
