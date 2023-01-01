import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

// 0. DOM
const cardContainer = document.querySelector("#card-container");
const searchForm = document.querySelector("#search-form");
const periodTags = document.querySelector("#period-tags");
const emptyNote = document.querySelector(".attraction__empty");
const mapToggle = document.querySelector("#map-toggle");
const mapEl = document.querySelector("#map");
let periodArr = [];

// 1. handler
searchForm.addEventListener("submit", renderCardbySearch);
searchForm.addEventListener("change", renderCardbySelect);
periodTags.addEventListener("click", removePeriodTag);

function eventListener() {
  cardContainer.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("bookmark")) {
      const attractionId = target.getAttribute("data-attractionid");
      const bookmarkId = target.getAttribute("data-bookmark-id");
      executeBookmark(attractionId, bookmarkId);
    }
  });

  mapToggle.addEventListener("click", (e) => {
    mapEl.classList.toggle("active");
    cardContainer.classList.toggle("hidden");
    document.querySelector(".container").classList.toggle("open-map");
  });
}

// 2. axios prepare data
const baseUrl = "https://json-server-render-roma.onrender.com";
let data = [];

setUserMenuBtn();
localLoginChecker();
init();
function init() {
  axios
    .get(`${baseUrl}/attractions?_embed=bookmarks`)
    .then(function (response) {
      console.log(response);
      data = response.data;
      renderCard(data);
      eventListener();
      renderCardbyLink();
      renderMapInfo(data);
    });
}

// 3. funcitons
function renderCard(dataArr) {
  if (dataArr.length == 0) {
    emptyNote.classList.add("active");
    mapEl.classList.remove("active");
  } else {
    emptyNote.classList.remove("active");
  }
  let cardHTML = ``;

  dataArr.forEach((data) => {
    const isAddedbyUser = data.bookmarks.filter((item) => {
      return item.userId === parseInt(localStorage.getItem("userId"));
    });
    let isAddedAttr = ``;
    let bookmarkIdAttr = ``;

    if (isAddedbyUser.length > 0) {
      isAddedAttr = `data-isAdded="true"`;
      bookmarkIdAttr = `data-bookmark-id="${isAddedbyUser[0].id}"`;
    }

    cardHTML += `
        <li class="card">
        <span data-attractionid="${
          data.id
        }" ${isAddedAttr} ${bookmarkIdAttr} class="bookmark material-symbols-outlined">bookmark</span>
            <a href="./details.html?id=${data.id}">
              <div class="card__img">
                <img src="${data.imgUrl}" alt="${data.name_it}" />            
              </div>
              <div class="card__text">
                <h3>${data.name_zh.replace("\n", "<br/>")}</h3>
              </div>
            </a>
        </li>`;
  });
  cardContainer.innerHTML = cardHTML;
}

function renderCardbySelect() {
  const category = document.querySelector("#category").value;
  const period = document.querySelector("#period").value;

  if (period === "all") {
    periodArr = ["古羅馬", "中世紀", "文藝復興", "近代", "現代", "當代"];
    let periodTagsHtml = "";
    periodArr.forEach((tag) => {
      periodTagsHtml += `<div class="tag" data-tag="${tag}">${tag}<span class="material-symbols-outlined">
      close</span></div>`;
    });
    periodTags.innerHTML = periodTagsHtml;
  }

  if (!periodArr.includes(period) && period !== "all") {
    periodArr.push(period);
    periodTags.innerHTML += `<div class="tag" data-tag="${period}">${period}<span class="material-symbols-outlined">
    close</span></div>`;
  }

  let selectedDataArr = getSelectedDataArr(category, periodArr);
  renderCard(selectedDataArr);
  renderMapInfo(selectedDataArr);
}

function removePeriodTag(e) {
  if (e.target.classList.contains("tag")) {
    const category = document.querySelector("#category").value;
    const tag = e.target.getAttribute("data-tag");

    Array.prototype.remove = function (value) {
      this.splice(this.indexOf(value), 1);
    };

    periodArr.remove(tag);
    e.target.remove();

    let selectedDataArr = getSelectedDataArr(category, periodArr);
    renderCard(selectedDataArr);
  }
}

