import { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchBooks } from '../utils/API';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { formatDate } from '../utils/formatDate';

const SearchBooks = () => {
    // create state for holding returned google api data
    const [searchedBooks, setSearchedBooks] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState('');
    // genreIds set to all by default
    const [genreIds, setGenreIds] = useState([]);
    // platforms set to all modern platforms by default
    const [platformIds, setPlatformIds] = useState([1, 4, 7, 14, 18, 187]);

    const [saveBook] = useMutation(SAVE_BOOK);

    const user = localStorage.getItem('user');

    // create method to search for books and set state on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await searchBooks({ search: searchInput, platforms: platformIds.toString(), genres: genreIds.toString() });
            const data = await response.json();
            console.log(data);
            const books = data.results.map((books) => ({
                id: books.id,
                title: books.name,
                releaseDate: books.released,
                platforms: books.platforms.map((child) => child.platform.name),
                genres: books.genres.map((genre) => genre.name),
                image: books.background_image
            }))
            setSearchedBooks(books)
        } catch (err) {
            console.error(err);
        }
    };

    // create function to handle saving a books to our database
    const handleSaveBook = async (books) => {
        // get token
        console.log(books)
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            console.log('Saving books with data:', books); // Log the books data
            const response = await saveBook({
                variables: { ...books }
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error details:', errorDetails);
                throw new Error('something went wrong!');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        if (!genreIds.includes(value)) {
            setGenreIds([...genreIds, value]);
        }
    };

    const handlePlatformChange = (e) => {
        const value = e.target.value;
        if (!platformIds.includes(value)) {
            setPlatformIds([...platformIds, value]);
        }
    };

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    <p>Search for Books!</p>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    className='mb-3'
                                    name='searchInput'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type='text'
                                    size='lg'
                                    placeholder='Search for a books'
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type='submit' variant='success' size='lg'>
                                    Submit Search
                                </Button>
                            </Col>
                            <Col>
                                <label>Platforms</label>
                                <Form.Check
                                    type='checkbox'
                                    label='PC'
                                    value='4'
                                    onChange={handlePlatformChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='PlayStation 5'
                                    value='187'
                                    onChange={handlePlatformChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Xbox Series X'
                                    value='186'
                                    onChange={handlePlatformChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Nintendo Switch'
                                    value='7'
                                    onChange={handlePlatformChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='PlayStation 4'
                                    value='18'
                                    onChange={handlePlatformChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Xbox One'
                                    value='1'
                                    onChange={handlePlatformChange}
                                />
                            </Col>
                            <Col>
                                <label>Genres</label>
                                <Form.Check
                                    type='checkbox'
                                    label='Action'
                                    value='4'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Adventure'
                                    value='3'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='RPG'
                                    value='5'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Strategy'
                                    value='10'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Puzzle'
                                    value='7'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Shooter'
                                    value='2'
                                    onChange={handleGenreChange}
                                />
                                <Form.Check
                                    type='checkbox'
                                    label='Racing'
                                    value='1'
                                    onChange={handleGenreChange}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
            <Row className='books-cards'>
                {searchedBooks?.map((books) => {
                    return (
                        <Col md="4" key={books.id}>
                            <Card border='dark' className='books-card'>
                                <Card.Img src={books.image} alt='box art' variant='top' className="books-card-img"/>
                                <Card.Body className="books-card-body">
                                    <h4>{books.title}</h4>
                                    <p>Released {formatDate(books.releaseDate)}</p>
                                    <div className='list'>
                                        <p>Platforms:&nbsp;</p>
                                        {books.platforms.join(' ')}
                                    </div>
                                    <div className='list'>
                                        <p>Genres:&nbsp;</p>
                                        {books.genres.join(' ')}
                                    </div>
                                    {Auth.loggedIn() && (
                                        <Button
                                            disabled={user.books?.some((savedBook) => savedBook.id === books.id)}
                                            className='btn-block btn-info'
                                            onClick={() => handleSaveBook(books)}>
                                            {user.books?.some((savedBook) => savedBook.id === books.id)
                                                ? 'This books is in your library.'
                                                : 'Save this Book!'}
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default SearchBooks;