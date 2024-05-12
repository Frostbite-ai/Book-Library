let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];

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

const getBookFromInput = (event) => {
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const author = formData.get("author");
  const pages = formData.get("pages");
  const year = formData.get("year");
  const readStatus = formData.get("status") === "true";
  return new Book(name, author, pages, year, readStatus);
};

const addBookToLibrary = (event) => {
  event.preventDefault();
  const newBook = getBookFromInput(event);
  console.log(newBook);
  if (myLibrary.some((book) => book.name === newBook.name)) {
    duplicateNameError.textContent = "This book already exists";
    return;
  }
  duplicateNameError.textContent = "";

  if (auth.currentUser) {
    addBookToLibraryDB(newBook);
  } else {
    myLibrary.push(newBook);
    updateLibrary();
    displayBooks();
  }
  closeModal();
  event.target.reset();
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
        }"     data-index2="${i}" data-title="${book.name}"  >
        <input type="button" class="Btn" id="removeBook_Btn" value="Remove" data-title="${
          book.name
        }" data-index="${i}">
      </div>
    `;
    container.innerHTML += bookCard;
  }

  const removeButtons = document.querySelectorAll("#removeBook_Btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      const title = event.target.getAttribute("data-title");
      if (auth.currentUser) {
        removeBookFromLibraryDB(title);
      } else {
        removeBookFromLibrary(index);
      }
    });
  });

  const updateReadStatusButtons = document.querySelectorAll(
    "#submitBtn_readStatusChange"
  );
  updateReadStatusButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index2");
      const title = event.target.getAttribute("data-title");

      if (auth.currentUser) {
        updateReadStatusDB(title);
      } else {
        updateReadStatus(index);
      }
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

const form = document.getElementById("bookForm");
form.addEventListener("submit", addBookToLibrary);

const bookModal = document.getElementById("bookModal");
const modalInside = bookModal.querySelector(".modalInside");

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("accountBtn_login");
const logoutBtn = document.getElementById("accountBtn_logout");
const accountBtn = document.getElementById("accountBtn_account");
const account_email = document.getElementById("account_email");

const userLogin = async () => {
  signInWithPopup(auth, provider);
};

const userLogout = async () => {
  await signOut(auth);
};

// const db = firebase.firestore();
let unsubscribe;

const setupRealTimeListener = () => {
  if (!auth.currentUser) {
    console.error("No authenticated user.");
    return;
  }

  const booksCollection = collection(db, "books");
  const booksQuery = query(
    booksCollection,
    where("ownerId", "==", auth.currentUser.uid),
    orderBy("createdAt")
  );

  unsubscribe = onSnapshot(booksQuery, (snapshot) => {
    const books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    myLibrary = docsToBooks(books);
    displayBooks();
  });
};
const restoreLocalBooks = () => {
  myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
};
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    accountBtn.style.display = "block";
    account_email.innerHTML = user.email;

    setupRealTimeListener();

    console.log(user);
    console.log(auth.currentUser.uid);
  } else {
    if (unsubscribe) {
      unsubscribe();
    }
    restoreLocalBooks();
    displayBooks();

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    accountBtn.style.display = "none";
  }
});

const addBookToLibraryDB = async (newBook) => {
  try {
    await addDoc(collection(db, "books"), bookToDoc(newBook));
    console.log("Book added successfully");
  } catch (error) {
    console.error("Error adding book: ", error);
  }
};

const removeBookFromLibraryDB = async (title) => {
  try {
    console.log("book title  is for removing:", title);

    const bookId = await getBookIdDB(title);
    console.log("book id is for removing:", bookId);

    if (bookId) {
      await deleteDoc(doc(db, "books", bookId));
      console.log("Book removed successfully");
    } else {
      console.log("Book not found");
    }
  } catch (error) {
    console.error("Error removing book: ", error);
  }
};

const updateReadStatusDB = async (title) => {
  try {
    // console.log("book title  is for updating:", title);
    const bookId = await getBookIdDB(title);
    // console.log("book id is for updating:", bookId);

    if (bookId) {
      const bookDoc = doc(db, "books", bookId);
      const bookSnapshot = await getDoc(bookDoc);
      if (bookSnapshot.exists()) {
        const currentReadStatus = bookSnapshot.data().readStatus;
        await updateDoc(bookDoc, {
          readStatus: !currentReadStatus,
        });
        console.log("Book status updated successfully");
      } else {
        console.log("Book not found");
      }
    } else {
      console.log("Book not found");
    }
  } catch (error) {
    console.error("Error updating book status: ", error);
  }
};

const docsToBooks = (docs) => {
  return docs.map((data) => {
    return new Book(
      data.name,
      data.author,
      data.pages,
      data.year,
      data.readStatus
    );
  });
};

const bookToDoc = (book) => {
  return {
    ownerId: auth.currentUser.uid,
    name: book.name,
    author: book.author,
    pages: book.pages,
    year: book.year,
    readStatus: book.readStatus,
    createdAt: serverTimestamp(),
  };
};

const getBookIdDB = async (title) => {
  const q = query(
    collection(db, "books"),
    where("ownerId", "==", auth.currentUser.uid),
    where("name", "==", title)
  );
  console.log("the query is :", q);
  const snapshot = await getDocs(q);
  console.log("the snapshot is :", snapshot);

  const bookId = snapshot.docs.map((doc) => doc.id).join("");
  return bookId;
};

const accountModal = document.getElementById("accountModal");
const accountModal_Inside = accountModal.querySelector(".modalInside");

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
