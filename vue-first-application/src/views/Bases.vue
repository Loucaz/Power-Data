<template>
  <div>
    <h2>Bases</h2>
    <div class="list-bases">
      <a href="#" @click="$bvModal.show('bv-modal-example')">
        <i class="material-icons">add</i>
        <h3>créer</h3>
      </a>
      <router-link v-for="base in bases" :key="base._id" :data="base" :to="{ name: 'base', params: { id: base._id }}">
        <i class="material-icons">add</i>
        <h3>{{ base.name }}</h3>
      </router-link>
    </div>


    <b-modal id="bv-modal-example" hide-footer>
      <template v-slot:modal-title>
        Créer une nouvelle base
      </template>
      <md-field>
        <label>Nom de la base</label>
        <md-input v-model="newBase.name" md-counter="30"></md-input>
      </md-field>
      <md-button class="md-primary" @click="addBase">Créer</md-button>
      <md-button @click="$bvModal.hide('bv-modal-example')">Annuler</md-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Bases',
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
  },
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,700,900&display=swap');
  .list-bases {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 80%;
    margin: 0 auto;
  }
  .list-bases a {
    font-family: 'Montserrat', sans-serif;
    color: #484A47;
    padding: 1rem 1.4rem;
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 1rem;
    width: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-shadow:
      0 2.1px 2.2px rgba(0, 0, 0, 0.006),
      0 5.1px 5.3px rgba(0, 0, 0, 0.008),
      0 9.5px 10px rgba(0, 0, 0, 0.01),
      0 17px 17.9px rgba(0, 0, 0, 0.012),
      0 31.8px 33.4px rgba(0, 0, 0, 0.014),
      0 76px 80px rgba(0, 0, 0, 0.02);
    transition: all 0.3s;
    margin-right: 1rem;
    margin-top: 1rem;
  }
  .list-bases a:hover {
    text-decoration: none;
    box-shadow:
      0 2.1px 2.2px rgba(0, 0, 0, 0.011),
      0 5.1px 5.3px rgba(0, 0, 0, 0.016),
      0 9.5px 10px rgba(0, 0, 0, 0.02),
      0 17px 17.9px rgba(0, 0, 0, 0.024),
      0 31.8px 33.4px rgba(0, 0, 0, 0.029),
      0 76px 80px rgba(0, 0, 0, 0.04);
    color: inherit;
  }
  .list-bases h3 {
    text-transform: uppercase;
    font-size: 1rem;
    margin-top: 1rem;
  }
  .list-bases i {
    color: #fff;
    border-radius: 50%;
    padding: 1rem;
    background-color: #56CBF9;
  }
</style>
