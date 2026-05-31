const API_KEY = "15d3e10f6a6b61a4142cb1d587a02673";

const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

async function fetchMovies(query = "") {

    try {

        let url;

        if (query.trim() !== "") {

            url =
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;

        } else {

            url =
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao buscar filmes.");
        }

        const data = await response.json();

        return data.results;

    } catch (error) {

        showMessage(error.message);
        return [];
    }
}

function createMovieCard(movie) {

    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=Sem+Imagem";

    card.innerHTML = `
        <img src="${poster}" alt="${movie.title}">
        
        <div class="movie-info">
            <h3>${movie.title}</h3>

            <p>
                <strong>Ano:</strong>
                ${movie.release_date
                    ? movie.release_date.substring(0,4)
                    : "N/A"}
            </p>

            <p>
                <strong>Nota:</strong>
                ${movie.vote_average}
            </p>

            <p>
                ${movie.overview
                    ? movie.overview.substring(0,100) + "..."
                    : "Sem descrição"}
            </p>
        </div>
    `;

    return card;
}

function renderMovies(movies) {

    movieList.innerHTML = "";

    if (movies.length === 0) {

        showMessage("Nenhum filme encontrado.");
        return;
    }

    showMessage("");

    movies.forEach(movie => {

        const card = createMovieCard(movie);

        movieList.appendChild(card);
    });
}

function showMessage(text) {

    message.textContent = text;
}

async function init() {

    showMessage("Carregando filmes...");

    const movies = await fetchMovies();

    renderMovies(movies);
}

btnSearch.addEventListener("click", async () => {

    const query = searchInput.value;

    showMessage("Buscando...");

    const movies = await fetchMovies(query);

    renderMovies(movies);
});

searchInput.addEventListener("keypress", async (event) => {

    if(event.key === "Enter") {

        const query = searchInput.value;

        showMessage("Buscando...");

        const movies = await fetchMovies(query);

        renderMovies(movies);
    }
});

init();


  