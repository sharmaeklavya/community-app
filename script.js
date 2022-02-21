//Gloal variables
let queryId = 1;
let singlePostId;

// API path to locate the data on the server
const mockUri = "https://6073d373066e7e0017e78599.mockapi.io/users/";
const newsAPI =
  "https://content.guardianapis.com/search?page=2&q=debate&api-key=";
const apiKey = "97e88681-b8e6-4813-9173-5d2249ab16e4";

//A simple bootstrap function to create above elements
function bootstrap(ele, className = "") {
  const element = document.createElement(ele);
  element.setAttribute("class", className);
  return element;
}

//Bootstrap navbar element
const navBar = bootstrap(
  "nav",
  "navbar navbar-expand-lg sticky-top navbar-dark bg-color"
);
navBar.innerHTML = `<div class="container">
  <div class="logo">
    <a class="navbar-brand heading" href="index.html">Community App</a>  
    <p class="text-white sub-heading">An ulimate place for answers</p>
  </div>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item m-2 active">
        <a class="nav-link" href="index.html">Home<span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item m-2">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#postModal">Create a post</button>
      </li>
      <li class="nav-item m-2">        
        <label class="switch">
          <input type="checkbox" class="checked">
          <span class="slider round"></span>
        </label>
      </li>      
    </ul>       
  </div>
  </div>`;

//Bootstrap create a post element
const createAPost = bootstrap("div", "post-card");
createAPost.innerHTML = `<div class="modal fade" id="postModal" tabindex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">  
    <div class="modal-header">    
      <h5 class="modal-title text-dark" id="ModalLabel">Create a post</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>      
    </div>
    <div class="modal-body bg-transparent text-dark">    
        <form class="description-form">
        <p class="h6 text-success mb-3 post-label hidden">Post created successfully</p> 
            <div class="form-group row">
                <label for="inputUsername" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUsername" required />
                </div>
            </div>
            <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" required />
                </div>
            </div>    
            <div class="form-group row">
                <label for="inputTitle" class="col-sm-2 col-form-label">Subject</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputTitle" required />
                </div>
            </div>
            <div class="form-group row">
                <label for="inputdescription" class="col-sm-2 col-form-label">Description</label>
                <div class="col-sm-10">
                    <textarea class="form-control" id="inputdescription" rows="5" cols="33" required></textarea>
                </div>
            </div>    
            <div class="modal-footer">                
                <button type="submit" class="btn btn-primary submit-btn">Submit</button>
            </div>
        </form>
    </div>
  </div>
</div>
</div>`;

// Bootstrap delete a post element
const deletePostModal = bootstrap("div", "modal fade");
deletePostModal.id = "deletePostModal";
deletePostModal.tabIndex = -1;
deletePostModal.ariaLabelledby = "deleteModalLabel";
deletePostModal.ariaHidden = "true";
deletePostModal.innerHTML = `<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title delete-modal-title text-center text-danger font-weight-bold" id="deleteModalLabel">Are you sure you want to delete?</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="delete-post-form">       
            <div class="form-group">
              <label for="delete-post-pass" class="col-form-label">Enter password: </label>
              <input type="password" class="form-control" id="delete-post-pass" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger delete-post-submit-btn">Delete</button>
        </div>
      </div>
    </div>`;

// creating HTML skelton through bootstrap
const containerFluid = bootstrap("div", "container-fluid box");
const container = bootstrap("div", "container");
const mainContentRow = bootstrap("div", "row");
const mainContentCol = bootstrap("div", "col-lg-12");
const postTitleRow = bootstrap("div", "row");
const postTitleCol = bootstrap("div", "col-lg-12");
const postTitle = bootstrap("p", "h3 font-weight-bold mt-4 py-2 border-bottom");
postTitle.innerText = "Latest Posts";
const postCardRow = bootstrap("div", "row");

// comment add section HTML skelton
const commentForm = bootstrap("form", "col-lg-6 comment-form hidden");
commentForm.innerHTML = `<div class="form-group">
<p class="empty-field text-danger text-center font-weight-bold h6"></p>
<label for="inputCommentName">My Name</label>
  <input type="text" class="form-control form-control-lg" id="inputCommentName" aria-describedby="name">
</div>
<div class="form-group">
  <label for="inputComment">My valuable opinion</label>
  <textarea class="form-control form-control-lg" id="iputComment" rows="2"></textarea>
</div>`;
const commentBtn = bootstrap("button", "btn btn-primary px-5 ml-auto");
commentBtn.setAttribute("type", "submit");
commentBtn.innerText = "Add this comment";
commentBtn.onclick = postComment;
commentForm.appendChild(commentBtn);

