import os
import re
import secrets
from contextlib import asynccontextmanager
from datetime import date
from math import ceil
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import field_validator
from sqlalchemy import func
from sqlmodel import Field, Session, SQLModel, col, create_engine, select

# Cuentas SOLO para laboratorio local. No usar estas claves en producción.
ADMIN_PASSWORD = os.environ.get("DEMO_ADMIN_PASSWORD", "admin123")
LECTOR_PASSWORD = os.environ.get("DEMO_LECTOR_PASSWORD", "lector123")
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+psycopg://tienda_alumno:clave_local_123@127.0.0.1:5434/tienda_flutter",
)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
seguridad = HTTPBasic(auto_error=False)


class VehiculoDatos(SQLModel):
    nombre: str = Field(min_length=3, max_length=60)
    anio: int = Field(ge=1900, le=2100)
    precio: float = Field(gt=0, le=999999999999)
    correo: str = Field(min_length=5, max_length=120)
    disponible: bool = True

    @field_validator("nombre", "correo", mode="before")
    @classmethod
    def limpiar(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor

    @field_validator("anio")
    @classmethod
    def comprobar_anio(cls, numero):
        if numero > date.today().year + 1:
            raise ValueError("El año no puede superar el próximo año")
        return numero

    @field_validator("correo")
    @classmethod
    def comprobar_correo(cls, correo):
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", correo):
            raise ValueError("Escribe un correo válido")
        return correo


class VehiculoTabla(VehiculoDatos, table=True):
    __tablename__ = "vehiculos"
    id: int | None = Field(default=None, primary_key=True)


class VehiculoEntrada(VehiculoDatos):
    pass


class VehiculoSalida(VehiculoDatos):
    id: int


class PaginaVehiculos(SQLModel):
    datos: list[VehiculoSalida]
    pagina: int
    tamano: int
    total: int
    total_paginas: int


class UsuarioActual(SQLModel):
    nombre: str
    rol: Literal["administrador", "lector"]


def no_autorizado():
    return HTTPException(
        status_code=401,
        detail="Credenciales incorrectas o ausentes",
        headers={"WWW-Authenticate": "Basic"},
    )


def obtener_usuario(
    credenciales: Annotated[HTTPBasicCredentials | None, Depends(seguridad)],
) -> UsuarioActual:
    if credenciales is None:
        raise no_autorizado()
    nombre = credenciales.username
    contrasena = credenciales.password
    es_admin = secrets.compare_digest(nombre, "admin") and secrets.compare_digest(
        contrasena, ADMIN_PASSWORD
    )
    es_lector = secrets.compare_digest(nombre, "lector") and secrets.compare_digest(
        contrasena, LECTOR_PASSWORD
    )
    if es_admin:
        return UsuarioActual(nombre="admin", rol="administrador")
    if es_lector:
        return UsuarioActual(nombre="lector", rol="lector")
    raise no_autorizado()


def exigir_administrador(
    usuario: Annotated[UsuarioActual, Depends(obtener_usuario)],
) -> UsuarioActual:
    if usuario.rol != "administrador":
        raise HTTPException(status_code=403, detail="Solo el administrador puede modificar")
    return usuario


def obtener_sesion():
    with Session(engine) as sesion:
        yield sesion


Sesion = Annotated[Session, Depends(obtener_sesion)]
Usuario = Annotated[UsuarioActual, Depends(obtener_usuario)]
Administrador = Annotated[UsuarioActual, Depends(exigir_administrador)]


@asynccontextmanager
async def iniciar(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="Tienda de vehículos: roles y paginación",
    description="Ejercicio local de Flutter + FastAPI + PostgreSQL",
    lifespan=iniciar,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/salud")
def salud():
    return {"estado": "ok"}


@app.get("/sesion", response_model=UsuarioActual)
def consultar_sesion(usuario: Usuario):
    return usuario


@app.get("/vehiculos", response_model=PaginaVehiculos)
def listar_vehiculos(
    sesion: Sesion,
    usuario: Usuario,
    pagina: int = Query(default=1, ge=1),
    tamano: int = Query(default=5, ge=1, le=50),
    buscar: str = Query(default="", max_length=60),
):
    condicion = col(VehiculoTabla.nombre).ilike(f"%{buscar.strip()}%")
    total = sesion.exec(
        select(func.count()).select_from(VehiculoTabla).where(condicion)
    ).one()
    datos = sesion.exec(
        select(VehiculoTabla)
        .where(condicion)
        .order_by(VehiculoTabla.id)
        .offset((pagina - 1) * tamano)
        .limit(tamano)
    ).all()
    return PaginaVehiculos(
        datos=datos,
        pagina=pagina,
        tamano=tamano,
        total=total,
        total_paginas=ceil(total / tamano),
    )


@app.post("/vehiculos", response_model=VehiculoSalida, status_code=201)
def crear_vehiculo(datos: VehiculoEntrada, sesion: Sesion, admin: Administrador):
    nuevo = VehiculoTabla.model_validate(datos)
    sesion.add(nuevo)
    sesion.commit()
    sesion.refresh(nuevo)
    return nuevo


@app.put("/vehiculos/{vehiculo_id}", response_model=VehiculoSalida)
def editar_vehiculo(
    vehiculo_id: int, datos: VehiculoEntrada, sesion: Sesion, admin: Administrador
):
    vehiculo = sesion.get(VehiculoTabla, vehiculo_id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    for clave, valor in datos.model_dump().items():
        setattr(vehiculo, clave, valor)
    sesion.add(vehiculo)
    sesion.commit()
    sesion.refresh(vehiculo)
    return vehiculo


@app.delete("/vehiculos/{vehiculo_id}", status_code=204)
def eliminar_vehiculo(vehiculo_id: int, sesion: Sesion, admin: Administrador):
    vehiculo = sesion.get(VehiculoTabla, vehiculo_id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    sesion.delete(vehiculo)
    sesion.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
