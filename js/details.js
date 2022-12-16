// details.js
import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

const getUrlString = location.href; // details.html?id=1
const url = new URL(getUrlString);
const redirectUrl = getUrlString;
const attractionId = parseInt(url.searchParams.get("id"));

let userId = parseInt(localStorage.getItem("userId"));
let userName = localStorage.getItem("userName");
let avatar = localStorage.getItem("avatar");

const baseUrl = "https://json-server-vercel-main.vercel.app";

const sliderArr = [];

init();
function init() {
  setUserMenuBtn();
  localLoginChecker();
  getDetailsData();
  getCommentsData();
}

// template START
const templateOfIntro = (data) => {
  let tags = data.period;
  let tagsHtml = `<p class="tag">${data.category}</p>`;

  data.period.forEach((tag) => {
    tagsHtml += `<p class="tag">${tag}</p>`;
  });

  return `
  <section
  class="intro"
  style="background-image: url(${data.imgBgUrl});"
  >
  <div class="container"> 
    <header>
      <h2 class="intro_title">${data.name_it.replace("\n", "<br/>")}
      <span>${data.name_zh.replace("\n", "<br/>")}</span></h2>
      <div class="tags">
        ${tagsHtml}
      </div>
    </header>
    <div class="intro__weather">
        <p class="intro__weather-degree"><i class="fa-solid fa-temperature-three-quarters"></i>25-26°C</p>
        <p class="intro__weather-humid"><i class="fa-solid fa-droplet"></i>30%</p>
    </div>
  </div>
  </section>
`;
};

const templateOfVisit = (data) => {
  let linkBtnsHtml = "";
  data.websites.forEach((item) => {
    linkBtnsHtml += `
    <a
      class="btn btn-link"
      target="_blank"
      href="${item.url}"
      ><span class="material-symbols-outlined">
      arrow_outward
      </span> ${item.title}
    </a>
    `;
  });
  return `
<section class="visit">
  <div class="container">
    <article>

      <div class="visit__description">
        <h2 class="section-title">參觀資訊<span>VISITA</span></h2>
        <p>${data.description.replace("\n", "<br/>")}</p>
      </div>

      <div class="visit__info">
        <div id="tabs-container" class="tabs" role="tablist" aria-label="Information Tabs">
          <h3 id="tab-opentime" class="tab active" role="tab" aria-selected="true" aria-controls="panel-opentime" tabindex="0">開放時間 Orari</h3>
          <h3 id="tab-tickets" class="tab" role="tab" aria-selected="false" aria-controls="panel-ticket" tabindex="0">門票售價 Biglietti</h3>
        </div>
        <div>
          <div id="panel-opentime" class="tab-panel active" role="tabpanel" tabindex="" aria-labelledby="tab-opentime">${
            data.opentime
          }
          </div>
          <div id="panel-ticket" class="tab-panel" role="tabpanel" tabindex="" aria-labelledby="tab-tickets">${
            data.entranceFee
          }
          </div>
        </div>
      </div>

    </article>

    <aside>
      <div class="visit__bookmark">
        <span id="bookmark-btn" data-attractionid="${
          data.id
        }" class="material-symbols-outlined">
        bookmark
        </span>
      </div>
      <div class="visit__location">
        <div class="visit__location-add"><span class="material-symbols-outlined">
        map
        </span><p>${data.address}</p></div>
        <div class="visit__location-map" id="map"></div>
      </div>
      <div class="visit__link">
        ${linkBtnsHtml}
        <a target="_blank" href="https://www.google.com.tw/maps/search/${
          data.location
        }" class="btn btn-link"
          ><span class="material-symbols-outlined"> near_me </span>Google Map</a
        >
      </div>
    </aside>
  </div>
</section>
`;
};

