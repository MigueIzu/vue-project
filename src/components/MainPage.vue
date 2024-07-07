<template>
  <div>
    <header>
      <div class="header-container" v-if="usuario">
        <h1>Bienvenido, {{ usuario.nombre }} {{ usuario.apellido }}</h1>
        <img src="@/assets/images/icono-usuario.png" alt="Ícono de Usuario" />
      </div>
    </header>

    <main>
      <div class="body-container">
        <div class="inferior-container">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Mail</th>
                <th>Avatar</th>
                <th>Área</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="empleado in empleados" :key="empleado.id">
                <td>{{ empleado.id }}</td>
                <td>{{ empleado.nombre }}</td>
                <td>{{ empleado.apellido }}</td>
                <td>{{ empleado.mail }}</td>
                <td>{{ empleado.avatar }}</td>
                <td>{{ empleado.area_descripcion }}</td>
                <td>
                  <i v-if="esAdmin || esEmpleadoActual(empleado)" class="far fa-edit" alt="Editar" @click="editarEmpleado(empleado)" ></i>
                  <i v-if="esAdmin || esEmpleadoActual(empleado)" class="far fa-trash-alt" alt="Eliminar" @click="confirmarEliminar(empleado.id)" ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

    <CustomSidebar v-model:visible="sidebarVisible" :empleado-actual="empleadoActual" :areas="areas">
      <template v-slot:default>
        
      </template>
    </CustomSidebar>

    <!-- Modal de confirmación -->
    <transition name="modal">
      <div v-if="mostrarConfirmacion" class="modal-overlay">
        <div class="modal">
          <h3>Usted está a punto de eliminar sus datos del Sistema</h3>
          <div class="modal-buttons">
            <button @click="eliminarEmpleadoConfirmado">Continuar</button>
            <button @click="cancelarEliminar">Cancelar</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios';
import CustomSidebar from './CustomSidebar.vue';

export default {
  components: {
    CustomSidebar
  },
  data() {
    return {
      usuario: null,
      empleados: [],
      areas: [], // Definir areas en data
      esAdmin: false,
      sidebarVisible: false,
      empleadoAEliminar: null,
      mostrarConfirmacion: false,
      empleadoActual: {} // Definir empleadoActual en data
    };
  },
  computed: {
    esEmpleadoActual() {
      return empleado => this.usuario.id === empleado.id;
    }
  },
  methods: {
    async cargarEmpleados() {
      try {
        const response = await axios.get('http://localhost:3000/api/empleados');
        this.empleados = response.data;
        this.cargarEmpleados(); // Recargar empleados después de editar
      } catch (error) {
        console.error('Error al cargar los empleados:', error);
      }
    },
    async cargarAreas() {
      try {
        const response = await axios.get('http://localhost:3000/api/areas');
        this.areas = response.data;
      } catch (error) {
        console.error('Error al cargar las áreas:', error);
      }
    },
    async cargarUsuario() {
      const storedUsuario = localStorage.getItem('empleado');

      if (storedUsuario) {
        try {
          this.usuario = JSON.parse(storedUsuario);
          this.esAdmin = this.usuario.area === 'Administrador';
          await this.cargarEmpleados();
          await this.cargarAreas(); // Cargar áreas
        } catch (error) {
          console.error('Error al parsear el usuario:', error);
        }
      } else {
        console.error('Usuario no encontrado en localStorage');
      }
    },
    editarEmpleado(empleado) {
      const areaRelacionada = this.areas.find(area => area.id === empleado.area_id);
      this.empleadoActual = {
        ...empleado,
        area_id: areaRelacionada ? areaRelacionada.id : null
      };
      this.sidebarVisible = true; // Mostrar la sidebar
    },
    
    
    async eliminarEmpleadoConfirmado() {
      try {
        await axios.delete(`http://localhost:3000/api/empleados/${this.empleadoAEliminar}`);
        this.cargarEmpleados();
        this.mostrarConfirmacion = false;
      } catch (error) {
        console.error('Error al eliminar el empleado:', error);
      }
    },
    confirmarEliminar(id) {
      this.empleadoAEliminar = id;
      this.mostrarConfirmacion = true;
    },
    cancelarEliminar() {
      this.empleadoAEliminar = null;
      this.mostrarConfirmacion = false;
    },
    verificarEmpleadoActual(empleado) {
      return this.empleadoActual.id === empleado.id;
    }
  },
  mounted() {
    this.cargarUsuario();
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal */
.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
}

.modal-enter,
.modal-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>