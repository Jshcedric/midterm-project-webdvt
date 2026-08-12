import { useState } from "react";
import { getCategoriesForType } from "../data/categories.js";

// Reusable for both "Add Transaction" and "Edit Transaction" (Phase 5).
// Pass `initialValues` to pre-fill the form when editing.
function TransactionForm({ initialValues, onSubmit, submitLabel = "Save Transaction" }) {
  const [values, setValues] = useState(
    initialValues || {
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    }
  );

  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setValues((prev) => {
      // If the type changes, clear the category since the available
      // category options are different for income vs. expense.
      if (field === "type" && value !== prev.type) {
        return { ...prev, type: value, category: "" };
      }
      return { ...prev, [field]: value };
    });
  }

  function validate() {
    const newErrors = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (values.amount === "" || values.amount === null) {
      newErrors.amount = "Amount is required.";
    } else if (Number(values.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!values.type) {
      newErrors.type = "Type is required.";
    }

    if (!values.category) {
      newErrors.category = "Category is required.";
    }

    if (!values.date) {
      newErrors.date = "Date is required.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      amount: Number(values.amount),
      title: values.title.trim(),
      description: values.description.trim(),
    });
  }

  const categoryOptions = getCategoriesForType(values.type);

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Lunch at school"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="amount">Amount (₱)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={values.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
      </div>

      <div className="form-field">
        <label>Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-option ${values.type === "expense" ? "type-option-active-expense" : ""}`}
            onClick={() => handleChange("type", "expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-option ${values.type === "income" ? "type-option-active-income" : ""}`}
            onClick={() => handleChange("type", "income")}
          >
            Income
          </button>
        </div>
        {errors.type && <p className="form-error">{errors.type}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Any extra notes..."
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default TransactionForm;
