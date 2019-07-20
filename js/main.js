/************************
 BOOK CLASS-->CREATE BOOK
 ***********************/
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

/************************
 UI CLASS-->UI TASKS
 ***********************/
class userInterface {
  static displayBooks() {
    const books = store.getBooks();

    books.forEach(book => userInterface.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static showAlerts(message, className) {
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 950);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
}

/************************
 STORE CLASS-->STORE DATA
 ***********************/
class store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

/************************
 DISPLAY BOOK-->TO UI
 ***********************/
document.addEventListener("DOMContentLoaded", userInterface.displayBooks);

/************************
 ADD BOOK-->ADD TO STORAGE
 ***********************/
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //VALIDATE
  if (title === "" || author === "" || isbn === "") {
    userInterface.showAlerts("Please fill in all fields", "danger");
  } else {
    //instanciate book
    const book = new Book(title, author, isbn);

    //addbook to ui
    userInterface.addBookToList(book);

    //add book to local storage
    store.addBook(book);

    //success msg
    userInterface.showAlerts("Book added successfully!", "success");

    //clear fields
    userInterface.clearFields();
  }
});

/************************
 REMOVE BOOK-->FROM UI&BASE
 ***********************/
document.querySelector("#book-list").addEventListener("click", e => {
  userInterface.deleteBook(e.target);
  userInterface.showAlerts("Book removed", "danger");
});
