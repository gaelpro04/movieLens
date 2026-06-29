import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
console.log("API_BASE:", API_BASE);

function MyApp() {
  return(
    <h1>Checkout console</h1>
  );
}

function Stage() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [movieSelected, setMovieSelected] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);
  const [movieReviews, setMovieReviews] = useState(null);
  const [streaming, setStreaming] = useState(null);

  const [clicked, setClicked] = useState(false);
  const [goBack, setGoBack] = useState(false);
  

  useEffect(() => {
    if (!query) {
      setMatches([]);
      return;
    }

    async function search() {
      const res = await fetch(`${API_BASE}/api/movies/search/${query}`);
      const data = await res.json();      
      setMatches(data);
    }
    search();
  }, [query]);

  async function handleClickMovie(movie) {
    setQuery("");
    setClicked(true);

    setTimeout(() => {
      setMovieSelected(movie);
      setClicked(false);
    }, 500);

    const res = await fetch(`${API_BASE}/api/movie/${movie.id}`);
    const data = await res.json();

    setMovieCredits(data.credits);       
    setMovieReviews(data);                   
    setStreaming(data["watch/providers"]);    
  }

  function onReload() {
    setMatches([]);
    setQuery("");
    setMovieSelected(null);
  }

  function handleClickGoBack() {
    setGoBack(true);

    setTimeout(() => {
      setMovieSelected(null);
      setGoBack(false);
    }, 500);
  }

  if (movieSelected) {
  return (
    <div className="whole">
      <DivUpper onMovie={handleClickMovie} onReload={onReload} query={query} matches={matches} setQuery={setQuery} />
      {movieCredits?.crew && movieReviews && streaming && (
        <DivMovie
          className="animate"       
          movie={movieSelected}
          credits={movieCredits}
          reviewsData={movieReviews}
          streaming={streaming}
          goBack={goBack}
          handleClick={handleClickGoBack}
        />
      )}
    </div>
  );
} else if (!movieSelected || goBack) {
  return (
    <div className="whole">
      <DivUpper onMovie={handleClickMovie} onReload={onReload} query={query} matches={matches} setQuery={setQuery} />

      <div className={clicked ? "catalog leaving" : "catalog"}>
        <DivMedium onMovie={handleClickMovie} />
        <DivAbove onMovie={handleClickMovie} />
      </div>
      
    </div>
  );
}
}

function DivMovie({movie, credits, reviewsData, streaming, goBack, handleClick}) {

  let reviews = reviewsData.reviews.results
  const runtime = reviewsData.runtime;
  const leng = reviewsData.spoken_languages[0].english_name;
  const popularity = reviewsData.popularity;

  let genres = [];
  for (const genre of reviewsData.genres) {
    genres.push(genre);
  }

  const genreLabel = genres.map((genrre, _) => {
    return(
      <label key={genrre.id} className="infss"> {genrre.name} </label>
    );
  })

  const providers = streaming.results?.MX?.flatrate || [];

  const providersIMG = providers.map((p) => (
    <img
      key={p.provider_id}
      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
    className="provider" style={{margin:10}}/>
  ));

  const cast = credits.cast.map((c, i) => {

    const path = `https://image.tmdb.org/t/p/w185${c.profile_path}`
    return(
      <div key={i} className="casTags">
        <img src={path} className="castName"/>
        <label className="userNameDiv1"> {c.name} </label>
      </div>
    ); 
  })


  const movieTagLink = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const movieName = movie.title;
  const director = credits.crew.find(d => d.job === "Director").name;
  const overView = movie.overview;
  const rate = movie.vote_average;

  const divReviews = reviews.map((review, _) => {

    const user = review.author_details;
    let avatar_reviewer = undefined;
    if (user.avatar_path) {
      avatar_reviewer = <img src={`https://image.tmdb.org/t/p/w185${user.avatar_path}`} className="userAvatarDiv"/>
    } else {
      avatar_reviewer = <img src="public\user.jpg" className="userAvatarDiv"/>

    }

    const content = review.content;

    return(
      <div key={review.id} className={user.username} style={{margin:30}}>      
          <div className="topPeekReviewDiv">
            {avatar_reviewer}
            <label className="userNameDiv"> {user.username} </label>
          </div>
          <div className="buttomPeekReviewDiv">
            <label className="reviewDiv"> {content} </label>
          </div>
      </div>
      
    );
  });

  return(
    <>
      <div className={goBack ? "DivAll ani" : "DivAll"}>
        <button className="goBack" onClick={handleClick}> Go back. </button>

         <div className="DivMovie">
        <div className="DivMovieLeft">
          <img src={moviePoster} className="poster"/>
          <div className="information">
            <div className="Minformation">
              <label className="infss"> Runtime: {runtime} </label>
              <label className="infss"> Lenguage: {leng} </label>
              <label className="infss"> Popularity: {popularity} </label>
            </div>

            <div className="vertical-divider"> </div>

            <div className="Minformation">
              {genreLabel}
            </div>
          </div>

          <div className="stream">
            {providersIMG}
          </div>

            <div className="castContainer">
              <label className="ccc"> Cast </label>
              <div className="cast">
                {cast}
              </div>
            </div>
            
        </div>
        <div className="DivMovieCenter">
          <label className="nameMovie"> {movieName} </label>
          <label className="nameDirector"> By {director} </label>
          <label className="nameDirector"> ★ {rate} </label>
          <label className="nameOverview"> {overView} </label>
        </div>

        <div className="DivMovieRight">
          <div className="DivMoviePeek">            
            {divReviews}
          </div>
        </div>
      </div>
      </div>
     
    </>
  );
}

