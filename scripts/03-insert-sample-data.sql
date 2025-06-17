-- Insertar entidad principal
INSERT INTO entidades (nombre, propietario, ruc, direccion, telefono, email, tipo) VALUES
('AutoRepuestos El Mecánico', 'Carlos Mendoza', '1291790642001', 'Av. Principal 123, Quito, Ecuador', '+593 2 234-5678', 'info@autorepuestos.com', 'matriz'),
('AutoRepuestos El Mecánico - Sucursal Norte', 'Carlos Mendoza', '1291790642001', 'Av. Eloy Alfaro 456, Quito, Ecuador', '+593 2 345-6789', 'norte@autorepuestos.com', 'sucursal'),
('AutoRepuestos El Mecánico - Sucursal Sur', 'Carlos Mendoza', '1291790642001', 'Av. Maldonado 789, Quito, Ecuador', '+593 2 456-7890', 'sur@autorepuestos.com', 'sucursal');

-- Insertar clientes
INSERT INTO clientes (nombre, ruc, direccion, telefono, email, notas) VALUES
('Juan Pérez García', '1234567890001', 'Av. Principal 123, Quito', '+593 99 123-4567', 'juan.perez@email.com', 'Cliente frecuente, siempre puntual con los pagos'),
('María López Sánchez', '9876543210001', 'Calle Secundaria 456, Guayaquil', '+593 98 765-4321', 'maria.lopez@email.com', 'Cliente nuevo, requiere seguimiento'),
('Carlos Ruiz Mendoza', '5678901234001', 'Av. Amazonas 789, Cuenca', '+593 97 555-1234', 'carlos.ruiz@email.com', NULL),
('Ana Gómez Torres', '1357924680001', 'Calle Los Pinos 321, Ambato', '+593 96 888-9999', 'ana.gomez@email.com', 'Cliente corporativo'),
('Roberto Suárez Villa', '2468135790001', 'Av. Central 654, Machala', '+593 95 777-8888', 'roberto.suarez@email.com', NULL);

-- Insertar vehículos
INSERT INTO vehiculos (cliente_id, marca, modelo, anio, placa, color, vin, motor, combustible, transmision, kilometraje) VALUES
(1, 'Toyota', 'Corolla', 2018, 'ABC-123', 'Blanco', '1HGBH41JXMN109186', '1.8L 4 cilindros', 'gasolina', 'manual', 45000),
(1, 'Nissan', 'Sentra', 2020, 'DEF-456', 'Gris', '3N1AB7AP5LY123456', '1.6L 4 cilindros', 'gasolina', 'cvt', 25000),
(2, 'Chevrolet', 'Aveo', 2019, 'GHI-789', 'Rojo', 'KL1TD66E09B123456', '1.4L 4 cilindros', 'gasolina', 'manual', 38000),
(3, 'Kia', 'Sportage', 2021, 'JKL-012', 'Negro', 'KNDPM3AC5M7123456', '2.0L 4 cilindros', 'gasolina', 'automatica', 15000),
(2, 'Hyundai', 'Accent', 2022, 'MNO-345', 'Azul', 'KMHC65LA5NU123456', '1.6L 4 cilindros', 'gasolina', 'manual', 8000),
(4, 'Ford', 'Escape', 2020, 'PQR-678', 'Blanco', '1FMCU9HD5LUA12345', '2.0L 4 cilindros', 'gasolina', 'automatica', 32000),
(5, 'Mazda', 'CX-5', 2021, 'STU-901', 'Gris', 'JM3KFBCM5M0123456', '2.5L 4 cilindros', 'gasolina', 'automatica', 18000);

-- Insertar categorías de repuestos
INSERT INTO categorias_repuestos (nombre, descripcion) VALUES
('Filtros', 'Filtros de aceite, aire, combustible y cabina'),
('Frenos', 'Pastillas, discos, tambores y líquido de frenos'),
('Suspensión', 'Amortiguadores, resortes y componentes de suspensión'),
('Motor', 'Bujías, correas, kits de distribución y componentes del motor'),
('Eléctrico', 'Baterías, alternadores, motores de arranque y componentes eléctricos'),
('Lubricantes', 'Aceites de motor, transmisión y otros lubricantes'),
('Llantas', 'Neumáticos y rines'),
('Refrigeración', 'Radiadores, termostatos y componentes del sistema de refrigeración'),
('Transmisión', 'Componentes de caja de cambios y transmisión'),
('Servicios', 'Mano de obra y servicios técnicos');

