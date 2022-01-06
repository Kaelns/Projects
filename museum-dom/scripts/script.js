//____________________ Burger menu____________________
const burgerMenu = document.querySelector(".burger-menu");
const bodyMenu = document.querySelector(".menu__body");
const headerTitle = document.querySelector(".header__title");
const welcomeTitle = document.querySelector(".welcome-title__wrapper");
const navLink = document.querySelectorAll(".nav__link1");

if (burgerMenu) {
  burgerMenu.addEventListener("click", (e) => {
    bodyMenu.classList.toggle("_active");
    headerTitle.classList.toggle("_active");
    burgerMenu.classList.toggle("_active");
    welcomeTitle.classList.toggle("_inactive");
    document.body.classList.toggle("_lock");
  });

  navLink.forEach((el) => {
    el.addEventListener("click", (e) => {
      bodyMenu.classList.remove("_active");
      headerTitle.classList.remove("_active");
      burgerMenu.classList.remove("_active");
      welcomeTitle.classList.remove("_inactive");
      document.body.classList.remove("_lock");
    });
  });
}

//____________________ Welcome slider____________________
$(document).ready(function () {
  $(".slider").slick({
    nextArrow: document.getElementById("slick-next"),
    prevArrow: document.getElementById("slick-previous"),
    dots: true,
    autoplay: true,
    speed: 1200,
    autoplaySpeed: 5000,
    appendDots: document.getElementById("slick-dots"),
  });
});

//____________________ Video slider____________________

$(document).ready(function () {
  $(".slider2").slick({
    arrows: true,
    dots: true,
    slidesToShow: 2,
    draggable: false,
    nextArrow: document.getElementById("slick-next2"),
    prevArrow: document.getElementById("slick-previous2"),
    appendDots: document.getElementById("slick-dots2"),
    asNavFor: ".slider2-big",
    focusOnSelect: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2,
        },
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });
  $(".slider2-big").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    arrows: false,
    fade: true,
    asNavFor: ".slider2",
  });
});

let $status = $(".pagingInfo");
let $slickElement = $(".slider");

$slickElement.on(
  "init reInit afterChange",
  function (event, slick, currentSlide, nextSlide) {
    let i = (currentSlide ? currentSlide : 0) + 1;
    $status.text("0" + i + " | " + "0" + slick.slideCount);
  }
);

// ___________________________Video controls____________________________
const sliderBig = document.getElementById("slider2-big");
const sliderMenu = document.getElementById("slider2__menu");
const videoList = sliderBig.querySelectorAll(".video1");
const sliderBigContainer = sliderBig.querySelectorAll(".slider-big__container");
const slickPrev = sliderMenu.querySelector(".slick-prev");
const slickDots = sliderMenu.querySelector(".slick-dots__wrapper");
const slickNext = sliderMenu.querySelector(".slick-next");
const iframe = document.getElementsByTagName("iframe");
let activeVideoPlayer = 0;

const videoWorks = !!document.createElement("video").canPlayType;

let currentUnsubscribeFunction = workWithPlayer(
  sliderBigContainer[activeVideoPlayer]
);

slickPrev.addEventListener("click", (event) => {
  if (activeVideoPlayer === 0) {
    activeVideoPlayer = 4;
  } else {
    activeVideoPlayer -= 1;
  }
  checkCurrentVideo();
  pauseIframe();
});

setTimeout(() => {
  slickDots.children[0].addEventListener("click", (event) => {
    const targetElem = event.target;
    activeVideoPlayer = Array.prototype.findIndex.call(
      slickDots.children[0].children,
      (elem) => {
        return elem.children[0] === targetElem;
      }
    );
    checkCurrentVideo();
  });
  pauseIframe();
}, 500);

slickNext.addEventListener("click", (event) => {
  if (activeVideoPlayer === 4) {
    activeVideoPlayer = 0;
  } else {
    activeVideoPlayer += 1;
  }
  checkCurrentVideo();
  pauseIframe();
});

function checkCurrentVideo() {
  currentUnsubscribeFunction();
  sliderBigContainer.forEach((player, index) => {
    if (activeVideoPlayer === index) {
      currentUnsubscribeFunction = workWithPlayer(player);
    }
  });
}

function pauseIframe() {
  Array.prototype.forEach.call(iframe, (currentIframe) => {
    currentIframe.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  });
}

