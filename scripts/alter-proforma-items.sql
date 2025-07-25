-- ALTER TABLE para permitir edición y guardado flexible de items en proformas
-- Haz un respaldo antes de ejecutar en producción

-- 1. Permitir repuesto_id NULL (para items personalizados)
ALTER TABLE proforma_items MODIFY repuesto_id INT NULL;

-- 2. Agregar columnas para código y descripción editables
ALTER TABLE proforma_items ADD COLUMN codigo VARCHAR(50) NULL AFTER repuesto_id;
ALTER TABLE proforma_items ADD COLUMN descripcion TEXT NOT NULL AFTER codigo;
ALTER TABLE proforma_items MODIFY descripcion TEXT NULL;
-- 3. (Opcional) Si quieres permitir precio_unitario NULL, ajusta:
-- ALTER TABLE proforma_items MODIFY precio_unitario DECIMAL(10,2) NULL;

-- 4. (Opcional) Si quieres permitir cantidad NULL, ajusta:
-- ALTER TABLE proforma_items MODIFY cantidad INT NULL;

-- 5. (Opcional) Si quieres eliminar la restricción de FK repuesto_id, puedes hacerlo así:
-- ALTER TABLE proforma_items DROP FOREIGN KEY <nombre_fk>;
-- (Reemplaza <nombre_fk> por el nombre real de la foreign key, si lo deseas)

-- Ahora puedes guardar cualquier combinación de código, descripción, cantidad y precio en los items de proforma, aunque no existan en repuestos.
