export const getSavedBookIds = () => {
    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : [];

    return savedBookIds;
};

export const saveBookIds = (ids) => {
    if (ids.length) {
        localStorage.setItem('saved_books', JSON.stringify(ids));

    } else {
        localStorage.removeItem('saved_books');
    }
};

export const removeBookId = (id) => {

    const savedBookIds = localStorage.getItem('saved_books')
        ? JSON.parse(localStorage.getItem('saved_books'))
        : null;

    if (!savedBookIds) {
        return false;
    }

    const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== id);

    localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

    return true;
};
