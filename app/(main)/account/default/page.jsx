import { redirect } from "next/navigation";
import { getUserAccounts } from "@/actions/dashboard";

export default async function DefaultAccountRedirect() {
  // Get all user accounts
  const accounts = await getUserAccounts();

  // Find the default account, or use the first account if none is marked as default
  const defaultAccount =
    accounts.find((account) => account.isDefault) || accounts[0];

  // If an account is found, redirect to it
  if (defaultAccount) {
    redirect(`/account/${defaultAccount.id}`);
  }

  // If no accounts exist, redirect to the dashboard
  redirect("/dashboard");
}
