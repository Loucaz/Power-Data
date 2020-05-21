<template>
  <div class="container" v-if="!loading">
    <div class="element-block header">
      <div class="base-informations">
        <div class="base-icon">
          <i class="fa fa-database" aria-hidden="true"></i>
        </div>
        <div class="base-description">
          <h2>{{ base.name }}</h2>
          <p>Créer le 14/01/2020 par <a href="#">Julien Lardet</a></p>
        </div>
      </div>
      <div class="base-actions">
        <a href="#"><i class="fa fa-external-link" aria-hidden="true"></i></a>
        <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a>
        <a @click="deleteBase()"><i class="fa fa-trash" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="base-tables">
      <h2>Liste des tables :</h2>
      <div class="list-tables">
        <router-link v-for="table in base.tables" :key="table._id" :data="table" :to="{ name: 'table', params: { id: base._id, idTable: table._id }}">
          <div class="table-icon">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </div>
          <p>{{ table.name }}</p>
        </router-link>

        <a @click="$bvModal.show('bv-modal-add-table')">
          <div class="table-icon">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </div>
          <p>Ajouter</p>
        </a>
      </div>
    </div>
    <b-modal id="bv-modal-add-table" hide-footer>
      <template v-slot:modal-title>
        Créer une nouvelle table
      </template>
      <p>La table sera créée dans la base <strong>{{ base.name }}</strong></p>
      <md-field>
        <label>Nom de la table</label>
        <md-input v-model="newTable.name" md-counter="30"></md-input>
      </md-field>
      <md-button class="md-primary" @click="addTable">Créer</md-button>
      <md-button @click="$bvModal.hide('bv-modal-add-table')">Annuler</md-button>
    </b-modal>
  </div>
</template>


<script>
export default {
  name: 'Base',
  data: function data() {
    return {
      base: {
        name: String,
        _id: String,
        tables: [],
      },
      loading: true,
      newTable: {
        name: '',
      },
    };
  },
  created() {
    const url = this.$adresse+`/bases/${this.$route.params.id}`;
    fetch(url)
      .then(res => res.json())
      .then((rep) => {
        this.base = rep.base;
        this.loading = false;
      });
    // console.log(this.base);
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    addTable: function addTable() {
      if (this.newTable.name.length > 0) {
        const url = this.$adresse+`/bases/${this.base._id}/table`;
        fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(this.newTable),
        })
          .then(res => res.json())
          .then((res) => {
            const tmp = this.base;
            tmp.tables.push(res);
            this.base = tmp;
          });
        this.newTable.name = '';
      }
    },
    fetchData() {
      this.base = null;
      this.loading = true;
      // replace `getPost` with your data fetching util / API wrapper
      const url = this.$adresse+`/bases/${this.$route.params.id}`;
      fetch(url)
        .then(res => res.json())
        .then((rep) => {
          this.base = rep.base;
          this.loading = false;
        });
    },

    deleteTable: function deleteTable() {
      const url = this.$adresse+`/bases/${this.base._id}`;
      fetch(url, { method: 'DELETE' })
        .then(console.log);
      this.$router.push({ name: 'home' });
    },
  },
};
</script>
