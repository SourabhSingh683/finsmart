import React from "react";
import { ExpenseSplitter } from "./_components/expense-splitter";

export const metadata = {
  title: "Split Expenses | FinSmart",
  description: "Split expenses easily among friends and family",
};

export default function ExpenseSplitterPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 gradient-title">Split Expenses</h1>
      <p className="text-muted-foreground mb-8">
        Easily split expenses among friends, family, or roommates. Add the total
        expense amount, select the participants, and see how much each person
        owes.
      </p>

      <ExpenseSplitter />
    </div>
  );
}
