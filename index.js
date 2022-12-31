const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let keyWordMovies = []
const MOVIES_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('#pagination')

// 生成電影清單
function renderMovieList(data) {
  dataPanel.innerHTML = ''
  data.forEach(element => {
    let rawHTML = `
    <div class="col-sm-3 mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + element.image}"
            class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${element.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id='${element.id}'>More</button>
            <button class="btn btn-info btn-add-favorite" data-id='${element.id}'>+</button>
          </div>
        </div>
      </div>
    `
    dataPanel.innerHTML += rawHTML
  });
}

// 電影詳細資料(互動視窗)
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  modalTitle.innerText = ''
  modalDate.innerText = ''
  modalDescription.innerText = ''
  modalImage.innerHTML = ''
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

//添加喜愛影片
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === Number(id))
  if (list.some((movie) => movie.id === Number(id))) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 計算電影總共分成幾頁 & 添加頁碼
function renderPaginator(amount) {
  pagination.innerHTML = ''
  const page = Math.ceil(amount / MOVIES_PER_PAGE)
  for (let x = 1; x <= page; x++) {
    pagination.innerHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${x}'>${x}</a></li>
    `
  }
}

// 分割每頁電影
function getMoviesByPage(page) {
  // 當 keyWordMovies 為空陣列的時候，判斷為false，就會取 movies陣列
  const data = keyWordMovies.length ? keyWordMovies : movies
  const starIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(starIndex, starIndex + MOVIES_PER_PAGE)
}

// 點擊頁碼換頁
pagination.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  renderMovieList(getMoviesByPage(Number(event.target.dataset.page)))
})

// 顯示More視窗 & 添加喜愛電影
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const id = event.target.dataset.id
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(id)
  }
})

//搜索列
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault()
  //取得搜尋關鍵字
  const keyWord = searchInput.value.trim().toLowerCase()
  //條件篩選
  keyWordMovies = movies.filter(function (item) {
    return item.title.toLowerCase().includes(keyWord)
  })
  //錯誤處理：無符合條件的結果
  if (keyWordMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyWord} 沒有符合條件的電影`)
  }
  renderPaginator(keyWordMovies.length)
  //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(1))
  searchInput.value = ''
})

// 電影清單
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)
  })
  .catch((err) => console.log(err))

