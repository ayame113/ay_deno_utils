import { serve } from "https://deno.land/std@0.90.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify({
      url: req.url,
      method: req.method,
      proto: req.proto,
      headers: Object.fromEntries(req.headers.entries())
    }, null, 2)
  });
}
