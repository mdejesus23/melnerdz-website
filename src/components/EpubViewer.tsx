import React, { useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { HiMiniTrash, HiMiniBars3, HiMiniXMark } from 'react-icons/hi2';

interface EpubViewerProps {
  epubUrl: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ epubUrl }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const storedBookmarks = JSON.parse(
        localStorage.getItem('bookmarks') || '[]',
      );
      setBookmarks(storedBookmarks);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to add a bookmark
  const addBookmark = () => {
    if (location && !bookmarks.includes(location)) {
      const updatedBookmarks = [...bookmarks, location];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Function to navigate to a bookmark
  const goToBookmark = (cfi: string) => setLocation(cfi);

  // Function to remove a bookmark
  const removeBookmark = (cfi: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b !== cfi);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar for bookmarks */}
      {isSidebarOpen && (
        <div className="fixed left-0 top-0 z-50 h-full w-[250px] bg-gray-800 p-4 text-white">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="mb-4 text-lg font-semibold text-red-500"
          >
            <HiMiniXMark size={36} />
          </button>
          <h3 className="text-xl font-bold text-lblue">Bookmarks</h3>
          <ul>
            {bookmarks.length > 0 ? (
              bookmarks.map((bookmark, index) => (
                <li key={index} className="mb-2">
                  <button
                    onClick={() => goToBookmark(bookmark)}
                    className="text-blue-400 hover:underline"
                  >
                    Bookmark {index + 1}
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    <HiMiniTrash />
                  </button>
                </li>
              ))
            ) : (
              <p>No bookmarks added</p>
            )}
          </ul>
        </div>
      )}

      {/* EPUB Reader */}
      <div className="flex w-full flex-col">
        <div className="h-[80vh] min-h-[45rem] w-full border border-gray-300 bg-gray-800 text-white">
          {/* ReactReader component */}
          <ReactReader
            url={epubUrl}
            location={location}
            locationChanged={(epubLocation) => setLocation(epubLocation)}
            epubInitOptions={{
              openAs: 'epub',
            }}
          />
        </div>

        <div className="flex justify-between bg-white p-4">
          <button
            onClick={addBookmark}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Add Bookmark
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded bg-gray-500 px-4 py-2 text-white"
          >
            <HiMiniBars3 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpubViewer;
