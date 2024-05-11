// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
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
      console.log(user, email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMsg = error.message;
    });
};
const userLogout = async () => {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    accountBtn.style.display = "block";
    account_email.innerHTML = user.email;

    console.log(user);
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    accountBtn.style.display = "none";
  }
});
const accountModal = document.getElementById("accountModal");
const userDetail = () => {
  accountModal.style.display = "flex";
};

const closeModal = (event) => {
  if (event.target === accountModal) {
    accountModal.style.display = "none";
  }
};

window.addEventListener("click", closeModal);
loginBtn.addEventListener("click", userLogin);
logoutBtn.addEventListener("click", userLogout);
accountBtn.addEventListener("click", userDetail);
