import React, { useEffect, useRef, useState } from 'react';
import ePub, { Rendition, Book } from 'epubjs';
import type { Location } from 'epubjs';
import { HiMiniTrash } from 'react-icons/hi2';
import { HiArrowSmallRight } from 'react-icons/hi2';
import { HiArrowSmallLeft } from 'react-icons/hi2';
import Modal from './Modal';

interface EpubViewerProps {
  epubUrl: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ epubUrl }) => {
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<{ name: string; cfi: string }[]>(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('bookmarks') || '[]')
      : [],
  );
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [showToc, setShowToc] = useState<boolean>(false);

  const toggleToc = () => {
    setShowToc((prev) => !prev);
  };

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

  const goToChapter = (href: string) => {
    renditionRef.current?.display(href);
    setShowToc(false);
  };
  const handlePrev = () => renditionRef.current?.prev();
  const handleNext = () => renditionRef.current?.next();

  const addBookmark = () => {
    if (currentLocation) {
      const bookmarkName = prompt('Enter a name for your bookmark:');
      if (!bookmarkName) return; // If the user cancels, do nothing

      const updatedBookmarks = [
        ...bookmarks,
        { name: bookmarkName, cfi: currentLocation },
      ];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  const goToBookmark = (cfi: string) => {
    renditionRef.current?.display(cfi);
  };

  const removeBookmark = (cfi: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b.cfi !== cfi);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Modal>
          <Modal.Open opens="bookmarks">
            <button className="rounded-md bg-lblue p-2">Open Bookmarks</button>
          </Modal.Open>
          <Modal.Window name="bookmarks">
            <div className="flex flex-col gap-4 p-4">
              <h2 className="text-lg font-semibold text-gray-700">Bookmarks</h2>
              {bookmarks.length === 0 ? (
                <p className="text-gray-500">No bookmarks added yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {bookmarks.map((bookmark) => (
                    <li
                      key={bookmark.cfi}
                      className="flex items-center justify-between border-b border-gray-300 pb-2"
                    >
                      <button
                        className="text-gray-600 hover:text-lblue"
                        onClick={() => goToBookmark(bookmark.cfi)}
                      >
                        {bookmark.name}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeBookmark(bookmark.cfi)}
                      >
                        <HiMiniTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Modal.Window>
        </Modal>

        <button
          onClick={toggleToc}
          className="rounded-md bg-lblue p-2 md:hidden"
        >
          {!showToc ? (
            <svg
              fill="none"
              strokeWidth="2"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              height="1.5em"
              width="1.5em"
              // style="overflow: visible; color: currentcolor;"
            >
              <path d="M3 12 21 12"></path>
              <path d="M3 6 21 6"></path>
              <path d="M3 18 21 18"></path>
            </svg>
          ) : (
            <svg
              fill="currentColor"
              stroke-width="0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              height="1.5em"
              width="1.5em"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="grid min-h-screen grid-cols-1 gap-4 overflow-hidden md:grid-cols-[1fr_2fr]">
        {/* Sidebar for TOC and Bookmarks */}

        {showToc && (
          <aside className="max-h-[25rem] min-h-[15rem] w-full overflow-y-auto rounded-md border-r border-gray-300 bg-white p-4 md:min-h-screen">
            <h2 className="w-full text-lg font-semibold text-gray-800">
              Table of Contents
            </h2>
            <ul className="mt-6 flex flex-col items-start gap-2">
              {toc.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 w-full border-b border-gray-300 pb-2"
                >
                  <button
                    className="text-gray-600 hover:text-lblue"
                    onClick={() => goToChapter(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <aside className="hidden max-h-[25rem] min-h-[15rem] w-full overflow-y-auto rounded-md border-r border-gray-300 bg-white p-4 md:block md:min-h-screen">
          <h2 className="w-full text-lg font-semibold text-gray-800">
            Table of Contents
          </h2>
          <ul className="mt-6 flex flex-col items-start gap-2">
            {toc.map((item, index) => (
              <li
                key={index}
                className="mb-2 w-full border-b border-gray-300 pb-2"
              >
                <button
                  className="text-gray-600 hover:text-lblue"
                  onClick={() => goToChapter(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* EPUB Viewer */}
        <div className="flex w-full flex-col overflow-hidden rounded-md">
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
    </>
  );
};

export default EpubViewer;
