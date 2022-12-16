import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

let userId = parseInt(localStorage.getItem("userId"));
let userName = localStorage.getItem("userName");
const baseUrl = "https://json-server-vercel-main-7wwq5qqbi-gretali.vercel.app";

init();
function init() {
  setUserMenuBtn();
  localLoginChecker();
  document.querySelector("#myName").value = userName;
  document.querySelector("[for='myName']").classList.add("float");
  document
    .querySelector("#profile-avatar")
    .setAttribute("src", localStorage.getItem("avatar"));
}

const profileEl = document.querySelector(".profile");

profileEl.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target;

  if (target.id === "myName-btn") {
    const userName = document.querySelector("#myName");
    if (!userName.value) {
      userName.nextElementSibling.textContent = "請輸入名稱";
      return;
    }
    updateName(userName.value);
  }

  if (target.id === "myPassword-btn") {
    const userOldPassword = document.querySelector("#myOldPassword");
    const userNewPassword = document.querySelector("#myNewPassword");

    let isValid = true;
    if (userOldPassword.value.length < 4) {
      userOldPassword.nextElementSibling.textContent = "密碼至少4碼";
      isValid = false;
    }

    if (userNewPassword.value.length < 4) {
      userNewPassword.nextElementSibling.textContent = "密碼至少4碼";
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    updatePassword(userOldPassword.value, userNewPassword.value);
  }

  if (target.id === "deleteAccount-btn") {
    swal
      .fire({
        title: "確定刪除帳戶嗎？",
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
            title: "帳戶已刪除",
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
          deleteAccount(userId);
        }
      });
  }
});

function updateName(userName) {
  axios
    .patch(
      `${baseUrl}/600/users/${userId}`,
      {
        name: userName,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      console.log(response);
      localStorage.setItem("userName", userName);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "更新成功",
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

function updatePassword(oldPassword, newPassword) {
  axios
    .get(`${baseUrl}/600/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
      const email = response.data.email;
      checkOldPassword(email, oldPassword, newPassword);
    })
    .catch((error) => {
      console.log(error);
    });
}

function checkOldPassword(email, oldPassword, newPassword) {
  axios
    .post(`${baseUrl}/login`, {
      email,
      password: oldPassword,
    })
    .then(function (response) {
      console.log(response);
      console.log("輸入正確");
      let token = response.data.accessToken;
      localStorage.setItem("token", token);

      updateNewPassword(newPassword);
      return;
    })
    .catch(function (error) {
      console.log(error);
      document.querySelector("#myOldPassword").nextElementSibling.textContent =
        "舊密碼輸入有誤";
      ("密碼至少4碼");
    });
}

function updateNewPassword(password) {
  axios
    .patch(
      `${baseUrl}/600/users/${userId}`,
      {
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      let token = response.data.accessToken;
      localStorage.setItem("token", token);
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "更新成功",
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
    .catch(function (error) {
      console.log(error);
      document.querySelector("#myOldPassword").nextElementSibling.textContent =
        "舊密碼輸入有誤";
      ("密碼至少4碼");
    });
}

function deleteAccount(userId) {
  // 暫時無法作用
  return;
  axios
    .delete(`${baseUrl}/600/users/${userId}`, {
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
