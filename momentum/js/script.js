import playList from "../js/songsList.js";
import settingText from "../js/settingText.js";

const city = document.querySelector(".city");
const name = document.querySelector(".name");
const tagElem = document.querySelector("#tag");
let tag;

let state = {
  language: "en-US",
  photoSource: 1,
  blocks: {
    time: true,
    date: true,
    greeting: true,
    quote: true,
    weather: true,
    player: true,
  },
};
let stateLocal;
const keys = Object.keys(state.blocks);

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }

  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }

  if (localStorage.getItem("tag")) {
    tagElem.value = localStorage.getItem("tag");
    tag = tagElem.value;
  }

  if (localStorage.getItem("stateLocal")) {
    let retrievedObject = localStorage.getItem("stateLocal");
    stateLocal = JSON.parse(retrievedObject);
  }
}

getLocalStorage();

//  _________ Time and Date __________
const time = document.querySelector(".time");
const date = document.querySelector(".date");

function showTime() {
  const currentTime = new Date().toLocaleTimeString();

  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
    hour12: true,
  };

  if (stateLocal) {
    stateLocal.language === "en-US"
      ? (options.hour12 = true)
      : (options.hour12 = false);
  } else {
    state.language === "en-US"
      ? (options.hour12 = true)
      : (options.hour12 = false);
  }

  const currentDate = new Date().toLocaleDateString(
    stateLocal.language,
    options
  );

  // if(stateLocal) {
  //   (stateLocal.language === "en-US")
  //   ? options[hour12] = true
  //   : options[hour12] = false
  // } else {
  //   time.textContent = `${currentTime}`;
  // }

  time.textContent = currentTime;
  date.textContent = currentDate;

  setTimeout(showTime, 1000);
}

showTime();

// Greeting ________________________________
// !Добавить модуль с локал сторейдж

const greeting = document.querySelector(".greeting");

function getTimeOfDayNum() {
  const hours = new Date().getHours();
  return Math.floor(hours / 6);
}

function getTimeOfDay() {
  switch (getTimeOfDayNum()) {
    case 0:
      return "night";
    case 1:
      return "morning";
    case 2:
      return "afternoon";
    case 3:
      return "evening";
  }
}

function getTimeOfDayRu() {
  switch (getTimeOfDayNum()) {
    case 0:
      return "Доброй ночи,";
    case 1:
      return "Доброе утро,";
    case 2:
      return "Добрый день,";
    case 3:
      return "Добрый вечер,";
  }
}

function setGreeting() {
  const timeOfDay = getTimeOfDay();
  const timeOfDayRu = getTimeOfDayRu();
  if (stateLocal) {
    if (stateLocal.language === "ru-RU") {
      greeting.textContent = timeOfDayRu;
      name.placeholder = "[Введите имя]";
    } else {
      greeting.textContent = `Good ${timeOfDay}, `;
      name.placeholder = "[Enter name]";
    }
  } else {
    if (state.language === "ru-RU") {
      greeting.textContent = timeOfDayRu;
      name.placeholder = "[Введите имя]";
    } else {
      greeting.textContent = `Good ${timeOfDay}, `;
      name.placeholder = "[Enter name]";
    }
  }
}

setGreeting();
// Background image ________________________________
//  ! Функцию гет тайм оф дей придется экспортировать

const body = document.getElementById("body");
const prevSliderBtn = document.querySelector(".slide-prev");
const nextSliderBtn = document.querySelector(".slide-next");
let randomNum;

function getRandomNum(length) {
  let random;
  random = Math.floor(Math.random() * length);
  if (random !== 0) {
    return random;
  } else {
    return (random = 1);
  }
}

randomNum = getRandomNum(20);

function setBg() {
  let timeOfDay = getTimeOfDay();
  const img = new Image();

  let bgNum = randomNum.toString();
  if (bgNum.length === 1) {
    bgNum = bgNum.padStart(2, "0");
  }

  img.src = `https://raw.githubusercontent.com/Kaelns/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

async function getLinkToImage(t = getTimeOfDay()) {
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${t}&client_id=9tL1SD45o1jwSBVtB-p-_XxC3f0wyggSSGp8G7PTuB8`;
  const res = await fetch(url);
  const data = await res.json();

  body.style.backgroundImage = `url(${data.urls.regular})`;
}

