class CommonApi {
  getData = async (endpoint) => {
    try {
      const res = await database
        .ref(endpoint)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          } else {
            return null;
          }
        });
      return res;
    } catch (error) {
      return null;
    }
  };
  postData = async (endpoint, data) => {
    try {
      await database.ref(endpoint).set(data);
      console.log("Data saved successfully!");
      return true;
    } catch (error) {
      console.log("Error saving data:", error);
      return null;
    }
  };
  putData = async (endpoint, data) => {
    try {
      const res = await database.ref(endpoint).update(data, (error) => {
        if (error) {
          // The write failed...
        } else {
          // Data saved successfully!
        }
      });
      return res;
    } catch (error) {
      return null;
    }
  };
}
const API = new CommonApi();
