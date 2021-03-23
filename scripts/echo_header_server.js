import { serve } from "https://deno.land/std@0.90.0/http/server.ts";
const s = serve({ port: 80 });
console.log("http://localhost:80/");
for await (const req of s) {
  console.log(req)
  console.log(Object.fromEntries(req.headers.entries()))
  req.respond({ body: JSON.stringify(Object.fromEntries(req.headers.entries())) });
}
