import React, { useState, useRef } from "react";
import foodImg from "../assets/food.png";
import giftImg from "../assets/gift.png";
import travelImg from "../assets/travel.png";
import deleteImg from "../assets/delete.png";
import editImg from "../assets/edit.png";
import { HiArrowLongRight } from "react-icons/hi2";
import { HiArrowLongLeft } from "react-icons/hi2";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Home = () => {
	const [showIncomeForm, setShowIncomeForm] = useState(false);
	const [totalBalance, setTotalBalance] = useState(0);
	const inputAmount = useRef();
	const handleIncomeSubmit = (e) => {
		e.preventDefault();
		const amount = inputAmount.current.value;
		if (!amount || isNaN(parseFloat(amount))) return;
		setTotalBalance((prev) => prev + parseFloat(amount));
		inputAmount.current.value = "";
		setShowIncomeForm(false);
	};

	const [totalExpense, setTotalExpense] = useState(0);
	const [showExpenseForm, setShowExpenseForm] = useState(false);
	const [transactionsList, setTransactionsList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const transactionsPerPage = 3;

	const handleExpenseSubmit = (e) => {
		e.preventDefault();
		const { title, price, category, date } = e.target;
		const transaction = {
			title: title.value,
			date: date.value,
			price: isNaN(parseInt(price.value)) ? null : parseInt(price.value),
			category: category.value,
		};
		let currentDate = new Date().toISOString().split("T")[0];

		if (
			!transaction.title ||
			!transaction.date ||
			!transaction.price ||
			isNaN(parseInt(transaction.price)) ||
			transaction.price < 0 ||
			transaction.price > totalBalance ||
			transaction.date > currentDate
		) {
			alert("Invalid data");
			return;
		}
		setTotalBalance((prev) => prev - parseFloat(transaction.price));
		setTotalExpense((prev) => prev + parseFloat(transaction.price));
		setTransactionsList([...transactionsList, transaction]);
		e.target.reset();
		setShowExpenseForm(false);
	};

	const handleDeleteTransaction = (index) => {
		const updatedTransactions = [...transactionsList];
		const price = updatedTransactions[index].price;
		setTotalExpense((prev) => prev - parseFloat(price));
		setTotalBalance((prev) => prev + parseFloat(price));
		updatedTransactions.splice(index, 1);
		setTransactionsList(updatedTransactions);
	};

	const [showEditForm, setShowEditForm] = useState(false);
	const [editIndex, setEditIndex] = useState(null);
	const handleEditSubmit = (e) => {
		e.preventDefault();
		const { title, price, category, date } = e.target;
		const updatedTransaction = {
			title: title.value,
			date: date.value,
			price: isNaN(parseFloat(price.value)) ? null : parseFloat(price.value),
			category: category.value,
		};

		let currentDate = new Date().toISOString().split("T")[0];

		if (
			!updatedTransaction.title ||
			!updatedTransaction.date ||
			!updatedTransaction.price ||
			isNaN(parseFloat(updatedTransaction.price)) ||
			updatedTransaction.price < 0 ||
			updatedTransaction.price > totalBalance ||
			updatedTransaction.date > currentDate
		) {
			alert("Invalid data");
			return;
		}

		const updatedTransactionsList = [...transactionsList];
		updatedTransactionsList[editIndex] = updatedTransaction;

		const priceDifference =
			updatedTransaction.price - transactionsList[editIndex].price;

		setTotalExpense((prev) => prev + priceDifference);
		setTotalBalance((prev) => prev - priceDifference);

		setTransactionsList(updatedTransactionsList);
		setShowEditForm(false);
		setEditIndex(null);
	};

	const indexOfLastTransaction = currentPage * transactionsPerPage;
	const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
	const currentTransactions = transactionsList.slice(
		indexOfFirstTransaction,
		indexOfLastTransaction
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const calculateTopExpenses = () => {
		const categories = {};
		transactionsList.forEach((transaction) => {
			const { category, price } = transaction;
			if (categories[category]) {
				categories[category] += price;
			} else {
				categories[category] = price;
			}
		});
		return Object.entries(categories).sort((a, b) => b[1] - a[1]);
	};

	const topExpenses = calculateTopExpenses();
	const chartData = topExpenses.map(([category, amount], index) => ({
		name: category,
		value: amount,
		fill:
			category === "food"
				? "#A000FF"
				: category === "entertainment"
				? "#FE9204"
				: "#FCE106",
	}));

	return (
		<>
			<div className="App">
				<h1>Expense Tracker</h1>
				<div className="create">
					<div className="wallet">
						<h1>
							Wallet Balance: <span>₹{totalBalance}</span>
						</h1>
						<button
							className="addIncome"
							onClick={() => {
								setShowIncomeForm(true);
							}}
						>
							+ Add Income
						</button>
					</div>
					<div className="expense">
						<h1>
							Expense: <span>₹{totalExpense}</span>
						</h1>
						<button
							className="addExpense"
							onClick={() => {
								setShowExpenseForm(true);
							}}
						>
							+ Add Expense
						</button>
					</div>
					<div className="graph">
						<PieChart width={300} height={300}>
							<Pie
								data={chartData}
								cx={130}
								cy={130}
								labelLine={false}
								outerRadius={120}
								fill="#8884d8"
								label={({
									cx,
									cy,
									midAngle,
									innerRadius,
									outerRadius,
									percent,
									index,
								}) => {
									const radius =
										innerRadius + (outerRadius - innerRadius) * 0.5;
									const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
									const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

									return (
										<text
											x={x}
											y={y}
											fill="white"
											textAnchor={x > cx ? "start" : "end"}
											dominantBaseline="central"
										>
											{`${(percent * 100).toFixed(2)}%`}
										</text>
									);
								}}
							>
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.fill} />
								))}
							</Pie>
							<Legend />
						</PieChart>
					</div>
				</div>
				<div className="detailContainer">
					<div className="recentTransaction">
						<h1>Recent Transactions</h1>
						<div className="transactionList">
							{currentTransactions.map((ele, idx) => {
								return (
									<div className="list" key={idx}>
										<img
											className="categoryImg"
											src={
												ele.category === "food"
													? foodImg
													: ele.category === "travel"
													? travelImg
													: giftImg
											}
											alt=""
										/>
										<div className="titleAndTime">
											<p>{ele.title}</p>
											<p style={{ color: "gray" }}>{ele.date}</p>
										</div>
										<p className="price">₹{ele.price}</p>
										<img
											style={{ cursor: "pointer" }}
											src={deleteImg}
											alt="delete"
											onClick={() => handleDeleteTransaction(idx)}
										/>
										<img
											style={{ cursor: "pointer" }}
											src={editImg}
											alt="edit"
											onClick={() => {
												setEditIndex(idx);
												setShowEditForm(true);
											}}
										/>
									</div>
								);
							})}
							<div className="navigationBtn">
								<button
									className="prevBtn"
									onClick={() => paginate(currentPage - 1)}
									disabled={currentPage === 1}
								>
									<HiArrowLongLeft />
								</button>
								<p className="pageNumber">{currentPage}</p>
								<button
									className="nextBtn"
									onClick={() => paginate(currentPage + 1)}
									disabled={currentTransactions.length < transactionsPerPage}
								>
									<HiArrowLongRight />
								</button>
							</div>
						</div>
					</div>
					<div className="topExpenses">
						<h1 className="expenseTitle">Top Expenses</h1>
						<div className="expenseList">
							{topExpenses.map(([category, amount], index) => (
								<div className="list" key={index}>
									<p>{category}</p>
									<div
										style={{ width: `${(amount / totalExpense) * 100}%` }}
									></div>
								</div>
							))}
						</div>
					</div>
				</div>
				{showIncomeForm && (
					<div className="overlay">
						<div className="formContainer">
							<div className="incomeForm">
								<h1>Add Income</h1>
								<form onSubmit={handleIncomeSubmit} className="add-income">
									<input
										type="text"
										ref={inputAmount}
										placeholder="Income Amount"
										required
									/>
									<button type="submit">Add Balance</button>
									<button
										onClick={() => {
											setShowIncomeForm(false);
										}}
									>
										Cancel
									</button>
								</form>
							</div>
						</div>
					</div>
				)}
				{showExpenseForm && (
					<div className="overlay">
						<div className="formContainer">
							<div className="expenseForm">
								<h1>Add Expense</h1>
								<form onSubmit={handleExpenseSubmit} className="expense-form">
									<input
										type="text"
										name="title"
										placeholder="Title"
										required
									/>
									<input
										type="text"
										name="price"
										placeholder="Price"
										required
									/>

									<select name="category" id="categorySelect" required>
										<option value="" disabled selected>
											Select Category
										</option>
										<option value="food">Food</option>
										<option value="entertainment">Entertainment</option>
										<option value="travel">Travel</option>
									</select>
									<input
										name="date"
										type="date"
										placeholder="dd/mm/yyyy"
										required
									/>
									<button type="submit">Add Expense</button>
									<button
										onClick={() => {
											setShowExpenseForm(false);
										}}
									>
										Cancel
									</button>
								</form>
							</div>
						</div>
					</div>
				)}
				{showEditForm && editIndex !== null && (
					<div className="overlay">
						<div className="formContainer">
							<div className="editForm">
								<h1>Edit Expense</h1>
								<form onSubmit={handleEditSubmit} className="expense-form">
									<input
										type="text"
										name="title"
										placeholder="Title"
										defaultValue={transactionsList[editIndex].title}
										required
									/>
									<input
										type="text"
										name="price"
										placeholder="Price"
										defaultValue={transactionsList[editIndex].price}
										required
									/>
									<select
										name="category"
										defaultValue={transactionsList[editIndex].category}
										required
									>
										<option value="food">Food</option>
										<option value="entertainment">Entertainment</option>
										<option value="travel">Travel</option>
									</select>
									<input
										name="date"
										type="date"
										defaultValue={transactionsList[editIndex].date}
										required
									/>
									<button type="submit">Update Expense</button>
									<button
										onClick={() => {
											setShowEditForm(false);
											setEditIndex(null);
										}}
									>
										Cancel
									</button>
								</form>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Home;
