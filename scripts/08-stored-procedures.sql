-- Procedimiento para generar número de proforma
DELIMITER //
CREATE PROCEDURE sp_generar_numero_proforma(OUT nuevo_numero VARCHAR(50))
BEGIN
    DECLARE contador INT;
    DECLARE anio_actual YEAR;
    
    SET anio_actual = YEAR(CURDATE());
    
    SELECT COUNT(*) + 1 INTO contador 
    FROM proformas 
    WHERE YEAR(fecha) = anio_actual;
    
    SET nuevo_numero = CONCAT('PRO-', anio_actual, '-', LPAD(contador, 3, '0'));
END//

-- Procedimiento para obtener stock disponible
CREATE PROCEDURE sp_verificar_stock(IN repuesto_id INT, IN cantidad_requerida INT, OUT stock_disponible BOOLEAN)
BEGIN
    DECLARE stock_actual INT;
    
    SELECT stock INTO stock_actual FROM repuestos WHERE id = repuesto_id;
    
    IF stock_actual >= cantidad_requerida THEN
        SET stock_disponible = TRUE;
    ELSE
        SET stock_disponible = FALSE;
    END IF;
END//

-- Procedimiento para actualizar stock
CREATE PROCEDURE sp_actualizar_stock(IN repuesto_id INT, IN cantidad INT, IN tipo_movimiento VARCHAR(10), IN motivo VARCHAR(255), IN referencia VARCHAR(100))
BEGIN
    DECLARE stock_actual INT;
    DECLARE nuevo_stock INT;
    
    SELECT stock INTO stock_actual FROM repuestos WHERE id = repuesto_id;
    
    IF tipo_movimiento = 'entrada' THEN
        SET nuevo_stock = stock_actual + cantidad;
    ELSEIF tipo_movimiento = 'salida' THEN
        SET nuevo_stock = stock_actual - cantidad;
    ELSE
        SET nuevo_stock = cantidad; -- ajuste directo
    END IF;
    
    UPDATE repuestos SET stock = nuevo_stock WHERE id = repuesto_id;
    
    INSERT INTO movimientos_stock (repuesto_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, referencia)
    VALUES (repuesto_id, tipo_movimiento, cantidad, stock_actual, nuevo_stock, motivo, referencia);
END//

DELIMITER ;
