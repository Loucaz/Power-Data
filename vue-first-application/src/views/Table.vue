<template>
  <div class="table-container" v-if="!loading">
      <div class="table-header">
      <div class="base-informations">
        <div class="base-icon table-blue">
          <i class="fa fa-envelope" aria-hidden="true"></i>
        </div>
        <div class="base-description">
          <h2>
            <router-link :to="{ name: 'base', params: { id: base._id }}">
              {{base.name}}
            </router-link>
            > {{table.name}}
          </h2>
          <p>Créer le 14/01/2020 par <a href="#">Julien Lardet</a></p>
        </div>
      </div>
      <div class="base-actions">
        <a href="#"><i class="fa fa-external-link" aria-hidden="true"></i></a>
        <a href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a>
        <a href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="table-actions">
      <div class="dropdown">
        <a class="action-btn dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Table
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" @click="$bvModal.show('bv-modal-add-column')">Ajouter une colonne</a>
          <a class="dropdown-item" href="#">Ajouter une ligne</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Exporter</a>
        </div>
      </div>
      <div class="dropdown">
        <a class="action-btn dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Formulaires
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" href="#">Liste des formulaires</a>
          <a class="dropdown-item" href="#">Créer un formulaire</a>
        </div>
      </div>
      <div class="dropdown">
        <a class="action-btn dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Developpement
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item" @click="$bvModal.show('bv-modal-add-type')">Ajouter un type de colonne</a>
        </div>
      </div>
    </div>
    <div class="table-data-container">
      <div class="table-column">
        <div class="table-column-header">
          <p>ID</p>
        </div>
        <div class="table-column-data">
          <div class="table-data">
            0
          </div>
          <div class="table-data">
            1
          </div>
          <div class="table-data">
            2
          </div>
          <div class="table-data">
            3
          </div>
          <div class="table-data">
            4
          </div>
        </div>
      </div>
      <div class="table-column">
        <div class="table-column-header">
          <p>Nom</p>
          <div class="dropdown">
            <a class="action-btn dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <h6 class="dropdown-header">Modification</h6>
              <a class="dropdown-item" href="#">Renommer</a>
              <a class="dropdown-item" href="#">Type de colonne</a>
              <a class="dropdown-item" href="#">Description</a>
              <a class="dropdown-item" href="#">Supprimer</a>
            </div>
          </div>
        </div>
        <div class="table-column-data">
          <div class="table-data">
            Julien
          </div>
          <div class="table-data">
            Vincent
          </div>
          <div class="table-data">
            Roger
          </div>
          <div class="table-data">
            Bernard
          </div>
          <div class="table-data">
            Jean-mi
          </div>
        </div>
      </div>
    </div>
    <b-modal id="bv-modal-add-column" hide-footer>
      <template v-slot:modal-title>
        Créer une nouvelle colonne
      </template>
      <p>La colonne sera ajoutée dans la table <strong>{{ table.name }}</strong></p>
      <md-field>
        <label>Nom de la colonne</label>
        <md-input v-model="newColumn.name" md-counter="30"></md-input>
      </md-field>

      <md-field>
        <label for="type">Type de la colonne</label>
        <md-select v-model="newColumn.type" name="type" id="type-select">
          <md-option :value="type._id" v-for="type in types" :key="type._id">{{ type.name }}</md-option>
        </md-select>
      </md-field>
      <md-button class="md-primary" @click="addColumn">Créer</md-button>
      <md-button @click="$bvModal.hide('bv-modal-add-table')">Annuler</md-button>
    </b-modal>
    <b-modal id="bv-modal-add-type" hide-footer>
      <template v-slot:modal-title>
        Ajouter un type
      </template>
      <md-field>
        <label>Nom du type</label>
        <md-input v-model="newType.name" md-counter="30"></md-input>
      </md-field>
      <md-field>
        <label>Real name</label>
        <md-input v-model="newType.realName" md-counter="30"></md-input>
      </md-field>
      <md-field>
        <label>description</label>
        <md-input v-model="newType.description" md-counter="60"></md-input>
      </md-field>
      <md-button class="md-primary" @click="addType">Créer</md-button>
      <md-button @click="$bvModal.hide('bv-modal-add-type')">Annuler</md-button>
    </b-modal>
  </div>
</template>


<script>
export default {
  name: 'table',
  data: function data() {
    return {
      base: {
        name: String,
        _id: String,
        tables: [],
      },
      table: {
        columns: [],
        name: String,
        _id: String,
        data: [],
      },
      newColumn: {
        name: String,
        type: String,
      },
      types: [],
      newType: {
        name: String,
        realName: String,
        description: String,
      },
      loading: true,
    };
  },
  created() {
    const url = `http://localhost:3000/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
    fetch(url)
      .then(res => res.json())
      .then((rep) => {
        this.base = rep.base;
        this.table = rep.table;
      });

    const urlTypes = 'http://localhost:3000/types';
    fetch(urlTypes)
      .then(res => res.json())
      .then((rep) => {
        this.types = rep;
        this.loading = false;
      });

    this.newColumn.name = '';
    this.newType.name = '';
    this.newType.realName = '';
    this.newType.description = '';
  },
  methods: {
    deleteTable: function deleteTable() {
      const url = `http://localhost:3000/bases/${this.base._id}`;
      fetch(url, { method: 'DELETE' });
      this.$router.push({ name: 'home' });
    },
    addType: function addType() {
      if (this.newType.name.length > 0 && this.newType.realName.length > 0 && this.newType.description.length > 0) {
        const url = 'http://localhost:3000/types';
        fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(this.newType),
        })
          .then(res => res.json())
          .then((res) => {
            console.log(res);
          });
        this.newType.name = '';
        this.newType.realName = '';
        this.newType.description = '';
      }
    },
    addColumn: function addColumn() {
      if (this.newColumn.name.length > 0 && this.newColumn.type.length > 0) {
        const url = `http://localhost:3000/bases/${this.base._id}/${this.table._id}/column`;
        fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(this.newColumn),
        })
          .then(res => res.json())
          .then((res) => {
            console.log(res);
          });
      }
    },
  },
};
</script>
