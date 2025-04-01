import React, { useEffect, useRef, useState } from 'react';
import ePub, { Rendition, Book } from 'epubjs';
import type { Location } from 'epubjs';
import { HiMiniTrash } from 'react-icons/hi2';
import { HiArrowSmallRight } from 'react-icons/hi2';
import { HiArrowSmallLeft } from 'react-icons/hi2';

interface EpubViewerProps {
  epubUrl: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ epubUrl }) => {
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('bookmarks') || '[]')
      : [],
  );
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    const book = ePub(epubUrl);
    const rendition = book.renderTo('viewer', {
      width: '100%',
      height: '80vh',
    });

    bookRef.current = book;
    renditionRef.current = rendition;
    rendition.display();

    // Apply Custom Theme
    const customTheme = {
      body: {
        backgroundColor: '#f9f9f9',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
      },
    };
    rendition.themes.register('customTheme', customTheme);
    rendition.themes.select('customTheme');

    // Track current location
    rendition.on('relocated', (location: Location) => {
      setCurrentLocation(location.start.cfi);
    });

    // Load Table of Contents
    book.loaded.navigation.then((nav) => setToc(nav.toc));

    return () => rendition.destroy();
  }, [epubUrl]);

  const goToChapter = (href: string) => renditionRef.current?.display(href);
  const handlePrev = () => renditionRef.current?.prev();
  const handleNext = () => renditionRef.current?.next();

  const addBookmark = () => {
    if (currentLocation && !bookmarks.includes(currentLocation)) {
      const updatedBookmarks = [...bookmarks, currentLocation];
      setBookmarks(updatedBookmarks);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      }
    }
  };

  const goToBookmark = (cfi: string) => {
    renditionRef.current?.display(cfi);
  };

  const removeBookmark = (cfi: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b !== cfi);
    setBookmarks(updatedBookmarks);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden rounded-lg md:flex-row">
      {/* Sidebar for TOC and Bookmarks */}
      <aside className="max-h-[25rem] min-h-[15rem] w-full overflow-y-auto border-r border-gray-300 bg-white p-4 md:w-1/4">
        <h2 className="w-full text-lg font-semibold text-gray-800">
          Table of Contents
        </h2>
        <ul className="mt-6">
          {toc.map((item, index) => (
            <li key={index} className="mb-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => goToChapter(item.href)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <h2 className="mb-4 mt-8 text-lg font-semibold text-gray-800">
          Bookmarks
        </h2>
        <ul>
          {bookmarks.length === 0 ? (
            <p>No bookmarks yet</p>
          ) : (
            bookmarks.map((bookmark, index) => (
              <li key={index} className="mb-2 flex items-center gap-2">
                <button
                  className="text-green-500 hover:underline"
                  onClick={() => goToBookmark(bookmark)}
                >
                  Bookmark {index + 1}
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => removeBookmark(bookmark)}
                >
                  <HiMiniTrash />
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* EPUB Viewer */}
      <div className="flex w-full flex-col md:w-3/4">
        <div
          id="viewer"
          className="flex-1 border border-gray-300 bg-white"
        ></div>
        <div className="flex justify-between bg-white p-4">
          <button
            onClick={handlePrev}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            <HiArrowSmallLeft />
          </button>
          <button
            onClick={addBookmark}
            className="rounded bg-lblue px-4 py-2 text-white"
          >
            Add Bookmark
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            <HiArrowSmallRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpubViewer;
