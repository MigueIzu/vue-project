<template>
  <header>
    <div class="header-container">
      <h1>Bienvenido</h1>
      <img src="@/assets/images/icono-usuario.png" alt="Ícono de Usuario" />
    </div>
  </header>
  <div class="body-container login-container">
    <form id="loginForm" @submit.prevent="login" novalidate>
      <h1>Gestión de Empleados</h1>
      <div class="contenedor-general-login">
        <div class="contenedor-izquierdo-login">
          <h2>Ingresar</h2>
          <div class="contenedor-general-izquierdo">
            <div class="contenedor-izquierdo-1"></div>
            <div class="contenedor-izquierdo-2">
              <div class="input-group">
                <label for="usuario" id="label-usuario-login">Usuario:</label>
              </div>
              <input type="text" id="usuario" name="usuario" v-model="usuario" required placeholder="Ingrese mail">
              <div class="input-group">
                <label for="contrasena" id="label-contrasena-login">Contraseña:</label>
              </div>
              <input type="password" id="contrasena" name="contrasena" v-model="contrasena" required placeholder="Ingrese clave de acceso">
            </div>
          </div>
          <div class="botones">
            <button type="submit">Ingresar</button>
          </div>
        </div>
        <div class="contenedor-derecho-login">
          <h2>Bienvenido</h2>
          <hr>
          <div class="separador"></div>
          <router-link to="/register" id="cuenta-nueva">¿No tienes cuenta? Regístrate</router-link>
          <hr>
          <div class="separador"></div>
        </div>
      </div>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>

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
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuario: '',
      contrasena: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          usuario: this.usuario,
          contrasena: this.contrasena
        });

        const { token, empleado } = response.data;

        // Guardar el token en el local storage o en una cookie
        localStorage.setItem('token', token);
        localStorage.setItem('empleado', JSON.stringify({
          id: empleado.id,
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          mail: empleado.mail,
          area: empleado.area_descripcion
        }));

        // Redirigir a la página principal
        this.$router.push('/main'); 
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            this.error = 'Credenciales incorrectas';
          } else if (error.response.status === 404) {
            this.error = 'Usuario no encontrado';
          } else {
            this.error = 'Error al intentar iniciar sesión';
          }
        } else {
          console.error('Error:', error.message);
          this.error = 'Error de red. Por favor, intenta nuevamente';
        }
      }
    },

    validarLoginForm() {
      if (this.usuario.trim() === '' || this.contrasena.trim() === '') {
        alert('Por favor, complete todos los campos.');
        return;
      }
      if (!this.usuario.includes('@') || !this.usuario.includes('.com')) {
        alert("El Usuario es un correo electrónico, debe contener '@' y '.com'");
        return;
      }
    }
  }
};
</script>


