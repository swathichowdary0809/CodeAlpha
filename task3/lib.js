document.addEventListener('DOMContentLoaded', function () {
    const homeLink = document.getElementById('homeLink');
    const addBookLink = document.getElementById('addBookLink');
    const borrowedBooksLink = document.getElementById('borrowedBooksLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const homeSection = document.getElementById('homeSection');
    const addBookSection = document.getElementById('addBookSection');
    const borrowedBooksSection = document.getElementById('borrowedBooksSection');
    const loginSection = document.getElementById('loginSection');
    function showSection(section) {
        homeSection.classList.add('hidden');
        addBookSection.classList.add('hidden');
        borrowedBooksSection.classList.add('hidden');
        loginSection.classList.add('hidden');
        section.classList.remove('hidden');
    }
    homeLink.addEventListener('click', function () {
        showSection(homeSection);
    });
    addBookLink.addEventListener('click', function () {
        showSection(addBookSection);
    });
    borrowedBooksLink.addEventListener('click', function () {
        showSection(borrowedBooksSection);
    });
    loginLink.addEventListener('click', function () {
        showSection(loginSection);
    });
    logoutLink.addEventListener('click', function (event) {
        event.preventDefault();
        sessionStorage.removeItem('loggedIn');
        showSection(homeSection);
        loginLink.classList.remove('hidden');
        logoutLink.classList.add('hidden');
    });
    if (sessionStorage.getItem('loggedIn') === 'true') {
        loginLink.classList.add('hidden');
        logoutLink.classList.remove('hidden');
    } else {
        loginLink.classList.remove('hidden');
        logoutLink.classList.add('hidden');
    }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'admin' && password === 'password') {
                sessionStorage.setItem('loggedIn', 'true');
                alert('Login successful!');
                showSection(homeSection);
                loginLink.classList.add('hidden');
                logoutLink.classList.remove('hidden');
            } else {
                alert('Invalid username or password.');
            }
        });
    }
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const isbn = document.getElementById('isbn').value;
            const pubDate = document.getElementById('pubDate').value;
            const category = document.getElementById('category').value;
            const book = {
                title,
                author,
                isbn,
                pubDate,
                category,
            };
            let books = JSON.parse(localStorage.getItem('books')) || [];
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
            alert('Book added successfully!');
            bookForm.reset();
            displayBooks(books);
        });
    }
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const bookList = document.getElementById('book-list');
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            const searchTerm = searchInput.value.toLowerCase();
            const books = JSON.parse(localStorage.getItem('books')) || [];
            const filteredBooks = books.filter(book => {
                return book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.category.toLowerCase() === searchTerm || 
                    book.isbn.includes(searchTerm);
            });
            displayBooks(filteredBooks);
        });
    }
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    const removeBorrowedBooksButton = document.getElementById('removeBorrowedBooks');
    if (borrowedBooksList) {
        let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        borrowedBooks.forEach(book => {
            const li = document.createElement('li');
            li.textContent = book.title + ' by ' + book.author;
            borrowedBooksList.appendChild(li);
        });
        removeBorrowedBooksButton.addEventListener('click', function () {
            localStorage.removeItem('borrowedBooks');
            while (borrowedBooksList.firstChild) {
                borrowedBooksList.removeChild(borrowedBooksList.firstChild);
            }
        });
    }
    function displayBooks(books) {
        if (bookList) {
            bookList.innerHTML = '';
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');
                bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>Publication Date:</strong> ${book.pubDate}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <button class="editButton">Edit</button>
                    <button class="borrowButton">Borrow Book</button>
                `;
                const editButton = bookElement.querySelector('.editButton');
                editButton.addEventListener('click', function () {
                    editBook(book);
                });
                const borrowButton = bookElement.querySelector('.borrowButton');
                borrowButton.addEventListener('click', function () {
                    borrowBook(book);
                });
                bookList.appendChild(bookElement);
            });
        }
    }
    function editBook(book) {
        const updatedTitle = prompt(`Enter new title (current: ${book.title}):`, book.title);
        const updatedAuthor = prompt(`Enter new author (current: ${book.author}):`, book.author);
        const updatedISBN = prompt(`Enter new ISBN (current: ${book.isbn}):`, book.isbn);
        const updatedPubDate = prompt(`Enter new publication date (current: ${book.pubDate}):`, book.pubDate);
        const updatedCategory = prompt(`Enter new category (current: ${book.category}):`, book.category);
        if (updatedTitle || updatedAuthor || updatedISBN || updatedPubDate || updatedCategory) {
            const updatedBook = {
                title: updatedTitle || book.title,
                author: updatedAuthor || book.author,
                isbn: updatedISBN || book.isbn,
                pubDate: updatedPubDate || book.pubDate,
                category: updatedCategory || book.category,
            };
            let books = JSON.parse(localStorage.getItem('books')) || [];
            const index = books.findIndex(b => b.isbn === book.isbn);
            if (index !== -1) {
                books[index] = updatedBook;
                localStorage.setItem('books', JSON.stringify(books));
                displayBooks(books);
            }
        }
    }
    function borrowBook(book) {
        let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        borrowedBooks.push(book);
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        alert('Book borrowed successfully!');
    }
    function addSampleBooks() {
        const sampleBooks = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", pubDate: "1925-04-10", category: "Fiction" },
            { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", pubDate: "1960-07-11", category: "Fiction" },
            { title: "1984", author: "George Orwell", isbn: "9780451524935", pubDate: "1949-06-08", category: "Science" },
            { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", pubDate: "1988-03-01", category: "Science" },
            { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", pubDate: "2011-09-04", category: "Non-Fiction" },
            { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "9780547928227", pubDate: "1937-09-21", category: "Non-Fiction" },
            { title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", pubDate: "1813-01-28", category: "Fiction" },
            { title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "9780316769488", pubDate: "1951-07-16", category: "Fiction" }
        ];
        let books = JSON.parse(localStorage.getItem('books')) || [];
        if (books.length === 0) {
            localStorage.setItem('books', JSON.stringify(sampleBooks));
            books = sampleBooks;
        }
        return books;
    }
    const allBooks = addSampleBooks();
    displayBooks(allBooks);
});
