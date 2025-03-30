import React, { useEffect, useRef, useState } from 'react';
import ePub, { Rendition, Book } from 'epubjs';

interface EpubViewerProps {
  epubUrl: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ epubUrl }) => {
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [toc, setToc] = useState<any[]>([]);

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
      h1: { color: '#333333' },
      h2: { color: '#333333' },
      p: { color: '#555555' },
      a: { color: '#007bff', textDecoration: 'none' },
      'a:hover': { color: '#0056b3' },
    };
    rendition.themes.register('customTheme', customTheme);
    rendition.themes.select('customTheme');

    // Load Table of Contents
    book.loaded.navigation.then((nav) => setToc(nav.toc));

    return () => rendition.destroy();
  }, [epubUrl]);

  const goToChapter = (href: string) => renditionRef.current?.display(href);
  const handlePrev = () => renditionRef.current?.prev();
  const handleNext = () => renditionRef.current?.next();

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar for TOC */}
      <aside className="min-h-[20rem] w-full overflow-y-auto border-r border-gray-300 bg-white p-4 md:w-1/4">
        <h2 className="mb-4 text-lg text-gray-800">Table of Contents</h2>
        <ul>
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
            Previous
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpubViewer;
