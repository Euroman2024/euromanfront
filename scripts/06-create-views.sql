-- Vista para resumen de proformas
CREATE VIEW v_proformas_resumen AS
SELECT 
    p.id,
    p.numero,
    p.fecha,
    c.nombre as cliente_nombre,
    c.ruc as cliente_ruc,
    CONCAT(v.marca, ' ', v.modelo, ' - ', v.placa) as vehiculo,
    p.descripcion,
    p.subtotal,
    p.iva,
    p.total,
    p.estado,
    p.fecha_registro,
    COUNT(pi.id) as total_items
FROM proformas p
JOIN clientes c ON p.cliente_id = c.id
JOIN vehiculos v ON p.vehiculo_id = v.id
LEFT JOIN proforma_items pi ON p.id = pi.proforma_id
GROUP BY p.id;

-- Vista para stock bajo
CREATE VIEW v_stock_bajo AS
SELECT 
    r.id,
    r.codigo,
    r.descripcion,
    c.nombre as categoria,
    r.stock,
    r.stock_minimo,
    r.precio,
    r.precio_iva,
    p.nombre as proveedor,
    r.ubicacion
FROM repuestos r
JOIN categorias_repuestos c ON r.categoria_id = c.id
LEFT JOIN proveedores p ON r.proveedor_id = p.id
WHERE r.stock <= r.stock_minimo AND r.estado = 'activo';

-- Vista para estadísticas de clientes
CREATE VIEW v_estadisticas_clientes AS
SELECT 
    c.id,
    c.nombre,
    c.ruc,
    COUNT(DISTINCT v.id) as total_vehiculos,
    COUNT(DISTINCT p.id) as total_proformas,
    COALESCE(SUM(CASE WHEN p.estado = 'facturada' THEN p.total ELSE 0 END), 0) as total_facturado,
    COALESCE(SUM(CASE WHEN p.estado IN ('pendiente', 'aprobada') THEN p.total ELSE 0 END), 0) as total_pendiente,
    MAX(p.fecha) as ultima_proforma
FROM clientes c
LEFT JOIN vehiculos v ON c.id = v.cliente_id
LEFT JOIN proformas p ON c.id = p.cliente_id
WHERE c.estado = 'activo'
GROUP BY c.id;
