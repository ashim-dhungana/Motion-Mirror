const express = require("express");
const path = require("path");
const { get } = require("request");
const app = express();

const session = require("express-session");

app.use(
  session({
    secret: "SecretKey", // Replace this with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsDir = path.join(__dirname, "views");
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "../images")));
app.use(express.static(path.join(__dirname, "../media")));
app.use(express.static(path.join(__dirname, "../../weights")));
app.use(express.static(path.join(__dirname, "../../dist")));

// Displaying LogIn page

app.get("/", (req, res) => res.sendFile(path.join(viewsDir, "login.html")));

app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  const validUsername = "admin";
  const validPassword = "password";
  
  const validUsername2 = "krishnajunior8@gmail.com";
  const validPassword2 = "youknowhoiam";
  
  if ((username === validUsername && password === validPassword) || (username === validUsername2 && password === validPassword2)) {
    req.session.isLoggedIn = true;
    res.redirect("/face_detection");
  } else {
    res.redirect("/?error=invalid");
  }
});
  



// Log Out
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error Logging Out");
    }
    console.log("logout");
    res.redirect("/");
  });
});

// Protect the routes
function checkAuth(req, res, next) {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect("/");
  }
}

// Only allow access to these routes if logged in

// app.get("/", (req, res) => res.redirect("/face_detection"));

app.get("/face_detection", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "faceDetection.html"))
);
app.get("/face_landmark_detection", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "faceLandmarkDetection.html"))
);
app.get("/face_expression_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "faceExpressionRecognition.html"))
);
app.get("/age_and_gender_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "ageAndGenderRecognition.html"))
);
app.get("/face_extraction", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "faceExtraction.html"))
);
app.get("/face_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "faceRecognition.html"))
);
app.get("/video_face_tracking", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "videoFaceTracking.html"))
);
app.get("/webcam_face_detection", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "webcamFaceDetection.html"))
);
app.get("/webcam_face_landmark_detection", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "webcamFaceLandmarkDetection.html"))
);
app.get("/webcam_face_expression_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "webcamFaceExpressionRecognition.html"))
);
app.get("/webcam_age_and_gender_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "webcamAgeAndGenderRecognition.html"))
);
app.get("/bbt_face_landmark_detection", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceLandmarkDetection.html"))
);
app.get("/bbt_face_similarity", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceSimilarity.html"))
);
app.get("/bbt_face_matching", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceMatching.html"))
);
app.get("/bbt_face_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceRecognition.html"))
);
app.get("/batch_face_landmarks", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "batchFaceLandmarks.html"))
);
app.get("/batch_face_recognition", checkAuth, (req, res) =>
  res.sendFile(path.join(viewsDir, "batchFaceRecognition.html"))
);

app.post("/fetch_external_image", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send("imageUrl param required");
  }
  try {
    const externalResponse = await request(imageUrl);
    res.set("content-type", externalResponse.headers["content-type"]);
    return res.status(202).send(Buffer.from(externalResponse.body));
  } catch (err) {
    return res.status(404).send(err.toString());
  }
});

app.listen(3000, () => console.log("Listening on port 3000!"));

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function (resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        },
      },
      returnBuffer ? { encoding: null } : {}
    );

    get(options, function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
