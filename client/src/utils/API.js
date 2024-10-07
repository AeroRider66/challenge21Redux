const key = import.meta.env.VITE_RAWG_API_KEY;

export const searchBooks = ({search, platforms, genres}) => {
    let genre=''
    if (genres.length > 0) {
        genre = `&genres=${genres}`;
    }
    return fetch(`https:`)
};


