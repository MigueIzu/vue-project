from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="rrhh"
        )
        if connection.is_connected():
            print("Conexión a MySQL exitosa")
    except Error as e:
        print(f"Error: '{e}'")
    return connection

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    mail = data.get('mail')
    clave = data.get('clave')
    area_id = data.get('area_id')

    connection = create_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO empleados (nombre, apellido, mail, clave, area_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, apellido, mail, clave, area_id))
        connection.commit()
        return jsonify({'message': 'Usuario registrado correctamente'}), 201
    except Error as e:
        print(f"Error: '{e}'")
        return jsonify({'message': 'Error al registrar el usuario'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    mail = data.get('mail')
    clave = data.get('clave')

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id, nombre, apellido, mail, area_id 
            FROM empleados 
            WHERE mail = %s AND clave = %s
        """, (mail, clave))
        empleado = cursor.fetchone()
        if empleado:
            return jsonify({
                'mensaje': 'Inicio de sesión exitoso',
                'empleado': empleado
            }), 200
        else:
            return jsonify({'mensaje': 'Credenciales incorrectas'}), 401
    except Error as e:
        print(f"Error: '{e}'")
        return jsonify({'mensaje': 'Error al intentar iniciar sesión'}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
