//網址API相關變數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";

//使用者空陣列
const users = [];
let filteredUsers = [];
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

//從網址取得所有使用者資料放入到使用者變數中在渲染到網頁中
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    //let users = response.data.results
    renderPaginator(users.length);
    renderUserList(getUsersByPage(1))
}).catch((err) => console.log(err));

//加入最愛使用者函式
function addToFavorite(id) {
  //console.log(id)
  //將從localStroage找到的favoriteUsers資料或空陣列資料存入到list
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  //將總使用者清單找出id等於傳入的id放入到user變數
  const user = users.find((user) => user.id === id)
  //如果使用者的id等於傳入的id,則顯示警告
  if (list.some((user) => user.id === id)) {
    return alert('此使用者已經收藏在清單中!')
  }
  //若沒有該id就相使用者資料更新到list變數中
  list.push(user)
  //再將list資料內容寫入localStorage中的favoriteUser裡
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

//監聽使用者modal詳細資料
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
    //console.log(id);
    //加入最愛使用者點選監聽
  } else if(event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});


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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML;
}

//使用者modal詳細資料
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

//設置搜尋監聽資料
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // let filteredUsers = []
  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }
  //重置分頁器
  renderPaginator(filteredUsers.length)
  //renderUserList(filteredUsers)
  //顯示第1頁搜尋的結果
  renderUserList(getUsersByPage(1))
})

//設定分頁顯示使用者清單數量
const USERS_PER_PAGE = 12

function getUsersByPage(page) {
  //
  const data = filteredUsers.length ? filteredUsers : users
  //計算起始 index 
  const startIndex = (page - 1) * USERS_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})

