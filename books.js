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
  console.log(duplicateNameError);
  for (let i = 0; i < myLibrary.length; i++) {
    if (name === myLibrary[i].name) {
      duplicateNameError.style.display = "block";
      return;
    }
  }
  // Hide the duplicate error message if no duplicates found
  duplicateNameError.style.display = "none";

  const newBook = new Book(name, author, pages, year, readStatus);
  myLibrary.push(newBook);
  updateLibrary();
  displayBooks();
  closeModal2();
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
        <input type="button" class="submitBtn"  id="submitBtn_readStatusChange" value="${
          book.readStatus ? "Read" : "Not Read"
        }"     data-index2="${i}">
        <input type="button" class="submitBtn" id="submitBtn_removeBook" value="Remove" data-index="${i}">
      </div>
    `;
    container.innerHTML += bookCard;
  }
  const removeButtons = document.querySelectorAll("#submitBtn_removeBook");
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
};

const modal = document.getElementById("addBookModal");
const modalBtn = document.getElementById("addBook");
modalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

const closeModal = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

const closeModal2 = () => {
  modal.style.display = "none";
};

window.addEventListener("click", closeModal);
document.addEventListener("DOMContentLoaded", setupFormHandler);
