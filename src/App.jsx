
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerPokemones = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get('https://pokeapi.co/api/v2/pokemon/');
      const listaResultados = respuesta.data.results;

      const peticionesDetalladas = listaResultados.map(async (pokemon) => {
        const detalle = await axios.get(pokemon.url);
        return {
          id: detalle.data.id,
          nombre: detalle.data.name,
          imagen: detalle.data.sprites.other['official-artwork'].front_default || detalle.data.sprites.front_default
        };
      });

      const listaCompleta = await Promise.all(peticionesDetalladas);
      setPokemones(listaCompleta);
    } catch (err) {
      console.error("Error al consumir la PokeAPI:", err);
      setError('Hubo un error al cargar los pokémones.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPokemones();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5 fw-bold text-primary">PokeAPI - Tarea N°7</h1>
      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando los 20 primeros pokémones...</p>
        </div>
      )}
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}
      {!cargando && !error && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {pokemones.map((pokemon) => (
            <Col key={pokemon.id}>
              <Card className="h-100 shadow-sm text-center border-0 bg-light">
                <div className="p-3 d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                  <Card.Img variant="top" src={pokemon.imagen} style={{ maxHeight: '130px', width: 'auto' }} />
                </div>
                <Card.Body className="bg-white rounded-bottom">
                  <Card.Title className="text-capitalize fw-bold fs-5 text-dark">
                    #{pokemon.id} - {pokemon.nombre}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default App;