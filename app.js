// document.addEventListener("DOMContentLoaded", () => {
//   gsap.registerPlugin(CustomEase);
//   CustomEase.create(
//     "hop",
//     "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
//   );

//   const sliderImages = document.querySelector(".slider-images");
//   const counter = document.querySelector(".counter");
//   const titles = document.querySelector(".slider-title-wrapper");
//   const indicators = document.querySelectorAll(".slider-indicators p");
//   const prevSlides = document.querySelectorAll(".slider-preview .preview");
//   const sliderPreview = document.querySelector(".slider-preview");

//   let currentImg = 1;
//   const totalSlides = 5;
//   let indicatorRotation = 0;

//   const updateCounterAndTitlePosition = () => {
//     const counterY = -20 * (currentImg - 1);
//     const titleY = -100 * (currentImg - 1);

//     gsap.to(counter, {
//       y: counterY,
//       duration: 1,
//       ease: "hop",
//     });

//     gsap.to(titles, {
//       y: titleY,
//       duration: 1,
//       ease: "hop",
//     });
//   };

//   const updateActiveSlidePreview = () => {
//     prevSlides.forEach((prev) => prev.classList.remove("active"));
//     prevSlides[currentImg - 1].classList.add("active");
//   };

//   const animateSlide = (direction) => {
//     const currentSlide =
//       document.querySelectorAll(".img")[
//         document.querySelectorAll(".img").length - 1
//       ];

//     const slideImg = document.createElement("div");
//     slideImg.classList.add("img");

//     const slideImgElem = document.createElement("img");
//     slideImgElem.src = `./Images/img${currentImg}.png`;
//     gsap.set(slideImgElem, { x: direction === "left" ? -300 : 300 });

//     slideImg.appendChild(slideImgElem);
//     sliderImages.appendChild(slideImg);

//     gsap.to(currentSlide.querySelector("img"), {
//       x: direction === "left" ? 300 : -300,
//       duration: 1.5,
//       ease: "power4.out",
//     });

//     gsap.fromTo(slideImg, {
//       clipPath:
//         direction === "left"
//           ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
//           : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
//     },
//     {
//       clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
//       duration: 1.5,
//       ease: 'power4.out',
//     });

//     gsap.to(slideImgElem, {
//       x: 0,
//       duration: 1.5,
//       ease: 'power4.out',
//     });

//     cleanupSlides();


//     indicatorRotation += direction === 'left' ? -90 : 90;
//     gsap.to(indicators, {
//       rotate: indicatorRotation,
//       duration: 1,
//       ease: 'hop',
//     });
//   };

//   document.addEventListener('click', (event) => {
//     const sliderWidth = document.querySelector('.slider').clientWidth;
//     const clickPosition = event.clientX;

//     if (sliderPreview.contains(event.target)) {
//       const clickedPrev = event.target.closest('.preview');

//       if(clickedPrev) {
//         const clickedIndex = Array.from(prevSlides).indexOf(clickedPrev) + 1;

//         if (clickedIndex !== currentImg) {
//           if (clickedIndex < currentImg) {
//             currentImg = clickedIndex;
//             animateSlide('left');
//           } else {
//             currentImg = clickedIndex;
//             animateSlide('right');
//           }
//           updateActiveSlidePreview();
//           updateCounterAndTitlePosition();
//         }
//       }
//       return;
//     }

//     if (clickPosition < sliderWidth / 2 && currentImg !== 1){
//       currentImg--;
//       animateSlide('left');
//     } else if (clickPosition > sliderWidth / 2 && currentImg !== totalSlides){
//       currentImg++;
//       animateSlide('right');
//     }

//     updateActiveSlidePreview();
//     updateCounterAndTitlePosition();
//   });

