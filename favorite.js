//網址API相關變數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";

//使用者空陣列
const users = JSON.parse(localStorage.getItem('favoriteUsers'));
//console.log(users)

//設定網頁相關元素定位
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator")
const userAvatar = document.querySelector("#show-user-avatar");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userGender = document.querySelector("#user-gender");
const userAge = document.querySelector("#user-age");
const userRegion = document.querySelector("#user-region");
const userBirth = document.querySelector("#user-birth");

//監聽使用者modal詳細資料
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
    //console.log(id);
    //最愛使用者點選監聽
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderUserList(users)

//使用者清單資料
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2" style="width: 10rem">
          <div class="card">
            <img
              data-id="${item.id}" src="${item.avatar}" class="card-img-top" alt="User Poster">
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#modal-show-user" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//使用者詳細資料
function showUserModal(id) {
  axios.get(INDEX_URL + id).then((response) => {
    let data = response.data;
    //console.log(data.surname);
    userAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="User Poster">`;
    userName.innerHTML = `${data.name} ${data.surname}`;
    userEmail.innerHTML = `email: ${data.email}`;
    userGender.innerHTML = `gender: ${data.gender}`;
    userAge.innerHTML = `age: ${data.age}`;
    userRegion.innerHTML = `region: ${data.region}`;
    userBirth.innerHTML = `birthday: ${data.birthday}`;
  });
}

//移除最愛使用者函式
function removeFromFavorite(id) {
  if(!users) return
  //在總使用者清單搜尋要刪除使用者的index
  const userIndex = users.findIndex((user) => user.id === id)
  //如果沒找到使用者id就結束
  if (userIndex === -1 ) return
  //找到使用者id的情況下就刪除該資料
  users.splice(userIndex, 1)
  //將刪除後的資料寫回到localStorage的favoriteUsers下
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  //重新渲染使用者資料
  renderUserList(users)
}