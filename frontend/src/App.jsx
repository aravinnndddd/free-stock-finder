import React, { useState } from "react";
import { Search, Camera, ExternalLink, Download, Loader2 } from "lucide-react";
import "./App.css"; // Import external styles

const App = () => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:5000/api/images?query=${query}`);
            const data = await res.json();
            setImages(data.images);
        } catch (err) {
            setError("Failed to fetch images. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchImages();
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <div className="header">
                <div className="header-title">
                    <Camera className="icon-large text-blue-500" />
                    <h1>Free Stock Image Finder</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <Search className="icon-small text-gray-400" />
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for any image..."
                />
                <button
                    className={`search-button ${isLoading ? "disabled" : "active"}`}
                    onClick={fetchImages}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="icon-small animate-spin" /> : "Search"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Image Grid */}
            <div className="image-grid">
                {images.map((img, index) => (
                    <div key={index} className="card">
                        <img src={img.url} alt={img.title} />
                        <div className="card-content">
                            <h3 className="card-title">{img.title}</h3>
                            <p className="card-source">Source: {img.source}</p>
                        </div>
                        <div className="card-footer">
                            <a href={img.link} target="_blank" rel="noopener noreferrer" className="view-link">
                                View Source <ExternalLink className="icon-small" />
                            </a>
                           
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {images.length === 0 && !isLoading && (
                <div className="empty-state">
                    <Camera className="icon-large text-gray-400" />
                    <p>Start searching to discover amazing stock images</p>
                </div>
            )}
        </div>
    );
};

export default App;
