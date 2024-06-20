import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchTransactions } from "./services/fetchTransactions";
import { CalculateReward } from "./utils/calculateRewards";
function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data);
    });
  }, []);
  const uniqueCustomers = [
    ...new Set(transactions.map((transaction) => transaction.customer)),
  ];
  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };
  const calculatePointsForTransaction = (amount) => {
    return CalculateReward(amount);
  };
  const renderTransactions = (customerTransactions, month) => {
    let totalPointsThisMonth = 0;
    return (
      <div key={month} className="monthly-rewards">
        {" "}
        <h3>
          {" "}
          {new Date(0, month).toLocaleString("default", { month: "long" })}{" "}
        </h3>{" "}
        {customerTransactions.length > 0 ? (
          <table>
            {" "}
            <thead>
              {" "}
              <tr>
                {" "}
                <th>Date</th> <th>Amount</th> <th>Points Earned</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {customerTransactions.map((transaction) => {
                const pointsEarned = calculatePointsForTransaction(
                  transaction.amount
                );
                totalPointsThisMonth += pointsEarned;
                return (
                  <tr key={transaction.date}>
                    {" "}
                    <td>{transaction.date}</td> <td>${transaction.amount}</td>{" "}
                    <td>{pointsEarned}</td>{" "}
                  </tr>
                );
              })}{" "}
            </tbody>{" "}
            <tfoot>
              {" "}
              <tr>
                {" "}
                <td colSpan="2">
                  {" "}
                  <strong>Total Points This Month:</strong>{" "}
                </td>{" "}
                <td>{totalPointsThisMonth}</td>{" "}
              </tr>{" "}
            </tfoot>{" "}
          </table>
        ) : (
          <p>
            {" "}
            No records found for{" "}
            {new Date(0, month).toLocaleString("default", {
              month: "long",
            })}
            .{" "}
          </p>
        )}{" "}
      </div>
    );
  };
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.customer === selectedCustomer
  );
  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const month = new Date(transaction.date).getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(transaction);
      return acc;
    },
    {}
  );
  return (
    <div className="App">
      {" "}
      <h1>Customer Rewards Program</h1>{" "}
      <div className="customer-selector">
        {" "}
        <label htmlFor="customer-select">Select Customer: </label>{" "}
        <select
          id="customer-select"
          onChange={handleCustomerChange}
          value={selectedCustomer}
        >
          {" "}
          <option value="">--Please choose a customer--</option>{" "}
          {uniqueCustomers.map((customer) => (
            <option key={customer} value={customer}>
              {" "}
              {customer}{" "}
            </option>
          ))}{" "}
        </select>{" "}
      </div>{" "}
      {selectedCustomer && (
        <div className="customer-rewards">
          {" "}
          <h2>{selectedCustomer}</h2>{" "}
          {Object.keys(groupedTransactions).map((month) =>
            renderTransactions(groupedTransactions[month], month)
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default App;