function workWithPlayer(player) {
  const video = player.querySelector(".video1");
  const videoControls = player.querySelector(".video-controls");
  const playButton = player.querySelector(".play");
  const playbackIcons = player.querySelectorAll(".playback-icons use");
  const stopIcons = player.querySelector(".stop-icons use");
  const progressBar = player.querySelector(".progress-bar");
  const seek = player.querySelector(".seek");
  const seekTooltip = player.querySelector(".seek-tooltip");
  const progressBarVolume = player.querySelector(".progress-bar-volume");
  const volumeButton = player.querySelector(".volume-button");
  const volumeIcons = player.querySelectorAll(".volume-button use");
  const volumeMute = player.querySelector('use[href="#volume-mute"]');
  const volumeLow = player.querySelector('use[href="#volume-low"]');
  const volumeHigh = player.querySelector('use[href="#volume-high"]');
  const volume = player.querySelector(".volume");
  const playbackAnimation = player.querySelector(".playback-animation");
  const fullscreenButton = player.querySelector(".fullscreen-button");
  const videoWrapper = player.querySelector(".video__wrapper");
  const fullscreenIcons = fullscreenButton.querySelectorAll("use");
  const playbackRate = player.querySelector(".playback-rate");

  if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove("hidden");
  }

  function togglePlay() {
    video.paused || video.ended ? video.play() : video.pause();
  }

  function updatePlayButton() {
    playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));
    stopIcons.classList.toggle("hidden");

    video.paused || video.ended
      ? playButton.setAttribute("data-title", "Play")
      : playButton.setAttribute("data-title", "Pause");
  }

  function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  }

  function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    seek.setAttribute("max", videoDuration);
    progressBar.setAttribute("max", videoDuration);

    volume.value = 0.1;
    video.volume = volume.value;
    progressBarVolume.value = volume.value;
  }

  function updateProgress() {
    seek.value = video.currentTime;
    progressBar.value = video.currentTime;
    window.requestAnimationFrame(updateProgress);
  }

  function updateSeekTooltip(event) {
    const skipTo = Math.round(
      (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute("max"), 10)
    );
    seek.setAttribute("data-seek", skipTo);
    const t = formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = seek.getBoundingClientRect();
    seekTooltip.style.left = `${event.pageX - rect.left}px`;
  }

  function skipAhead(event) {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
  }

  function updateVolume() {
    if (video.muted) {
      video.muted = false;
    }

    video.volume = volume.value;
    progressBarVolume.value = volume.value;
  }

  function updateVolumeIcon() {
    volumeIcons.forEach((icon) => {
      icon.classList.add("hidden");
    });

    volumeButton.setAttribute("data-title", "Mute");

    if (video.muted || video.volume === 0) {
      volumeMute.classList.remove("hidden");
      volumeButton.setAttribute("data-title", "Unmute");
    } else if (video.volume > 0 && video.volume < 0.5) {
      volumeLow.classList.remove("hidden");
    } else {
      volumeHigh.classList.remove("hidden");
    }
  }

  function toggleMute() {
    video.muted = !video.muted;

    if (video.muted) {
      volume.setAttribute("data-volume", volume.value);
      volume.value = 0;
      progressBarVolume.value = volume.value;
    } else {
      volume.value = volume.dataset.volume;
      progressBarVolume.value = volume.value;
    }
  }

  function animatePlayback() {
    playbackAnimation.animate(
      [
        {
          transform: "scale(1)",
        },
        {
          transform: "scale(1.1)",
        },
        {
          transform: "scale(1)",
        },
      ],
      {
        duration: 550,
      }
    );
  }

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoWrapper.requestFullscreen();
    }
  }

  function updateFullscreenButton() {
    fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

    if (document.fullscreenElement) {
      fullscreenButton.setAttribute("data-title", "Exit full screen");
    } else {
      fullscreenButton.setAttribute("data-title", "Full screen");
    }
  }

  function playbackRateDown() {
    let rate = (video.playbackRate -= 0.25);
    playbackRate.textContent = `${rate}x`;

    playbackRate.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0,
          transform: "scale(1.3)",
        },
      ],
      {
        duration: 550,
      }
    );
  }

  function playbackRateUp() {
    let rate = (video.playbackRate += 0.25);
    playbackRate.textContent = `${rate}x`;

    playbackRate.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0,
          transform: "scale(1.3)",
        },
      ],
      {
        duration: 700,
      }
    );
  }

  function keyboardShortcuts(event) {
    const { code } = event;
    switch (code) {
      case "Space":
        togglePlay();
        break;
      case "KeyM":
        toggleMute();
        break;
      case "KeyF":
        toggleFullScreen();
        break;
    }
    if (event.code == "Comma" && event.shiftKey) {
      playbackRateDown();
    }
    if (event.code == "Period" && event.shiftKey) {
      playbackRateUp();
    }
  }

  function unsubscribe() {
    fullscreenButton.removeEventListener("click", toggleFullScreen);
    playButton.removeEventListener("click", togglePlay);
    video.removeEventListener("play", updatePlayButton);
    video.removeEventListener("pause", updatePlayButton);
    video.removeEventListener("timeupdate", updateProgress);
    seek.removeEventListener("mousemove", updateSeekTooltip);
    seek.removeEventListener("input", skipAhead);
    volume.removeEventListener("input", updateVolume);
    video.removeEventListener("volumechange", updateVolumeIcon);
    volumeButton.removeEventListener("click", toggleMute);
    video.removeEventListener("click", togglePlay);
    video.removeEventListener("click", animatePlayback);
    videoWrapper.removeEventListener(
      "fullscreenchange",
      updateFullscreenButton
    );
    video.removeEventListener("loadedmetadata", initializeVideo);
    document.removeEventListener("keyup", keyboardShortcuts);
    video.pause();
  }

  if (video.videoWidth && video.videoHeight) {
    initializeVideo();
  }

  fullscreenButton.addEventListener("click", toggleFullScreen);
  playButton.addEventListener("click", togglePlay);
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);
  video.addEventListener("timeupdate", updateProgress);
  seek.addEventListener("mousemove", updateSeekTooltip);
  seek.addEventListener("input", skipAhead);
  volume.addEventListener("input", updateVolume);
  video.addEventListener("volumechange", updateVolumeIcon);
  volumeButton.addEventListener("click", toggleMute);
  video.addEventListener("click", togglePlay);
  video.addEventListener("click", animatePlayback);
  videoWrapper.addEventListener("fullscreenchange", updateFullscreenButton);
  video.addEventListener("loadedmetadata", initializeVideo);
  document.addEventListener("keyup", keyboardShortcuts);

  return unsubscribe;
}

