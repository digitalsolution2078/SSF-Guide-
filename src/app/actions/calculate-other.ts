"use server";

import { z } from "zod";
import {
  calculateAllocation,
  calculateForeignEmployment,
} from "@/lib/calculation/engine";
import { getActiveRule } from "@/lib/calculation/provider";
import type {
  AllocationResult,
  ForeignEmploymentResult,
  ForeignEmploymentRuleParams,
  FormalRuleParams,
  RuleMeta,
} from "@/lib/calculation/types";
import { CalculationInputError } from "@/lib/calculation/types";

export interface AllocationActionState {
  status: "idle" | "ok" | "error";
  errorCode?: string;
  result?: AllocationResult;
  meta?: RuleMeta;
}

export async function calculateAllocationAction(
  _prev: AllocationActionState,
  formData: FormData,
): Promise<AllocationActionState> {
  const parsed = z
    .object({ basicSalary: z.coerce.number().finite().positive().max(10_000_000) })
    .safeParse({ basicSalary: formData.get("basicSalary") });
  if (!parsed.success) return { status: "error", errorCode: "INVALID_INPUT" };

  const { params, meta } = await getActiveRule("ALLOCATION");
  try {
    const result = calculateAllocation(
      parsed.data.basicSalary,
      params as FormalRuleParams,
    );
    return { status: "ok", result, meta };
  } catch (e) {
    if (e instanceof CalculationInputError) {
      return { status: "error", errorCode: e.code };
    }
    throw e;
  }
}

export interface ForeignActionState {
  status: "idle" | "ok" | "error";
  errorCode?: string;
  errorMessage?: string;
  result?: ForeignEmploymentResult;
  meta?: RuleMeta;
}

export async function calculateForeignAction(
  _prev: ForeignActionState,
  formData: FormData,
): Promise<ForeignActionState> {
  const parsed = z
    .object({
      base: z.coerce.number().finite().positive().max(10_000_000),
      periodMonths: z.coerce.number().int().min(1).max(600),
    })
    .safeParse({
      base: formData.get("base"),
      periodMonths: formData.get("periodMonths"),
    });
  if (!parsed.success) return { status: "error", errorCode: "INVALID_INPUT" };

  const { params, meta } = await getActiveRule("FOREIGN_EMPLOYMENT");
  try {
    const result = calculateForeignEmployment(
      parsed.data,
      params as ForeignEmploymentRuleParams,
    );
    return { status: "ok", result, meta };
  } catch (e) {
    if (e instanceof CalculationInputError) {
      return { status: "error", errorCode: e.code, errorMessage: e.message };
    }
    throw e;
  }
}
