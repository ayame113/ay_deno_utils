import {
  mdToHTML,
  serve,
  /*tsToJs,*/
} from "https://deploy-gitrepo.deno.dev/v0.0.1/mod.ts";

const converters = [{
  // When `match` returns true, the` convert` function is called. (The first matching converter will be used.)
  match: (request: Request) => new URL(request.url).pathname.endsWith(".md"),
  convert: mdToHTML,
}, /* {
  match: (request: Request) =>
    !request.headers.get("user-agent")?.includes("Deno"),
  convert: tsToJs,
},*/ {
  match: () => true,
  convert: ({ content }: { content: string }) => ({
    content,
    headers: { "Access-Control-Allow-Origin": "*" },
  }),
}];

serve({
  owner: "ayame113",
  repo: "ay_deno_utils",
  converters,
});
