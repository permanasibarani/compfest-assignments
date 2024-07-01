import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
	getDatabase,
	ref,
	push,
	onValue,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const appSettings = {
	databaseURL:
		"https://sea-salon-682a3-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const db = getDatabase(app);
const reviewsInDB = ref(db, "Reviews");
const servicesInDB = ref(db, "Services");

//* For reviews section
const cardBody = document.querySelectorAll(".card-body");

const createCardContent = (userComment, userName, userLocation, userRating) => {
	const commentElement = document.createElement("p");
	commentElement.classList.add("card-text", "p-3");
	commentElement.textContent = `"${userComment}"`;

	const userInformationElement = document.createElement("p");
	userInformationElement.classList.add("text-end", "text-muted", "mb-0");
	userInformationElement.textContent = `${userName}, ${userLocation}`;

	const userRatingElement = document.createElement("p");
	userRatingElement.classList.add("text-end", "text-muted");
	userRatingElement.textContent = `Rating: ${userRating}`;

	return { commentElement, userInformationElement, userRatingElement };
};

const getReviews = (callback) => {
	onValue(reviewsInDB, (snapshot) => {
		const reviewsArray = Object.values(snapshot.val());
		callback(reviewsArray);
	});
};

const showReviews = (reviews) => {
	for (const [index, content] of cardBody.entries()) {
		const userComment = reviews[index].comment;
		const userName = reviews[index].name;
		const userLocation = reviews[index].location;
		const userRating = reviews[index].rating;
		const cardContent = createCardContent(
			userComment,
			userName,
			userLocation,
			userRating,
		);
		content.append(
			cardContent.commentElement,
			cardContent.userInformationElement,
			cardContent.userRatingElement,
		);
	}
};
getReviews(showReviews);

//* DOM Functionality
const serviceLists = document.querySelectorAll(".service-lists .nav-link");
const serviceContentLists = document.querySelectorAll(
	".service-contents .service-div",
);
for (const [index, list] of serviceLists.entries()) {
	list.addEventListener("click", (e) => {
		for (const content of serviceContentLists) {
			content.classList.add("visually-hidden");
		}
		for (const list of serviceLists) {
			list.classList.remove("active");
		}
		const hrefValue = +extractNumbers(e.target.getAttribute("href"));
		serviceLists[hrefValue].classList.add("active");
		serviceContentLists[hrefValue].classList.remove("visually-hidden");
	});
}
function extractNumbers(str) {
	const regex = /\d+/; // Regular expression to match one or more digits
	const match = str.match(regex); // Match the regex in the string
	return match ? match[0] : ""; // Return the matched numbers or an empty string if no match
}

// const serviceListsContainer = document.querySelector(".service-lists");

// const createServiceList = (serviceName) => {
// 	const listElement = document.createElement("li");
// 	listElement.classList.add("nav-item", "d-flex", "justify-content-end");

// 	const serviceElement = document.createElement("a");
// 	serviceElement.classList.add("nav-link", "service-list", "text-end");
// 	serviceElement.textContent = serviceName;

// 	return { listElement, serviceElement };
// };

// const getServices = (callback) => {
// 	onValue(servicesInDB, (snapshot) => {
// 		const servicesArray = Object.values(snapshot.val());
// 		callback(servicesArray);
// 	});
// };

// const showServices = (services) => {
// 	for (const iterator of services) {
// 		const serviceContent = createServiceList(iterator.service);
// 		serviceContent.listElement.append(serviceElement);
// 		serviceListsContainer.append(serviceContent);
// 	}
// };

// getServices(showServices)

const navbarContainer = document.querySelector("#navbar-container");

document.addEventListener("DOMContentLoaded", async () => {
	const multipleCardCarousel = document.querySelector(
		"#carouselExampleControls",
	);
	if (window.matchMedia("(min-width: 768px)").matches) {
		const carousel = new bootstrap.Carousel(multipleCardCarousel, {
			interval: false,
		});

		const carouselInner = document.querySelector(".carousel-inner");
		const carouselItems = document.querySelectorAll(".carousel-item");
		const carouselWidth = carouselInner.scrollWidth;
		const cardWidth = carouselItems[0].offsetWidth;
		let scrollPosition = 0;

		document
			.querySelector("#carouselExampleControls .carousel-control-next")
			.addEventListener("click", () => {
				if (scrollPosition < carouselWidth - cardWidth * 4) {
					scrollPosition += cardWidth;
					carouselInner.scrollTo({
						left: scrollPosition,
						behavior: "smooth",
					});
				}
			});

		document
			.querySelector("#carouselExampleControls .carousel-control-prev")
			.addEventListener("click", () => {
				if (scrollPosition > 0) {
					scrollPosition -= cardWidth;
					carouselInner.scrollTo({
						left: scrollPosition,
						behavior: "smooth",
					});
				}
			});
	} else {
		multipleCardCarousel.classList.add("slide");
	}
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
