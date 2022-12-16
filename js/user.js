const getUrlString = location.href; // signin.html?register=true
const url = new URL(getUrlString);
const ifOpenSignup = url.searchParams.get("register");
const redirectUrl = url.searchParams.get("redirectUrl");
// console.log(redirectUrl);

// 0. DOM
const signupAccount = document.querySelector("#signup-account");
const signupPassword = document.querySelector("#signup-password");
const signupName = document.querySelector("#signup-name");
const signupBtn = document.querySelector("#signup-btn");

const signinAccount = document.querySelector("#signin-account");
const signinPassword = document.querySelector("#signin-password");
const signinBtn = document.querySelector("#signin-btn");

const openSignin = document.querySelector("#open-signin");
const openSignup = document.querySelector("#open-signup");

const signupContainer = document.querySelector("#signup");
const signinContainer = document.querySelector("#signin");

const signupEmailMsg = document.querySelector("#signup-account + .signup-msg");
const signupNameMsg = document.querySelector("#signup-name + .signup-msg");
const signinEmailMsg = document.querySelector("#signin-account + .signin-msg");
const signupPasswordMsg = document.querySelector(
  "#signup-password + .signup-msg"
);
const signinPasswordMsg = document.querySelector(
  "#signin-password + .signin-msg"
);

const successContainer = document.querySelector("#success-container");
const successMsg = document.querySelector(".success-msg");

// 1. Axios - signup / signin
// 1-1. handler
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signupEmailMsg.textContent = "";
  callSignUp();
});

signinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signinEmailMsg.textContent = "";
  callSignin();
});

// 1-2. signup function
const baseUrl = "https://json-server-vercel-main-7wwq5qqbi-gretali.vercel.app";
function callSignUp() {
  let email = signupAccount.value;
  let password = signupPassword.value;
  let userName = signupName.value;

  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  let isValid = true;

  if (password == "" || password.length < 4) {
    signupPasswordMsg.textContent = "密碼至少4碼";
    isValid = false;
  }
  if (email.search(emailRule) == -1) {
    signupEmailMsg.textContent = "電子信箱格式不正確";
    isValid = false;
  }

  if (userName == "") {
    signupNameMsg.textContent = "名稱不得為空";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  let randomNum = Math.floor(Math.random() * 6) + 1;
  let obj = {
    email,
    password,
    name: userName,
    imgUrl: `../img/avatar0${randomNum}.svg`,
  };

  console.log(obj);

  axios
    .post(`${baseUrl}/signup`, obj)
    .then(function (response) {
      console.log(response);

      signupAccount.value = "";
      signupPassword.value = "";
      signupEmailMsg.textContent = "";
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "帳號註冊成功",
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

      setTimeout(() => {
        switchPanel(signinContainer, signupContainer);
      }, 2000);
    })
    .catch(function (error) {
      console.log(error);
      let msg = error.response.data;
      console.log(msg);
      console.log(signupEmailMsg);

      if (msg === "Email already exists") {
        signupEmailMsg.textContent = "此電子信箱已註冊";
      }
    });
}

// 1-3. signin function
function callSignin() {
  let email = signinAccount.value;
  let password = signinPassword.value;
  const emailRule =
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  let isValid = true;

  if (password == "" || password.length < 4) {
    signinPasswordMsg.textContent = "密碼至少4碼";
    isValid = false;
  }
  if (email.search(emailRule) == -1) {
    signinEmailMsg.textContent = "電子信箱格式不正確";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  let obj = {};
  obj.email = email;
  obj.password = password;
  console.log(obj);

  axios
    .post(`${baseUrl}/login`, obj)
    .then(function (response) {
      console.log(response);
      let token = response.data.accessToken;
      let userName = response.data.user.name;
      let userId = response.data.user.id;
      let avatar = response.data.user.imgUrl;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("avatar", avatar);
      if (token) {
        Swal.fire({
          position: "center-center",
          icon: "success",
          title: "登入成功",
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
      }
      setTimeout(() => {
        window.location.replace(redirectUrl || "./attraction.html");
      }, 2000);
      return;
    })
    .catch(function (error) {
      console.log(error);
      let msg = error.response.data;
      if (msg === "Incorrect password") {
        signinPasswordMsg.textContent = "密碼錯誤";
      }

      if (msg === "Password is too short") {
        signinPasswordMsg.textContent = "密碼至少4碼";
      }

      if (msg === "Cannot find user") {
        signinEmailMsg.textContent = "電子信箱輸入有誤或尚未註冊";
      }
    });
}

// 2. Switch signup panel / signin panel
// 2-1. handler
openSignin.addEventListener("click", (e) => {
  e.preventDefault();
  switchPanel(signinContainer, signupContainer);
});

openSignup.addEventListener("click", (e) => {
  e.preventDefault();
  switchPanel(signupContainer, signinContainer);
});

if (ifOpenSignup) {
  switchPanel(signupContainer, signinContainer);
} else {
  switchPanel(signinContainer, signupContainer);
}

// 2-2. switch function
function switchPanel(openPanel, closePanel) {
  openPanel.style.display = "flex";
  openPanel.style.animation = "fadeIn .3s ease";
  closePanel.style.display = "none";
}

// 3. Listen inputs changes
listenInputs(
  signinContainer,
  [signinAccount, signinPassword],
  [signinEmailMsg, signinPasswordMsg]
);
listenInputs(
  signupContainer,
  [signupAccount, signupPassword, signupName],
  [signupEmailMsg, signupPasswordMsg, signupNameMsg]
);

function listenInputs(container, inputs, msgEls) {
  container.addEventListener("change", () => {
    inputs.forEach((input) => {
      if (input.value !== "") {
        document.querySelector(`[for="${input.id}"]`).classList.add("float");
      } else {
        document.querySelector(`[for="${input.id}"]`).classList.remove("float");
      }
    });
  });

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", () => {
      msgEls[index].textContent = "";
    });
  });
}