async function getLinkToImage2(t = getTimeOfDay()) {
  let randomPhoto = getRandomNum(100);
  const url = ` https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d15469b2c12e390817bbae24f25d8841&tags=${t}&extras=url_l&format=json&nojsoncallback=1`;
  const res = await fetch(url);
  const data = await res.json();
  body.style.backgroundImage = `url(${data.photos.photo[randomPhoto].url_l})`;
}

function chooseSource(t) {
  if (stateLocal) {
    if (stateLocal.photoSource === 1) {
      setBg();
    } else if (stateLocal.photoSource === 2) {
      getLinkToImage(t);
    } else {
      getLinkToImage2(t);
    }
  } else {
    setBg();
  }
}

function getSlideNext() {
  if (randomNum !== 20) {
    randomNum++;
  } else {
    randomNum = 1;
  }
  chooseSource(tag);
}

function getSlidePrev() {
  if (randomNum !== 1) {
    randomNum--;
  } else {
    randomNum = 20;
  }
  chooseSource(tag);
}

prevSliderBtn.addEventListener("click", getSlidePrev);
nextSliderBtn.addEventListener("click", getSlideNext);
tagElem.addEventListener("change", () => {
  tag = tagElem.value;
  chooseSource(tag);
});

// Weather ________________________________
// !Добавить модуль с локал сторейдж

const MY_WEATHER_API = "0c68e85b8b5f721b114059f6054d6891";
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const descriptionContainer = document.querySelector(".description-container");
const weatherDescription = document.querySelector(".weather-description");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const weatherError = document.querySelector(".weather-error");
let weatherLang = { lang: "", wind: "", humidity: "", speed: "" };

