import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

const redirectUrl = location.href;

let userId = parseInt(localStorage.getItem("userId"));
let userName = localStorage.getItem("userName");
let avatar = localStorage.getItem("avatar");

if (!userId) {
  window.location.replace(`./signin.html?redirectUrl=${redirectUrl}`);
}

// 0. DOM
const cardContainer = document.querySelector("#card-container");
const searchForm = document.querySelector("#search-form");

// 1. handler

// 2. axios prepare data
const baseUrl = "https://json-server-vercel-main.vercel.app";
let data = [];

init();
function init() {
  setUserMenuBtn();
  localLoginChecker();

  axios
    .get(`${baseUrl}/bookmarks?userId=${userId}&_expand=attraction`)
    .then(function (response) {
      data = response.data;
      console.log(data);
      renderCard(data);
      // eventListener();
    });
}

// 3. funcitons
function renderCard(dataArr) {
  let cardHTML = ``;
  dataArr.forEach((data) => {
    cardHTML += `
        <li class="card">
        <span data-attractionid="${
          data.attraction.id
        }" data-isAdded="true" class="bookmark material-symbols-outlined">bookmark</span>
            <a href="./details.html?id=${data.attraction.id}">
              <div class="card__img">
                <img src="${data.attraction.imgUrl}" alt="${
      data.attraction.name_it
    }" />
              </div>
              <div class="card__text">
                <h3>${data.attraction.name_zh.replace("\n", "<br/>")}</h3>
              </div>
            </a>
        </li>`;
  });
  cardContainer.innerHTML = cardHTML;
}
