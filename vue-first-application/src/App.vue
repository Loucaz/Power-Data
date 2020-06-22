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
      <div v-if="username" class="navigation">
        <h2>Bases de donn&eacute;es:</h2>
        <router-link v-for="base in bases" :key="base._id" :data="base"
                     :to="{ name: 'base', params: { id: base._id }}">
          <i class="fa fa-database" aria-hidden="true"></i>{{ base.name }}
        </router-link>
        <a @click="$bvModal.show('bv-modal-create-base')"><i class="fa fa-plus"
                                                             aria-hidden="true"></i>Cr&eacute;er</a>
        </div>
      <div class="navigation">
        <h2>Tutoriels:</h2>
        <router-link to="/tuto">
          <i class="fa fa-database" aria-hidden="true"></i>
          Utiliser Power Data
        </router-link>
      </div>
    </div>
    <div v-if="username" class="user-block">
      <div class="user-informations">
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        <h3>{{this.username}}</h3>
      </div>
      <div class="user-navigation">
        <router-link @click.native="Logout" to="/login">D&eacute;connexion</router-link>
      </div>
    </div>
    <div v-else class="user-block">
      <div class="user-navigation">
        <router-link to="/register">Inscription</router-link>
        <router-link to="/login">Connexion</router-link>
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
  import router from "./router";

  export default {
    data: function data() {
      return {
        loading: true,
        bases: [],
        newBase: {
          name: '',
        },

        username: null,
      };
    },
    created() {
      this.fetchData();
    },
    watch: {
      // call again the method if the route changes
      $route: 'fetchData',

    },
    methods: {
      addBase: function addBase() {
        fetch(this.$adresse+'/bases', {
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
            fetch(this.$adresse+`/users/${localStorage.getItem('user')}`, {
              method: 'PUT',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                nbase: base._id,
              }),
            }).then(res2 => res2.json())
              .then((response) => {
              });

          });


      },
      fetchData() {
        if (localStorage.getItem('user') != null) {
          fetch(this.$adresse+`/users/${localStorage.getItem('user')}`, {
            method: 'GET',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            }
          })
            .then(res => res.json())
            .then((res) => {
              if(res.error){
                return this.Logout();
              }
              this.bases = res.user.bases;
              this.loading = false;
            }).catch((error) => {
            return this.Logout();
          });
          this.username = localStorage.getItem('username');
        }else{
          this.Logout();
        }
      },
      Logout() {
        this.username = null;
        this  .bases = null;
        localStorage.clear();
      }
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
