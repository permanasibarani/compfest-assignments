const navbarContainer = document.querySelector("#navbar-container");

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const res = await fetch("http://localhost:3000/api/auth/status");
		const jsonRes = await res.json();
		const customerEmail = jsonRes.email;
		const customerEmailElement = document.createElement("a");
		customerEmailElement.classList.add("nav-link", "me-4");
		customerEmailElement.textContent = customerEmail;
		navbarContainer.appendChild(customerEmailElement);
	} catch (error) {}
});
