import DOMPurify from 'dompurify';
import Fuse from 'fuse.js';
import type { SearchData } from '@/types/dataTypes';

document.addEventListener('astro:page-load', () => {
  const search = document.getElementById('search') as HTMLInputElement;
  const resultsList = document.getElementById(
    'searchResults',
  ) as HTMLUListElement;

  let SEARCH_DATA: SearchData[] | null = null;
  let FUSE_INSTANCE: any;
  const FUSE_OPTIONS = {
    minMatchCharLength: 2,
    includeScore: true,
    shouldSort: true,
    threshold: 0.2,
    keys: [
      {
        name: 'title',
        weight: 1,
      },
      {
        name: 'description',
        weight: 0.75,
      },
    ],
  };

  const SPINNER = `<span class="text-lblue"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="fill-current" viewBox="0 0 256 256" id="spinner"><path d="M236,128a108,108,0,0,1-216,0c0-42.52,24.73-81.34,63-98.9A12,12,0,1,1,93,50.91C63.24,64.57,44,94.83,44,128a84,84,0,0,0,168,0c0-33.17-19.24-63.43-49-77.09A12,12,0,1,1,173,29.1C211.27,46.66,236,85.48,236,128Z"></path><style>
          #spinner {
              animation: spin 1s linear infinite;
          }
          @keyframes spin {
              100% {
                  transform: rotate(360deg);
              }
          }
          </style></svg></span>`;

  function updateSearchPageURL(search: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('q', search);
    window.history.replaceState(null, '', url);
  }

  function generateSearchList(results: any[]) {
    return results
      .map((r) => {
        const { title, slug, description, image, collection } = r.item;

        return `
        <li>
          <a href="/${collection}/${slug}/" class="block rounded-md bg-white/10 p-4 hover:bg-white/20 transition">
            <h3 class="font-bold text-lg text-lblue">${title}</h3>
            <p class="text-sm text-neutral-300 mt-1">${description}</p>
          </a>
        </li>
      `;
      })
      .join('');
  }

  async function fetchSearchResults(search: string) {
    if (search.length === 0) return;

    if (resultsList) {
      resultsList.innerHTML = SPINNER;
    }
    if (!SEARCH_DATA) {
      try {
        const res = await fetch('/search.json');
        if (!res.ok) {
          throw new Error('Something went wrong…please try again');
        }
        const data = await res.json();
        SEARCH_DATA = data;
      } catch (e) {
        console.error(e);
      }
    }
    if (SEARCH_DATA && !FUSE_INSTANCE) {
      FUSE_INSTANCE = new Fuse(SEARCH_DATA, FUSE_OPTIONS);
    }
    if (!FUSE_INSTANCE) return;
    const searchResult = FUSE_INSTANCE.search(search);

    if (resultsList) {
      resultsList.innerHTML =
        searchResult.length > 0
          ? generateSearchList(searchResult)
          : `<li class="text-neutral-800 dark:text-neutral-200 ">No results found…</li>`;
    }
  }

  // Event listeners
  window.addEventListener('DOMContentLoaded', () => {
    const urlParams: string = DOMPurify.sanitize(
      new URLSearchParams(window.location.search).get('q') || '',
    );
    fetchSearchResults(urlParams);
    // updateDocumentTitle(urlParams);
    if (search) {
      search.value = urlParams || '';
      // search.focus();
    }
  });

  search?.addEventListener('input', () => {
    const searchTerm = DOMPurify.sanitize(search.value);
    // updateDocumentTitle(searchTerm);
    fetchSearchResults(searchTerm);
    updateSearchPageURL(searchTerm);
  });
});
