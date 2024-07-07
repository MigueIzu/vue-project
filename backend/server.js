import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rrhh'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

//Ruta para registrar empleados
app.post('/api/register', async (req, res) => {
  const { nombre, apellido, mail, clave, area_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    const sqlUsuario = 'INSERT INTO empleados (nombre, apellido, mail, clave) VALUES (?, ?, ?, ?)';
    
    db.query(sqlUsuario, [nombre, apellido, mail, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario:', err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      
      const usuarioId = result.insertId;
      const sqlEmpleadoArea = 'INSERT INTO empleados_has_area (empleados_id, area_id) VALUES (?, ?)';
      
      db.query(sqlEmpleadoArea, [usuarioId, area_id], (err, result) => {
        if (err) {
          console.error('Error al insertar empleado_area:', err);
          res.status(500).send('Error al registrar el área del empleado');
          return;
        }
        
        res.status(200).send('Usuario registrado correctamente');
      });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

app.get('/api/areas', (req, res) => {
  const sqlarea = 'SELECT id, descripcion FROM area';
  db.query(sqlarea, (err, results) => {
    if (err) {
      console.error('Error al obtener las áreas:', err);
      res.status(500).send('Error al obtener las áreas');
      return;
    }
    res.status(200).json(results);
  });
});

// Ruta para el login de usuario
app.post('/api/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  
  const sql = `
    SELECT e.*, a.descripcion AS area_descripcion
    FROM empleados e
    JOIN empleados_has_area ea ON e.id = ea.empleados_id
    JOIN area a ON ea.area_id = a.id
    WHERE e.mail = ?
  `;

  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error('Error al buscar empleado:', err);
      res.status(500).send('Error al buscar empleado');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }

    const empleado = results[0];
    
    const match = await bcrypt.compare(contrasena, empleado.clave);
    if (!match) {
      res.status(401).send('Credenciales incorrectas');
      return;
    }

    const token = jwt.sign({ id: empleado.id, area: empleado.area_descripcion }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, empleado });
  });
});


// Ruta para obtener la lista de empleados y sus áreas
app.get('/api/empleados', (req, res) => {
  const sql = `
    SELECT e.id, e.nombre, e.apellido, e.mail, e.avatar, a.descripcion AS area_descripcion
    FROM empleados e
    JOIN empleados_has_area ea ON e.id = ea.empleados_id
    JOIN area a ON ea.area_id = a.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los empleados:', err);
      res.status(500).send('Error al obtener los empleados');
      return;
    }
    res.status(200).json(results);
  });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ruta para el manejo adecuado de la actualización del emplado
app.put('/api/empleados/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, mail, area_id } = req.body;

  try {
    const sqlUpdateEmpleado = 'UPDATE empleados SET nombre = ?, apellido = ?, mail = ? WHERE id = ?';
    db.query(sqlUpdateEmpleado, [nombre, apellido, mail, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar empleado:', err);
        res.status(500).send('Error al actualizar el empleado');
        return;
      }

      const sqlUpdateArea = 'UPDATE empleados_has_area SET area_id = ? WHERE empleados_id = ?';
      db.query(sqlUpdateArea, [area_id, id], (err, result) => {
        if (err) {
          console.error('Error al actualizar área del empleado:', err);
          res.status(500).send('Error al actualizar el área del empleado');
          return;
        }

        res.status(200).send('Empleado actualizado correctamente');
      });
    });
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    res.status(500).send('Error al actualizar el empleado');
  }
});

// Ruta para la eliminación de un emplado
app.delete('/api/empleados/:id', (req, res) => {
  const empleadoId = req.params.id;

  const sqlEliminarEmpleado = 'DELETE FROM empleados WHERE id = ?';
  const sqlEliminarEmpleadoArea = 'DELETE FROM empleados_has_area WHERE empleados_id = ?';

  db.query(sqlEliminarEmpleadoArea, [empleadoId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el área del empleado:', err);
      res.status(500).send('Error al eliminar el área del empleado');
      return;
    }

    db.query(sqlEliminarEmpleado, [empleadoId], (err, result) => {
      if (err) {
        console.error('Error al eliminar el empleado:', err);
        res.status(500).send('Error al eliminar el empleado');
        return;
      }

      res.status(200).send('Empleado eliminado correctamente');
    });
  });
});