-- Insertar proveedores
INSERT INTO proveedores (nombre, ruc, direccion, telefono, email, contacto) VALUES
('Toyota Ecuador', '1790123456001', 'Av. República del Salvador, Quito', '+593 2 333-4444', 'ventas@toyota.com.ec', 'Luis Morales'),
('Chevrolet Ecuador', '1790234567001', 'Av. Amazonas, Quito', '+593 2 444-5555', 'repuestos@chevrolet.com.ec', 'Ana Vásquez'),
('Nissan Ecuador', '1790345678001', 'Av. 6 de Diciembre, Quito', '+593 2 555-6666', 'partes@nissan.com.ec', 'Carlos Jiménez'),
('Bosch Ecuador', '1790456789001', 'Av. Eloy Alfaro, Quito', '+593 2 666-7777', 'info@bosch.com.ec', 'María González'),
('NGK Ecuador', '1790567890001', 'Av. América, Quito', '+593 2 777-8888', 'ventas@ngk.com.ec', 'Pedro Ramírez'),
('Castrol Ecuador', '1790678901001', 'Av. Patria, Quito', '+593 2 888-9999', 'distribución@castrol.com.ec', 'Laura Herrera'),
('Monroe Ecuador', '1790789012001', 'Av. Occidental, Quito', '+593 2 999-0000', 'repuestos@monroe.com.ec', 'Diego Silva'),
('Gates Ecuador', '1790890123001', 'Av. Mariscal Sucre, Quito', '+593 2 111-2222', 'partes@gates.com.ec', 'Sandra López');

-- Insertar repuestos
INSERT INTO repuestos (codigo, descripcion, categoria_id, proveedor_id, precio, stock, stock_minimo, ubicacion, notas) VALUES
-- Filtros
('FIL001', 'Filtro de aceite Toyota Original', 1, 1, 12.50, 25, 10, 'A1-B2', 'Compatible con Corolla 2018-2022'),
('FIL002', 'Filtro de aire Toyota Corolla', 1, 1, 15.75, 20, 8, 'A2-B1', 'Filtro de aire original Toyota'),
('FIL003', 'Filtro de combustible Nissan', 1, 3, 18.90, 15, 5, 'A3-B3', 'Para motores 1.6L'),
('FIL004', 'Filtro de cabina universal', 1, 4, 22.50, 30, 12, 'A4-B2', 'Filtro antipolen'),

-- Frenos
('FRE001', 'Pastillas de freno delanteras Toyota', 2, 1, 45.00, 15, 5, 'B2-C3', 'Pastillas cerámicas originales'),
('FRE002', 'Pastillas de freno traseras Nissan', 2, 3, 38.75, 12, 4, 'B3-C2', 'Para Sentra 2020+'),
('FRE003', 'Disco de freno delantero', 2, 4, 85.50, 8, 3, 'B1-C1', 'Disco ventilado 280mm'),
('FRE004', 'Líquido de frenos DOT 4', 2, 4, 12.90, 25, 10, 'B4-C4', 'Botella 500ml'),

-- Suspensión
('SUS001', 'Amortiguador trasero Monroe', 3, 7, 85.00, 8, 3, 'C1-D2', 'Para vehículos medianos'),
('SUS002', 'Amortiguador delantero Monroe', 3, 7, 95.00, 6, 2, 'C2-D1', 'Con resorte incluido'),
('SUS003', 'Resorte helicoidal trasero', 3, 7, 45.60, 10, 4, 'C3-D3', 'Para suspensión independiente'),

-- Motor
('MOT001', 'Bujías NGK (set 4 unidades)', 4, 5, 32.00, 18, 10, 'D3-E1', 'Bujías iridio premium'),
('MOT002', 'Kit de distribución completo Gates', 4, 8, 180.00, 5, 3, 'D2-E3', 'Incluye correa, tensores y bomba'),
('MOT003', 'Correa de accesorios', 4, 8, 25.80, 12, 6, 'D1-E2', 'Correa serpentina'),
('MOT004', 'Termostato motor', 4, 1, 28.50, 15, 8, 'D4-E4', 'Apertura 82°C'),

-- Eléctrico
('ELE001', 'Batería 12V 60Ah Bosch', 5, 4, 120.00, 12, 3, 'E3-F1', 'Batería libre de mantenimiento'),
('ELE002', 'Alternador Toyota Corolla', 5, 1, 285.00, 4, 2, 'E1-F2', 'Alternador remanufacturado'),
('ELE003', 'Motor de arranque Nissan', 5, 3, 195.50, 3, 1, 'E2-F3', 'Para motores 1.6L'),

-- Lubricantes
('LUB001', 'Aceite motor 5W-30 (4 litros) Castrol', 6, 6, 28.00, 30, 15, 'F1-G2', 'Aceite sintético premium'),
('LUB002', 'Aceite transmisión automática', 6, 6, 35.75, 20, 8, 'F2-G1', 'ATF Dexron VI'),
('LUB003', 'Aceite hidráulico dirección', 6, 6, 18.90, 25, 10, 'F3-G3', 'Power steering fluid'),

-- Servicios
('SER001', 'Mano de obra - Mantenimiento básico', 10, NULL, 35.00, 999, 0, 'SERVICIO', 'Cambio de aceite y filtros'),
('SER002', 'Mano de obra - Cambio de frenos', 10, NULL, 25.00, 999, 0, 'SERVICIO', 'Instalación de pastillas'),
('SER003', 'Mano de obra - Alineación y balanceo', 10, NULL, 15.00, 999, 0, 'SERVICIO', 'Alineación computarizada'),
('SER004', 'Diagnóstico computarizado', 10, NULL, 20.00, 999, 0, 'SERVICIO', 'Escaneo de códigos de error');
