// JavaScript code for managing the gallery

// Function to fetch photos from the server
async function fetchPhotos() {
  const response = await fetch('/photos');
  const photos = await response.json();
  displayPhotos(photos);
}

// Function to display photos in the gallery
function displayPhotos(photos) {
  const photosContainer = document.getElementById('photosContainer');
  photosContainer.innerHTML = '';
  photos.forEach(photo => {
      const photoDiv = document.createElement('div');
      photoDiv.classList.add('photo');
      photoDiv.innerHTML = `
          <img src="${photo.imageUrl}" alt="${photo.title}">
          <div class="photo-actions">
              <h3>${photo.title}</h3>
              <p>${photo.description}</p>
              <button class="delete-btn" data-id="${photo._id}">Delete</button>
              <button class="edit-btn" data-id="${photo._id}">Edit</button>
              <button class="like-btn" data-id="${photo._id}">Like</button>
              <button class="dislike-btn" data-id="${photo._id}">Dislike</button>
              <button class="comment-btn" data-id="${photo._id}">Comment</button>
              <span class="likes">${photo.likes} Likes</span>
              <span class="dislikes">${photo.dislikes} Dislikes</span>
              <ul class="comment-list">
                  ${photo.comments.map(comment => `<li>${comment.text}</li>`).join('')}
              </ul>
              <div class="comment-form" style="display: none;">
                  <input type="text" placeholder="Your comment">
                  <button class="submit-comment-btn" data-id="${photo._id}">Send</button>
              </div>
          </div>
      `;
      photosContainer.appendChild(photoDiv);
  });
}

// Function to handle form submission for photo upload
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('image', document.getElementById('image').files[0]);
  try {
      const response = await fetch('/upload', {
          method: 'POST',
          body: formData
      });
      if (response.ok) {
          fetchPhotos();
      } else {
          console.error('Upload failed');
      }
  } catch (error) {
      console.error('Error:', error);
  }
});

// Function to handle like button click
document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('like-btn')) {
      const photoId = event.target.dataset.id;
      try {
          const response = await fetch(`/photos/${photoId}/like`, { method: 'POST' });
          if (response.ok) {
              fetchPhotos();
          } else {
              console.error('Like failed');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
});

// Function to handle dislike button click
document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('dislike-btn')) {
      const photoId = event.target.dataset.id;
      try {
          const response = await fetch(`/photos/${photoId}/dislike`, { method: 'POST' });
          if (response.ok) {
              fetchPhotos();
          } else {
              console.error('Dislike failed');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
});

// Function to handle comment button click
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('comment-btn')) {
      const commentForm = event.target.parentElement.querySelector('.comment-form');
      if (commentForm.style.display === 'none') {
          commentForm.style.display = 'block';
      } else {
          commentForm.style.display = 'none';
      }
  }
});

// Function to handle comment submission
document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('submit-comment-btn')) {
      const photoId = event.target.dataset.id;
      const commentText = event.target.parentElement.querySelector('input').value;
      try {
          const response = await fetch(`/photos/${photoId}/comment`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ text: commentText })
          });
          if (response.ok) {
              fetchPhotos();
          } else {
              console.error('Comment failed');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
});

// Fetch photos when the page loads
fetchPhotos();
