import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ExpenseForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      expenseName: "Momo",
      amount: 0,
      date: ""
    }
  });

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [budget] = useState(20000); 
  const [filterDates, setFilterDates] = useState({
    startDate: '',
    endDate: ''
  });

  const applyDateFilter = (expensesList) => {
    const filtered = expensesList.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = filterDates.startDate ? new Date(filterDates.startDate) : null;
      const endDate = filterDates.endDate ? new Date(filterDates.endDate) : null;

      return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate);
    });
    setFilteredExpenses(filtered);
    const total = filtered.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpense(total);
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          "https://expense-tracker-1884d-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json"
        );

        if (response.data) {
          const formattedExpenses = Object.entries(response.data).map(([id, expense]) => ({
            id,
            name: expense['expense-name'],
            amount: parseFloat(expense['expense-amount']),
            date: expense['expense-date']
          }));
          setExpenses(formattedExpenses);
          applyDateFilter(formattedExpenses);
        }
        
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    getPost();
  }, []);
  useEffect(() => {
    applyDateFilter(expenses);
  }, [filterDates, expenses]);
  const onAddExpense = async (data) => {
    const formattedData = {
      "expense-name": data.name,
      "expense-amount": data.amount,
      "expense-date": data.date,
    };
    await axios.post(
      "https://expense-tracker-1884d-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json",
      formattedData
    );
    const response = await axios.get(
      "https://expense-tracker-1884d-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json"
    );
    if (response.data) {
      const formattedExpenses = Object.entries(response.data).map(([id, expense]) => ({
        id,
        name: expense['expense-name'],
        amount: parseFloat(expense['expense-amount']),
        date: expense['expense-date']
      }));
      setExpenses(formattedExpenses);
      applyDateFilter(formattedExpenses);
    
      window.alert(`Expense "${data.name}" of amount Rs ${data.amount} has been added.`);
    }
  };

  const onSubmit = (data) => {
    onAddExpense(data);
  };
  const remainingBudget = budget - totalExpense;
  const usedPercentage = ((totalExpense / budget) * 100).toFixed(2);
  const availablePercentage = (100 - usedPercentage).toFixed(2);

  const budgetColor = remainingBudget >= budget * 0.5
    ? 'green'
    : remainingBudget >= budget * 0.2
    ? 'yellow'
    : 'red';
  const getExpenseColor = (expenseAmount) => {
    const remaining = budget - (totalExpense - expenseAmount);
    if (remaining >= budget * 0.5) {
      return 'green';
    } else if (remaining >= budget * 0.2) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Add New Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expense Name</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              id="name"
              {...register('name', { required: true })}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">This field is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="expenseAmt"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              {...register('amount', { required: true, validate: value => value > 0 })}
            />
            {errors.amount && <span className="text-red-500 text-sm mt-1">Amount must be a positive number</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="expenseDate"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              {...register('date', {
                required: true,
                validate: value => new Date(value) <= new Date(),
              })}
            />
            {errors.date && <span className="text-red-500 text-sm mt-1">Date must be today or earlier</span>}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Expense
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Filter Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            value={filterDates.startDate}
            onChange={(e) => setFilterDates({ ...filterDates, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            value={filterDates.endDate}
            onChange={(e) => setFilterDates({ ...filterDates, endDate: e.target.value })}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Expense List</h2>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {filteredExpenses.map((expense) => (
            <tr
              key={expense.id}
              className={`border-b bg-${getExpenseColor(expense.amount)}-100`}
            >
              <td className="px-4 py-2">{expense.name}</td>
              <td className="px-4 py-2">Rs {expense.amount}</td>
              <td className="px-4 py-2">{expense.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-xl font-semibold mt-6">
        Total Expense: <span className="text-red-500">Rs {totalExpense}</span>
      </h3>

      <h3 className="text-xl font-semibold mt-4" style={{ color: budgetColor }}>
        Remaining Budget: Rs {remainingBudget}
      </h3>
      <h3 className="text-xl font-semibold mt-2">
        Used: {usedPercentage}% | Available: {availablePercentage}%
      </h3>
    </div>
  );
};

export default ExpenseForm;
