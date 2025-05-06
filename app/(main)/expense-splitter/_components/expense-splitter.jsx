"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  X,
  Users2,
  Receipt,
  DivideCircle,
  Trash2,
  Save,
  Check,
  Clock,
  Percent,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export function ExpenseSplitter() {
  const [totalAmount, setTotalAmount] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [participants, setParticipants] = useState([
    { id: 1, name: "", isPaid: false, percentage: 50 },
    { id: 2, name: "", isPaid: false, percentage: 50 },
  ]);
  const [customSplit, setCustomSplit] = useState(false);
  const [amountPerPerson, setAmountPerPerson] = useState([]);
  const [calculationDone, setCalculationDone] = useState(false);
  const [savedSplits, setSavedSplits] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  // Load saved splits from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("savedExpenseSplits");
    if (savedData) {
      try {
        setSavedSplits(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved splits:", e);
        localStorage.removeItem("savedExpenseSplits");
      }
    }
  }, []);

  // Save splits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedExpenseSplits", JSON.stringify(savedSplits));
  }, [savedSplits]);

  // Generate a new unique ID for participants
  const getNewId = () => {
    const ids = participants.map((p) => p.id);
    return Math.max(...ids, 0) + 1;
  };

  // Calculate even percentages when participants change
  useEffect(() => {
    if (!customSplit && participants.length > 0) {
      const evenPercentage = 100 / participants.length;
      setParticipants(
        participants.map((p) => ({
          ...p,
          percentage: parseFloat(evenPercentage.toFixed(2)),
        }))
      );
    }
  }, [participants.length, customSplit]);

  // Add a new participant
  const addParticipant = () => {
    const newParticipant = {
      id: getNewId(),
      name: "",
      isPaid: false,
      percentage: customSplit
        ? 0
        : (100 / (participants.length + 1)).toFixed(2),
    };

    // If using custom split, we need to adjust percentages
    if (customSplit) {
      setParticipants([...participants, newParticipant]);
    } else {
      // For equal split, recalculate all percentages
      const evenPercentage = 100 / (participants.length + 1);
      setParticipants([
        ...participants.map((p) => ({
          ...p,
          percentage: parseFloat(evenPercentage.toFixed(2)),
        })),
        {
          ...newParticipant,
          percentage: parseFloat(evenPercentage.toFixed(2)),
        },
      ]);
    }

    // Recalculate if already calculated
    if (calculationDone) {
      calculateSplit();
    }
  };

  // Remove a participant
  const removeParticipant = (id) => {
    if (participants.length <= 2) {
      toast.error("You need at least 2 participants");
      return;
    }

    const filteredParticipants = participants.filter((p) => p.id !== id);

    // For equal split, recalculate percentages
    if (!customSplit) {
      const evenPercentage = 100 / filteredParticipants.length;
      setParticipants(
        filteredParticipants.map((p) => ({
          ...p,
          percentage: parseFloat(evenPercentage.toFixed(2)),
        }))
      );
    } else {
      // For custom split, just remove the participant
      setParticipants(filteredParticipants);
    }

    // Recalculate if already calculated
    if (calculationDone) {
      calculateSplit(filteredParticipants);
    }
  };

  // Update participant info
  const updateParticipant = (id, field, value) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Update participant percentage
  const updatePercentage = (id, value) => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0) return;

    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, percentage } : p))
    );
  };

  // Reset to even split
  const resetToEvenSplit = () => {
    const evenPercentage = 100 / participants.length;
    setParticipants(
      participants.map((p) => ({
        ...p,
        percentage: parseFloat(evenPercentage.toFixed(2)),
      }))
    );
    toast.info("Reset to even split");
  };

  // Calculate total percentage for validation
  const getTotalPercentage = () => {
    return participants.reduce(
      (sum, p) => sum + (parseFloat(p.percentage) || 0),
      0
    );
  };

  // Calculate split amount
  const calculateSplit = (currentParticipants = participants) => {
    if (
      !totalAmount ||
      isNaN(parseFloat(totalAmount)) ||
      parseFloat(totalAmount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if all participants have names
    const emptyNames = currentParticipants.filter((p) => !p.name.trim());
    if (emptyNames.length > 0) {
      toast.error("All participants must have names");
      return;
    }

    // For custom split, validate that percentages add up to 100%
    if (customSplit) {
      const totalPercentage = getTotalPercentage();
      if (Math.abs(totalPercentage - 100) > 0.1) {
        toast.error(
          `Percentages must add up to 100%. Current total: ${totalPercentage.toFixed(
            2
          )}%`
        );
        return;
      }
    }

    const amount = parseFloat(totalAmount);

    // Calculate amount per person based on percentage
    const amountsPerPerson = currentParticipants.map((participant) => {
      const percentage = parseFloat(participant.percentage) || 0;
      return {
        id: participant.id,
        amount: (amount * percentage) / 100,
      };
    });

    setAmountPerPerson(amountsPerPerson);
    setCalculationDone(true);
    toast.success("Split calculated successfully!");
  };

  // Get amount for a specific participant
  const getAmountForParticipant = (participantId) => {
    const entry = amountPerPerson.find((p) => p.id === participantId);
    return entry ? entry.amount.toFixed(2) : "0.00";
  };

  // Save the current expense split
  const saveExpenseSplit = () => {
    if (!calculationDone) {
      toast.error("Please calculate the split first");
      return;
    }

    if (!expenseName.trim()) {
      toast.error("Please enter an expense name");
      return;
    }

    const newSplit = {
      id: isEditing || Date.now().toString(),
      date: new Date().toISOString(),
      name: expenseName,
      totalAmount: parseFloat(totalAmount),
      customSplit,
      amountPerPerson: [...amountPerPerson],
      participants: [...participants],
    };

    if (isEditing) {
      setSavedSplits(
        savedSplits.map((split) => (split.id === isEditing ? newSplit : split))
      );
      setIsEditing(null);
      toast.success("Expense split updated!");
    } else {
      setSavedSplits([newSplit, ...savedSplits]);
      toast.success("Expense split saved!");
    }

    resetForm();
  };

  // Delete a saved split
  const deleteSavedSplit = (id) => {
    setSavedSplits(savedSplits.filter((split) => split.id !== id));
    toast.info("Expense split deleted");
  };

  // Edit a saved split
  const editSavedSplit = (split) => {
    setExpenseName(split.name);
    setTotalAmount(split.totalAmount.toString());
    setParticipants(split.participants);
    setAmountPerPerson(split.amountPerPerson || []);
    setCustomSplit(split.customSplit || false);
    setCalculationDone(true);
    setIsEditing(split.id);
    toast.info("Editing expense split");
  };

  // Reset the form
  const resetForm = () => {
    setTotalAmount("");
    setExpenseName("");
    setParticipants([
      { id: 1, name: "", isPaid: false, percentage: 50 },
      { id: 2, name: "", isPaid: false, percentage: 50 },
    ]);
    setAmountPerPerson([]);
    setCalculationDone(false);
    setIsEditing(null);
    setCustomSplit(false);
    toast.info("Form has been reset");
  };

  // Toggle participant payment status in saved splits
  const togglePaymentStatus = (splitId, participantId) => {
    setSavedSplits(
      savedSplits.map((split) => {
        if (split.id === splitId) {
          return {
            ...split,
            participants: split.participants.map((p) =>
              p.id === participantId ? { ...p, isPaid: !p.isPaid } : p
            ),
          };
        }
        return split;
      })
    );
    toast.success("Payment status updated");
  };

  // Get payment status summary
  const getPaymentSummary = (split) => {
    const paidCount = split.participants.filter((p) => p.isPaid).length;
    const totalCount = split.participants.length;
    return `${paidCount}/${totalCount} paid`;
  };

  // Get amount from saved split
  const getAmountFromSavedSplit = (split, participantId) => {
    if (split.amountPerPerson) {
      const entry = split.amountPerPerson.find((p) => p.id === participantId);
      return entry ? `₹${entry.amount.toFixed(2)}` : "-";
    }

    // Fallback for older saved splits
    return `₹${(split.totalAmount / split.participants.length).toFixed(2)}`;
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              {isEditing ? "Edit Expense" : "Expense Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="Dinner, Movie, etc."
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Amount (₹)</Label>
              <Input
                id="total-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 my-4">
              <Label htmlFor="custom-split">Custom Split</Label>
              <Switch
                id="custom-split"
                checked={customSplit}
                onCheckedChange={setCustomSplit}
              />
              <div className="flex items-center ml-auto">
                <span className="text-sm mr-2 text-muted-foreground">
                  Total: {getTotalPercentage().toFixed(2)}%
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetToEvenSplit}
                  title="Reset to even split"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  <Users2 className="inline mr-2 h-4 w-4" /> Participants
                </Label>
                <span className="text-sm text-muted-foreground">
                  {participants.length}{" "}
                  {participants.length === 1 ? "person" : "people"}
                </span>
              </div>

              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder={`Person ${index + 1}'s name`}
                        value={participant.name}
                        onChange={(e) =>
                          updateParticipant(
                            participant.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="w-28 relative">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={participant.percentage}
                        onChange={(e) =>
                          updatePercentage(participant.id, e.target.value)
                        }
                        className="pr-6"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Percent className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addParticipant}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Person
              </Button>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => calculateSplit()}
              >
                <DivideCircle className="mr-2 h-4 w-4" />
                Calculate Split
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users2 className="mr-2 h-5 w-5" />
              Split Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!calculationDone ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>
                  Fill in expense details and calculate to see split results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {expenseName || "Expense"}
                  </h3>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">
                      ₹{parseFloat(totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Split Type:</span>
                    <span>{customSplit ? "Custom" : "Equal"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Split Among:</span>
                    <span>{participants.length} people</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Who Pays What</h4>
                  <ul className="space-y-2">
                    {participants.map((participant) => (
                      <li
                        key={participant.id}
                        className="flex justify-between items-center p-2 rounded-md bg-purple-50"
                      >
                        <div>
                          <span>
                            {participant.name || `Person ${participant.id}`}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({participant.percentage}%)
                          </span>
                        </div>
                        <span className="font-medium">
                          ₹{getAmountForParticipant(participant.id)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  onClick={saveExpenseSplit}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Split" : "Save Split"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Splits Section */}
      {savedSplits.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Saved Expense Splits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedSplits.map((split) => (
              <Card key={split.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{split.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editSavedSplit(split)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => deleteSavedSplit(split.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₹{split.totalAmount.toFixed(2)} •{" "}
                    {new Date(split.date).toLocaleDateString()} •{" "}
                    {split.customSplit ? "Custom" : "Equal"} Split
                  </p>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {split.participants.map((person) => (
                      <div
                        key={person.id}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          person.isPaid ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`paid-${split.id}-${person.id}`}
                            checked={person.isPaid}
                            onCheckedChange={() =>
                              togglePaymentStatus(split.id, person.id)
                            }
                          />
                          <div>
                            <Label
                              htmlFor={`paid-${split.id}-${person.id}`}
                              className={
                                person.isPaid
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }
                            >
                              {person.name}
                            </Label>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({person.percentage || "0"}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {getAmountFromSavedSplit(split, person.id)}
                          </span>
                          <span className="text-sm">
                            {person.isPaid ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-500" />
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 py-2">
                  <div className="w-full flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>
                    <span className="font-medium">
                      {getPaymentSummary(split)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
