import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { SAVED_BOOKS } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';

const SavedBooks = () => {
    const [books, setBooks] = useState([]); // Initialize with an empty array
    const { loading, data } = useQuery(SAVED_BOOKSS);
    const [removeBook] = useMutation(REMOVE_BOOK);

    useEffect(() => {
        if (data && data.savedBooks) {
            setBooks(data.savedBooks); // Ensure you are accessing the correct property
        }
    }, [data]);


    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (BookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const user = await removeBook({
                variables: { bookId },
            });
            setBooks(user);
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    };

    if (loading) {
        return <h2>LOADING...</h2>;
    }

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container fluid>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {books && books.length
                        ? `Viewing ${books.length} saved ${books.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {books.map((book) => {
                        return (
                            <Col key={book.id} md="4">
                                <Card border='dark'>
                                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className='small'>Authors: {book.authors}</p>
                                        <Card.Text>{book.description}</Card.Text>
                                        <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.id)}>
                                            Delete this Book!
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;
