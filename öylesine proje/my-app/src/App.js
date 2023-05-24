import React, { useState, useEffect } from "react";
import "./App.css";

function PageLoader() {
  return (
    <div className="page-loader">
      <img
        src="https://upload.wikimedia.org/wikipedia/ro/thumb/8/89/Pikachu.jpg/220px-Pikachu.jpg"
        alt="Pikachu"
        className="loader-image"
      />
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonData, setPokemonData] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [visiblePages, setVisiblePages] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((response) => response.json())
      .then((data) => {
        setPokemonData(data.results);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const pageCount = Math.ceil(pokemonData.length / perPage);
    const totalVisiblePages = Math.min(pageCount, 10);

    if (pageCount <= 10) {
      setVisiblePages(Array.from({ length: pageCount }, (_, i) => i + 1));
    } else if (currentPage <= 6) {
      setVisiblePages(Array.from({ length: totalVisiblePages }, (_, i) => i + 1));
    } else if (currentPage >= pageCount - 4) {
      setVisiblePages(
        Array.from({ length: totalVisiblePages }, (_, i) => pageCount - totalVisiblePages + i + 1)
      );
    } else {
      setVisiblePages(Array.from({ length: totalVisiblePages }, (_, i) => currentPage - 5 + i));
    }
  }, [currentPage, perPage, pokemonData]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredData = pokemonData.filter((val) => {
    return val.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pageCount = Math.ceil(filteredData.length / perPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addToFavorites = (pokemon) => {
    const updatedFavorites = [...favorites, { ...pokemon, isFavorite: true }];
    setFavorites(updatedFavorites);
  };

  const removeFromFavorites = (pokemon) => {
    const updatedFavorites = favorites.filter((fav) => fav.name !== pokemon.name);
    setFavorites(updatedFavorites);
  };

  const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <label className="mode-control">
            <input
              className="input"
              id="mode-btn"
              type="checkbox"
              onClick={handleToggleMode}
              checked={darkMode}
            />
            <span>Koyu Mod</span>
            <span>Açık Mod</span>
          </label>
          <h1>Pokemon</h1>

          <div className="inputContainer">
            <input
              className={`search ${darkMode ? "dark" : ""}`}
              type="text"
              placeholder="Pokemon ismi giriniz"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dataContainer">
            {paginatedData.map((val, index) => {
              const isFavorite = favorites.find((fav) => fav.name === val.name);

              return (
                <div className={`data ${darkMode ? "dark" : ""}`} key={index}>
                  {isFavorite && <span className="favorite-icon">&#10003;</span>}
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      val.url.split("/")[6]
                    }.png`}
                    alt=""
                  />
                  <h3>{val.name}</h3>
                  <p></p>
                  {isFavorite ? (
                    <button className="favorite-button" onClick={() => removeFromFavorites(val)}>
                      <span className="favorite-button-icon">&#8722;</span>
                      Favorilerden Çıkar
                    </button>
                  ) : (
                    <button className="favorite-button" onClick={() => addToFavorites(val)}>
                      <span className="favorite-button-icon">&#43;</span>
                      Favorilere Ekle
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pagination">
            <button
              className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
              disabled={currentPage === 1}
              onClick={() => handlePageClick(currentPage - 1)}
            >
              Prev
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`pagination-button ${currentPage === pageNumber ? "active" : ""}`}
                onClick={() => handlePageClick(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              className={`pagination-button ${currentPage === pageCount ? "disabled" : ""}`}
              disabled={currentPage === pageCount}
              onClick={() => handlePageClick(currentPage + 1)}
            >
              Next
            </button>
          </div>

          <div>
            <h2>Favoriler</h2>
            {favorites.map((fav, index) => (
              <div key={index}>
                <span>{fav.name}</span>
                <button className="favorite-button" onClick={() => removeFromFavorites(fav)}>
                  <span className="favorite-button-icon">&#8722;</span>
                  Favorilerden Çıkar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
