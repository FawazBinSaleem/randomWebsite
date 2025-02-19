let currentIndex = 0;
const carousel = document.getElementById("carousel");
const slideCounter = document.getElementById("slideCounter");
const fileName = "media.json";
const imageFormats = [".jpeg", ".jpg", ".gif", ".png", ".webp"];
let touchStartX = 0;
let touchEndX = 0;

openModal("myModal", "openModal", "close");
parseFile(fileName);



carousel.addEventListener("touchstart", event => {
  touchStartX = event.touches[0].clientX;
});

carousel.addEventListener("touchmove", event => {
  touchEndX = event.touches[0].clientX;
});

carousel.addEventListener("touchend", () => {
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > 50) {
    // Swiped left → Next slide
    changeSlide(1);
  } else if (swipeDistance < -50) {
    // Swiped right → Previous slide
    changeSlide(-1);
  }
});


function parseFile(fileName) {
  fetch(fileName)
    .then(response => response.json())
    .then(mediaFiles => {
      console.log(`Loaded ${mediaFiles.length} media files`);

      const fragment = document.createDocumentFragment();

      mediaFiles.forEach(file => {
        let element;
        if (file.endsWith(".mp4")) {
          element = document.createElement("video");
          element.className = "carousel-video";
          element.src = file;
          element.controls = true;
        } else if (imageFormats.some(format => file.endsWith(format))) {
          element = document.createElement("img");
          element.className = "carousel-image";
          element.src = file;
          element.alt = file;
        }

        if (element) fragment.appendChild(element);
      });

      carousel.appendChild(fragment);
      showSlide(0);
    })
    .catch(error => console.error("Error loading media.json:", error));
}

function getSlides() {
  return document.querySelectorAll(".carousel-image, .carousel-video");
}

function showSlide(index) {
  const slides = getSlides();
  if (slides.length === 0) return;

  currentIndex = (index + slides.length) % slides.length;

  slides.forEach(slide => {
    slide.style.display = "none";
    if (slide.tagName === "VIDEO") slide.pause();
  });

  slides[currentIndex].style.display = "block";
  if (slides[currentIndex].tagName === "VIDEO") slides[currentIndex].play();

  updateSlideCounter();
}

function changeSlide(direction) {
  showSlide(currentIndex + direction);
}

function updateSlideCounter() {
  const slides = getSlides();
  slideCounter.textContent = `${currentIndex + 1}/${slides.length}`;
}

function pauseVideo(videos) {
  videos.forEach(video => video.pause());
}

function openModal(modalId, buttonID, closeClass) {
  const modal = document.getElementById(modalId);
  const btn = document.getElementById(buttonID);
  const span = document.getElementsByClassName(closeClass)[0];

  function closeModal() {
    modal.style.display = "none";
    pauseVideo(modal.querySelectorAll("video"));
  }

  btn.addEventListener("click", () => {
    modal.style.display = "block";
    showSlide(0);
  });

  span.addEventListener("click", closeModal);
  window.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
    else if (event.key === "ArrowLeft") changeSlide(-1);
    else if (event.key === "ArrowRight") changeSlide(1);
  });


  window.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
  });
  
  window.addEventListener("touchmove", event => {
    touchEndX = event.touches[0].clientX;
  });
  
  window.addEventListener("touchend", () => {
    const swipeDistance = touchStartX - touchEndX;
  
    if (Math.abs(swipeDistance) > 50) {
      changeSlide(swipeDistance > 0 ? 1 : -1);
    }
  });
}
