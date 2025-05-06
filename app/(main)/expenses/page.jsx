import React from "react";
import { getUserTransactions } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import DownloadButton from "./download-button";

// Helper function to get category name from ID
function getCategoryName(categoryId) {
  const categoryNames = {
    shopping: "Shopping",
    travel: "Travel",
    utilities: "Utilities",
    housing: "Housing",
    transportation: "Transportation",
    education: "Education",
    food: "Food",
    entertainment: "Entertainment",
    groceries: "Groceries",
    healthcare: "Healthcare",
    personal: "Personal Care",
    fuel: "Fuel",
    "internet-phone": "Internet & Phone",
    bills: "Bills & Fees",
    "other-expense": "Other Expense",
  };

  return categoryNames[categoryId] || "Expense";
}

const CategoryIcon = ({ categoryId }) => {
  // Map of category IDs to emoji icons
  const categoryIcons = {
    shopping: "🛍️",
    travel: "✈️",
    utilities: "💡",
    housing: "🏠",
    transportation: "🚌",
    education: "📚",
    food: "🍽️",
    entertainment: "🎬",
    groceries: "🛒",
    medical: "🏥",
    personal: "😊",
    fuel: "⛽",
    "internet-phone": "📱",
  };

  // Return the icon or a default
  return <span className="text-2xl">{categoryIcons[categoryId] || "💰"}</span>;
};

export default async function ExpensesPage() {
  // Fetch all user transactions
  const result = await getUserTransactions({ type: "EXPENSE" });
  const expenses = result?.data || [];

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Expenses</h1>
        <DownloadButton expenses={sortedExpenses} />
      </div>

      <div className="grid gap-4">
        {sortedExpenses.map((expense) => (
          <Link
            key={expense.id}
            href={`/transaction/create?edit=${expense.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <CategoryIcon categoryId={expense.category} />
                </div>
                <div>
                  <div className="font-semibold">
                    {expense.description || getCategoryName(expense.category)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(expense.date), "do MMM yyyy")}
                  </div>
                </div>
              </div>
              <div className="text-red-500 font-medium">
                - ₹{expense.amount.toFixed(2)}
              </div>
            </div>
          </Link>
        ))}

        {expenses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No expenses found</p>
            <Link href="/transaction/create?type=EXPENSE">
              <Button className="mt-4">Add Your First Expense</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
