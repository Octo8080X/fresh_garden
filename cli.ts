import { parseArgs } from "https://deno.land/std@0.210.0/cli/parse_args.ts";
import { ensureDirSync } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std@0.210.0/fs/exists.ts";

const parsedArgs = parseArgs(Deno.args);
if (!parsedArgs["_"][0]) {
  console.error(
    "\u001b[31m[ERROR]:Please input resource name. ex cli.ts user\u001b[0m",
  );
  Deno.exit(1);
}

ensureDirSync(`./plantation`);
ensureDirSync(`./plantation/${parsedArgs["_"][0]}`);

// ./plantation/extra_load.tsx が存在しなければ作成する
if (!existsSync(`./plantation/extra_load.tsx`)) {
  const souceText = "console.log('Load ./plantation!');\n";

  Deno.writeTextFileSync(
    `./plantation/extra_load.ts`,
    souceText,
  );
  console.info(`✅ Create File: ./plantation/extra_load.ts`);
}

const create = await fetch(
  "https://deno.land/x/plantation@0.0.1/routesTemplate/create.tsx?source=",
);
const createFilePath = `./plantation/${parsedArgs["_"][0]}/create.tsx`;
Deno.writeTextFileSync(
  createFilePath,
  await create.text(),
);
console.info(`✅ Create File: ${createFilePath}`);
Deno.writeTextFileSync(
  `./plantation/extra_load.ts`,
  `(async () => await import('.${createFilePath}'));\n`,
  { append: true },
);

const login = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/plantation/main/routesTemplate/create.tsx",
);

const loginFilePath = `./plantation/${parsedArgs["_"][0]}/login.tsx`;
Deno.writeTextFileSync(
  loginFilePath,
  await login.text(),
);
console.info(`✅ Create File: ${loginFilePath}`);
Deno.writeTextFileSync(
  `./plantation/extra_load.ts`,
  `(async () => await import('.${loginFilePath}'));\n`,
  { append: true },
);
const logout = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/plantation/main/routesTemplate/logout.tsx",
);

const logoutFilePath = `./plantation/${parsedArgs["_"][0]}/logout.tsx`;
Deno.writeTextFileSync(
  logoutFilePath,
  await logout.text(),
);
console.info(`✅ Create File: ${logoutFilePath}`);
Deno.writeTextFileSync(
  `./plantation/extra_load.ts`,
  `(async () => await import('.${logoutFilePath}'));\n`,
  { append: true },
);

console.info(
  `Please add \`(async () => await import('./plantation/extra_loader.ts'));\` to your main.ts.`,
);
