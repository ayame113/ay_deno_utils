import { serve } from "https://deno.land/std@0.90.0/http/server.ts";
const s = serve({ port: 80 });
console.log("http://localhost:80/");
for await (const req of s) {
  req.respond({
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2)
  });
}
