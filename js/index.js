document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const baseURL = "http://localhost:3000/books";
  
    // Function to fetch and display books
    const fetchBooks = async () => {
      try {
        const response = await fetch(baseURL);
        const books = await response.json();
  
        books.forEach(book => {
          const bookItem = document.createElement("li");
          bookItem.classList.add("book-item");
          bookItem.textContent = book.title;
          bookItem.addEventListener("click", () => showBookDetails(book));
          bookList.appendChild(bookItem);
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
  
    // Function to display book details
    const showBookDetails = (book) => {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnail}" alt="Book Thumbnail">
        <p>${book.description}</p>
        <h3>Liked By:</h3>
        <ul id="liked-users"></ul>
        <button id="like-btn">Like</button>
      `;
  
      const likeBtn = document.getElementById("like-btn");
      likeBtn.addEventListener("click", () => toggleLike(book));
    };
  
    // Function to toggle like status
    const toggleLike = async (book) => {
      try {
        const response = await fetch(`${baseURL}/${book.id}`);
        const updatedBook = await response.json();
  
        const currentUser = { id: 1, username: "pouros" }; // Example current user
        const likedUsers = updatedBook.users || [];
  
        if (likedUsers.some(user => user.id === currentUser.id)) {
          // User already liked the book, unlike it
          const updatedUsers = likedUsers.filter(user => user.id !== currentUser.id);
          await sendPatchRequest(updatedBook.id, updatedUsers);
          showBookDetails(updatedBook); // Update display
        } else {
          // User likes the book, add to liked users
          likedUsers.push(currentUser);
          await sendPatchRequest(updatedBook.id, likedUsers);
          showBookDetails(updatedBook); // Update display
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };
  
    // Function to send PATCH request
    const sendPatchRequest = async (bookId, updatedUsers) => {
      try {
        await fetch(`${baseURL}/${bookId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ users: updatedUsers })
        });
      } catch (error) {
        console.error("Error sending PATCH request:", error);
      }
    };
  
    // Initial fetch and setup
    fetchBooks();
  });
  