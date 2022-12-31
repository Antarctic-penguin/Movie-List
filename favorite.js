const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

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
            <button class="btn btn-danger btn-remove-favorite" data-id='${element.id}'>X</button>
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

//移除喜愛影片
function removeFromFavorite(id) {
  // 第一個是檢查如果movies陣列不存在，第二個是如果movies array存在，但裡面沒有元素的情況
  if (!movies || !movies.length) return 
  const movieIndex = movies.findIndex((movie) => movie.id === Number(id))
  // findIndex 沒能找到符合的項目，則會回傳 -1
  if (movieIndex === -1) return
  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

// 顯示More視窗 & 移除喜愛電影
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const id = event.target.dataset.id
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(id)
  }
})

// 電影清單
renderMovieList(movies)
