from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel, Session, create_engine

from main import app, obtener_sesion

motor_pruebas = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
SQLModel.metadata.create_all(motor_pruebas)


def sesion_pruebas():
    with Session(motor_pruebas) as sesion:
        yield sesion


app.dependency_overrides[obtener_sesion] = sesion_pruebas
# No abrir con "with": así este test no arranca PostgreSQL en el lifespan.
cliente = TestClient(app)


def test_crud_vehiculos():
    datos = {
        "nombre": "  Renault 9  ",
        "anio": 1994,
        "precio": 12000000.5,
        "correo": "cliente@ejemplo.com",
        "disponible": True,
    }
    respuesta = cliente.post("/vehiculos", json=datos)
    assert respuesta.status_code == 201
    vehiculo = respuesta.json()
    assert vehiculo["nombre"] == "Renault 9"
    identificador = vehiculo["id"]
    assert isinstance(identificador, int)

    listado = cliente.get("/vehiculos")
    assert listado.status_code == 200
    assert any(v["id"] == identificador for v in listado.json())

    datos["nombre"] = "Renault 21"
    cambio = cliente.put(f"/vehiculos/{identificador}", json=datos)
    assert cambio.status_code == 200
    assert cambio.json()["nombre"] == "Renault 21"

    borrado = cliente.delete(f"/vehiculos/{identificador}")
    assert borrado.status_code == 204
    assert cliente.delete(f"/vehiculos/{identificador}").status_code == 404


def test_validaciones_del_servidor():
    respuesta = cliente.post("/vehiculos", json={
        "nombre": "a", "anio": 1800, "precio": -1,
        "correo": "correo_invalido", "disponible": True,
    })
    assert respuesta.status_code == 422
