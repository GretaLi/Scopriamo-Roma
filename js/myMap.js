import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

const redirectUrl = location.href;

let userId = parseInt(localStorage.getItem("userId"));

if (!userId) {
  window.location.replace(`./signin.html?redirectUrl=${redirectUrl}`);
}

// 1. axios prepare data
const baseUrl = "https://json-server-render-roma.onrender.com";

init();
function init() {
  setUserMenuBtn();
  localLoginChecker();

  axios
    .get(`${baseUrl}/bookmarks?userId=${userId}&_expand=attraction`)
    .then(function (response) {
      let data = response.data;
      renderInfo(data);
    });
}

// 2. leafletjs & openstreetmap
const map = L.map("map").setView([41.89295, 12.482199], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function renderInfo(data) {
  const sidebar = L.control.sidebar("sidebar", {
    position: "right",
  });
  map.addControl(sidebar);

  setTimeout(function () {
    sidebar.show();
  }, 300);

  const defaultInfo = data[0];
  DOMinfo(defaultInfo);

  data.forEach((item) => {
    // console.log(item);
    const x = Number(item.attraction.x);
    const y = Number(item.attraction.y);

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
}
function DOMinfo(item) {
  const renderText = (el, text) => {
    document.querySelector(el).innerHTML = text;
  };
  renderText(
    "#sidebar-title-it",
    item.attraction.name_it.replace("\n", "<br/>")
  );
  renderText(
    "#sidebar-title-zh",
    item.attraction.name_zh.replace("\n", "<br/>")
  );
  renderText("#panel-opentime", item.attraction.opentime);
  renderText("#panel-ticket", item.attraction.entranceFee);
  document
    .querySelector("#sidebar-img")
    .setAttribute("src", item.attraction.imgUrl);
  document
    .querySelector("#sidebar-page-link")
    .setAttribute("href", `./details.html?id=${item.attraction.id}`);
  document
    .querySelector("#sidebar-map-link")
    .setAttribute(
      "href",
      `https://www.google.com.tw/maps/search/${item.attraction.location}`
    );
}
