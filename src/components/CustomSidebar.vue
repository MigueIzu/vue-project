<template>
  <div>
    <div class="sidebar-overlay" v-if="visible" @click="$emit('update:visible', false)"></div>
    <div :class="['sidebar', { 'is-visible': visible }]">
      <div class="sidebar-content">
        <button class="close-btn" @click="$emit('update:visible', false)">X</button>
        <slot></slot>
        <div class="input-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="empleadoActual.nombre" />
        </div>
        <div class="input-group">
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" v-model="empleadoActual.apellido" />
        </div>
        <div class="input-group">
          <label for="mail">Mail:</label>
          <input type="email" id="mail" v-model="empleadoActual.mail" />
        </div>
        <div class="input-group">
          <label for="avatar">Avatar:</label>
          <input type="file" id="avatar" @change="cargarAvatar" accept="image/*" />
        </div>
        <div class="input-group">
          <label for="area">Área:</label>
          <select id="area" v-model="empleadoActual.area_id">
            <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.descripcion }}</option>
          </select>
        </div>
        <div class="botones">
          <button @click="guardarEmpleado">Guardar</button>
          <button @click="cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';


export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    empleadoActual: {
      type: Object,
      default: () => ({
        id: null,
        nombre: '',
        apellido: '',
        mail: '',
        avatar: null,
        area_id: null 
      })
    },
    areas: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    cargarAvatar(event) {
      const file = event.target.files[0];
      console.log('Archivo seleccionado:', file);
    },
    guardarEmpleado() {
      const metodo = this.empleadoActual.id ? 'put' : 'post';
      const url = this.empleadoActual.id ? `http://localhost:3000/api/empleados/${this.empleadoActual.id}` : '/api/empleados';
      axios({
        method: metodo,
        url: url,
        data: this.empleadoActual
      })
      .then(response => {
        console.log('Empleado guardado:', response.data);
        this.$emit('guardar-empleado', this.empleadoActual);
        this.$emit('update:visible', false);
      })
      .catch(error => {
        console.error('Error al guardar el empleado:', error);
      });
    },
    cancelar() {
      this.$emit('update:visible', false);
    }
  }
};
</script>




