window.onload = async function () {
  var albums_data;

  const urlParams = new URLSearchParams(window.location.search);

  const album = urlParams.get("album");

  $(document).ready(async function () {
    const CLIENT_ID =
      "105438724692-copdd31l459r34o95rqkv39vq8fpm2kc.apps.googleusercontent.com";
    const API_KEY = "AIzaSyBKBWe_B-EBDupUs5MIJFZGSQHWPmvEhEI";
    const DISCOVERY_DOCS = [
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    ];
    const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
    }

    function handleClientLoad() {
      gapi.load("client:auth2", initClient);
    }

    function handleSubmit() {
      if (album) {
        loadPhotosFromFolder(album);
      } else {
      }
    }

    function extractFolderId(url) {
      const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    function loadPhotosFromFolder(folderId) {
      const photoBoxes = document.querySelectorAll(".photo-box");
      photoBoxes.forEach((box) => {
        box.innerHTML = ""; // Clear each photo box
      });

      // Function to fetch files and handle pagination
      const fetchFiles = (pageToken) => {
        gapi.client.drive.files
          .list({
            q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
            fields:
              "nextPageToken, files(id, name, thumbnailLink, webContentLink, webViewLink)",
            pageToken: pageToken,
          })
          .then((response) => {
            const files = response.result.files;
            console.log(files);
            if (files && files.length > 0) {
              // Distributing photos into three boxes
              files.forEach((file, index) => {
                const photoBoxIndex = index % photoBoxes.length;
                const photoBox = photoBoxes[photoBoxIndex];
                const photoDiv = document.createElement("div");
                photoDiv.className = "photo";
                $(".swiper-wrapper").append(
                  `<div class="swiper-slide"><a href="https://lh3.googleusercontent.com/d/${file.id}" download target="_blank"><img src="https://lh3.googleusercontent.com/d/${file.id}" alt="${file.name}"></a> </div> `
                );
                photoDiv.innerHTML = `
                  <div data-bs-toggle="modal"
                  data-bs-target="#album-modal" style="cursor: pointer">
                      <img src="https://lh3.googleusercontent.com/d/${file.id}" alt="${file.name}">
                  </div>`;
                photoBox.appendChild(photoDiv);
              });
            } else {
              alert("No photos found in the folder.");
            }

            // If there's a next page, fetch it
            if (response.result.nextPageToken) {
              fetchFiles(response.result.nextPageToken);
            }
          })
          .catch((error) => {
            console.error("Error fetching photos:", error);
            alert("Failed to fetch photos.");
          });
      };

      // Start fetching files without a page token
      fetchFiles();
    }

    handleClientLoad();
    setTimeout(() => {
      handleSubmit();
      $("#loading").hide();
      var swiper = new Swiper(".mySwiper", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }, 2000);
  });
};