const templateOfTour = (data) => {
  let sliderInnerHTML = ``;
  data.virtualTours.forEach((item) => {
    sliderArr.push(item);
    sliderInnerHTML += `
    <div class="swiper-slide">
      <img class="active" src="${item.imgUrl}" />
      <iframe src="" data-streetView-url="${item.streetView}" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="loading"><div class="loading-item"></div></div>
    </div>
    `;
  });

  return `<section class="virtrul-tour">
          <div class="container">
            <h2 class="section-title">虛擬導覽 <span>Turismo Digitale</span></h2>
            <div class="slider">
              <div class="slider__toggle">
                <i class="fa-solid fa-image"></i>
                    <div class="button" id="button-10">
                      <input id="slider-toggle" name="sliderView" type="checkbox" class="checkbox" />
                      <div class="knobs">
                        <span>圖片</span>
                      </div>
                    </div>
                <i class="fa-solid fa-street-view"></i>
              </div>
              <div class="slider__inner">
                <div class="slider__innerinner swiper mySwiper">
                  <div class="slider__display active swiper-wrapper" id="slider-display">
                    ${sliderInnerHTML}
                  </div>
                  <div id="slider-pagination" class="slider__pagination swiper-pagination">
                    
                  </div>
                </div>

                <article class="slider__info" id="slider-info">
                  <header>
                    <h3 id="slider-tltle-zh">${data.virtualTours[0].title_zh}</h3>
                    <p id="slider-tltle-it">${data.virtualTours[0].title_it}</p>
                    <p id="slider-subtitle">${data.virtualTours[0].subtitle}</p>
                  </header>
                  <p id="slider-description">${data.virtualTours[0].description}</p>
                </article>
              </div>
            </div>
          </div>
        </section>
`;
};

const templateOfComment = (data) => {
  let editBtn = "";

  let commentIdAttr = `data-comment-id="${data.id}"`;
  if (parseInt(data.userId) === userId) {
    editBtn = `<span id="comment-edit-btn" class="edit-btn material-symbols-outlined" ${commentIdAttr}>edit</span>`;
  }

  const commentLikedbyUserArr = data.comments_likes.filter((item) => {
    return item.userId == userId;
  });

  let commentLikeAttr = `data-isLiked= "false"`;
  let commentLikeIdAttr = "";
  if (commentLikedbyUserArr.length > 0) {
    commentLikeAttr = `data-isLiked= "true"`;
    commentLikeIdAttr = `data-like-id="${commentLikedbyUserArr[0].id}"`;
  }

  return `<div class="column-item comment__card">
              ${editBtn}
            <div class="comment__card-user">
              <img
                id="comment-user-img"
                src="${data.user.imgUrl}"
                alt=""
              />
              <div>
                <p id="comment-name">${data.user.name}</p>
                <p id="comment-time">${new Date(data.timestamp * 1000)
                  .toLocaleString()
                  .substring(0, 10)}</p>
              </div>
            </div>
            <p class="comment__card-text">${data.content}</p>
            <div class="comment__card-like">
              <span ${commentLikeIdAttr} ${commentLikeAttr} ${commentIdAttr} class="like-btn material-symbols-outlined">
              thumb_up_off
              </span>
              <p><span id="like-counter-el">${
                data.comments_likes.length
              }</span>人覺得有幫助</p>
            </div>
          </div>`;
};
// template END

// get data START
function getDetailsData() {
  axios
    .get(`${baseUrl}/attractions/${attractionId}?_embed=virtualTours`)
    .then(function (response) {
      let data = response.data;
      // render when loading
      // console.log(data);
      render(data);
      eventListener();
      checkBookmark(attractionId, userId);
    });
}

function getCommentsData() {
  axios
    .get(
      `${baseUrl}/comments?attractionId=${attractionId}&_expand=user&_embed=comments_likes`
    )
    .then(function (response) {
      let commentDataArr = response.data;
      // console.log(commentDataArr);
      // render when loading
      renderComment(commentDataArr);
    });
}