function renderCardbyLink() {
  const getUrlString = location.href; // ?category=歷史遺跡
  const url = new URL(getUrlString);
  const qCategory = url.searchParams.get("category"); // 歷史遺跡

  if (qCategory) {
    document.querySelector(`[value="${qCategory}"]`).selected = true;
    let selectedDataArr = getSelectedDataArr(qCategory, [
      "古羅馬",
      "中世紀",
      "文藝復興",
      "近代",
      "現代",
      "當代",
    ]);
    renderCard(selectedDataArr);
    renderMapInfo(selectedDataArr);
  }
}

function getSelectedDataArr(category, periods) {
  let selectedDataArr = data;

  if (category === "all" && periods.length === 6) {
    return selectedDataArr;
  }

  if (category === "all") {
    return filteredPeriod(selectedDataArr);
  }

  // when category is selected, filter data by period
  selectedDataArr = selectedDataArr.filter((item) => {
    return item.category === category;
  });

  selectedDataArr = filteredPeriod(selectedDataArr);

  function filteredPeriod() {
    const filteredDataArr = [];
    periods.forEach((period) => {
      selectedDataArr.forEach((item) => {
        if (item.period.includes(period) && !filteredDataArr.includes(item)) {
          filteredDataArr.push(item);
        }
      });
    });
    return filteredDataArr;
  }

  return selectedDataArr;
}

function renderCardbySearch(e) {
  e.preventDefault();
  const queryStr = document.querySelector("#search-text").value;
  const category = document.querySelector("#category").value;

  let selectOptions = "";
  if (category !== "all") {
    selectOptions += `&category=${category}`;
  }

  axios
    .get(
      `${baseUrl}/attractions?q=${queryStr}${selectOptions}&_embed=bookmarks`
    )
    .then(function (response) {
      console.log(response);
      let data = response.data;
      renderCard(data);
      renderMapInfo(data);
    });
}

// bookmark
// POST /bookmarks 景點收藏

function executeBookmark(attractionId, bookmarkId) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    Swal.fire({
      position: "center",
      title: "請先登入",
      showConfirmButton: false,
      width: "20em",
      padding: "2em 4em 3em",
      timer: 1500,
      background: "hsl(var(--clr-light))",
      iconColor: "hsl(var(--clr-accent),.8)",
      color: "hsl(var(--clr-dark))",
      customClass: {
        title: "fw-med",
        container: "left-80px",
      },
    });
    return;
  }

  if (!bookmarkId) {
    console.log("加入收藏");
    axios
      .post(
        `${baseUrl}/600/bookmarks`,
        {
          attractionId: parseInt(attractionId),
          userId: parseInt(userId),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (bookmarkId) {
    console.log("移除收藏");
    axios
      .delete(`${baseUrl}/600/bookmarks/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        init();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// 4. leafletjs & openstreetmap
const map = L.map("map").setView([41.89295, 12.482199], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
console.log(map);

function renderMapInfo(data) {
  const sidebar = L.control.sidebar("map-sidebar", {
    position: "right",
  });
  map.addControl(sidebar);

  setTimeout(function () {
    sidebar.show();
  }, 300);

  data.forEach((item) => {
    const x = Number(item.x);
    const y = Number(item.y);

    let marker = L.marker([x, y])
      .addTo(map)
      .on("click", () => {
        let visible = sidebar.isVisible();
        if (!visible) {
          sidebar.toggle();
        }
        DOMinfo(item);
      });
    marker._icon.classList.add("huechange");
  });

  // default info
  DOMinfo(data[0]);
}
function DOMinfo(item) {
  const renderText = (el, text) => {
    document.querySelector(el).innerHTML = text;
  };
  renderText("#sidebar-title-it", item.name_it.replace("\n", "<br/>"));
  renderText("#sidebar-title-zh", item.name_zh.replace("\n", "<br/>"));
  renderText("#panel-opentime", item.opentime);
  renderText("#panel-ticket", item.entranceFee);
  document.querySelector("#sidebar-img").setAttribute("src", item.imgUrl);
  document
    .querySelector("#sidebar-page-link")
    .setAttribute("href", `./details.html?id=${item.id}`);
  document
    .querySelector("#sidebar-map-link")
    .setAttribute(
      "href",
      `https://www.google.com.tw/maps/search/${item.location}`
    );
}
