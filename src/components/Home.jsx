import foodImg from "../assets/food.png";
import giftImg from "../assets/gift.png";
import travelImg from "../assets/travel.png";
import deleteImg from "../assets/delete.png";
import editImg from "../assets/edit.png";
import { HiArrowLongRight } from "react-icons/hi2";
import { HiArrowLongLeft } from "react-icons/hi2";
const Home = () => {
	return (
		<>
			<div className="App">
				<h1>Expense Tracker</h1>
				<div className="create">
					<div className="wallet">
						<h1>
							Wallet Balance: <span>₹4500</span>
						</h1>
						<button className="addIncome">+ Add Income</button>
					</div>
					<div className="expense">
						<h1>
							Expense: <span>₹500</span>
						</h1>
						<button className="addExpense">+ Add Expense</button>
					</div>
				</div>
				<div className="detailContainer">
					<div className="recentTransaction">
						<h1>Recent Transactions</h1>
						<div className="transactionList">
							<div className="list">
								<img className="categoryImg" src={foodImg} alt="" />
								<div className="titleAndTime">
									<p>Samosa</p>
									<p style={{ color: "gray" }}>March 20, 2024</p>
								</div>
								<p className="price">₹150</p>
								<img style={{ cursor: "pointer" }} src={deleteImg} alt="" />
								<img style={{ cursor: "pointer" }} src={editImg} alt="" />
							</div>
							<div className="list">
								<img src={giftImg} alt="" />
								<div className="titleAndTime">
									<p>Movie</p>
									<p style={{ color: "gray" }}>March 21, 2024</p>
								</div>
								<p className="price">₹300</p>
								<img src={deleteImg} alt="" />
								<img src={editImg} alt="" />
							</div>
							<div className="list">
								<img src={travelImg} alt="" />
								<div className="titleAndTime">
									<p>Auto</p>
									<p style={{ color: "gray" }}>March 22, 2024</p>
								</div>
								<p className="price">₹50</p>
								<img src={deleteImg} alt="" />
								<img src={editImg} alt="" />
							</div>
							<div className="navigationBtn">
								<button className="prevBtn">
									<HiArrowLongLeft />
								</button>
								<p className="pageNumber">1</p>
								<button className="nextBtn">
									<HiArrowLongRight />
								</button>
							</div>
						</div>
					</div>
					<div className="topExpenses">
						<h1 className="expenseTitle">Top Expenses</h1>
						<div className="expenseList">
							<div className="list">
								<p>Entertainment</p>
								<div style={{ width: "75%" }}></div>
							</div>
							<div className="list">
								<p>Food</p>
								<div style={{ width: "55%" }}></div>
							</div>
							<div className="list">
								<p>Fun</p>
								<div style={{ width: "35%" }}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Home;