function eventListener() {
  document.body.addEventListener("click", (e) => {
    const target = e.target;

    // tabs
    if (target.classList.contains("tab")) {
      const tabs = target.parentElement.children;
      for (let tab of tabs) {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      }
      target.classList.add("active");
      target.setAttribute("aria-selected", "true");

      const panelId = target.getAttribute("aria-controls");
      const currentPanel = document.querySelector(`#${panelId}`);
      const panels = currentPanel.parentElement.children;
      for (let panel of panels) {
        panel.classList.remove("active");
      }
      currentPanel.classList.add("active");
    }
    // bookmarks
    if (target.id === "bookmark-btn") {
      let isLiked = target.getAttribute("data-isAdded");
      let bookmarkId = target.getAttribute("data-bookmark-id");
      if (isLiked == "false") {
        executeBookmark(attractionId, userId, bookmarkId);
        target.setAttribute("data-isAdded", "true");
      } else {
        executeBookmark(attractionId, userId, bookmarkId);
        target.setAttribute("data-isAdded", "false");
      }
    }

    // image/streetview toggle

    if (target.id === "slider-toggle") {
      const images = document.querySelectorAll(".swiper-slide img");
      const streetViews = document.querySelectorAll(".swiper-slide iframe");
      console.log(images);
      console.log(streetViews);
      images.forEach((img) => img.classList.toggle("active"));
      streetViews.forEach((item) => {
        item.classList.toggle("active");
        const streetViewUrl = item.getAttribute("data-streetView-url");
        item.setAttribute("src", streetViewUrl);
        if (item.classList.contains("active")) {
          item.nextElementSibling.style.display = "flex";
        } else {
          item.nextElementSibling.style.display = "none";
        }
      });
    }

    // comment
    if (target.id === "comment-modal-btn") {
      e.preventDefault();
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
      document.querySelector("#comment-modal").style.display = "flex";
      document.querySelector("#comment-user-name").textContent = userName;
      document
        .querySelector("#comment-user-avatar")
        .setAttribute("src", avatar);
    }

    if (target.classList.contains("close-modal-btn")) {
      const commentModal = target.parentElement.parentElement.parentElement;
      commentModal.style.display = "none";
    }

    if (target.id === "comment-submit-btn") {
      e.preventDefault();
      const commentForm = document.querySelector("#comment-form");
      postComment(commentForm);
    }

    if (target.id === "comment-edit-btn") {
      const commentId = target.getAttribute("data-comment-id");
      renderEditCommentModal(commentId);
    }

    if (target.id === "comment-submit-edit-btn") {
      e.preventDefault();
      const commentId = target.getAttribute("data-comment-id");
      const commentEditForm = target.parentElement.parentElement;
      editComment(commentId, commentEditForm);
    }

    if (target.id === "comment-delete-btn") {
      const commentId = target.getAttribute("data-comment-id");
      renderDeleteCommentModal(commentId);
    }

    // comment like
    if (target.classList.contains("like-btn")) {
      let likeId = target.getAttribute("data-like-id");
      let commentId = target.getAttribute("data-comment-id");
      checkLike(commentId, likeId, userId);
    }
  });
  sliderGrab();
}
// get data END

// render START
const app = document.querySelector("#app");

