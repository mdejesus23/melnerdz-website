import { useState, useEffect, useRef } from 'react';

interface BookmarkProps {
  currentLocation?: string;
  setBookmarks: React.Dispatch<
    React.SetStateAction<{ name: string; cfi: string }[]>
  >;
  bookmarks: { name: string; cfi: string }[];
  onCloseModal?: () => void;
}

function addBookmarkForm(props: BookmarkProps) {
  const { currentLocation, setBookmarks, bookmarks, onCloseModal } = props;
  const [bookmarksName, setBookmarksName] = useState<string>('');
  const [bookmarksError, setBookmarksError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookmarksName(e.target.value);
  };

  const addBookmark = () => {
    if (props.currentLocation) {
      // const bookmarkName = prompt('Enter a name for your bookmark:');
      if (!bookmarksName) {
        setBookmarksError('Bookmark name cannot be empty.');
        return;
      } // If the user cancels, do nothing

      const updatedBookmarks = [
        ...bookmarks,
        { name: bookmarksName, cfi: currentLocation! },
      ];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarksName(''); // Clear the input field
      onCloseModal?.();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold text-gray-700">Add Bookmark</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Bookmark Name"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addBookmark();
          }
        }}
        onChange={changeHandler}
        value={bookmarksName}
        className="rounded border border-gray-300 p-2 text-neutral-800"
      />
      {bookmarksError && (
        <p className="mt-[-10px] text-xs text-red-500">{bookmarksError}</p>
      )}
      <button
        onClick={addBookmark}
        className="rounded bg-lblue px-4 py-2 text-white"
      >
        Add Bookmark
      </button>
    </div>
  );
}

export default addBookmarkForm;