// comment section HTML skelton
const commentRow = bootstrap("div", "row");
const commentCol = bootstrap("div", "col-lg-6");
const commentCardRow = bootstrap("div", "row mb-2");
const commentTitle = bootstrap("h4", "h4 font-weight-bold pl-3 pb-2");
commentTitle.innerText = "Comments:";
const timelineCol = bootstrap("div", "col-lg-6 ml-auto timeline");
const timelineBody = bootstrap("div", "card timeline__card mb-2 p-4 text-dark");
const timelineTitle = bootstrap("h5", "h4 font-weight-bold text-center");
timelineTitle.innerText = "Other articles";
commentCardRow.appendChild(commentTitle);
timelineBody.appendChild(timelineTitle);
timelineCol.appendChild(timelineBody);

// Delete post button
const deleteBtn = bootstrap("button", "btn btn-danger delete-post-btn hidden");
deleteBtn.setAttribute("data-toggle", "modal");
deleteBtn.setAttribute("data-target", "#deletePostModal");
deleteBtn.innerText = "Delete";

// appending child elements into their parent element
postTitleCol.append(postTitle);
postTitleRow.append(postTitleCol);
mainContentCol.append(createAPost, postTitleRow, postCardRow, commentRow);
mainContentRow.append(mainContentCol);
container.append(mainContentRow);
containerFluid.appendChild(container);
document.body.append(navBar, containerFluid);

// HTML Selectors
const createPostForm = document.querySelector(".description-form");
const username = document.getElementById("inputUsername");
const password = document.getElementById("inputPassword");
const subject = document.getElementById("inputTitle");
const description = document.getElementById("inputdescription");
const postLabel = document.querySelector(".post-label");
const toggleBtn = document.querySelector(".switch");
const toggleInput = document.querySelector(".checked");

// toggling event listener to switch to dark/ light theme
toggleBtn.addEventListener("click", () => {
  if (toggleInput.checked) {
    containerFluid.classList.toggle("bg-color");
  }
  if (containerFluid.classList.contains("bg-color")) {
    localStorage.setItem("color-theme", "bg-color");
    localStorage.setItem("status", true);
  } else {
    localStorage.setItem("color-theme", "default");
    localStorage.setItem("status", false);
  }
});

// function to save the current theme
const retrieveTheme = () => {
  let theme = localStorage.getItem("color-theme");
  let toggle = localStorage.getItem("status");
  toggle = JSON.parse(toggle);
  if (theme != null) {
    containerFluid.classList.remove("default", "bg-color");
    containerFluid.classList.add(theme);
    toggleInput.checked = toggle;
  }
};
retrieveTheme();

// Window event listener to keep the theme in all the tabs
window.addEventListener(
  "storage",
  function () {
    retrieveTheme();
  },
  false
);

// post form event listener to collect data from user
createPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  collectData();
});

// function to collect data from user form
const collectData = () => {
  const userValue = username.value;
  const passValue = password.value;
  const subValue = subject.value;
  const descriptionValue = description.value;
  postData(mockUri, queryId, userValue, passValue, subValue, descriptionValue);
  postLabel.classList.remove("hidden");
  setTimeout(() => {
    postLabel.classList.add("hidden");
    window.location.reload();
  }, 2000);
  queryId++;
  createPostForm.reset();
};

// sending form data to the api server
const postData = (...postDetails) => {
  const [uri, queryId, username, password, title, description] = postDetails;
  let data = {
    queryId,
    username,
    password,
    title,
    description,
  };
  fetch(uri, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((resp) => resp.json())
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.error(err));
};

// async function to fetch data from uri
async function posts() {
  try {
    const uriData = await fetch(mockUri);
    const uriDataJson = await uriData.json();
    displayAllPosts(uriDataJson);
  } catch {
    console.error("Api error occured");
  }
}
posts();

//async function to fetch data from guardian
async function articles() {
  const promise = await fetch(newsAPI + apiKey);
  let data = await promise;
  data = await data.json();
  displayArticleLinks(data.response.results);
}
articles();

//function to fetch comments
function comments(id) {
  fetch(mockUri + id + "/comments")
    .then((res) => res.json())
    .then((data) => displayComments(data))
    .catch((err) => console.error(err));
}