async function getWeather() {
  changeWeatherLang();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${weatherLang.lang}&appid=${MY_WEATHER_API}&units=metric`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();

    weatherError.classList.add("_hidden");
    weatherIcon.classList.remove("_hidden");
    descriptionContainer.classList.remove("_hidden");

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `${weatherLang.wind}: ${data.wind.speed} ${weatherLang.speed}`;
    humidity.textContent = `${weatherLang.humidity}: ${data.main.humidity}%`;
  } else {
    weatherError.classList.remove("_hidden");
    weatherIcon.classList.add("_hidden");
    descriptionContainer.classList.add("_hidden");
  }
}

document.addEventListener("DOMContentLoaded", getWeather);
city.addEventListener("change", getWeather);

// Quotes________________________________
// ! getRandomNum экспортируем
const quoteContainer = document.querySelector(".quote");
const authorContainer = document.querySelector(".author");
const changeQuoteBtn = document.querySelector(".change-quote");
let randomNumber;
let randomQuote;

async function getQuotes(num) {
  const quotes = "quotes.json";
  const res = await fetch(quotes);
  const data = await res.json();

  randomNumber = num;
  randomQuote = randomNumber;
  if (stateLocal) {
    if (stateLocal.language === "ru-RU") {
      randomQuote += 102;
    } else {
      randomQuote = randomNumber;
    }
  } else {
    if (state.language === "ru-RU") {
      randomQuote += 102;
    } else {
      randomQuote = randomNumber;
    }
  }
  quoteContainer.textContent = `"${data.quotes[randomQuote].quote}"`;
  authorContainer.textContent = data.quotes[randomQuote].author;
}

getQuotes(getRandomNum(102));

changeQuoteBtn.addEventListener("click", () => {
  getQuotes(getRandomNum(102));
});

//_________________________________________________Player_______________

const audioTitle = document.querySelector(".audio__title");
const playButton = document.querySelector(".play");
const playPrev = document.querySelector(".play-prev");
const playNext = document.querySelector(".play-next");
const progressBarVolume = document.querySelector(".progress-bar-volume");
const progressBar = document.querySelector(".progress-bar");
const seek = document.querySelector(".seek");
const seekTooltip = document.querySelector(".seek-tooltip");
const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");
const volumeButton = document.querySelector(".volume-button");
const audioPlayList = document.querySelector(".play-list");

let audioIndex = 0;
let queueAudio = [];

const audio = new Audio();

function loadTrack(index) {
  audio.src = playList[index].src;
  audioTitle.innerHTML = `${index + 1}. ${playList[index].title}`;
  audio.load();
}

loadTrack(audioIndex);

function buildPlayList() {
  playList.forEach((el, index) => {
    const li = document.createElement("li");
    li.classList = "audioList";
    const btn = document.createElement("div");
    btn.classList = "audio-btn play";

    li.append(
      btn,
      (audioTitle.innerHTML = `${index + 1}. ${playList[index].title}`)
    );

    audioPlayList.append(li);

    queueAudio.push(btn);
  });
}

buildPlayList();

function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

function playAudioFromList(index) {
  audioIndex = index;

  loadTrack(audioIndex);
  togglePlay();
  updatePlayButton();
}

function playPrevAudio() {
  if (audioIndex !== 0) {
    audioIndex -= 1;
  } else {
    audioIndex = playList.length - 1;
  }

  loadTrack(audioIndex);
  togglePlay();
  updatePlayButton();
}

function playNextAudio() {
  if (audioIndex !== playList.length - 1) {
    audioIndex += 1;
  } else {
    audioIndex = 0;
  }

  loadTrack(audioIndex);
  togglePlay();
  updatePlayButton();
}

function updatePlayButton() {
  queueAudio.forEach((item) => {
    item.classList.remove("pause");
  });

  if (audio.paused || audio.ended) {
    playButton.classList.remove("pause");
    playButton.setAttribute("data-title", "Play");
  } else {
    playButton.classList.add("pause");
    queueAudio[audioIndex].classList.add("pause");
    playButton.setAttribute("data-title", "Pause");
  }
}

function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

function initializeAudio() {
  const audioDuration = Math.round(audio.duration);
  seek.setAttribute("max", audioDuration);
  progressBar.setAttribute("max", audioDuration);

  const time = formatTime(audioDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);

  audio.volume = volume.value;
  progressBarVolume.value = volume.value;
}

function updateTimeElapsed() {
  const time = formatTime(Math.round(audio.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}

function updateProgress() {
  seek.value = audio.currentTime;
  progressBar.value = audio.currentTime;
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
  audio.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

function updateVolume() {
  if (audio.muted) {
    audio.muted = false;
  }

  audio.volume = volume.value;
  progressBarVolume.value = volume.value;
}

function updateVolumeIcon() {
  volumeButton.setAttribute("data-title", "Mute");

  if (audio.muted || audio.volume === 0) {
    volumeButton.classList.add("mute");
    volumeButton.setAttribute("data-title", "Unmute");
  } else if (audio.volume > 0 && audio.volume < 0.5) {
    volumeButton.classList.add("average-volume");
    volumeButton.classList.remove("mute");
  } else {
    volumeButton.classList.remove("mute");
    volumeButton.classList.remove("average-volume");
  }
}

function toggleMute() {
  audio.muted = !audio.muted;

  if (audio.muted) {
    volume.setAttribute("data-volume", volume.value);
    volume.value = 0;
    progressBarVolume.value = volume.value;
  } else {
    volume.value = volume.dataset.volume;
    progressBarVolume.value = volume.value;
  }
}

playButton.addEventListener("click", togglePlay);
playPrev.addEventListener("click", playPrevAudio);
playNext.addEventListener("click", playNextAudio);
audio.addEventListener("ended", playNextAudio);
playButton.addEventListener("click", updatePlayButton);
audio.addEventListener("loadedmetadata", initializeAudio);
audio.addEventListener("timeupdate", updateProgress);
seek.addEventListener("mousemove", updateSeekTooltip);
seek.addEventListener("input", skipAhead);
audio.addEventListener("timeupdate", updateTimeElapsed);
volume.addEventListener("input", updateVolume);
audio.addEventListener("volumechange", updateVolumeIcon);
volumeButton.addEventListener("click", toggleMute);

queueAudio.forEach((el, i) => {
  el.addEventListener("click", () => {
    playAudioFromList(i);
  });
});

// ___________________  Settings  ________________________

const settingsBtn = document.querySelector(".settings__btn");
const popup = document.querySelector(".popup");
const inputListCheckbox = popup.querySelectorAll(".input-list-checkbox");
const inputListRadioLang = popup.querySelectorAll("input[name='language']");
const inputListRadioSource = popup.querySelectorAll("input[name='source']");
const settingsList = Array.from(popup.querySelectorAll(".set-list"));
const player = document.querySelector(".player");
const weather = document.querySelector(".weather");
const greetingContainer = document.querySelector(".greeting-container");
const quotesWrapper = document.querySelector(".quotes__wrapper");

// Массив на уже существующих элементах + новые
const blocks = [time, date, greetingContainer, quotesWrapper, weather, player];

function togglePopup() {
  popup.classList.toggle("hidden");
  settingsBtn.classList.toggle("_active");
}

inputListCheckbox.forEach((el, i) => {
  if (stateLocal) {
    if (!stateLocal.blocks[keys[i]]) {
      el.checked = false;
      blocks[i].classList.add("hidden");
    }
  }

  el.addEventListener("click", () => {
    if (stateLocal) {
      changeObjectValue(stateLocal, i);
    } else {
      changeObjectValue(state, i);
    }
    blocks[i].classList.toggle("hidden");
  });
});

inputListRadioLang.forEach((el, i) => {
  if (stateLocal) {
    if (stateLocal.language === "ru-RU" && i === 1) {
      el.checked = true;
      changeSettingsLang();
    }
  }
  el.addEventListener("click", () => {
    if (stateLocal) {
      changeLang(stateLocal, i);
    } else {
      changeLang(state, i);
    }
    city.value === "Minsk" ? (city.value = "Минск") : (city.value = "Minsk");
    setGreeting();
    changeWeatherLang();
    getWeather();
    getQuotes(randomNumber);
    changeSettingsLang();
  });
});

inputListRadioSource.forEach((el, i) => {
  if (stateLocal) {
    if (stateLocal.photoSource === 2 && i === 1) {
      el.checked = true;
      getLinkToImage();
    } else if (stateLocal.photoSource === 3 && i === 2) {
      el.checked = true;
      getLinkToImage2();
    } else {
      setBg();
    }
  }
  el.addEventListener("click", () => {
    if (stateLocal) {
      changeSource(stateLocal, i);
    } else {
      changeSource(state, i);
    }
    chooseSource(tag);
  });
});

function changeObjectValue(object, index) {
  object.blocks[keys[index]]
    ? (object.blocks[keys[index]] = false)
    : (object.blocks[keys[index]] = true);
}

function changeLang(object, index) {
  if (index === 0) {
    object.language = "en-US";
  } else {
    object.language = "ru-RU";
  }
}

function changeSource(object, index) {
  if (index === 0) {
    object.photoSource = 1;
  } else if (index === 1) {
    object.photoSource = 2;
  } else {
    object.photoSource = 3;
  }
}

function changeWeatherLang() {
  if (stateLocal) {
    if (stateLocal.language === "ru-RU") {
      weatherLang.lang = "ru";
      weatherLang.wind = "Скорость ветра";
      weatherLang.humidity = "Влажность";
      weatherLang.speed = "м/с";
    } else {
      weatherLang.lang = "en";
      weatherLang.wind = "Wind speed";
      weatherLang.humidity = "Humidity";
      weatherLang.speed = "m/s";
    }
  } else {
    if (state.language === "ru-RU") {
      weatherLang.lang = "ru";
      weatherLang.wind = "Скорость ветра";
      weatherLang.humidity = "Влажность";
      weatherLang.speed = "м/с";
    } else {
      weatherLang.lang = "en";
      weatherLang.wind = "Wind speed";
      weatherLang.humidity = "Humidity";
      weatherLang.speed = "m/s";
    }
  }
}

function changeSettingsLang() {
  if (stateLocal) {
    if (stateLocal.language === "ru-RU") {
      saveSettingRu();
    } else {
      saveSettingEn();
    }
  } else {
    if (state.language === "ru-RU") {
      saveSettingRu();
    } else {
      saveSettingEn();
    }
  }
}

function saveSettingEn() {
  settingsList.forEach((el, i) => {
    el.textContent = settingText[i];
  });
}

function saveSettingRu() {
  settingsList.forEach((el, i) => {
    el.textContent = settingText[i + 10];
  });
}

settingsBtn.addEventListener("click", togglePopup);

// ! Отдельный модуль

function setLocalStorage() {
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
  localStorage.setItem("tag", tagElem.value);

  if (stateLocal) {
    localStorage.setItem("stateLocal", JSON.stringify(stateLocal));
  } else {
    stateLocal = JSON.stringify(state);
    localStorage.setItem("stateLocal", stateLocal);
  }
}

window.addEventListener("beforeunload", setLocalStorage);

// !

// alert(
//   "Извиняюсь за такие просьбы, но дайте, пожалуйста, больше времени на то, чтобы доделать проект. Так получилось, что не вовремя заболел, а доделать ради опыта хотелось. Удачи в обучении"
// );
