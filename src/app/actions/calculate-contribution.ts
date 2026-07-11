"use server";

import { z } from "zod";
import { calculateFormalContribution, calculateAllocation } from "@/lib/calculation/engine";
import { getActiveRule } from "@/lib/calculation/provider";
import type {
  AllocationResult,
  ContributionResult,
  FormalRuleParams,
  RuleMeta,
} from "@/lib/calculation/types";
import { CalculationInputError } from "@/lib/calculation/types";

const inputSchema = z.object({
  basicSalary: z.coerce.number().finite().positive().max(10_000_000),
});

export interface ContributionActionState {
  status: "idle" | "ok" | "error";
  errorCode?: "BELOW_MIN_BASE" | "ABOVE_MAX_BASE" | "INVALID_INPUT";
  result?: ContributionResult;
  allocation?: AllocationResult;
  meta?: RuleMeta;
}

export async function calculateContributionAction(
  _prev: ContributionActionState,
  formData: FormData,
): Promise<ContributionActionState> {
  const parsed = inputSchema.safeParse({
    basicSalary: formData.get("basicSalary"),
  });
  if (!parsed.success) {
    return { status: "error", errorCode: "INVALID_INPUT" };
  }

  const { params, meta } = await getActiveRule("CONTRIBUTION");
  try {
    const rule = params as FormalRuleParams;
    const result = calculateFormalContribution(parsed.data.basicSalary, rule);
    const allocation = calculateAllocation(parsed.data.basicSalary, rule);
    return { status: "ok", result, allocation, meta };
  } catch (e) {
    if (e instanceof CalculationInputError) {
      return { status: "error", errorCode: e.code };
    }
    throw e;
  }
}
