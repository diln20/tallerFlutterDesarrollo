import io
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app import create_app

CREDENCIALES = {
    "admin": ("admin@demo.local", "admin12345"),
    "vendedor": ("vendedor@demo.local", "vendedor12345"),
    "cliente": ("cliente@demo.local", "cliente12345"),
}

@pytest.fixture
def cliente(tmp_path: Path):
    with TestClient(create_app(db_path=tmp_path / "test.db", media_dir=tmp_path / "media")) as c:
        yield c

def aut(rol):
    return {"auth": CREDENCIALES[rol]}

def datos(nombre="Renault Logan", marca="Renault", precio=35000000, disponible=True):
    return {"nombre": nombre, "marca": marca, "precio": precio, "disponible": disponible}

def crear(c, **kw):
    r = c.post("/vehiculos", json=datos(**kw), **aut("admin"))
    assert r.status_code == 201, r.text
    return r.json()

def test_cuentas_precargadas(cliente):
    for rol in CREDENCIALES:
        r = cliente.get("/sesion", **aut(rol))
        assert r.status_code == 200
        assert r.json()["rol"] == ("administrador" if rol == "admin" else rol)

def test_errores_autenticacion(cliente):
    assert cliente.get("/vehiculos").status_code == 401
    assert cliente.get("/sesion", auth=("cliente@demo.local", "mala")).status_code == 401

def test_permisos_vehiculos(cliente):
    assert cliente.post("/vehiculos", json=datos(), **aut("cliente")).status_code == 403
    creado = cliente.post("/vehiculos", json=datos(), **aut("vendedor"))
    assert creado.status_code == 201
    vid = creado.json()["id"]
    assert cliente.put(f"/vehiculos/{vid}", json=datos(precio=39000000), **aut("vendedor")).status_code == 200
    assert cliente.delete(f"/vehiculos/{vid}", **aut("vendedor")).status_code == 403
    assert cliente.delete(f"/vehiculos/{vid}", **aut("cliente")).status_code == 403
    assert cliente.delete(f"/vehiculos/{vid}", **aut("admin")).status_code == 204

def test_crud_y_validaciones(cliente):
    v = crear(cliente)
    vid = v["id"]
    assert v["marca"] == "Renault"
    assert cliente.post("/vehiculos", json=datos(precio=-1), **aut("admin")).status_code == 422
    r = cliente.put(f"/vehiculos/{vid}", json=datos(nombre="Mazda 2", marca="Mazda", precio=55000000, disponible=False), **aut("admin"))
    assert r.status_code == 200 and not r.json()["disponible"]
    assert cliente.put("/vehiculos/999999", json=datos(), **aut("admin")).status_code == 404
    assert cliente.delete(f"/vehiculos/{vid}", **aut("admin")).status_code == 204
    assert cliente.delete(f"/vehiculos/{vid}", **aut("admin")).status_code == 404

def test_busqueda_precio_orden_filtros_y_paginacion(cliente):
    crear(cliente, nombre="Renault Logan", marca="Renault", precio=35000000)
    crear(cliente, nombre="Mazda 2", marca="Mazda", precio=60000000)
    crear(cliente, nombre="Renault Duster", marca="Renault", precio=80000000, disponible=False)
    r = cliente.get("/vehiculos", params={"marca":"Renault","precio_max":40000000}, **aut("cliente"))
    assert r.status_code == 200 and r.json()["total"] == 1
    r = cliente.get("/vehiculos", params={"buscar":"ren","tamano":1,"pagina":2}, **aut("cliente"))
    assert r.json()["total"] == 2 and r.json()["total_paginas"] == 2
    r = cliente.get("/vehiculos", params={"orden":"precio_desc"}, **aut("cliente"))
    assert r.json()["datos"][0]["precio"] == 80000000
    r = cliente.get("/vehiculos", params={"solo_disponibles":True}, **aut("cliente"))
    assert r.json()["total"] == 2

