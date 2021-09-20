import { serve } from "https://deploy-gitrepo.deno.dev/v0.0.3/serve.ts";
import { tsToJs } from "https://deploy-gitrepo.deno.dev/v0.0.3/ts_to_js.ts";

const converters = [{
  match: (request: Request) =>
    new URL(request.url).pathname.endsWith(".ts") &&
    !request.headers.get("user-agent")?.includes("Deno"),
  convert: tsToJs,
}, {
  match: (request: Request) => {
    const { pathname } = new URL(request.url);
    return pathname.endsWith(".ts") || pathname.endsWith(".js");
  },
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
