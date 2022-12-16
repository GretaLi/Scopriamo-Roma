import { setUserMenuBtn, localLoginChecker } from "./userMenu.js";

setUserMenuBtn();
localLoginChecker();

// GSAP loop text
gsap.registerPlugin(ScrollTrigger, TextPlugin);

gsap.to(".loop", {
  xPercent: "-50",
  ease: "none",
  duration: 20,
  repeat: -1,
});

// GSAP scroll | Hero
const tl1 = gsap.timeline({
  scrollTrigger: {
    trigger: ".swiper-pagination-progressbar",
    markers: false,
    start: "top 65%",
    end: "top 0%",
    scrub: true,
    snap: {
      snapTo: "labels",
    },
  },
});

tl1
  .addLabel("start")
  .to(".hero p", {
    opacity: "1",
    top: 300,
  })
  .to(
    ".hero i",
    {
      opacity: "0",
    },
    "<"
  )
  .to(
    ".hero h2:nth-child(1)",
    {
      yPercent: 50,
      top: 400,
    },
    "<"
  )
  .to(
    ".hero h2:nth-child(2)",
    {
      yPercent: 50,
      top: 600,
    },
    "<"
  )
  .addLabel("end");

// GSAP scroll | Intro
const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".intro",
    markers: false,
    start: "top 50%",
    end: "top 5%",
    scrub: true,
    snap: {
      snapTo: "labels",
    },
  },
});

tl2
  .addLabel("start")
  .from(".intro p", {
    yPercent: 20,
  })
  .addLabel("end");

// GSAP scroll | Explore
const tl3 = gsap.timeline({
  scrollTrigger: {
    trigger: ".explore .title",
    markers: false,
    start: "top 65%",
    end: "top 30%",
    scrub: true,
    snap: {
      snapTo: "labels",
    },
  },
});

tl3
  .addLabel("start")
  .from(".card-item1", {
    yPercent: 80,
  })
  .from(".card-item2", {
    yPercent: 80,
  })
  .from(".card-item3", {
    yPercent: 80,
  })
  .from(".card-item4", {
    yPercent: 80,
  })
  .addLabel("end");

// GSAP Horizontal Scroll | Top 10
let sections = gsap.utils.toArray(".top10__card");

let scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".top10__card-container",
    toggleClass: "active",
    pin: true,
    scrub: 0.1,
    markers: false,
    start: "0%",
    end: "+=2000",
  },
});

// Top 10 | Change background and info
const top10ChangeBg = (el) => {
  const container = document.querySelector(el);
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("top10__card")) {
      let imgUrl = e.target.children[0].getAttribute("src");
      container.style.backgroundImage = `url(./${imgUrl})`;
      container.style.backgroundColor = `hsl(var(--clr-veryDark))`;

      const title = e.target.children[1].children[0].innerHTML;
      const category = e.target.getAttribute("data-category");
      const subcategory = e.target.getAttribute("data-subcategory");
      const attractionId = e.target.getAttribute("data-attraction-id");

      const cardInfoTitle = document.querySelector(".top10__card-info h3");
      const cardInfotagCategory = document.querySelector("#top10-category");
      const cardInfotagPeriod = document.querySelector("#top10-period");
      const cardInfoLink = document.querySelector("#top10-link");

      cardInfoTitle.innerHTML = title;
      cardInfotagCategory.textContent = category;
      cardInfotagPeriod.textContent = subcategory;
      cardInfoLink.setAttribute(
        "href",
        `./details.html?id=${parseInt(attractionId)}`
      );
    }
  });
};
top10ChangeBg(".top10__container");

// Noise effect
const noise = (el) => {
  let canvas, ctx;

  let wWidth, wHeight;

  let noiseData = [];
  let frame = 0;

  let loopTimeout;

  // Create Noise
  const createNoise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xffcdebff;
      }
    }

    noiseData.push(idata);
  };

  // Play Noise
  const paintNoise = () => {
    if (frame === 9) {
      frame = 0;
    } else {
      frame++;
    }

    ctx.putImageData(noiseData[frame], 0, 0);
  };

  // Loop
  const loop = () => {
    paintNoise(frame);

    loopTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(loop);
    }, 1000 / 25);
  };

  // Setup
  const setup = () => {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    canvas.width = wWidth;
    canvas.height = wHeight;

    for (let i = 0; i < 10; i++) {
      createNoise();
    }

    loop();
  };

  // Reset
  let resizeThrottle;
  const reset = () => {
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(resizeThrottle);

        resizeThrottle = window.setTimeout(() => {
          window.clearTimeout(loopTimeout);
          setup();
        }, 200);
      },
      false
    );
  };

  // Init
  const init = (() => {
    canvas = document.querySelector(el);
    ctx = canvas.getContext("2d");
    setup();
  })();
};

noise("#noise1");
noise("#noise2");
noise("#noise3");

// 3D tilt Effect with Vanilla-Tilt.js
for (let i = 1; i <= 4; i++) {
  VanillaTilt.init(document.querySelector(`.card-item${i}`), {
    max: 20,
    scale: 1.05,
    speed: 3500,
    glare: true,
    "max-glare": 0.1,
    transition: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  });
}
