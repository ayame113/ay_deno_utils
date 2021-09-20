import { serve } from "https://deploy-gitrepo.deno.dev/v0.0.2/serve.ts";
import { tsToJs } from "https://deploy-gitrepo.deno.dev/v0.0.2/ts_to_js.ts";
// import { mdToHTML } from "https://deploy-gitrepo.deno.dev/v0.0.2/md_to_html.ts";

const converters = [
  /*{
  // When `match` returns true, the` convert` function is called. (The first matching converter will be used.)
  match: (request: Request) => new URL(request.url).pathname.endsWith(".md"),
  convert: mdToHTML,
}, */ {
    match: (request: Request) =>
      new URL(request.url).pathname.endsWith(".ts") &&
      !request.headers.get("user-agent")?.includes("Deno"),
    convert: tsToJs,
  },
  {
    match: (request: Request) => {
      const { pathname } = new URL(request.url);
      return pathname.endsWith(".ts") || pathname.endsWith(".js");
    },
    convert: ({ content }: { content: string }) => ({
      content,
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
  },
];

serve({
  owner: "ayame113",
  repo: "ay_deno_utils",
  converters,
});