function render(data) {
  console.log(data);
  app.innerHTML += templateOfIntro(data);
  app.innerHTML += templateOfVisit(data);
  app.innerHTML += templateOfTour(data);
  renderMap(data.x, data.y, data.name_zh);
  initSwiper();
}
function renderComment(commentDataArr) {
  let renderHtml = "";

  if (commentDataArr.length === 0) {
    document.querySelector("#comment-container").innerHTML =
      "成為第一個留言的人";
    return;
  }

  commentDataArr.forEach((item) => {
    renderHtml += templateOfComment(item);
  });
  document.querySelector("#comment-container").innerHTML = renderHtml;
}
function renderEditCommentModal(commentId) {
  console.log(avatar);
  axios
    .get(`${baseUrl}/comments/${parseInt(commentId)}`)
    .then(function (response) {
      const modal = document.createElement("div");
      modal.classList.add("comment__modal");
      modal.style.display = "flex";
      modal.innerHTML = `
    <form action="" class="comment__form edit">
      <div class="comment__card-user">
        <img src="${avatar}" alt="" />
        <div>
          <p class="comment__card-user-name">${userName}</p>
          <p class="comment__card-user-time">${new Date(
            response.data.timestamp * 1000
          )
            .toLocaleString()
            .substring(0, 10)}</p>
        </div>
      </div>
      <textarea
        id="comment-textarea"
        name="textarea"
        rows="10"
        placeholder="分享您在這個景點的親身體驗"
      >${response.data.content}</textarea>
      <label for="form-file" class="btn btn-dark"
        >新增照片<input id="form-file" type="file"
      /></label>
      <div class="img-container">
        <div class="img"></div>
        <div class="img"></div>
        <div class="img"></div>
      </div>
      <div class="btn-container">
        <input
        id="comment-delete-btn"
        type="button"
        class="btn btn-delete"
        value="刪除評論"
        data-comment-id="${commentId}"
        />
        <input
          type="button"
          class="btn btn-cancel close-modal-btn"
          value="取消"
        />
        <button
          id="comment-submit-edit-btn"
          type="submit"
          class="btn btn-action"
          data-comment-id="${commentId}"
        >
          更新評論
        </button>
      </div>
    </form>
  `;
      mainEl.appendChild(modal);
    });
}
function renderDeleteCommentModal(commentId) {
  swal
    .fire({
      title: "確定刪除評論嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "hsl(var(--clr-danger))",
      cancelButtonColor: "hsl(var(--clr-dark))",
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
      width: "25em",
      padding: "2em 3em",
      background: "hsl(var(--clr-light))",
      iconColor: "hsl(var(--clr-accent),.8)",
      color: "hsl(var(--clr-dark))",
      customClass: {
        title: "fw-med",
        confirmButton: "btn-danger",
        cancelButton: "btn-dark",
        container: "left-80px",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "此評論已刪除",
          showConfirmButton: false,
          width: "20em",
          padding: "3em 4em",
          timer: 1500,
          background: "hsl(var(--clr-light))",
          iconColor: "hsl(var(--clr-accent),.8)",
          color: "hsl(var(--clr-dark))",
          customClass: {
            title: "fw-med",
          },
        });
        deleteComment(commentId);
      }
    });
}

function initSwiper(data) {
  // initialize swiper
  const swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `
        <div class="${className}" data-slider-index="${index + 1}">
          <img class="slider-img" src="" />
        </div>`;
      },
    },
  });

  // render pagination img
  const sliderImgs = document.querySelectorAll(".slider-img");
  let i = 0;
  sliderImgs.forEach((img) => {
    img.setAttribute("src", sliderArr[i].imgUrl);
    i++;
  });

  // render info when slide change
  swiper.on("slideChange", function () {
    renderSliderInfo(this.activeIndex);
  });
}

function renderSliderInfo(activeIndex) {
  const currentDisplay = sliderArr[activeIndex];

  const sliderDOM = (el, text) => {
    document.querySelector(el).textContent = text;
    document.querySelector(el).classList.add("fadeIn");
    document
      .querySelector(el)
      .addEventListener("animationend", () =>
        document.querySelector(el).classList.remove("fadeIn")
      );
  };
  sliderDOM("#slider-tltle-zh", currentDisplay.title_zh);
  sliderDOM("#slider-tltle-it", currentDisplay.title_it);
  sliderDOM("#slider-subtitle", currentDisplay.subtitle);
  sliderDOM("#slider-description", currentDisplay.description);
}

function sliderGrab() {
  // grab to scroll on pagination
  const slider = document.querySelector("#slider-pagination");
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return; // stop the fn from running
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3;
    slider.scrollLeft = scrollLeft - walk;
  });
}

function renderMap(x, y, name) {
  const map = L.map("map").setView([x, y], 17);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let marker = L.marker([x, y]).addTo(map).bindPopup(name);
  marker._icon.classList.add("huechange");
}

