let currentIndex = 0;
const carousel = document.getElementById("carousel");
const slideCounter = document.getElementById("slideCounter");
const fileName = 'media.txt';
const relativePath='media/';
const imageFormats = ['.jpeg', '.jpg', '.gif', '.png', '.webp'];



openModal("myModal", "openModal", "close");
parseFile(fileName,relativePath);





function parseFile(fileName,relativePath) {
  index=0;
  fetch(fileName)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let mediaFiles = text.split(relativePath).map(function (line, index) {
        return index === 0 ? line.trim() : relativePath + line.trim();
      }).filter(function (line) {
        return line; 
      });

      mediaFiles.forEach(function (file) {
        if (file.endsWith('.mp4')) {
          const video = document.createElement('video');
          video.className = 'carousel-video';
          video.src = file;
          video.controls = true;
          carousel.appendChild(video);
        } else if (imageFormats.some(function (format) {
          return file.endsWith(format);
        })) {
          const img = document.createElement('img');
          img.className = 'carousel-image';
          img.src = file;
          img.alt = file;
          carousel.appendChild(img);
        }
      });
      showSlide(index); 
    });
}



function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-image, .carousel-video");
  if (index >= slides.length) {
    currentIndex = 0;
  }
  if (index < 0) {
    currentIndex = slides.length - 1;
  }

  slides.forEach(function (slide) {
    slide.style.display = "none";
    if (slide.tagName === 'VIDEO') {
      slide.pause();
    }
  })


  
  slides[currentIndex].style.display = "block";
  if (slides[currentIndex].tagName === 'VIDEO') {
    slides[currentIndex].play();
  }

  updateSlideCounter();
}

function changeSlide(direction) {
    currentIndex += direction;
    showSlide(currentIndex);
}

function updateSlideCounter() {
  const slides = document.querySelectorAll(".carousel-image, .carousel-video");
  slideCounter.textContent = `${currentIndex + 1}/${slides.length}`;
}

function pauseVideo(videos) {
  videos.forEach(function (video) {
    video.pause();
  });
}

function openModal(modalId, buttonID, closeClass) {
  const modal = document.getElementById(modalId);
  const btn = document.getElementById(buttonID);
  const span = document.getElementsByClassName(closeClass)[0];


  btn.addEventListener('click', function () {
    console.log("Button was clicked!");
    modal.style.display = "block";
    showSlide(0); 
  });

 
  span.addEventListener('click', function () {
    console.log("Close button was clicked!");
    modal.style.display = "none";
  
    const videos = modal.querySelectorAll('video');
    pauseVideo(videos);

  });


  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = "none";

      const videos = modal.querySelectorAll('video');
      pauseVideo(videos);

    }
  });

  
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      modal.style.display = "none";
   
      const videos = modal.querySelectorAll('video');
      pauseVideo(videos);

    } else if (event.key === 'ArrowLeft') {
      changeSlide(-1); 
    } else if (event.key === 'ArrowRight') {
      changeSlide(1); 

    } else if (event.key === ' ') { 
      const currentSlide = document.querySelectorAll(".carousel-image, .carousel-video")[currentIndex];
      if (currentSlide.tagName === 'VIDEO') {
        if (currentSlide.paused) {
          currentSlide.play();
        } else {
          currentSlide.pause();
        }
      }
    }
  });
}


