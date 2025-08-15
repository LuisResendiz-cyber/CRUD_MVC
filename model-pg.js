const pool = require("../config/db-pg");

class Process {
  static async insertAuto(data, tableName) {
    if (!data || data.length === 0) return 0;
    const batchSize = 1000;
    const columns = Object.keys(data[0]);
    const batches = Math.ceil(data.length / batchSize);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      for (let i = 0; i < batches; i++) {
        const batch = data.slice(i * batchSize, (i + 1) * batchSize);
        await this.insertBatch(batch, tableName, columns);
      }
      await client.query('COMMIT');
      return data.length;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error ${error.message}`);
    } finally {
      client.release();  // Liberar conexión
    }
  }



  static async insertBatch(batch, tableName, columns) {    
    // 1. Crear placeholders dinámicos ($1, $2, ...)
    const valuePlaceholders = batch.map((_, rowIdx) => {
      const startIdx = rowIdx * columns.length + 1;
      return `(${columns.map((_, colIdx) => `$${startIdx + colIdx}`).join(', ')})`;
    }).join(', ');

    // 2. Preparar valores en orden plano
    const values = batch.flatMap(row => 
      columns.map(col => {
        // Manejar valores nulos y fechas
        if (row[col] instanceof Date) return row[col].toISOString();
        return row[col] !== undefined ? row[col] : null;
      })
    );
    // 3. Escapar nombres de columnas (prevención SQL injection)
    const escapedColumns = columns.map(col => `${col.replace(/"/g, '""')}`).join(', ');    
    // 4. Construir consulta final
    const queryText = `
      INSERT INTO ${tableName} 
      (${escapedColumns})
      VALUES ${valuePlaceholders}
    `;
    // console.log(queryText)
    // 5. Ejecutar consulta
    await pool.query(queryText, values);
  }
}
module.exports = {
  Process,
};
