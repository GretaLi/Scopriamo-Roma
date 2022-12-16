export function setUserMenuBtn() {
  const redirectUrl = location.href;
  document
    .querySelector("#signin-btn")
    .setAttribute("href", `./signin.html?redirectUrl=${redirectUrl}`);
  document
    .querySelector("#signup-btn")
    .setAttribute(
      "href",
      `./signin.html?register=true&redirectUrl=${redirectUrl}`
    );
}

export function localLoginChecker() {
  const localJWT = localStorage.getItem("token");
  const userMenu = document.querySelector("#user-menu");

  if (localJWT) {
    // const AUTH = `Bearer ${localStorage.getItem("token")}`;
    let userName = localStorage.getItem("userName");
    let avatar = localStorage.getItem("avatar");
    // let userId = localStorage.getItem("userId");

    userMenu.innerHTML = `
      <button><span>${userName}</span><img id="toggle-usermenu" src="${avatar}"/></button>
      <ul>
        <li>
          <img src="${avatar}"/>
          <p>Hello, ${userName}</p>
        </li>
        <li><a href="./profile.html">會員資料</a></li>
        <li><a href="./index.html" id="usermenu-signout">登出</a></li>
      </ul>
      `;

    userMenu.addEventListener("click", (e) => {
      const target = e.target;
      console.log(target);
      if (target.id === "toggle-usermenu") {
        console.log(e.target.parentElement);
        e.target.parentElement.classList.toggle("active");
      }

      if (target.id === "usermenu-signout") {
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }
}
