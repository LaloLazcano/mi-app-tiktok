'use client';

import React, { useState, useRef, useEffect } from 'react';
import './Formato_app.css';
import videos from './videos.json';
import { FaSearch } from 'react-icons/fa';

const VideoSwipeApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [viewFavorites, setViewFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // ✅ AGREGADO PARA MANEJAR CATEGORÍA
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

  const uniqueCategories = [...new Set(videos.map(video => video.category))]; // ✅ CATEGORÍAS ÚNICAS
  const videosInCategory = selectedCategory
    ? videos.filter(video => video.category === selectedCategory) // ✅ FILTRA POR CATEGORÍA
    : [];
  const favoriteVideos = favorites.map(index => videos[index]);

  const libraryContent = viewFavorites
    ? favoriteVideos
    : selectedCategory
      ? videosInCategory
      : uniqueCategories;

  return (
    <div className="app">
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
                onClick={() => {
                  setCurrentIndex(videos.indexOf(video));
                  setSearchTerm(''); // <== Limpia la barra de búsqueda al hacer click
                }}
                >
                {video.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="library-toggle" onClick={() => setIsLibraryOpen(!isLibraryOpen)}>
        ☰
      </button>

      <img src="/images/schneider2.png" alt="" className="image-side" />

      <div className={`library ${isLibraryOpen ? 'open' : ''}`}>
        <button className="close-library" onClick={() => setIsLibraryOpen(false)}>
          ✖
        </button>

        <button
          className="toggle-favorites"
          onClick={() => {
            setViewFavorites(!viewFavorites);
            setSelectedCategory(null); // ✅ LIMPIA CATEGORÍA AL VER FAVORITOS
          }}
        >
          {viewFavorites ? 'Ver todas las categorías' : 'Ver favoritos ★'}
        </button>

        {!viewFavorites && !selectedCategory && <p className="category-prompt">Selecciona una categoría:</p>}
        {viewFavorites && favoriteVideos.length === 0 && (
          <p className="no-favorites-message">Aún no tienes videos favoritos</p>

        )}

        <div>
          {libraryContent.map((item, index) => (
            <div
              key={index}
              className="library-item"
              onClick={() => {
                if (viewFavorites || selectedCategory) {
                  const videoIndex = videos.indexOf(item);
                  setCurrentIndex(videoIndex);
                  setIsLibraryOpen(false);
                } else {
                  setSelectedCategory(item); // ✅ SELECCIÓN DE CATEGORÍA
                }
              }}
            >
              {viewFavorites || selectedCategory ? item.title : item}
            </div>
          ))}
        </div>

        {selectedCategory && !viewFavorites && (
  <button
    className="toggle-favorites"
    onClick={() => setSelectedCategory(null)}
    style={{ marginTop: '10px' }}
  >
    ← Volver a categorías
  </button>
)}

        
      </div>

      <div className="video-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
        <video
          ref={videoRef}
          src={videos[currentIndex].url}
          muted={muted}
          autoPlay
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="video-player"
        />
      </div>

      <div className="controls">
      <button className="control-btn play-btn" onClick={togglePlayPause}>
  {isPlaying ? '❚❚' : '▶'}
</button>
<button className="control-btn favorite-btn" onClick={toggleFavorite}>
  {favorites.includes(currentIndex) ? '★' : '☆'}
</button>


        <div className="video-title">{videos[currentIndex].title}</div>
      </div>
    </div>
  );
};

export default VideoSwipeApp;
