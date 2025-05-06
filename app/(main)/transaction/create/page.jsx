import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;
  const type = searchParams?.type;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  // Set page title based on transaction type
  const pageTitle =
    type === "EXPENSE"
      ? "Add Expense"
      : editId
      ? "Edit Transaction"
      : "Add Transaction";

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{pageTitle}</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
