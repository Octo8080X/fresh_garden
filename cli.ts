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

ensureDirSync(`./garden`);
ensureDirSync(`./garden/${parsedArgs["_"][0]}`);

// ./garden/extra_load.tsx が存在しなければ作成する
if (!existsSync(`./garden/extra_load.tsx`)) {
  const souceText = "console.log('Load ./garden!');\n";

  Deno.writeTextFileSync(
    `./garden/extra_load.ts`,
    souceText,
  );
  console.info(`✅ Create File: ./garden/extra_load.ts`);
}

const create = await fetch(
  "https://deno.land/x/garden@0.0.1/routesTemplate/create.tsx?source=",
);
const createFilePath = `./garden/${parsedArgs["_"][0]}/create.tsx`;
Deno.writeTextFileSync(
  createFilePath,
  await create.text(),
);
console.info(`✅ Create File: ${createFilePath}`);
Deno.writeTextFileSync(
  `./garden/extra_load.ts`,
  `(async () => await import('.${createFilePath}'));\n`,
  { append: true },
);

const login = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/garden/main/routesTemplate/create.tsx",
);

const loginFilePath = `./garden/${parsedArgs["_"][0]}/login.tsx`;
Deno.writeTextFileSync(
  loginFilePath,
  await login.text(),
);
console.info(`✅ Create File: ${loginFilePath}`);
Deno.writeTextFileSync(
  `./garden/extra_load.ts`,
  `(async () => await import('.${loginFilePath}'));\n`,
  { append: true },
);
const logout = await fetch(
  "https://raw.githubusercontent.com/Octo8080X/garden/main/routesTemplate/logout.tsx",
);

const logoutFilePath = `./garden/${parsedArgs["_"][0]}/logout.tsx`;
Deno.writeTextFileSync(
  logoutFilePath,
  await logout.text(),
);
console.info(`✅ Create File: ${logoutFilePath}`);
Deno.writeTextFileSync(
  `./garden/extra_load.ts`,
  `(async () => await import('.${logoutFilePath}'));\n`,
  { append: true },
);

console.info(
  `Please add \`(async () => await import('./garden/extra_loader.ts'));\` to your main.ts.`,
);