//   const cleanupSlides = () => {
//     const imgElements = document.querySelectorAll('.slider-images .img');
//     if (imgElements.length > totalSlides) {
//       imgElements[0].remove();
//     }
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const loader = new THREE.GLTFLoader();
  loader.load("care.glb", (gltf) => {
    model = gltf.scene;

    model.traverse((node) => {
      if (node.isMesh && node.material) {
        Object.assign(node.material, {
          metalness: 0.05,
          roughness: 0.9,
        });
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    modelSize = size;

    scene.add(model);
    setupModel();
  });

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const header1Split = new SplitText(".header-1 h1", {
    type: "chars",
    charsClass: "char",
  });
  const titleSplits = new SplitText(".tooltip .title h2", {
    type: "lines",
    linesClass: "line",
  });
  const descriptionSplits = new SplitText(".tooltip .description p", {
    type: "lines",
    linesClass: "line",
  });
  header1Split.chars.forEach(
    (char) => (char.innerHTML = `<span>${char.innerHTML}</span>`)
  );
  [...titleSplits.lines, ...descriptionSplits.lines].forEach(
    (line) => (line.innerHTML = `<span>${line.innerHTML}</span>`)
  );

  const animOptions = { duration: 1, ease: "power3.out", stagger: 0.025 };
  const tooltipSelectors = [
    {
      trigger: 0.65,
      elements: [
        ".tooltip:nth-child(1) .icon ion-icon",
        ".tooltip:nth-child(1) .title .line > span",
        ".tooltip:nth-child(1) .description .line > span",
      ],
    },
    {
      trigger: 0.85,
      elements: [
        ".tooltip:nth-child(2) .icon ion-icon",
        ".tooltip:nth-child(2) .title .line > span",
        ".tooltip:nth-child(2) .description .line > span",
      ],
    },
  ];

  ScrollTrigger.create({
    trigger: ".product-overview",
    start: "75% bottom",
    onEnter: () =>
      gsap.to(".header-1 h1 .char > span", {
        y: "0%",
        duration: 1,
        ease: "power3.out",
        stagger: 0.025,
      }),
    onLeaveBack: () =>
      gsap.to(".header-1 h1 .char > span", {
        y: "100%",
        duration: 1,
        ease: "power3.out",
        stagger: 0.025,
      }),
  });

  let model,
    currentRotation = 0,
    modelSize;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.querySelector(".model-container").appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(1, 2, 3);
  mainLight.castShadow = true;
  mainLight.shadow.bias = -0.001;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-2, 0, -2);
  scene.add(fillLight);

  function setupModel() {
    if (!model || !modelSize) return;

    const isMobile = window.innerWidth < 1000;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.set(
      isMobile ? center.x + modelSize.x * 1 : -center.x - modelSize.x * 0.4,
      -center.y + modelSize.y * 0.085,
      -center.z
    );

    model.rotation.z = isMobile ? 0 : THREE.Math.degToRad(-25);

    const cameraDistance = isMobile ? 2 : 1.25;
    camera.position.set(
      0,
      0,
      Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
    );
    camera.lookAt(0, 0, 0);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setupModel();
  });

  ScrollTrigger.create({
    trigger: ".product-overview",
    start: "top top",
    end: `+=${window.innerHeight * 10}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: ({ progress }) => {
      const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
      gsap.to(".header-1", {
        xPercent:
          progress < 0.05 ? 0 : progress > 0.35 ? -100 : -100 * headerProgress,
      });

      const maskSize =
        progress < 0.2
          ? 0
          : progress > 0.3
          ? 100
          : 100 * ((progress - 0.2) / 0.1);
      gsap.to(".circular-mask", {
        clipPath: `circle(${maskSize}% at 50% 50%)`,
      });

      const header2Progress = (progress - 0.15) / 0.35;
      const header2Percent =
        progress < 0.15
          ? 100
          : progress > 0.5
          ? -200
          : 100 - 300 * header2Progress;
      gsap.to(".header-2", { xPercent: header2Percent });

      const scaleX =
        progress < 0.45
          ? 0
          : progress > 0.65
          ? 100
          : 100 * ((progress - 0.45) / 0.2);
      gsap.to(".tooltip .divider", { scaleX: `${scaleX}%`, ...animOptions });

      tooltipSelectors.forEach(({ trigger, elements }) => {
        gsap.to(elements, {
          y: progress >= trigger ? "0%" : "125%",
          ...animOptions,
        });
      });

      if (model && progress >= 0.05) {
        const rotationProgress = (progress - 0.05) / 0.95;
        const targetRotation = Math.PI * 3 * 4 * rotationProgress;
        const rotationDiff = targetRotation - currentRotation;
        if (Math.abs(rotationDiff) > 0.001) {
          model.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
          currentRotation = targetRotation;
        }
      }
    },
  });
});
