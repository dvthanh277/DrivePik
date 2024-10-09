const firebaseConfig = {
  databaseURL:
    "https://drivepik-b0895-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
