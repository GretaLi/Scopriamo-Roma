import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

//axios prepare data
const baseUrl = "https://json-server-vercel-main.vercel.app";
let mapData = [];

init();
function init() {
  setUserMenuBtn();
  localLoginChecker();

  axios.get(`${baseUrl}/rione`).then(function (response) {
    mapData = response.data;
    // console.log(mapData);
  });
}

// DOM
const map = document.querySelector(".map__roma");
const mapContainer = document.querySelector(".map");
const allRioni = document.querySelectorAll(".map__roma path");
const mapLocation = document.querySelector("#mapLocation");
const mapCard = document.querySelector("#mapCard");
const rioneBg = document.querySelector(".map__rione-bg");
const mapCardIntro = document.querySelector(".card__inner-intro");
const mapHandler = document.querySelector("#map-pagination");

const mapHeight = map.clientHeight;
const mapWidth = map.clientWidth;

// Handler
mapContainer.addEventListener("click", resetMapStyle);
map.addEventListener("mouseenter", styleOnMapWhenMouseenter);
map.addEventListener("mouseleave", styleOnMapWhenMouseleave);
map.addEventListener("click", styleOnMap);
map.addEventListener("mousemove", movementOnMap);
map.addEventListener("click", renderSelectedCard);
mapHandler.addEventListener("click", renderSelectedCardbyBtn);

// Functions
function resetMapStyle(e) {
  if (
    e.target.getAttribute("data-rione") ||
    e.target.classList.contains("map__pagination-btn")
  ) {
    return;
  }
  map.classList.remove("active");
  map.style.transform = `scale(1)`;
  allRioni.forEach((rione) => {
    rione.classList.remove("sibling-rioni");
    rione.classList.remove("active");
  });

  mapCardIntro.classList.add("active");
  mapCard.classList.remove("active");
  rioneBg.style.background = ``;
  mapLocation.textContent = `SELECT A RIONE`;
  mapLocation.classList.remove("active");
}

function styleOnMapWhenMouseenter() {
  allRioni.forEach((rione) => {
    rione.classList.add("sibling-rioni");
  });
}

function styleOnMapWhenMouseleave() {
  map.style.top = 0;
  map.style.left = 0;

  if (!map.classList.contains("active")) {
    map.style.transform = `scale(1)`;
    allRioni.forEach((rione) => {
      rione.classList.remove("sibling-rioni");
    });
  }

  mapLocation.textContent = `SELECT A RIONE`;
  mapLocation.classList.remove("active");
}

function styleOnMap(e) {
  if (!e.target.getAttribute("data-rione")) {
    return;
  }
  allRioni.forEach((rione) => {
    rione.classList.remove("active");
  });
  map.classList.add("active");
  e.target.classList.add("active");
  // indexId = e.target.id;
}

function movementOnMap(e) {
  const x = e.offsetX / mapWidth;
  const y = e.offsetY / mapHeight;

  let left;
  let top;
  x < 0.5 ? (left = x * 4) : (left = -x * 4);
  y < 0.5 ? (top = y * 4) : (top = -y * 4);
  map.style.transform = `translate3d(${left}em, ${top}em, 0) scale(1.25)`;

  let currentLocation = e.target.getAttribute("data-rione");
  mapLocation.textContent = currentLocation;
  mapLocation.classList.add("active");
}

function renderSelectedCard(e) {
  const targetId = e.target.id;
  const id = targetId.slice(5, targetId.length);
  const selectedData = getSelectedData(id);
  renderCard(selectedData);
}

function renderSelectedCardbyBtn(e) {
  let indexId = 0;
  // if any rione path is active
  const previousRione = document.querySelector("path.active");
  if (previousRione) {
    indexId = parseInt(previousRione.id.slice(5, previousRione.id.length));
  }

  // remove active from all rione path
  Array.from(map.children).forEach((rione) => {
    rione.classList.remove("active");
  });

  let locationHTML = "";

  // click on prev btn
  if (e.target.id === "map-btn-prev") {
    indexId <= 1 ? (indexId = map.childElementCount) : indexId--;
  }

  // click on next btn
  if (e.target.id === "map-btn-next") {
    indexId >= map.childElementCount ? (indexId = 1) : indexId++;
  }

  // console.log(indexId);
  const curretRione = document.querySelector(`#rione${indexId}`);
  curretRione.classList.add("active");

  const selectedData = getSelectedData(`${indexId}`);
  renderCard(selectedData);

  locationHTML = curretRione.getAttribute("data-rione");
  mapLocation.innerHTML = locationHTML;
  mapLocation.classList.add("active");
}

function getSelectedData(id) {
  const selectedData = mapData.filter((data) => {
    return data.id === parseInt(id);
  });
  return selectedData;
}

function renderCard(data) {
  let recommentHTML = ``;
  data[0].recommend.forEach((tag) => {
    recommentHTML += `<div class="tag">${tag}</div>`;
  });

  const mapCardHTML = `
      <h2>${data[0].rione_it}</h2>
      <img src="${data[0].imgUrl}" alt="${data[0].imgAlt}">
      <p>${data[0].description}</p>
      <h3>此區推薦景點</h3>
      <div class="tags">${recommentHTML}</div>
    `;

  mapCardIntro.classList.remove("active");
  mapCard.classList.add("active");
  mapCard.innerHTML = mapCardHTML;
  rioneBg.style.background = `url(${data[0].imgBgUrl})`;
}
