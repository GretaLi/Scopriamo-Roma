console.clear();

gsap.registerPlugin(ScrollTrigger);

const covers = gsap.utils.toArray(".ebook__cover");
const contents = gsap.utils.toArray(".ebook__body");
const bg = gsap.utils.toArray(".ebook__image");
console.log(contents);

covers.forEach((cover, index) => {
  const header = cover.querySelector(".ebook__header");
  const arrow = document.querySelector(".arrow-down");

  const t = gsap.timeline();
  t.to(arrow, {
    opacity: 0,
    y: 80,
  })
    .from(header.children, {
      opacity: 0,
      y: 80,
      stagger: 0.1,
      scale: 1.5,
    })
    .to(
      bg[index],
      {
        scale: 1.25,
        yoyo: true,
        backgroundPosition: "50% 50%",
      },
      "<"
    );

  ScrollTrigger.create({
    animation: t,
    trigger: cover,
    markers: false,
    scrub: 1,
    start: "15% 10%",
    end: "150%",
    snap: 0.2,
  });
});
