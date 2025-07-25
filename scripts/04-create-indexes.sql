-- Índices para mejorar rendimiento
CREATE INDEX idx_clientes_ruc ON clientes(ruc);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_vehiculos_cliente ON vehiculos(cliente_id);
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_repuestos_codigo ON repuestos(codigo);
CREATE INDEX idx_repuestos_categoria ON repuestos(categoria_id);
CREATE INDEX idx_repuestos_stock ON repuestos(stock);
CREATE INDEX idx_proformas_numero ON proformas(numero);
CREATE INDEX idx_proformas_cliente ON proformas(cliente_id);
CREATE INDEX idx_proformas_fecha ON proformas(fecha);
CREATE INDEX idx_proformas_estado ON proformas(estado);
CREATE INDEX idx_proforma_items_proforma ON proforma_items(proforma_id);
CREATE INDEX idx_movimientos_repuesto ON movimientos_stock(repuesto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos_stock(fecha_registro);
