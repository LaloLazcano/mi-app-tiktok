'use client';

import React, { useState, useRef, useEffect } from 'react';
import './Formato_app.css';
import videos from './videos.json'; // Asumiendo que los videos están en un JSON
import { FaSearch } from 'react-icons/fa';

const VideoSwipeApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [viewFavorites, setViewFavorites] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTouch, setStartTouch] = useState(0);
  const [muted, setMuted] = useState(false);

  const handleSwipe = (direction) => {
    if (direction === 'up' && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleNextVideo);
      return () => {
        videoRef.current.removeEventListener('ended', handleNextVideo);
      };
    }
  }, [currentIndex]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFavorite = () => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(currentIndex)
        ? prevFavorites.filter((fav) => fav !== currentIndex)
        : [...prevFavorites, currentIndex]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTouchStart = (e) => setStartTouch(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (!startTouch) return;
    const touchDiff = startTouch - e.touches[0].clientY;
    if (Math.abs(touchDiff) > 50) {
      handleSwipe(touchDiff > 0 ? 'up' : 'down');
      setStartTouch(0);
    }
  };

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const uniqueCategories = [...new Set(videos.map(video => video.category))];
  const filteredLibrary = viewFavorites 
    ? videos.filter((video, index) => favorites.includes(index))
    : uniqueCategories;

  return (
    <div className="app">
      {/* Barra de búsqueda */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        {searchTerm && filteredVideos.length > 0 && (
          <div className="search-suggestions">
            {filteredVideos.map((video, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => setCurrentIndex(videos.indexOf(video))}
              >
                {video.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para abrir la biblioteca */}
      <button className="library-toggle" onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
        ☰
      </button>

      {/* Imagen decorativa */}
      <img src="/images/schneider2.jpg" alt="" className="image-side" />

      {/* Biblioteca de videos */}
      <div className={`library ${isLibraryOpen ? 'open' : ''}`}>
        {/* Botón de cerrar */}
        <button className="close-library" onClick={() => setIsLibraryOpen(false)}>
          ✖
        </button>

        {/* Botón para cambiar entre categorías y favoritos */}
        <button className="toggle-favorites" onClick={() => setViewFavorites(!viewFavorites)}>
          {viewFavorites ? 'Ver todas las categorías' : 'Ver favoritos ★'}
        </button>

        {viewFavorites && favorites.length === 0 ? (
          <p>Aún no tienes videos favoritos</p>
        ) : (
          filteredLibrary.map((item, index) => (
            <div
              key={index}
              className="library-item"
              onClick={() => {
                if (viewFavorites) {
                  setCurrentIndex(videos.indexOf(item));
                }
              }}
            >
              {viewFavorites ? item.title : item}
            </div>
          ))
        )}
      </div>

      {/* Contenedor del video */}
      <div className="video-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
        <video
         ref={videoRef}
         src={videos[currentIndex].url}
         muted={muted}
         onPlay={() => setIsPlaying(true)}
         onPause={() => setIsPlaying(false)}
         playsInline
         preload="none"
         loop
         className="video-player"
        />
      </div>

      {/* Controles de video */}
      <div className="controls">
        <button className="control-btn" onClick={togglePlayPause}>
          {isPlaying ? '||' : '▷'}
        </button>
        <button className="control-btn" onClick={toggleFavorite}>
          {favorites.includes(currentIndex) ? '★' : '☆'}
        </button>
        <div className="video-title">{videos[currentIndex].title}</div>
      </div>
    </div>
  );
};

export default VideoSwipeApp;
