const signUpForm = document.querySelector("#signup-form");
const signInForm = document.querySelector("#signin-form");

const sendSignUpData = async (e) => {
	e.preventDefault();
	const signUpData = {
		fullName: signUpForm["full-name"].value,
		email: signUpForm["signup-email"].value,
		phoneNumber: signUpForm["phone-number"].value,
		password: signUpForm["signup-password"].value,
	};
	try {
		const res = await fetch("http://localhost:3000/sign-up", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signUpData),
		});
		if (!res.ok) {
			throw new Error("Fail to sign up");
		}
		window.location.replace("http://localhost:3000/customer");
		alert("Account created successfully!");
	} catch (error) {
		console.error(error);
	}
};

const sendSignInData = async (e) => {
	e.preventDefault();
	const signInData = {
		email: signInForm["signin-email"].value,
		password: signInForm["signin-password"].value,
	};
	try {
		const res = await fetch("http://localhost:3000/api/auth", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signInData),
		});
		if (!res.ok) {
			throw new Error("Fail to sign in");
		}
		const jsonRes = await res.json();
		if (jsonRes.role === "customer") {
			window.location.replace("http://localhost:3000/customer");
			alert("Welcome customer!");
		} else {
			window.location.replace("http://localhost:3000/admin");
			alert("Welcome admin!");
		}
	} catch (error) {
		console.error(error);
	}
};

signUpForm.addEventListener("submit", sendSignUpData);
signInForm.addEventListener("submit", sendSignInData);
