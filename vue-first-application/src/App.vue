<template>
  <body>
    <div class="navigation-bar">
      <div>
        <div class="logo">
          <router-link :to="{ name: 'home' }">
            <img src="../public/assets/img/logo.svg" alt="logo"/>
            <h1>POWER-DATA</h1>
          </router-link>
        </div>
        <div class="navigation">
          <h2>Bases de donn&eacute;es:</h2>
          <router-link v-for="base in bases" :key="base._id" :data="base" :to="{ name: 'base', params: { id: base._id }}">
            <i class="fa fa-database" aria-hidden="true"></i>{{ base.name }}
          </router-link>
          <a @click="$bvModal.show('bv-modal-create-base')"><i class="fa fa-plus" aria-hidden="true"></i>Cr&eacute;er</a>
          <h2>Tutoriels:</h2>
          <router-link to="/tutobases"><i class="fa fa-database" aria-hidden="true"></i>Créer une base</router-link>
          <router-link to="/tutotables"><i class="fa fa-bars" aria-hidden="true"></i>Créer des tables</router-link>
          <router-link to="/tutoformulaires"><i class="fa fa-check-square-o" aria-hidden="true"></i>Créer des formulaires</router-link>
          <router-link to="/tutodonnees"><i class="fa fa-flag-checkered" aria-hidden="true"></i>Collecter des donn&eacute;es</router-link>
          <a href="#"><i class="fa fa-plus" aria-hidden="true"></i>Voir plus</a>
        </div>
      </div>
      <div class="user-block">
        <div class="user-informations">
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <h3>Julien Lardet</h3>
        </div>
        <div class="user-navigation">
          <a href="#">Mon compte</a>
          <a href="#">D&eacute;connexion</a>
        </div>
      </div>
    </div>
    <router-view/>
    <b-modal id="bv-modal-create-base" hide-footer>
      <template v-slot:modal-title>
        Créer une nouvelle base
      </template>
      <md-field>
        <label>Nom de la base</label>
        <md-input v-model="newBase.name" md-counter="30"></md-input>
      </md-field>
      <md-button class="md-primary" @click="addBase">Créer</md-button>
      <md-button @click="$bvModal.hide('bv-modal-create-base')">Annuler</md-button>
    </b-modal>
  </body>
</template>


<script>
export default {
  data: function data() {
    return {
      loading: true,
      bases: [],
      newBase: {
        name: '',
      },
    };
  },
  created() {
    fetch('http://localhost:3000/bases')
      .then(res => res.json())
      .then((bases) => {
        this.bases = bases;
        this.loading = false;
      });
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    addBase: function addBase() {
      fetch('http://localhost:3000/bases', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: this.newBase.name,
        }),
      })
        .then(res => res.json())
        .then((base) => {
          this.bases.push(base);
          this.newBase.name = '';
        });
    },
    fetchData() {
      fetch('http://localhost:3000/bases')
        .then(res => res.json())
        .then((bases) => {
          this.bases = bases;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
