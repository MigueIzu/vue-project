<template>
  <div>
    <header>
      <div class="header-container">
        <h1>Bienvenido</h1>
        <img src="@/assets/images/icono-usuario.png" alt="Ícono de Usuario" />
      </div>
	  <div class="navList">
		<a href="http://localhost:8081/main">Listar Empleados</a>
		<a href="http://localhost:8081/register">Crear Empleado</a>
	  	<a href="https://expensesmanagercacpython24155g8front.netlify.app">Front</a>
	  </div> 
    </header>

    <main>
      <div class="body-container">
        <h2>Registro de Empleado</h2>
        <form id="registroForm" @submit.prevent="validarRegistro" novalidate>
          <div class="contenedor-general">
            <div class="contenedor-izquierdo">
              <div class="input-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" v-model="nombre" required />
              </div>
              <div class="input-group">
                <label for="apellido">Apellido:</label>
                <input type="text" id="apellido" name="apellido" v-model="apellido" required />
              </div>
              <div class="input-group">
                <label for="mail">Mail:</label>
                <input type="email" id="mail" name="mail" v-model="mail" required />
              </div>
              <div class="input-group">
                <label for="area">Área:</label>
                <select id="area" v-model="area" required>
                  <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.descripcion }}</option>
                </select>
              </div>
            </div>
            <div class="contenedor-derecho">
              <div class="input-group">
                <label for="clave">Clave:</label>
                <input type="password" id="clave" name="clave" v-model="clave" required />
              </div>
              <div class="input-group">
                <label for="repetir-clave">Repetir Clave:</label>
                <input type="password" id="repetir-clave" name="repetir-clave" v-model="repetirClave" required />
              </div>
            </div>
          </div>
          <div class="input-group checkbox">
            <input type="checkbox" id="aceptar-terminos" v-model="aceptarTerminos" required />
            <label for="aceptar-terminos">
              <a href="#" id="terminos-link" @click.prevent="mostrarModal">Aceptar términos y condiciones</a>
            </label>
          </div>
          <div class="botones">
            <button type="submit">Registrar</button>
            <button type="button" @click="volver">Volver</button>
          </div>
        </form>
      </div>
    </main>

    <footer>
      <div class="footer-container">
        <p>Comisión 24155 - Grupo 8</p>
        <div class="redes-sociales">
          <a href="#"><img src="@/assets/images/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="@/assets/images/instagram.png" alt="Instagram" /></a>
          <a href="#"><img src="@/assets/images/x.png" alt="X" /></a>
        </div>
      </div>
    </footer>

    <div id="myModal" class="modal" v-show="modalVisible">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h2>Términos y Condiciones</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vestibulum, velit sit amet semper vehicula, arcu
          nulla lobortis nisl, vitae faucibus ante nisi et erat. Mauris erat leo, iaculis nec malesuada eget, auctor at
          ligula. Nunc at gravida felis. Maecenas quis est leo. Nullam suscipit, magna eu pellentesque dapibus, arcu enim
          dignissim nisl, quis aliquet diam ipsum ut odio. Quisque lacus odio, blandit nec sagittis sit amet, finibus sed
          est. Sed eget aliquam massa. Nulla consectetur lectus aliquam quam varius tempus. Curabitur mollis rutrum ex ac
          pellentesque.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      apellido: '',
      mail: '',
      clave: '',
      repetirClave: '',
      area: '',
      aceptarTerminos: false,
      modalVisible: false,
      areas: []
    };
  },
  methods: {
    validarRegistro() {
      // Validación de los campos del formulario
      if (this.nombre.trim() === '' || this.apellido.trim() === '' || this.mail.trim() === '' || this.clave.trim() === '' || this.repetirClave.trim() === '' || this.area === '') {
        alert('Por favor, complete todos los campos.');
        return;
      }
      if (!this.mail.includes('@') || !this.mail.includes('.com')) {
        alert("El correo debe ser válido (debe contener '@' y '.com')");
        return;
      }
      if (this.clave !== this.repetirClave) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (!this.aceptarTerminos) {
        alert("Debe aceptar los términos y condiciones para registrarse.");
        return;
      }
      
      // Objeto con los datos del usuario a enviar
      const usuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        mail: this.mail,
        clave: this.clave,
        area_id: this.area
      };

      // Envío de los datos usando Axios
      axios.post('http://localhost:3000/api/register', usuario)
        .then(response => {
          alert('Usuario registrado correctamente.');
          console.log('Respuesta del servidor:', response.data); 
        })
        .catch(error => {
          alert('Error al registrar el usuario.');
          console.error('Error:', error);
        });
    },
    
    mostrarModal(event) {
      event.preventDefault(); 
      this.modalVisible = true; 
    },
    cerrarModal() {
      this.modalVisible = false; 
    },
    volver() {
      window.history.back(); 
    },
    obtenerAreas() {
      
      axios.get('http://localhost:3000/api/areas')
        .then(response => {
          this.areas = response.data;
        })
        .catch(error => {
          console.error('Error al obtener las áreas:', error);
        });
    }
  },
  mounted() {
    this.obtenerAreas();
  }
};
</script>

<style>

.navList{
	display:flex;
	flex-direction: row;
}
.navList a{
	margin-right:10px;
}
</style>
