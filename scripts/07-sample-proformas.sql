-- Insertar proformas de ejemplo
INSERT INTO proformas (numero, fecha, cliente_id, vehiculo_id, kilometraje, descripcion, nota_aviso, aviso) VALUES
('PRO-2024-001', '2024-01-15', 1, 1, '45000', 'Mantenimiento preventivo y cambio de repuestos', 'Esta proforma tiene validez de 15 días a partir de la fecha de emisión.', 'Los precios incluyen IVA. Garantía de 30 días en repuestos y 15 días en mano de obra.'),
('PRO-2024-002', '2024-01-14', 2, 3, '38000', 'Cambio de pastillas de freno', 'Esta proforma tiene validez de 15 días a partir de la fecha de emisión.', 'Los precios incluyen IVA. Garantía de 30 días en repuestos y 15 días en mano de obra.'),
('PRO-2024-003', '2024-01-12', 3, 4, '15000', 'Mantenimiento mayor - Kit de distribución', 'Esta proforma tiene validez de 15 días a partir de la fecha de emisión.', 'Los precios incluyen IVA. Garantía de 30 días en repuestos y 15 días en mano de obra.');

-- Insertar items de las proformas
INSERT INTO proforma_items (proforma_id, repuesto_id, cantidad, precio_unitario) VALUES
-- Proforma 1
(1, 1, 1, 12.50),  -- Filtro de aceite
(1, 19, 1, 28.00), -- Aceite motor
(1, 22, 1, 35.00), -- Mano de obra mantenimiento

-- Proforma 2
(2, 5, 1, 45.00),  -- Pastillas delanteras
(2, 23, 1, 25.00), -- Mano de obra frenos

-- Proforma 3
(3, 14, 1, 180.00), -- Kit distribución
(3, 13, 4, 32.00),  -- Bujías
(3, 22, 1, 35.00);  -- Mano de obra