// function to add comments and send them to server
function addComment(name, comment, scheduled) {
  const data = { name, comment, scheduled };
  fetch(mockUri + singlePostId + "/comments", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((resp) => resp.json())
    .then((result) => {})
    .catch((err) => console.error(err));
}

// function to display add a comment form
const addCommentForm = () => {
  commentForm.classList.toggle("hidden");
};

// function to display articles from guardian
function displayArticleLinks(articles) {
  articles.forEach((article) => {
    const item = bootstrap("div", "article-item p-2");
    const link = bootstrap("a", "article-link");
    link.setAttribute("href", article.webUrl);
    link.setAttribute("target", "_blank");
    link.innerText = article.webTitle;
    item.appendChild(link);
    timelineBody.appendChild(item);
  });
}

// function to display all post on home page
const displayAllPosts = (postdata) => {
  postdata.forEach((data) => {
    const postCardCol = bootstrap("div", "col-sm-6 col-md-4 col-lg-3 px-2");
    const postCard = bootstrap(
      "div",
      "card all-card my-3 py-2 shadow-sm p-3 rounded "
    );
    postCard.addEventListener("click", () => {
      displaySinglePost(
        data.id,
        data.username,
        data.password,
        data.title,
        data.description
      );
    });
    postCard.innerHTML = `
        <div class="card-body bg-transparent text-dark overflow-hidden py-2">          
          <h5 class="card-title h5 font-weight-bold">${data.title}</h5>          
          <p class="card-text">${data.description}</p>          
        </div>        
          <p class="card__text bg-transparent text-dark">Created by: ${data.username}</p>
      `;
    postCardCol.append(postCard);
    postCardRow.insertBefore(postCardCol, postCardRow.childNodes[0]);
  });
};

// function to display a detailed full page post
const displaySinglePost = (...postDetails) => {
  const [id, username, password, title, description] = postDetails;
  singlePostId = id;
  comments(id);
  // Emptying main content box, changing title,
  postCardRow.innerText = "";
  postTitle.innerText = title;
  createAPost.classList.remove("hidden");
  // creating single post page
  const postCardCol = bootstrap("div", "col-lg-12");
  const postCard = bootstrap("div", "card single-card");
  const cardBody = bootstrap("div", "card-body bg-transparent text-dark");
  const authorImgDiv = bootstrap("div", "text-center");
  const authorImg = bootstrap("img", "author-img");
  authorImg.setAttribute("src", "https://i.pravatar.cc/80");
  const authorName = bootstrap("p", "card-text font-weight-bold");
  authorName.innerText = username;
  const cardText = bootstrap("p", "card-text h5 px-3 mt-3");
  cardText.innerText = description;
  const addBtn = bootstrap("button", "btn btn-info add-comment-btn");
  addBtn.setAttribute("type", "button");
  addBtn.innerText = "Add a response";
  addBtn.onclick = addCommentForm;
  deleteBtn.onclick = () => {
    deletePost(id, password);
  };
  // appending above html elements
  authorImgDiv.append(authorImg, authorName);
  cardBody.append(authorImgDiv, deleteBtn, deletePostModal, cardText);
  postCard.append(cardBody, addBtn);
  postCardCol.append(postCard);
  postCardRow.append(postCardCol, commentForm);
  deleteBtn.classList.remove("hidden");
};

// function to display comments
function displayComments(comments) {
  comments.forEach((data) => {
    const commentCardCol = bootstrap("div", "col-lg-12");
    const commentBody = bootstrap("div", "card mb-3");
    commentBody.innerHTML = `<div class="card-body bg-transparent text-dark">    
      <p class="card-text comment__text h6 pt-2">${data.comment}</p>      
    </div>
    <div class="card-footer text-muted d-flex justify-content-between">
    <span>Written by ${data.name} </span> <span>Posted at: ${data.scheduled} </span>
    </div>`;
    commentCardCol.append(commentBody);
    commentCardRow.append(commentCardCol);
    commentCol.append(commentCardRow);
    commentRow.append(commentCol, timelineCol);
    commentForm.classList.add("hidden");
  });
}

// function to post a comment
function postComment(e) {
  e.preventDefault();
  const inputName = document.getElementById("inputCommentName").value;
  const inputComment = document.getElementById("iputComment").value;
  const emptyMessage = document.querySelector(".empty-field");
  const scheduled = dateAndTime();
  if (inputName !== "" && inputComment !== "") {
    const commentCardCol = bootstrap("div", "col-lg-12");
    const commentBody = bootstrap("div", "card mb-3");
    commentBody.innerHTML = `<div class="card-body bg-transparent text-dark">    
      <p class="card-text comment__text h6 pt-2">${inputComment}</p>      
    </div>
    <div class="card-footer text-muted d-flex justify-content-between">
    <span>Written by ${inputName} </span> <span>Posted at: ${scheduled} </span>
    </div>`;
    commentCardCol.append(commentBody);
    commentCardRow.append(commentCardCol);
    commentCol.append(commentCardRow);
    commentRow.append(commentCol, timelineCol);
    commentForm.classList.add("hidden");
    addComment(inputName, inputComment, scheduled);
    commentForm.reset();
  } else {
    emptyMessage.innerText = "No field should be empty.";
    setInterval(() => {
      emptyMessage.innerText = "";
    }, 1000);
  }
}

// function to delete a post
const deletePost = (id, password) => {
  const deletePostBtn = document.querySelector(".delete-post-submit-btn");
  const passInput = document.getElementById("delete-post-pass");
  const message = document.querySelector(".delete-modal-title");
  deletePostBtn.addEventListener("click", () => {
    if (passInput.value === password) {
      try {
        fetch(mockUri + id, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            window.location.reload();
          });
      } catch (err) {
        console.err(err);
      }
    } else {
      message.innerText = "Oops! Password does not match. Try again.";
    }
  });
};

//function to capture date and time of comment
const dateAndTime = () => {
  const Month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let today = new Date();
  let date = `${today.getDate()} ${
    Month[today.getMonth()]
  } ${today.getFullYear()}`;
  let time = today.getHours() + ":" + today.getMinutes();
  const currentDateTime = time + " || " + date;
  return currentDateTime;
};
