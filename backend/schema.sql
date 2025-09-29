CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS habitaciones (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(10) UNIQUE NOT NULL,
  tipo VARCHAR(30) NOT NULL,          
  capacidad INT NOT NULL,
  precio_noche INT NOT NULL,
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  habitacion_id INT REFERENCES habitaciones(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
  creado_en TIMESTAMP DEFAULT NOW()
);

INSERT INTO habitaciones (numero, tipo, capacidad, precio_noche, descripcion)
VALUES 
 ('101','Turista',2,35000,'Habitación estándar'),
 ('102','Turista',2,35000,'Habitación estándar'),
 ('201','Premium',3,52000,'Vista al mar'),
 ('202','Premium',3,52000,'Vista al mar'),
 ('301','Turista',2,36000,'Cama queen'),
 ('302','Turista',2,36000,'Cama queen'),
 ('401','Premium',4,60000,'Suite'),
 ('402','Premium',4,60000,'Suite')
ON CONFLICT DO NOTHING;
