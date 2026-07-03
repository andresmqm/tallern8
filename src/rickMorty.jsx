import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function RickAndMorty() {
    const [personajes, setPersonajes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const obtenerPersonajes = async () => {
        try {
            setCargando(true);
            const respuesta = await axios.get('https://rickandmortyapi.com/api/character');
            setPersonajes(respuesta.data.results);
            setError(null);
        } catch (err) {
            console.error("Error al obtener los personajes:", err);
            setError("No se pudieron cargar los personajes");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerPersonajes();
    }, []);

    if (cargando) {
        return (
            <Container classname="text-center my-5">
                <Spinner animation="border" variant="warning" />
                <p classname="mt-2 text-white">Cargando...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container classname="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container classname="my-5">
            <h1 classname="text-center mb-4 text-warning">Personajes de Rick and Morty</h1>
            
            <Row row-cols-1="row-cols-1" row-cols-md-3="row-cols-md-3" row-cols-lg-4="row-cols-lg-4" classname="g-4">
                {personajes.map((personaje) => (
                    <Col key="{personaje.id}">
                        <Card classname="h-100 bg-secondary text-white border-0 shadow-sm">
                            <Card.Img variant="top" src={personaje.image} alt={personaje.name} />
                            <Card.Body>
                                <Card.Title classname="text-warning">{personaje.name}</Card.Title>
                                <Card.Text>
                                    <strong>Especie:</strong> {personaje.species}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default RickAndMorty;