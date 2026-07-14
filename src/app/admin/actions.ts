"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/admin-auth";

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
