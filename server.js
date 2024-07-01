import express from "express";
import path from "node:path";
import bodyParser from "body-parser";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, get } from "firebase/database";
import session from "express-session";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appSettings = {
	databaseURL:
		"https://sea-salon-682a3-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const db = getDatabase(initializeApp(appSettings));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	session({
		secret: "no pain no gain",
		saveUninitialized: false,
		resave: false,
		cookie: { maxAge: 60000 * 60 },
	}),
);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../sea-salon/public/dashboard.html"));
});

app.get("/customer", (req, res) => {
	res.sendFile(
		path.join(__dirname, "../sea-salon/public/customer-dashboard.html"),
	);
});

app.get("/admin", (req, res) => {
	if (req.session.user.role !== "admin") {
		return res.status(401).send({ msg: "Not Authenticated" });
	}
	res.sendFile(
		path.join(__dirname, "../sea-salon/public/admin-dashboard.html"),
	);
});

app.post("/sign-up", (req, res) => {
	const signUpData = {
		fullName: req.body.fullName,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		password: req.body.password,
		role: "customer",
	};
	const usersInDB = ref(db, "Users");
	push(usersInDB, signUpData)
		.then(() => {
			req.session.user = signUpData;
			res.status(201).send({ message: "User signed up successfully." });
		})
		.catch((error) => {
			console.error("Error signing up user:", error);
			res.status(500).send({ message: "Error signing up user." });
		});
});

app.post("/api/auth", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const usersInDB = ref(db, "Users");
	const snapshot = await get(usersInDB);
	const userData = snapshot.val();
	const userArray = userData ? Object.values(userData) : [];
	const findUser = userArray.find((list) => {
		return list.email === email;
	});
	if (!findUser) {
		return res.status(401).send({ msg: "USER NOT FOUND, PLEASE SIGN UP" });
	}
	if (findUser.password !== password) {
		return res.status(401).send({ msg: "INVALID PASS" });
	}
	req.session.user = findUser;
	res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
	return req.session.user
		? res.status(200).send(req.session.user)
		: res.status(401).send({ msg: "INVALID USER CREDENTIALS" });
});

app.listen(3000);
