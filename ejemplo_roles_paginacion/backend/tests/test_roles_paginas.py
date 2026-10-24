from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

import os

# Las pruebas usan SQLite aislado y no requieren PostgreSQL o Docker.
os.environ.setdefault("DATABASE_URL", "sqlite://")

from main import app, obtener_sesion

db_prueba = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
SQLModel.metadata.create_all(db_prueba)


def sesion_falsa():
    with Session(db_prueba) as sesion:
        yield sesion


app.dependency_overrides[obtener_sesion] = sesion_falsa
# No se entra al contexto del TestClient: se evita el lifespan con PostgreSQL real.
cliente = TestClient(app)
admin = ("admin", "admin123")
lector = ("lector", "lector123")


def datos(nombre):
    return {
        "nombre": nombre,
        "anio": 1994,
        "precio": 12000000.5,
        "correo": "cliente@ejemplo.com",
        "disponible": True,
    }


def test_autenticacion_y_permisos():
    assert cliente.get("/vehiculos").status_code == 401
    assert cliente.get("/sesion", auth=("admin", "incorrecto")).status_code == 401
    assert cliente.get("/sesion", auth=lector).json()["rol"] == "lector"
    assert cliente.get("/sesion", auth=admin).json()["rol"] == "administrador"
    assert cliente.post("/vehiculos", auth=lector, json=datos("Renault 9")).status_code == 403
    assert cliente.put("/vehiculos/1", auth=lector, json=datos("Renault 21")).status_code == 403
    assert cliente.delete("/vehiculos/1", auth=lector).status_code == 403


def test_crud_con_roles_y_paginas():
    creados = []
    for nombre in ("Renault 9", "Mazda 3", "Toyota Corolla"):
        respuesta = cliente.post("/vehiculos", json=datos(nombre), auth=admin)
        assert respuesta.status_code == 201
        creados.append(respuesta.json()["id"])

    primera = cliente.get("/vehiculos?pagina=1&tamano=2", auth=lector)
    assert primera.status_code == 200
    assert primera.json()["total"] == 3
    assert primera.json()["total_paginas"] == 2
    assert len(primera.json()["datos"]) == 2
    segunda = cliente.get("/vehiculos?pagina=2&tamano=2", auth=lector)
    assert len(segunda.json()["datos"]) == 1
    assert segunda.json()["datos"][0]["nombre"] == "Toyota Corolla"

    filtrada = cliente.get("/vehiculos?pagina=1&tamano=2&buscar=mazda", auth=lector)
    assert filtrada.json()["total"] == 1
    assert filtrada.json()["datos"][0]["nombre"] == "Mazda 3"

    cambio = cliente.put(f"/vehiculos/{creados[0]}", auth=admin, json=datos("Renault 21"))
    assert cambio.status_code == 200
    assert cambio.json()["nombre"] == "Renault 21"
    assert cliente.delete(f"/vehiculos/{creados[1]}", auth=admin).status_code == 204
    assert cliente.delete(f"/vehiculos/{creados[1]}", auth=admin).status_code == 404

    assert cliente.get("/vehiculos?pagina=0", auth=lector).status_code == 422
    assert cliente.get("/vehiculos?tamano=51", auth=lector).status_code == 422
    assert cliente.post("/vehiculos", auth=admin, json=datos("X")).status_code == 422


def test_trece_registros_y_busqueda_con_paginacion():
    for numero in range(1, 14):
        respuesta = cliente.post(
            "/vehiculos",
            auth=admin,
            json=datos(f"PracticaP13 Auto {numero:02d}"),
        )
        assert respuesta.status_code == 201

    base = "/vehiculos?tamano=5&buscar=PracticaP13"
    pagina1 = cliente.get(base + "&pagina=1", auth=lector).json()
    pagina2 = cliente.get(base + "&pagina=2", auth=lector).json()
    pagina3 = cliente.get(base + "&pagina=3", auth=lector).json()
    assert [len(p["datos"]) for p in (pagina1, pagina2, pagina3)] == [5, 5, 3]
    assert all(p["total"] == 13 and p["total_paginas"] == 3 for p in
               (pagina1, pagina2, pagina3))
    assert len(cliente.get(base + "&pagina=4", auth=lector).json()["datos"]) == 0

    vacia = cliente.get("/vehiculos?buscar=SinCoincidenciaXYZ", auth=lector).json()
    assert vacia["total"] == 0
    assert vacia["total_paginas"] == 0
    assert vacia["datos"] == []
