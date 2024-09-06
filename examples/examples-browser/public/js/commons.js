async function requestExternalImage(imageUrl) {
  const res = await fetch("fetch_external_image", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });
  if (!(res.status < 400)) {
    console.error(res.status + " : " + (await res.text()));
    throw new Error("failed to fetch image from url: " + imageUrl);
  }

  let blob;
  try {
    blob = await res.blob();
    return await faceapi.bufferToImage(blob);
  } catch (e) {
    console.error("received blob:", blob);
    console.error("error:", e);
    throw new Error("failed to load image from url: " + imageUrl);
  }
}

function renderNavBar(navbarId, exampleUri) {
  const examples = [
    {
      uri: "face_detection",
      name: "Face Detection",
    },
    {
      uri: "face_landmark_detection",
      name: "Face Landmark Detection",
    },
    {
      uri: "face_expression_recognition",
      name: "Face Expression Recognition",
    },
    {
      uri: "age_and_gender_recognition",
      name: "Age and Gender Recognition",
    },
    // {
    //   uri: 'face_recognition',
    //   name: 'Face Recognition'
    // },
    {
      uri: "face_extraction",
      name: "Face Extraction",
    },
    // {
    //   uri: 'video_face_tracking',
    //   name: 'Video Face Tracking'
    // },
    {
      uri: "webcam_face_detection",
      name: "Webcam Face Detection",
    },
    {
      uri: "webcam_face_landmark_detection",
      name: "Webcam Face Landmark Detection",
    },
    {
      uri: "webcam_face_expression_recognition",
      name: "Webcam Face Expression Recognition",
    },
    {
      uri: "webcam_age_and_gender_recognition",
      name: "Webcam Age and Gender Recognition",
    },
    // {
    //   uri: 'bbt_face_landmark_detection',
    //   name: 'BBT Face Landmark Detection'
    // },
    // {
    //   uri: 'bbt_face_similarity',
    //   name: 'BBT Face Similarity'
    // },
    // {
    //   uri: 'bbt_face_matching',
    //   name: 'BBT Face Matching'
    // },
    // {
    //   uri: 'bbt_face_recognition',
    //   name: 'BBT Face Recognition'
    // },
    // {
    //   uri: 'batch_face_landmarks',
    //   name: 'Batch Face Landmark Detection'
    // },
    // {
    //   uri: 'batch_face_recognition',
    //   name: 'Batch Face Recognition'
    // }
  ];

  const navbar = $(navbarId).get(0);
  const pageContainer = $(".page-container").get(0);

  const header = document.createElement("h3");
  header.innerHTML = examples.find((ex) => ex.uri === exampleUri).name;
  pageContainer.insertBefore(header, pageContainer.children[0]);

  const menuContent = document.createElement("ul");
  menuContent.id = "slide-out";
  menuContent.classList.add("side-nav", "fixed");
  navbar.appendChild(menuContent);

  const menuButton = document.createElement("a");
  menuButton.href = "#";
  menuButton.classList.add("button-collapse", "show-on-large");
  menuButton.setAttribute("data-activates", "slide-out");
  const menuButtonIcon = document.createElement("img");
  menuButtonIcon.src = "menu_icon.png";
  menuButton.appendChild(menuButtonIcon);
  navbar.appendChild(menuButton);

  const li = document.createElement("li");
  const githubLink = document.createElement("a");
  githubLink.classList.add("waves-effect", "waves-light", "side-by-side");
  githubLink.id = "github-link";
  // githubLink.href = 'https://github.com/justadudewhohacks/face-api.js'
  const h5 = document.createElement("h5");
  h5.innerHTML = "Motion Mirror";
  githubLink.appendChild(h5);
  const githubLinkIcon = document.createElement("img");
  // githubLinkIcon.src = 'github_link_icon.png'
  githubLink.appendChild(githubLinkIcon);
  li.appendChild(githubLink);
  menuContent.appendChild(li);

  examples.forEach((ex) => {
    const li = document.createElement("li");
    if (ex.uri === exampleUri) {
      li.style.background = "#b0b0b0";
    }
    const a = document.createElement("a");
    a.classList.add("waves-effect", "waves-light", "pad-sides-sm");
    a.href = ex.uri;
    const span = document.createElement("span");
    span.innerHTML = ex.name;
    span.style.whiteSpace = "nowrap";
    a.appendChild(span);
    li.appendChild(a);
    menuContent.appendChild(li);
  });

// Add Logout Button
const logoutLi = document.createElement("li");
const logoutButton = document.createElement("a");
logoutButton.classList.add("waves-effect", "waves-light", "pad-sides-sm");
logoutButton.href = "#";
logoutButton.innerHTML = "Logout";

// Styling Logout Button
logoutButton.style.cssText = `
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1e90ff;
  color: #1e90ff;
  padding: 10px 30px;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  margin: auto;
  transition: color 0.3s ease, background-color 0.3s ease, transform 0.2s ease;
  width: 12vw;
  font-size: 20px;
  font-weight: bold;  
  position: absolute;
  bottom: 80px;
  left: 10px;
  background-color: transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;
logoutButton.onmouseover = () => {
  logoutButton.style.backgroundColor = '#1e90ff';
  logoutButton.style.color = '#ffffff';
  icon.style.color = '#ffffff'; /* Icon color on hover */
};
logoutButton.onmouseout = () => {
  logoutButton.style.backgroundColor = 'transparent';
  logoutButton.style.color = '#1e90ff';
  icon.style.color = '#1e90ff'; /* Reset icon color */
};

// Create an icon element for FontAwesome
const icon = document.createElement('i');
icon.classList.add('fa', 'fa-power-off');
icon.style.fontSize = '20px';
icon.style.color = '#1e90ff'; /* Initial icon color */
icon.style.marginRight = '10px'; /* Space between icon and text */
icon.style.verticalAlign = 'middle';

// Add the icon to the button
logoutButton.insertBefore(icon, logoutButton.firstChild);




// Calling Logout Button
logoutButton.onclick = () => {
  handleLogout();
};

logoutLi.style.textAlign = "center";
logoutLi.style.width = "100%"; /* Full width for proper alignment */

logoutLi.appendChild(logoutButton);
menuContent.appendChild(logoutLi);


  $(".button-collapse").sideNav({
    menuWidth: 260,
  });
}

function handleLogout() {
  console.log("handlelogout");
  window.location.href = "/logout";
}

function renderSelectList(
  selectListId,
  onChange,
  initialValue,
  renderChildren
) {
  const select = document.createElement("select");
  $(selectListId).get(0).appendChild(select);
  renderChildren(select);
  $(select).val(initialValue);
  $(select).on("change", (e) => onChange(e.target.value));
  $(select).material_select();
}

function renderOption(parent, text, value) {
  const option = document.createElement("option");
  option.innerHTML = text;
  option.value = value;
  parent.appendChild(option);
}
