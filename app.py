from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')
    # Aquí puedes manejar la lógica de registro, como guardar en la base de datos
    return jsonify({'message': 'Usuario registrado'}), 201

if __name__ == '__main__':
    app.run(debug=True)