"""API de laboratorio de Mi Concesionario (SQLite y archivos locales).

Autenticacion HTTP Basic solamente para pruebas locales. Para produccion se
necesitan HTTPS, sesiones seguras, control de intentos y gestion de secretos.
"""
import hashlib
import io
import os
import secrets
import sqlite3
import uuid
from contextlib import asynccontextmanager
from enum import Enum
from math import ceil
from pathlib import Path
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, File, HTTPException, Query, Request, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field, field_validator

ROOT = Path(__file__).resolve().parent
MAX_IMAGE_BYTES = 5 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 24_000_000
basic = HTTPBasic(auto_error=False)


class Rol(str, Enum):
    administrador = "administrador"
    vendedor = "vendedor"
    cliente = "cliente"


class UsuarioSalida(BaseModel):
    id: int
    nombre: str
    correo: str
    rol: Rol


class CrearUsuario(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    correo: str = Field(min_length=5, max_length=160)
    contrasena: str = Field(min_length=8, max_length=128)
    rol: Rol

    @field_validator("nombre", "correo")
    @classmethod
    def limpiar(cls, value: str) -> str:
        return value.strip()

    @field_validator("correo")
    @classmethod
    def correo_valido(cls, value: str) -> str:
        if value.count("@") != 1 or "." not in value.rsplit("@", 1)[-1]:
            raise ValueError("Correo no valido")
        return value.lower()


class CambiarRol(BaseModel):
    rol: Rol


class VehiculoEntrada(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    marca: str = Field(min_length=2, max_length=50)
    precio: float = Field(gt=0, le=2_000_000_000)
    disponible: bool = True

    @field_validator("nombre", "marca")
    @classmethod
    def quitar_espacios(cls, valor: str) -> str:
        return valor.strip()


class VehiculoSalida(VehiculoEntrada):
    id: int
    imagen_url: str | None
    es_favorito: bool


class Pagina(BaseModel):
    datos: list[VehiculoSalida]
    pagina: int
    tamano: int
    total: int
    total_paginas: int


class Resumen(BaseModel):
    total: int
    disponibles: int
    favoritos: int


def hash_contrasena(password: str) -> str:
    sal = secrets.token_bytes(16)
    vueltas = 160_000
    clave = hashlib.pbkdf2_hmac("sha256", password.encode(), sal, vueltas)
    return f"{vueltas}:{sal.hex()}:{clave.hex()}"


def verificar_contrasena(password: str, almacenada: str) -> bool:
    try:
        vueltas_str, sal_hex, hash_hex = almacenada.split(":")
        calculada = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(sal_hex), int(vueltas_str))
        return secrets.compare_digest(calculada, bytes.fromhex(hash_hex))
    except (ValueError, TypeError):
        return False


def conectar(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path, timeout=15, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def inicializar(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with conectar(db_path) as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL UNIQUE,
                clave_hash TEXT NOT NULL,
                rol TEXT NOT NULL CHECK(rol IN ('administrador','vendedor','cliente'))
            );
            CREATE TABLE IF NOT EXISTS vehiculos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                marca TEXT NOT NULL,
                precio REAL NOT NULL,
                disponible INTEGER NOT NULL DEFAULT 1,
                imagen_archivo TEXT
            );
            CREATE TABLE IF NOT EXISTS favoritos (
                usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                vehiculo_id INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
                PRIMARY KEY(usuario_id, vehiculo_id)
            );
        """)
        if conn.execute("SELECT COUNT(*) FROM usuarios").fetchone()[0] == 0:
            perfiles = [
                ("Ana Administradora", "admin@demo.local", os.getenv("AULA_ADMIN_PASSWORD", "admin12345"), Rol.administrador.value),
                ("Luis Vendedor", "vendedor@demo.local", os.getenv("AULA_VENDEDOR_PASSWORD", "vendedor12345"), Rol.vendedor.value),
                ("Sofia Cliente", "cliente@demo.local", os.getenv("AULA_CLIENTE_PASSWORD", "cliente12345"), Rol.cliente.value),
            ]
            conn.executemany(
                "INSERT INTO usuarios(nombre,correo,clave_hash,rol) VALUES(?,?,?,?)",
                [(n, e, hash_contrasena(p), r) for n, e, p, r in perfiles],
            )
        conn.commit()


def bd(request: Request):
    connection = conectar(request.app.state.db_path)
    try:
        yield connection
    finally:
        connection.close()


BD = Annotated[sqlite3.Connection, Depends(bd)]


def no_autorizado() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales no validas",
        headers={"WWW-Authenticate": "Basic"},
    )


def usuario_actual(
    credenciales: Annotated[HTTPBasicCredentials | None, Depends(basic)],
    conn: BD,
) -> UsuarioSalida:
    if credenciales is None:
        raise no_autorizado()
    fila = conn.execute(
        "SELECT * FROM usuarios WHERE correo=?", (credenciales.username.strip().lower(),)
    ).fetchone()
    if fila is None or not verificar_contrasena(credenciales.password, fila["clave_hash"]):
        raise no_autorizado()
    return UsuarioSalida(id=fila["id"], nombre=fila["nombre"], correo=fila["correo"], rol=fila["rol"])


Usuario = Annotated[UsuarioSalida, Depends(usuario_actual)]


def permitir(*roles: Rol):
    def comprobar(usuario: Usuario) -> UsuarioSalida:
        if usuario.rol not in roles:
            raise HTTPException(status_code=403, detail="No tienes permiso para esta accion")
        return usuario
    return comprobar


Administrador = Annotated[UsuarioSalida, Depends(permitir(Rol.administrador))]
Editor = Annotated[UsuarioSalida, Depends(permitir(Rol.administrador, Rol.vendedor))]


def devolver_vehiculo(conn: sqlite3.Connection, vehiculo_id: int, user_id: int) -> VehiculoSalida:
    fila = conn.execute(
        """SELECT v.id,v.nombre,v.marca,v.precio,v.disponible,v.imagen_archivo,
           EXISTS(SELECT 1 FROM favoritos f WHERE f.vehiculo_id=v.id AND f.usuario_id=?) AS favorito
           FROM vehiculos v WHERE v.id=?""",
        (user_id, vehiculo_id),
    ).fetchone()
    if fila is None:
        raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
    return VehiculoSalida(
        id=fila["id"], nombre=fila["nombre"], marca=fila["marca"],
        precio=fila["precio"], disponible=bool(fila["disponible"]),
        imagen_url=f"/media/{fila['imagen_archivo']}" if fila["imagen_archivo"] else None,
        es_favorito=bool(fila["favorito"]),
    )


def create_app(db_path: Path | None = None, media_dir: Path | None = None) -> FastAPI:
    path = Path(db_path or os.getenv("AULA_DB_PATH", str(ROOT / "data" / "concesionario.sqlite3")))
    media = Path(media_dir or os.getenv("AULA_MEDIA_DIR", str(ROOT / "media")))
    media.mkdir(parents=True, exist_ok=True)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        inicializar(path)
        yield

    app = FastAPI(
        title="Mi Concesionario - API educativa",
        description="CRUD, imagenes persistentes, roles y favoritos.",
        lifespan=lifespan,
    )
    app.state.db_path = path
    app.state.media_dir = media
    allowed = ["http://localhost:5174", "http://127.0.0.1:5174"]
    allowed += [s.strip() for s in os.getenv("AULA_CORS_ORIGINS", "").split(",") if s.strip()]
    app.add_middleware(
        CORSMiddleware, allow_origins=allowed,
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
    # Imagenes de vehiculos publicas solo para el laboratorio de catalogo.
    app.mount("/media", StaticFiles(directory=str(media)), name="media")

    @app.get("/salud")
    def salud():
        return {"estado": "ok"}

    @app.get("/sesion", response_model=UsuarioSalida)
    def sesion(usuario: Usuario):
        return usuario

    @app.get("/usuarios", response_model=list[UsuarioSalida])
    def usuarios(conn: BD, admin: Administrador):
        filas = conn.execute("SELECT id,nombre,correo,rol FROM usuarios ORDER BY id").fetchall()
        return [dict(f) for f in filas]

    @app.post("/usuarios", response_model=UsuarioSalida, status_code=201)
    def crear_usuario(datos: CrearUsuario, conn: BD, admin: Administrador):
        try:
            cursor = conn.execute(
                "INSERT INTO usuarios(nombre,correo,clave_hash,rol) VALUES(?,?,?,?)",
                (datos.nombre, datos.correo, hash_contrasena(datos.contrasena), datos.rol.value),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=409, detail="Correo ya registrado")
        return UsuarioSalida(id=cursor.lastrowid, nombre=datos.nombre, correo=datos.correo, rol=datos.rol)

    @app.patch("/usuarios/{usuario_id}/rol", response_model=UsuarioSalida)
    def cambiar_rol(usuario_id: int, datos: CambiarRol, conn: BD, admin: Administrador):
        fila = conn.execute("SELECT id,nombre,correo,rol FROM usuarios WHERE id=?", (usuario_id,)).fetchone()
        if fila is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        if admin.id == usuario_id and datos.rol != Rol.administrador:
            raise HTTPException(status_code=400, detail="No puedes quitarte tu propio rol durante la sesion")
        conn.execute("UPDATE usuarios SET rol=? WHERE id=?", (datos.rol.value, usuario_id))
        conn.commit()
        return UsuarioSalida(id=fila["id"], nombre=fila["nombre"], correo=fila["correo"], rol=datos.rol)

    @app.delete("/usuarios/{usuario_id}", status_code=204)
    def eliminar_usuario(usuario_id: int, conn: BD, admin: Administrador):
        if admin.id == usuario_id:
            raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
        cursor = conn.execute("DELETE FROM usuarios WHERE id=?", (usuario_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        conn.commit()
        return Response(status_code=204)

    @app.get("/vehiculos", response_model=Pagina)
    def listar(
        conn: BD,
        usuario: Usuario,
        pagina: int = Query(default=1, ge=1),
        tamano: int = Query(default=6, ge=1, le=50),
        buscar: str = Query(default="", max_length=80),
        marca: str = Query(default="", max_length=50),
        precio_max: float | None = Query(default=None, gt=0),
        solo_favoritos: bool = False,
        solo_disponibles: bool = False,
        orden: Literal["nombre", "precio_asc", "precio_desc", "recientes"] = "recientes",
    ):
        condiciones: list[str] = []
        parametros: list = []
        if buscar.strip():
            condiciones.append("(lower(v.nombre) LIKE ? OR lower(v.marca) LIKE ?)")
            criterio = f"%{buscar.strip().lower()}%"
            parametros += [criterio, criterio]
        if marca.strip():
            condiciones.append("lower(v.marca)=?")
            parametros.append(marca.strip().lower())
        if precio_max is not None:
            condiciones.append("v.precio<=?")
            parametros.append(precio_max)
        if solo_disponibles:
            condiciones.append("v.disponible=1")
        if solo_favoritos:
            condiciones.append("EXISTS(SELECT 1 FROM favoritos f WHERE f.vehiculo_id=v.id AND f.usuario_id=?)")
            parametros.append(usuario.id)
        where = (" WHERE " + " AND ".join(condiciones)) if condiciones else ""
        total = conn.execute("SELECT COUNT(*) FROM vehiculos v" + where, parametros).fetchone()[0]
        sorts = {
            "nombre": "v.nombre COLLATE NOCASE ASC, v.id DESC",
            "precio_asc": "v.precio ASC, v.id DESC",
            "precio_desc": "v.precio DESC, v.id DESC",
            "recientes": "v.id DESC",
        }
        filas = conn.execute(
            """SELECT v.id,v.nombre,v.marca,v.precio,v.disponible,v.imagen_archivo,
            EXISTS(SELECT 1 FROM favoritos f WHERE f.vehiculo_id=v.id AND f.usuario_id=?) AS favorito
            FROM vehiculos v""" + where + " ORDER BY " + sorts[orden] + " LIMIT ? OFFSET ?",
            [usuario.id, *parametros, tamano, (pagina - 1) * tamano],
        ).fetchall()
        return Pagina(
            datos=[
                VehiculoSalida(
                    id=f["id"], nombre=f["nombre"], marca=f["marca"], precio=f["precio"],
                    disponible=bool(f["disponible"]), es_favorito=bool(f["favorito"]),
                    imagen_url=f"/media/{f['imagen_archivo']}" if f["imagen_archivo"] else None,
                ) for f in filas
            ],
            pagina=pagina, tamano=tamano, total=total, total_paginas=ceil(total / tamano),
        )

    @app.get("/resumen", response_model=Resumen)
    def resumen(conn: BD, usuario: Usuario):
        total, disponibles = conn.execute(
            "SELECT COUNT(*),COALESCE(SUM(disponible),0) FROM vehiculos"
        ).fetchone()
        favoritos = conn.execute(
            "SELECT COUNT(*) FROM favoritos WHERE usuario_id=?", (usuario.id,)
        ).fetchone()[0]
        return Resumen(total=total, disponibles=disponibles, favoritos=favoritos)

    @app.post("/vehiculos", response_model=VehiculoSalida, status_code=201)
    def crear(datos: VehiculoEntrada, conn: BD, editor: Editor):
        cur = conn.execute(
            "INSERT INTO vehiculos(nombre,marca,precio,disponible) VALUES(?,?,?,?)",
            (datos.nombre, datos.marca, datos.precio, int(datos.disponible)),
        )
        conn.commit()
        return devolver_vehiculo(conn, cur.lastrowid, editor.id)

    @app.put("/vehiculos/{vehiculo_id}", response_model=VehiculoSalida)
    def editar(vehiculo_id: int, datos: VehiculoEntrada, conn: BD, editor: Editor):
        cur = conn.execute(
            "UPDATE vehiculos SET nombre=?,marca=?,precio=?,disponible=? WHERE id=?",
            (datos.nombre, datos.marca, datos.precio, int(datos.disponible), vehiculo_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        conn.commit()
        return devolver_vehiculo(conn, vehiculo_id, editor.id)

    @app.delete("/vehiculos/{vehiculo_id}", status_code=204)
    def eliminar(vehiculo_id: int, conn: BD, admin: Administrador, request: Request):
        fila = conn.execute("SELECT imagen_archivo FROM vehiculos WHERE id=?", (vehiculo_id,)).fetchone()
        if fila is None:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        conn.execute("DELETE FROM vehiculos WHERE id=?", (vehiculo_id,))
        conn.commit()
        if fila["imagen_archivo"]:
            (request.app.state.media_dir / fila["imagen_archivo"]).unlink(missing_ok=True)
        return Response(status_code=204)

    @app.post("/vehiculos/{vehiculo_id}/imagen", response_model=VehiculoSalida)
    async def subir_imagen(
        vehiculo_id: int,
        request: Request,
        conn: BD,
        editor: Editor,
        archivo: UploadFile = File(...),
    ):
        fila = conn.execute("SELECT imagen_archivo FROM vehiculos WHERE id=?", (vehiculo_id,)).fetchone()
        if fila is None:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        contenido = await archivo.read(MAX_IMAGE_BYTES + 1)
        if not contenido or len(contenido) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Imagen vacia o mayor que 5 MB")
        try:
            with Image.open(io.BytesIO(contenido)) as img:
                formato = img.format
                img.verify()
        except (UnidentifiedImageError, ValueError, OSError, Image.DecompressionBombError):
            raise HTTPException(status_code=422, detail="El archivo no es una imagen valida")
        extensiones = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}
        if formato not in extensiones:
            raise HTTPException(status_code=415, detail="Solo JPEG, PNG o WebP")
        nombre = uuid.uuid4().hex + extensiones[formato]
        destino = request.app.state.media_dir / nombre
        destino.write_bytes(contenido)
        try:
            conn.execute("UPDATE vehiculos SET imagen_archivo=? WHERE id=?", (nombre, vehiculo_id))
            conn.commit()
        except Exception:
            destino.unlink(missing_ok=True)
            raise
        if fila["imagen_archivo"]:
            (request.app.state.media_dir / fila["imagen_archivo"]).unlink(missing_ok=True)
        return devolver_vehiculo(conn, vehiculo_id, editor.id)

    @app.delete("/vehiculos/{vehiculo_id}/imagen", response_model=VehiculoSalida)
    def quitar_imagen(vehiculo_id: int, conn: BD, editor: Editor, request: Request):
        fila = conn.execute("SELECT imagen_archivo FROM vehiculos WHERE id=?", (vehiculo_id,)).fetchone()
        if fila is None:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        conn.execute("UPDATE vehiculos SET imagen_archivo=NULL WHERE id=?", (vehiculo_id,))
        conn.commit()
        if fila["imagen_archivo"]:
            (request.app.state.media_dir / fila["imagen_archivo"]).unlink(missing_ok=True)
        return devolver_vehiculo(conn, vehiculo_id, editor.id)

    @app.put("/vehiculos/{vehiculo_id}/favorito")
    def agregar_favorito(vehiculo_id: int, conn: BD, usuario: Usuario):
        if conn.execute("SELECT id FROM vehiculos WHERE id=?", (vehiculo_id,)).fetchone() is None:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        conn.execute(
            "INSERT OR IGNORE INTO favoritos(usuario_id,vehiculo_id) VALUES(?,?)",
            (usuario.id, vehiculo_id),
        )
        conn.commit()
        return {"es_favorito": True}

    @app.delete("/vehiculos/{vehiculo_id}/favorito")
    def quitar_favorito(vehiculo_id: int, conn: BD, usuario: Usuario):
        if conn.execute("SELECT id FROM vehiculos WHERE id=?", (vehiculo_id,)).fetchone() is None:
            raise HTTPException(status_code=404, detail="Vehiculo no encontrado")
        conn.execute(
            "DELETE FROM favoritos WHERE usuario_id=? AND vehiculo_id=?",
            (usuario.id, vehiculo_id),
        )
        conn.commit()
        return {"es_favorito": False}

    return app


app = create_app()