function DivUpper({ onMovie, onReload, query, matches, setQuery }) {

  const listSearch = matches.map((movie) => {
    return(
      <li key={movie.id} onClick={() => onMovie(movie)}> {movie.title} </li>  
    );
  })
  
  return(
    <div className="divUpper">
      <div className="divUpperApart">
          <h1> movieLens. </h1>
          <img src="/movielens_smile.svg" className="logo" onClick={onReload}/>
        </div>
      
      <input className="inputBar" placeholder="  Search for a movie..." value={query} 
      onChange = {(e) => setQuery(e.target.value)}/>

      <ul className="matches">
        {listSearch}
      </ul>
    </div>
  );
}

function DivMedium({onMovie}) {
  const [popular20Movies, setPopular20Movies] = useState([]);
  const [creditsPM, setCreditsPM] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    async function getPopularMovies() {
      const res = await fetch(`${API_BASE}/api/movies/popular`);
      const data = await res.json();
      setPopular20Movies(data);
      
      let movieId = data[0].id;

      const res1 = await fetch(`${API_BASE}/api/movie/${movieId}`);
      const data1 = await res1.json();
      setCreditsPM(data1.credits);
      setReviews(data1.reviews.results);
      
    }
    
    getPopularMovies();
  }, []);


  const postersMovie = popular20Movies.map((movie, _) => {

    return(
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} key={movie.id} onClick={() => onMovie(movie)}/>
    );
  })

  return(
    <>
      <hr className="divider"></hr>
      <label className="dividerLabel"> top Movies. </label>
      <div className="DivMedium">
        <div className="DivMediumApart">
          {postersMovie}
        </div>

        {popular20Movies.length > 0 && creditsPM?.crew && (
        <MovieTag popularMovie={popular20Movies[0]} creditPopularMovie={creditsPM} reviews={reviews}/>
        )}

      </div>
    </>
  );
}

function MovieTag({ popularMovie, creditPopularMovie, reviews }) {
  const movieTagLink = `https://image.tmdb.org/t/p/w780${popularMovie.backdrop_path}`;
  const moviePoster = `https://image.tmdb.org/t/p/w500${popularMovie.poster_path}`;
  const movieName = popularMovie.title;
  const director = creditPopularMovie.crew.find(d => d.job === "Director")?.name; 
  const overView = popularMovie.overview;
  const rate = popularMovie.vote_average;

  const hasReviews = reviews?.length > 0;
  const picked = hasReviews ? reviews[Math.floor(Math.random() * reviews.length)] : null;
  const reviewer = picked?.author_details;

  const avatar_reviewer = (
    <img
      src={reviewer?.avatar_path
        ? `https://image.tmdb.org/t/p/w185${reviewer.avatar_path}`
        : "/user.jpg"}
      className="userAvatar"
    />
  );

  return (
    <div className="DivContainer">
      <div className="DivTag" style={{ backgroundImage: `url(${movieTagLink})` }} />

      <div className="DivTagTrans">
        <img src={moviePoster} className="test" />

        <div className="BannerInfo">
          <label className="topLabel"> Top movie. </label>
          <label className="titleLabel"> {movieName} </label>
          <label className="directorLabel"> By {director} </label>
          <label className="descriptionLabel"> ★ {rate} </label>
          <label className="descriptionLabel"> {overView} </label>
        </div>

        {picked && (
          <div className="peekReview">
            <div className="topPeekReview">
              {avatar_reviewer}
              <label className="userName"> {reviewer?.username} </label>
            </div>
            <div className="bottomPeekReview">
              <ReviewItem review={picked.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DivAbove({ onMovie }) {
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    async function getAllGenres() {
      const res = await fetch(`${API_BASE}/api/movies/genres`);
      const data = await res.json();

      const fiveGenres = data.genres.slice(0, 5);

      const results = await Promise.all(
        fiveGenres.map(async (genre) => {
          const res1 = await fetch(
            `${API_BASE}/api/movies/genres/${genre.id}`
          );
          const data1 = await res1.json();
          return { genre, movies: data1.results };
        })
      );

      setGenreData(results);
    }

    getAllGenres();
  }, []);

  return (
    <>
      {genreData.map(({ genre, movies }) => (
        <div key={genre.id}>
          <hr className="divider2" />
          <label className="dividerLabel"> {genre.name} </label>
          <div className="DivAbove">
            <div className="DivMediumApart">
              {movies.map((movie) => (
                <img
                  key={movie.id}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  onClick={() => onMovie(movie)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Stage
