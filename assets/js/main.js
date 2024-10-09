function addScript(src, isModule = false) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");

    s.setAttribute("src", src);
    s.addEventListener("load", resolve);
    s.addEventListener("error", reject);
    if (isModule) {
      s.setAttribute("type", "module");
    }

    document.head.appendChild(s);
  });
}

const libs = [
  {
    src: "https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js",
    module: false,
  },
  {
    src: "https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js",
    module: false,
  },
  {
    src: "../assets/js/firebase.js",
    module: false,
  },
  {
    src: "../assets/js/commonApi.js",
    module: false,
  },
];
(async function () {
  for (const lib of libs) {
    await addScript(lib.src, lib.module).catch((err) => console.error(err));
  }
  console.log(`Loaded ${libs.length} script files!`);
})();