window.addEventListener("keydown", function (e) {
  if (e.code == "Space") {
    e.preventDefault();
  }
});

//___________________ Image comparison slider____________________

const slider = document.querySelector("#image-comparison-slider");
const sliderImgWrapper = document.querySelector(
  "#image-comparison-slider .image-compare__block"
);
const sliderHandle = document.querySelector(
  "#image-comparison-slider .slider-handle"
);

slider.addEventListener("mousedown", () => {
  slider.addEventListener("mousemove", sliderMouseMove);

  slider.addEventListener("mouseup", () => {
    slider.removeEventListener("mousemove", sliderMouseMove);
  });
});

function sliderMouseMove(event) {
  const sliderLeftX = slider.offsetLeft;
  const sliderWidth = slider.clientWidth;
  const sliderHandleWidth = sliderHandle.clientWidth;

  let mouseX = event.clientX - sliderLeftX;
  if (mouseX < 0) mouseX = 0;
  else if (mouseX > sliderWidth) mouseX = sliderWidth;

  sliderImgWrapper.style.width = `${((1 - mouseX / sliderWidth) * 100).toFixed(
    4
  )}%`;
  sliderHandle.style.left = `calc(${((mouseX / sliderWidth) * 100).toFixed(
    4
  )}% - ${sliderHandleWidth / 2}px)`;
}

// _________________________Gallery_____________________________
const leftColumn = document.querySelector("#left__column");
const middleColumn = document.querySelector("#middle__column");
const rightColumn = document.querySelector("#right__column");

const picture1 = `<img src="../museum-dom/assets/img/Gallery/galery1.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture2 = `<img src="../museum-dom/assets/img/Gallery/galery2.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture3 = `<img src="../museum-dom/assets/img/Gallery/galery3.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture4 = `<img src="../museum-dom/assets/img/Gallery/galery4.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture5 = `<img src="../museum-dom/assets/img/Gallery/galery5.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture6 = `<img src="../museum-dom/assets/img/Gallery/galery6.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture7 = `<img src="../museum-dom/assets/img/Gallery/galery7.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture8 = `<img src="../museum-dom/assets/img/Gallery/galery8.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture9 = `<img src="../museum-dom/assets/img/Gallery/galery9.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture10 = `<img src="../museum-dom/assets/img/Gallery/galery10.jpg" alt="gallery" loading='lazy' class="gallery__img">`;
const picture11 = `<img src="../museum-dom/assets/img/Gallery/galery11.jpg" alt="gallery" loading='lazy' class="gallery__img gallery__img_hidden">`;
const picture12 = `<img src="../museum-dom/assets/img/Gallery/galery12.jpg" alt="gallery" loading='lazy' class="gallery__img gallery__img_hidden">`;
const picture13 = `<img src="../museum-dom/assets/img/Gallery/galery13.jpg" alt="gallery" loading='lazy' class="gallery__img gallery__img_hidden">`;
const picture14 = `<img src="../museum-dom/assets/img/Gallery/galery14.jpg" alt="gallery" loading='lazy' class="gallery__img gallery__img_hidden">`;
const picture15 = `<img src="../museum-dom/assets/img/Gallery/galery15.jpg" alt="gallery" loading='lazy' class="gallery__img gallery__img_hidden">`;

let arrLeft = [
  picture1,
  picture2,
  picture3,
  picture4,
  picture5,
  picture11,
  picture12,
];
let arrMiddle = [
  picture6,
  picture7,
  picture8,
  picture9,
  picture10,
  picture13,
  picture14,
  picture15,
];
let arrRight = [picture11, picture12, picture13, picture14, picture15];

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

shuffle(arrLeft);
shuffle(arrMiddle);
shuffle(arrRight);

arrLeft.map((elem) => (leftColumn.innerHTML += elem));
arrMiddle.map((elem) => (middleColumn.innerHTML += elem));
arrRight.map((elem) => (rightColumn.innerHTML += elem));

// ______________Gallery img ascent__________________
const imgContainer = document.getElementById("img-container");
const imgArr = Array.from(imgContainer.getElementsByTagName("img"));

let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("_active");
      } else {
        entry.target.classList.remove("_active");
      }
    });
  },
  {
    threshold: [0.15],
    rootMargin: "500px 0px 0px 0px",
  }
);

imgArr.forEach((img) => {
  observer.observe(img);
});

console.log("Нету калькуляторов, валидации и карты");
