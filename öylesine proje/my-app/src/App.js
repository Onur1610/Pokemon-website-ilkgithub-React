import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonData, setPokemonData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => setPokemonData(data.results))
      .catch(error => console.log(error));
  }, []);

  const handleToggleMode = () => {
    setDarkMode(!darkMode);
  }

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <label className="mode-control">
        <input className="input" id="mode-btn" type="checkbox" onClick={handleToggleMode} />
        <span>Koyu Mod</span>
        <span>Açık Mod</span>
      </label>
      <h1>Pokemon</h1>
      
      <div className='inputContainer'>
        <input
          className={`search ${darkMode ? 'dark' : ''}`}
          type="text"
          placeholder="Pokemon ismi giriniz"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
      </div>
      
      <div className='dataContainer'>
        {pokemonData
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return val;
            }
          })
          .map((val, index) => {
            return (
              <div className={`data ${darkMode ? 'dark' : ''}`} key={index}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${val.url.split('/')[6]}.png`}
                  alt=""
                />
                <h3>{val.name}</h3>
                <p></p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
