const myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];

class Book {
  constructor(name, author, pages, year, readStatus) {
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.readStatus = readStatus;
  }
}

const updateLibrary = () => {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
};

const duplicateNameError = document.getElementById("duplicateName");

const addBookToLibrary = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const author = formData.get("author");
  const pages = formData.get("pages");
  const year = formData.get("year");
  const readStatus = formData.get("status") === "true";
  for (let i = 0; i < myLibrary.length; i++) {
    if (name === myLibrary[i].name) {
      duplicateNameError.innerText = "This book already exists";
      return;
    }
  }
  duplicateNameError.innerText = "";
  const newBook = new Book(name, author, pages, year, readStatus);
  myLibrary.push(newBook);
  updateLibrary();
  displayBooks();
  closeModal();
};

const displayBooks = () => {
  const container = document.getElementsByClassName("grid-container")[0];
  container.innerHTML = "";

  for (let i = 0; i < myLibrary.length; i++) {
    const book = myLibrary[i];
    const bookCard = `
      <div id="gridCard">
        <div >"${book.name}"</div>
        <div> ${book.author} </div>
        <div> ${book.pages} pages </div>
        <div> ${book.year} </div>
        <input type="button" class="Btn"  id="submitBtn_readStatusChange" value="${
          book.readStatus ? "Read" : "Not Read"
        }"     data-index2="${i}">
        <input type="button" class="Btn" id="removeBook_Btn" value="Remove" data-index="${i}">
      </div>
    `;
    container.innerHTML += bookCard;
  }
  const removeButtons = document.querySelectorAll("#removeBook_Btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      removeBookFromLibrary(index);
    });
  });

  const updateReadStatusButtons = document.querySelectorAll(
    "#submitBtn_readStatusChange"
  );
  updateReadStatusButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index2");
      updateReadStatus(index);
    });
  });
};

const updateReadStatus = (index) => {
  myLibrary[index].readStatus = !myLibrary[index].readStatus;
  updateLibrary();
  displayBooks();
};

const removeBookFromLibrary = (index) => {
  myLibrary.splice(index, 1);
  updateLibrary();
  displayBooks();
};

const setupFormHandler = () => {
  const form = document.getElementById("bookForm");
  form.addEventListener("submit", addBookToLibrary);
  displayBooks();
  form.reset();
  document.forms[0].reset();
};

const bookModal = document.getElementById("bookModal");
const modalInside = bookModal.querySelector(".modalInside");

// const closeModal2 = () => {
//   modalInside.style.transform = "scale(0)";
//   setTimeout(() => {
//     bookModal.classList.remove("show");
//     bookModal.style.display = "none";
//   }, 200);
// };

document.addEventListener("DOMContentLoaded", setupFormHandler);

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUBOX7pAHlZ5B-6yMyYIzQloi3AVft4j8",
  authDomain: "library-49cf6.firebaseapp.com",
  projectId: "library-49cf6",
  storageBucket: "library-49cf6.appspot.com",
  messagingSenderId: "586311427699",
  appId: "1:586311427699:web:8a0ae1da2ec028282d2c06",
  measurementId: "G-88MJXRR68G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("accountBtn_login");
const logoutBtn = document.getElementById("accountBtn_logout");
const accountBtn = document.getElementById("accountBtn_account");
const account_email = document.getElementById("account_email");

const userLogin = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      //   const user = "vaibhavmeena91@gmail.com";

      const email = result.email;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMsg = error.message;
    });
};
const userLogout = async () => {
  signOut(auth).then(() => {});
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    accountBtn.style.display = "block";
    account_email.innerHTML = user.email;

    console.log(user);
    console.log(auth.currentUser.uid);
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    accountBtn.style.display = "none";
  }
});

// const db = firebase.firestore();
// let unsubscribe;
// const setupRealTimeListener = () => {
//   unsubscribe = db;
// };

const accountModal = document.getElementById("accountModal");
const accountModal_Inside = accountModal.querySelector(".modalInside");

// const bookModal = document.getElementById("bookModal");
const bookModal_Btn = document.getElementById("Btn_addBook");
const bookModal_Inside = bookModal.querySelector(".modalInside");

const openModal = (modal) => {
  modal.style.display = "flex";
  setTimeout(() => {
    bookModal_Inside.style.transform = "scale(1)";
    accountModal_Inside.style.transform = "scale(1)";
    modal.classList.add("show");
  }, 10);
};

const closeModal = (event) => {
  if (!event || event.target === accountModal || event.target === bookModal) {
    accountModal_Inside.style.transform = "scale(0)";
    bookModal_Inside.style.transform = "scale(0)";
    setTimeout(() => {
      accountModal.classList.remove("show");
      bookModal.classList.remove("show");
      accountModal.style.display = "none";
      bookModal.style.display = "none";
    }, 200);
  }
};

const handleKeyboardInput = (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
};

window.onkeydown = handleKeyboardInput;
window.onclick = closeModal;
accountBtn.addEventListener("click", () => openModal(accountModal));
bookModal_Btn.addEventListener("click", () => openModal(bookModal));

loginBtn.onclick = userLogin;
logoutBtn.onclick = userLogout;
