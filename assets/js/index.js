window.onload = async function () {
  var albums_data;
  const getAlbums = async () => {
    albums_data = (await API.getData("albums")) || [];
    $("#albums_created").html(`Album đã tạo:` + albums_data.length);
    renderAlbums();
    console.log("albums_data", albums_data);
  };
  const renderAlbums = async () => {
    document.querySelector(
      "#albums-container"
    ).innerHTML = `<div class="col-sm-6 col-xl-3 mb-2">
              <div class="card overflow-hidden rounded-2" style="height: 100%">
                <button
                  class="d-flex flex-column align-items-center justify-content-center btn btn-outline-info"
                  data-bs-toggle="modal"
                  data-bs-target="#create-album-modal"
                  style="flex: 1; gap: 10px"
                >
                  <i class="ti ti-photo-plus" style="font-size: 36px"></i>
                  Tạo album
                </button>
              </div>
            </div>
            ${albums_data
              .map((item) => {
                return `<div class="col-sm-6 col-xl-3 mb-2">
              <div class="card overflow-hidden rounded-2" style="height: 100%; border: 1px solid rgb(229,234,239)">
                <div class="position-relative" style="width: 100%;height: 240px;overflow: hidden;display: flex;align-items: center;">
                  <a href="./album.html?album=${item.id}"><img
                      src="${item.thumbnail}"
                      class="card-img-top rounded-0"
                      style="width:100%"
                      alt="..." /></a>
                </div>
                <div class="card-body pt-3 p-3">
                  <h6 class="fw-semibold fs-4">${item.name}</h6>
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-3 mb-0"> Ngày tạo: ${new Date(
                      item.date_created
                    ).toLocaleDateString("en-GB")} </span>
                    <ul class="list-unstyled d-flex align-items-center mb-0">
                      <li>
                        <a class="text-danger" href="javascript:void(0)" onclick="handleRemoveAlbum('${
                          item.id
                        }')"
                          ><i class="ti ti-trash" style="font-size: 24px"></i></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>`;
              })
              .join("")}
            `;
  };
  window.handleRemoveAlbum = async (id) => {
    console.log(id);
    let temp = albums_data.filter((album) => album.id !== id);
    const res = await API.postData("albums/", temp); // Using the postData function
    if (res) {
      getAlbums();
    }
  };
  await getAlbums();
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
      const urlInput = $("#link").val() || null;
      const folderId = extractFolderId(urlInput);
      if (folderId) {
        loadPhotosFromFolder(folderId);
      } else {
        $("#link").addClass("is-invalid");
        $("#thumbnail").html(``);
      }
    }

    function extractFolderId(url) {
      const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    function loadPhotosFromFolder(folderId) {
      // Function to fetch files and handle pagination
      const fetchFiles = (pageToken) => {
        $("#link").removeClass("is-valid");
        $("#link").removeClass("is-invalid");

        gapi.client.drive.files
          .list({
            q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
            fields:
              "nextPageToken, files(id, name, thumbnailLink, webContentLink, webViewLink)",
            pageToken: pageToken,
          })
          .then((response) => {
            const files = response.result.files;

            // If files are found, process them
            if (files && files.length > 0) {
              $("#thumbnail").html(
                `<img class="card-img" src="https://lh3.googleusercontent.com/d/${files[0].id}" alt="${files[0].name}">`
              );
              $("#link").addClass("is-valid");
            } else {
              alert("No photos found in the folder.");
            }
          })
          .catch((error) => {
            $("#link").addClass("is-invalid");
            $("#thumbnail").html(``);
          });
      };

      // Start fetching files without a page token
      fetchFiles();
    }

    handleClientLoad();

    $("#link").on("blur", function () {
      handleSubmit();
    });
    $("#submitCreate").on("click", async () => {
      const urlInput = $("#link").val() || null;
      const folderId = extractFolderId(urlInput);
      const thumbnail = $("#thumbnail img").attr("src") || "";

      let album = {
        comment_count: "",
        date_created: Date.now(),
        file_count: "",
        files: "",
        id: folderId,
        like_count: "",
        name: $("#name").val(),
        name_client: "",
        password: $("#password").val(),
        thumbnail: thumbnail,
      };
      albums_data.push(album);
      console.log("album post", album);

      const res = await API.postData("albums/", albums_data); // Using the postData function
      if (res) {
        getAlbums();
        $("#create-album-modal").modal("toggle");
      }
    });

    function togglePasswordInput() {
      if ($("#usePassword").is(":checked")) {
        $("#password").show(); // Show the password input
      } else {
        $("#password").hide(); // Hide the password input
      }
    }

    // Bind the change event to the checkbox
    $("#usePassword").change(function () {
      togglePasswordInput();
    });
  });
};