def test_favoritos_por_usuario_y_borrado_cascada(cliente):
    vid = crear(cliente)["id"]
    assert cliente.put(f"/vehiculos/{vid}/favorito", **aut("cliente")).json()["es_favorito"]
    assert cliente.put(f"/vehiculos/{vid}/favorito", **aut("cliente")).status_code == 200
    assert cliente.get("/vehiculos", params={"solo_favoritos":True}, **aut("cliente")).json()["total"] == 1
    assert cliente.get("/vehiculos", params={"solo_favoritos":True}, **aut("vendedor")).json()["total"] == 0
    assert cliente.get("/resumen", **aut("cliente")).json()["favoritos"] == 1
    assert cliente.delete(f"/vehiculos/{vid}", **aut("admin")).status_code == 204
    assert cliente.get("/resumen", **aut("cliente")).json()["favoritos"] == 0

def test_admin_gestiona_usuarios(cliente):
    assert cliente.get("/usuarios", **aut("cliente")).status_code == 403
    data = {"nombre":"Nueva", "correo":"nueva@ejemplo.com", "contrasena":"secreto123", "rol":"cliente"}
    r = cliente.post("/usuarios", json=data, **aut("admin"))
    assert r.status_code == 201
    uid = r.json()["id"]
    assert cliente.post("/usuarios", json=data, **aut("admin")).status_code == 409
    assert cliente.patch(f"/usuarios/{uid}/rol", json={"rol":"vendedor"}, **aut("vendedor")).status_code == 403
    assert cliente.patch(f"/usuarios/{uid}/rol", json={"rol":"vendedor"}, **aut("admin")).json()["rol"] == "vendedor"
    assert cliente.get("/sesion", auth=("nueva@ejemplo.com","secreto123")).json()["rol"] == "vendedor"
    adminid = cliente.get("/sesion", **aut("admin")).json()["id"]
    assert cliente.patch(f"/usuarios/{adminid}/rol", json={"rol":"cliente"}, **aut("admin")).status_code == 400
    assert cliente.delete(f"/usuarios/{uid}", **aut("admin")).status_code == 204

def test_imagen_real_y_persistencia(cliente):
    vid = crear(cliente)["id"]
    imagen = Image.new("RGB", (64, 40), color=(52, 120, 200))
    raw = io.BytesIO()
    imagen.save(raw, format="PNG")
    r = cliente.post(f"/vehiculos/{vid}/imagen", files={"archivo":("auto.png",raw.getvalue(),"image/png")}, **aut("vendedor"))
    assert r.status_code == 200, r.text
    url = r.json()["imagen_url"]
    assert url.startswith("/media/")
    assert cliente.get(url).status_code == 200
    assert cliente.get("/vehiculos", **aut("cliente")).json()["datos"][0]["imagen_url"] == url
    assert cliente.delete(f"/vehiculos/{vid}/imagen", **aut("cliente")).status_code == 403
    assert cliente.delete(f"/vehiculos/{vid}/imagen", **aut("admin")).json()["imagen_url"] is None
    assert cliente.get(url).status_code == 404

def test_imagenes_invalidas_y_tamano(cliente):
    vid = crear(cliente)["id"]
    r = cliente.post(f"/vehiculos/{vid}/imagen", files={"archivo":("falsa.png",b"no es una imagen","image/png")}, **aut("admin"))
    assert r.status_code == 422
    r = cliente.post(f"/vehiculos/{vid}/imagen", files={"archivo":("grande.png",b"0"*(5*1024*1024+1),"image/png")}, **aut("admin"))
    assert r.status_code == 413
    r = cliente.post(f"/vehiculos/{vid}/imagen", files={"archivo":("foto.png",b"ok","image/png")}, **aut("cliente"))
    assert r.status_code == 403

def test_origen_cors_local(cliente):
    r = cliente.options("/vehiculos", headers={
        "Origin":"http://localhost:63321",
        "Access-Control-Request-Method":"GET",
        "Access-Control-Request-Headers":"authorization",
    })
    assert r.headers["access-control-allow-origin"] == "http://localhost:63321"
