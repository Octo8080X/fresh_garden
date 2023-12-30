import { z, type ZodIssue } from "../../deps.ts";

interface PlantationTextValidateResultSuccess {
  success: true;
  errors: string[];
  data: string;
}

interface PlantationTextValidateResultFailure {
  success: false;
  errors: string[];
}
export type PlantationTextValidateResult =
  | PlantationTextValidateResultSuccess
  | PlantationTextValidateResultFailure;

export const usernameSchema = z
  .coerce
  .string()
  .trim()
  .min(8)
  .max(32)
  .regex(/[0-9]+/)
  .regex(/[a-z]+/)
  .regex(/^[a-z0-9]+/);

export const emailSchema = z
  .coerce
  .string()
  .trim()
  .min(8)
  .max(48)
  .email();

export const passwordSchema = z
  .coerce
  .string()
  .trim()
  .min(18)
  .max(48)
  .regex(/[0-9]+/)
  .regex(/[a-z]+/)
  .regex(/[A-Z]+/)
  .regex(/[!\";:#$%&&'\(\)=~|]+/)
  .regex(/^[a-zA-Z0-9!\";:#$%&'\(\)=~|]+/);

const stringValidSchema = z
  .coerce
  .string()
  .trim();

export function sameLogicValidate(
  name: string,
  testTarget: string | undefined | null,
  zodSchema: z.ZodString,
): PlantationTextValidateResult {
  const result = zodSchema.safeParse(testTarget);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }

  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) => `[${name}] ${i.message}`),
  };
}

export function stringValidate(
  name: string,
  testTarget: string | undefined | null,
): PlantationTextValidateResult {
  const result = stringValidSchema.safeParse(testTarget);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }

  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) => `[${name}] ${i.message}`),
  };
}