// render END

// POST /bookmarks 景點收藏
// checkBookmark(attractionId, userId)
function checkBookmark(attractionId, userId) {
  if (!userId) {
    console.log("尚未登入");
    return;
  }

  axios
    .get(`${baseUrl}/bookmarks?attractionId=${attractionId}`)
    .then((response) => {
      // console.log(response.data);
      const data = response.data;
      let bookmark = {};

      data.forEach((item) => {
        // console.log("檢查中");
        if (item.userId == userId) {
          bookmark.isMarked = true; // 如 userId 相同代表已收藏過
          bookmark.id = item.id;
          // console.log("已收藏");
        }
      });
      return bookmark;
    })
    .then((bookmark) => {
      if (bookmark.isMarked) {
        let bookmarkBtn = document.querySelector("#bookmark-btn");
        bookmarkBtn.setAttribute("data-isAdded", "true");
        bookmarkBtn.setAttribute("data-bookmark-id", bookmark.id);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function executeBookmark(attractionId, userId, bookmarkId) {
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
  // console.log(!bookmarkId);

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
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// POST /comments 留言發表
// const commentObj = {
//   attractionId: 1,
//   userId: 3,
//   timestamp: Math.floor(new Date().getTime() / 1000.0),
//   content:
//     "超級推薦景點，館藏非常豐富，至少預留四個小時來逛逛，如果時間允許的話也可以安排一整天。\n目前線上預約購票的話 + 1 歐元免排隊，如果是在羅馬當地讀書的留學生記得拿出你的學生證免費換票入場！",
// };

// postComment(form);
function postComment(form) {
  const data = {
    attractionId: parseInt(attractionId),
    userId: parseInt(userId),
    timestamp: Math.floor(new Date().getTime() / 1000.0),
    content: form.textarea.value,
  };

  if (!data.content) {
    const commentForm = document.querySelector("#comment-form");
    const commentTextarea = document.querySelector("#comment-textarea");
    commentForm.classList.add("warn");
    commentTextarea.setAttribute("placeholder", "請在此輸入評論");

    setTimeout(() => {
      commentForm.classList.remove("warn");
      commentTextarea.setAttribute("placeholder", "分享您在這個景點的親身體驗");
    }, 3000);
    return;
  }

  axios
    .post(`${baseUrl}/644/comments`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "發布成功",
        showConfirmButton: false,
        width: "20em",
        padding: "3em 4em",
        timer: 1500,
        background: "hsl(var(--clr-light))",
        iconColor: "hsl(var(--clr-accent),.8)",
        color: "hsl(var(--clr-dark))",
        customClass: {
          title: "fw-med",
          container: "left-80px",
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// PATCH /comments/id 留言修改
// editComment(commentId, form)
function editComment(commentId, form) {
  const data = {
    content: form.textarea.value,
  };

  axios
    .patch(`${baseUrl}/600/comments/${commentId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "編輯成功",
        showConfirmButton: false,
        width: "20em",
        padding: "3em 4em",
        timer: 1500,
        background: "hsl(var(--clr-light))",
        iconColor: "hsl(var(--clr-accent),.8)",
        color: "hsl(var(--clr-dark))",
        customClass: {
          title: "fw-med",
          container: "left-80px",
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
//  DELETE /comments/id 留言刪除
// deleteComment(commentId)
function deleteComment(commentId) {
  axios
    .delete(`${baseUrl}/600/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

// POST /comments_likes 留言按讚

// checkLike(commentId, userId)
function checkLike(commentId, likeId, userId) {
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

  if (!likeId) {
    console.log("尚未按過讚，寫入資料");
    axios
      .post(
        `${baseUrl}/600/comments_likes`,
        {
          commentId: parseInt(commentId),
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
        getCommentsData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (likeId) {
    console.log("已經按過讚，刪除資料");
    axios
      .delete(`${baseUrl}/600/comments_likes/${parseInt(likeId)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        getCommentsData();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
