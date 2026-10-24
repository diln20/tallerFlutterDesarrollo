import os
from pathlib import Path
import re
from contextlib import asynccontextmanager
from datetime import date
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import field_validator
from sqlmodel import Field, Session, SQLModel, create_engine, select

# Solo para prácticas locales. En servidores reales usa variables de entorno secretas.
def obtener_url_postgresql() -> str:
    # La variable permite elegir otra base expresamente (Docker opcional).
    definida = os.environ.get("DATABASE_URL", "").strip()
    if definida:
        return definida

    # Por defecto: PostgreSQL normal de Windows (puerto definido en .env.native).
    archivo = Path(__file__).resolve().with_name(".env.native")
    if archivo.is_file():
        for linea in archivo.read_text(encoding="utf-8-sig").splitlines():
            if linea.strip().startswith("DATABASE_URL="):
                url = linea.partition("=")[2].strip()
                if url:
                    return url
    raise RuntimeError("Falta .env.native o DATABASE_URL en tienda_api")


DATABASE_URL = obtener_url_postgresql()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


class VehiculoDatos(SQLModel):
    nombre: str = Field(min_length=3, max_length=60)
    anio: int = Field(ge=1900, le=2100)
    precio: float = Field(gt=0, le=999999999999)
    correo: str = Field(min_length=5, max_length=120)
    disponible: bool = True

    @field_validator("nombre", "correo", mode="before")
    @classmethod
    def quitar_espacios(cls, valor):
        return valor.strip() if isinstance(valor, str) else valor

    @field_validator("anio")
    @classmethod
    def comprobar_anio(cls, anio):
        if anio > date.today().year + 1:
            raise ValueError("El año supera el próximo año")
        return anio

    @field_validator("correo")
    @classmethod
    def comprobar_correo(cls, correo):
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", correo):
            raise ValueError("Escribe un correo de contacto válido")
        return correo


class VehiculoTabla(VehiculoDatos, table=True):
    __tablename__ = "vehiculos"
    id: int | None = Field(default=None, primary_key=True)


class VehiculoEntrada(VehiculoDatos):
    pass


class VehiculoSalida(VehiculoDatos):
    id: int


def obtener_sesion():
    with Session(engine) as sesion:
        yield sesion


Sesion = Annotated[Session, Depends(obtener_sesion)]


@asynccontextmanager
async def iniciar_aplicacion(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="API de la Tienda de Vehículos",
    description="Práctica de Flutter, FastAPI y PostgreSQL",
    lifespan=iniciar_aplicacion,
)

# Solo los orígenes usados por Flutter Web en la clase.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.get("/salud")
def salud():
    return {"estado": "ok"}


@app.get("/vehiculos", response_model=list[VehiculoSalida])
def listar_vehiculos(sesion: Sesion):
    consulta = select(VehiculoTabla).order_by(VehiculoTabla.id)
    return sesion.exec(consulta).all()


@app.post("/vehiculos", response_model=VehiculoSalida, status_code=201)
def crear_vehiculo(datos: VehiculoEntrada, sesion: Sesion):
    nuevo = VehiculoTabla.model_validate(datos)
    sesion.add(nuevo)
    sesion.commit()
    sesion.refresh(nuevo)
    return nuevo


@app.put("/vehiculos/{vehiculo_id}", response_model=VehiculoSalida)
def actualizar_vehiculo(vehiculo_id: int, datos: VehiculoEntrada, sesion: Sesion):
    vehiculo = sesion.get(VehiculoTabla, vehiculo_id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    for campo, valor in datos.model_dump().items():
        setattr(vehiculo, campo, valor)
    sesion.add(vehiculo)
    sesion.commit()
    sesion.refresh(vehiculo)
    return vehiculo


@app.delete("/vehiculos/{vehiculo_id}", status_code=204)
def eliminar_vehiculo(vehiculo_id: int, sesion: Sesion):
    vehiculo = sesion.get(VehiculoTabla, vehiculo_id)
    if vehiculo is None:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    sesion.delete(vehiculo)
    sesion.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
