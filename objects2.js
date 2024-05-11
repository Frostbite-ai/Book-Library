function Books(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    let readstatus = this.read ? "read" : "not read yet";
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.readstatus}`;
  };
}

const theHobbit = new Books("The Hobbit", "J.R.R. Tolkien", 295, false);

console.log(theHobbit.info());

console.log(Object.getPrototypeOf(theHobbit));
