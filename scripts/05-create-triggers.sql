-- Trigger para actualizar totales de proforma
DELIMITER //
CREATE TRIGGER tr_actualizar_totales_proforma
AFTER INSERT ON proforma_items
FOR EACH ROW
BEGIN
    UPDATE proformas 
    SET 
        subtotal = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = NEW.proforma_id),
        iva = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = NEW.proforma_id) * 0.12,
        total = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = NEW.proforma_id) * 1.12
    WHERE id = NEW.proforma_id;
END//

-- Trigger para actualizar totales al eliminar items
CREATE TRIGGER tr_actualizar_totales_proforma_delete
AFTER DELETE ON proforma_items
FOR EACH ROW
BEGIN
    UPDATE proformas 
    SET 
        subtotal = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = OLD.proforma_id),
        iva = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = OLD.proforma_id) * 0.12,
        total = (SELECT COALESCE(SUM(precio_total), 0) FROM proforma_items WHERE proforma_id = OLD.proforma_id) * 1.12
    WHERE id = OLD.proforma_id;
END//



DELIMITER //

DROP TRIGGER IF EXISTS tr_movimiento_stock_insert;

CREATE TRIGGER tr_movimiento_stock_insert
AFTER INSERT ON proforma_items
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;
    IF NEW.repuesto_id IS NOT NULL THEN
        SELECT stock INTO stock_actual FROM repuestos WHERE id = NEW.repuesto_id;
        INSERT INTO movimientos_stock (repuesto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, referencia)
        VALUES (
            NEW.repuesto_id, 
            'salida', 
            NEW.cantidad, 
            stock_actual, 
            stock_actual - NEW.cantidad,
            'Venta en proforma',
            (SELECT numero FROM proformas WHERE id = NEW.proforma_id)
        );
        UPDATE repuestos 
        SET stock = stock - NEW.cantidad 
        WHERE id = NEW.repuesto_id;
    END IF;
END
//

DELIMITER ;
DELIMITER ;
