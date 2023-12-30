import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";
import { ensureDirSync } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std@0.210.0/fs/exists.ts";

const parsedArgs = parseArgs(Deno.args);

ensureDirSync(`./plantation`);
ensureDirSync(`./plantation/${parsedArgs["_"][0]}`);

const create = await fetch(
  "https://deno.land/x/plantation@0.0.1/routesTemplate/create.tsx?source=",
);
const createFilePath = `./plantation/${parsedArgs["_"][0]}/create.tsx`;
Deno.writeTextFileSync(
  createFilePath,
  await create.text(),
);
console.info(`✅ Create File: ${createFilePath}`) 

const login = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/plantation/main/routesTemplate/create.tsx",
);

const loginFilePath = `./plantation/${parsedArgs["_"][0]}/login.tsx`;
Deno.writeTextFileSync(
  loginFilePath,
  await login.text(),
);
console.info(`✅ Create File: ${loginFilePath}`) 

const logout = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/plantation/main/routesTemplate/logout.tsx",
);

const logoutFilePath = `./plantation/${parsedArgs["_"][0]}/logout.tsx`;
Deno.writeTextFileSync(
  logoutFilePath,
  await logout.text(),
);
console.info(`✅ Create File: ${logoutFilePath}`) 
