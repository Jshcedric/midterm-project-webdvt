import { useState, useEffect } from "react";
import mockTransactions from "../data/mockTransactions.js";

// The localStorage key we save everything under.
const STORAGE_KEY = "budget-tracker-transactions";

// Reads transactions from localStorage.
// If nothing has been saved yet (first time visiting the app), we seed it
// with the sample mock data so the Dashboard isn't empty on first load.
function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return mockTransactions;
  } catch (error) {
    console.error("Failed to read transactions from localStorage:", error);
    return mockTransactions;
  }
}

// Generates a unique-enough id without needing an extra library.
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// This custom hook is the ONLY place that talks to localStorage.
// Every page/component that needs transaction data calls this hook
// instead of duplicating the read/write logic.
function useTransactions() {
  const [transactions, setTransactions] = useState(loadTransactions);

  // Whenever the transactions list changes, save it back to localStorage
  // so the data survives a page refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage:", error);
    }
  }, [transactions]);

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  }

  function updateTransaction(id, updatedFields) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function getTransactionById(id) {
    return transactions.find((t) => t.id === id);
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  };
}

export default useTransactions;
