"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

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

export default function DownloadButton({ expenses }) {
  const handleDownload = () => {
    // Create CSV content
    const headers = ["Date", "Category", "Description", "Amount"];
    const csvRows = [
      headers.join(","),
      ...expenses.map((expense) => {
        const formattedDate = format(new Date(expense.date), "yyyy-MM-dd");
        const category = getCategoryName(expense.category);
        const description = expense.description || "";
        const amount = expense.amount.toFixed(2);
        return [
          formattedDate,
          category,
          `"${description.replace(/"/g, '""')}"`,
          amount,
        ].join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleDownload}
    >
      <Download size={18} />
      <span>Download</span>
    </Button>
  );
}
