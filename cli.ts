import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";
import { ensureDirSync } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";

const parsedArgs = parseArgs(Deno.args);

ensureDirSync(`./plantation`);
ensureDirSync(`./plantation/${parsedArgs["_"][0]}`);

const create = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/plantation/main/routes/create.tsx",
);
Deno.writeTextFileSync(
  `./plantation/${parsedArgs["_"][0]}/create.tsx`,
  await create.text(),
);

Deno.writeTextFileSync(`./plantation/${parsedArgs["_"][0]}/login.tsx`, "AAA");

Deno.writeTextFileSync(`./plantation/${parsedArgs["_"][0]}/logout.tsx`, "AAA");
