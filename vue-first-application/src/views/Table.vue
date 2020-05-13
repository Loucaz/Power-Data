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

    <div class="">
      <b-tabs content-class="mt-3">
        <b-tab title="Grille" active>
          <div class="table-actions">
            <div class="dropdown">
              <a class="action-btn dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Table
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" @click="showAddColumn = !showAddColumn">Ajouter une colonne</a>
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
            <div class="table-datas">
              <md-table>
                <md-table-row>
                  <md-table-head md-numeric>ID</md-table-head>
                  <md-table-head v-for="c in table.columns" v-bind:key="c.id">
                    {{ c.name }}
                  </md-table-head>
                </md-table-row>

                <md-table-row @click="showInsertData = true">
                  <md-table-cell md-numeric>1</md-table-cell>
                  <md-table-cell></md-table-cell>
                  <md-table-cell></md-table-cell>
                </md-table-row>
              </md-table>
            </div>

            <!-- BLOC CREATE COLUMN -->
            <transition name="slide-fade">
              <div class="table-bloc-settings" v-if="showAddColumn">
                <div class="table-settings-header">
                  <a class="table-settings-close-btn" @click="showAddColumn = !showAddColumn">x</a>
                  <h3 class="table-settings-title">Ajouter une colonne</h3>
                </div>
                <div class="table-settings-content">
                  <p>La colonne sera ajoutée dans la table <strong>{{ table.name }}</strong></p>
                  <md-field>
                    <label>Nom de la colonne</label>
                    <md-input v-model="newColumn.name" md-counter="30"></md-input>
                  </md-field>

                  <md-field>
                    <label for="type">Type de la colonne</label>
                    <md-select v-model="newColumn.type" name="type" id="type-select" @input="getColumnSettings" md-dense>
                      <md-option :value="type.realName" v-for="type in types" :key="type._id">{{ type.name }}</md-option>
                    </md-select>
                  </md-field>
                  <div class="extra-type-settings">
                    <div v-for="c in columnConstraints" :key="c.id">
                      <md-field v-if="c.type != 'checkbox' && c.type != 'date'">
                        <label>{{ c.title }}</label>
                        <md-input v-if="c.type == 'text'" v-model="c.cible" :id="c.id" :ref="c.id" md-counter="30"></md-input>
                        <md-input v-if="c.type == 'number'" v-model="c.cible" type="number" :id="c.id" :ref="c.id"></md-input>
                        <md-select v-if="c.type == 'select'" v-model="c.cible" name="typeDate" :id="c.id" :ref="c.id" @input="c.input" md-dense>
                          <md-option :value="opt.id" v-for="opt in c.options" :key="opt.id">{{ opt.name }}</md-option>
                        </md-select>
                        <span v-if="c.helper != null" class="md-helper-text">{{ c.helper }}</span>
                      </md-field>
                    </div>
                    <div v-if="dateInterval">
                      <md-datepicker id="date-start" ref="date-start" v-model="newColumn.dateStart">
                        <label>Date minimum</label>
                      </md-datepicker>
                      <md-datepicker id="date-end" ref="date-end" v-model="newColumn.dateEnd">
                        <label>Date maximum</label>
                      </md-datepicker>
                    </div>
                    <md-checkbox v-if="nullableOption" class="md-primary" v-model="newColumn.nullable">Peut être vide</md-checkbox>
                  </div>
                  <md-button class="md-primary" @click="addColumn">Créer</md-button>
                  <md-button @click="showAddColumn = !showAddColumn">Annuler</md-button>
                </div>
              </div>
            </transition>
            <!-- END BLOC CREATE COLUMN -->

            <!-- BLOC INSERT DATA -->
            <transition name="slide-fade">
              <div class="table-bloc-settings" v-if="showInsertData">
                <div class="table-settings-header">
                  <a class="table-settings-close-btn" @click="showInsertData = !showInsertData">x</a>
                  <h3 class="table-settings-title">Ajouter une ligne</h3>
                </div>
                <div class="table-settings-content">
                  <p>Les données seront ajoutées dans la table <strong>{{ table.name }}</strong></p>
                  <md-button class="md-primary" @click="addColumn">Créer</md-button>
                  <md-button @click="showAddColumn = !showAddColumn">Annuler</md-button>
                </div>
              </div>
            </transition>
            <!-- END BLOC INSERT DATA -->
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
              <label>Type de la colonne</label>
              <md-select v-model="newColumn.type" name="type" id="type-select">
                <md-option :value="type.realName" v-for="type in types" :key="type._id">{{ type.name }}</md-option>
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
        </b-tab>


        <b-tab title="Formulaire">
            <div> 
              <md-table-head v-for="c in table.columns" v-bind:key="c.id">
                   
                  </md-table-head>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <b-form-group
                v-for="c in table.columns" v-bind:key="c.id"
                id="input-group-1"
                label-for="input-1"
                >
                <p>{{ c.name }} :</p>
                 <!-- label="Email address:" -->
                <!-- description="We'll never share your email with anyone else." -->
                <b-form-input
                  id="input-1"
                  class="col-3"
                  v-model="form.email"
                  type="email"
                  required=""
                >
                </b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </div>
        </b-tab>


        <b-tab title="Calendrier">
             <b-calendar block :start-weekday="weekday" selected-variant="success" today-variant="info" locale="fr"></b-calendar>
        
        </b-tab>
      </b-tabs>
    </div>



  </div>
</template>


<script>
import format from 'date-fns/format';

export default {
  name: 'table',
  data: function data() {
    const dateFormat = this.$material.locale.dateFormat || 'yyyy-MM-dd';
    const now = new Date();
    return {
      weekday: 1,
      form: {
          email: '',
          name: '',
          food: null,
          checked: []
        },
        foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
        show: true,
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
        nullable: true,
        min: Number,
        max: Number,
        defaultStringValue: String,
        numberStepValue: Number,
        dateIsToday: false,
        dateIsFree: false,
        dateStart: format(now, dateFormat),
        dateEnd: format(now, dateFormat),
      },
      newData: {
        value: String,
        valueString: String,
        valueNumber: Number,
        valueBoolean: Boolean,
        valueDate: Date,
        line: Number,
        Column: String,
      },
      typeDate: Number,
      dateInterval: false,
      nullableOption: true,
      columnConstraints: [],
      c: String,
      constraint: {
        label: String,
      },
      types: [],
      newType: {
        name: String,
        realName: String,
        description: String,
      },
      loading: true,
      showAddColumn: false,
      showInsertData: false,
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
    this.newColumn.nullable = true;
    this.newColumn.min = null;
    this.newColumn.max = null;
    this.newColumn.defaultStringValue = null;

    this.newType.name = '';
    this.newType.realName = '';
    this.newType.description = '';
  },
  methods: {
    onSubmit(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
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
      this.newColumn.min = (this.$refs['newcolumn-min'] != null) ? this.$refs['newcolumn-min'][0].value : null;
      this.newColumn.max = (this.$refs['newcolumn-max'] != null) ? this.$refs['newcolumn-max'][0].value : null;
      this.newColumn.numberStepValue = (this.$refs['step-value'] != null) ? this.$refs['step-value'][0].value : null;
      this.newColumn.defaultStringValue = (this.$refs['default-text'] != null) ? this.$refs['default-text'][0].value : null;

      console.log(this.newColumn);

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
            const tmp = this.table;
            tmp.columns.push(res);
            this.table = tmp;
          });
      }
    },
    getDateSettings: function getDateSettings(value) {
      this.dateInterval = false;
      this.newColumn.dateIsToday = false;
      this.newColumn.dateIsFree = false;
      switch (value) {
        // Libre
        case '1':
          this.newColumn.dateIsFree = true;
          this.nullableOption = true;
          break;
        // Entre deux dates
        case '2':
          this.dateInterval = true;
          this.nullableOption = true;
          break;
        // Date du jour
        case '3':
          this.nullableOption = false;
          this.newColumn.nullable = false;
          this.newColumn.dateIsToday = true;
          break;
        default:
          break;
      }
    },
    getColumnSettings: function getColumnSettings(typeRealname) {
      this.dateInterval = false;
      this.newColumn.dateIsToday = false;
      switch (typeRealname) {
        case 'number':
          this.newColumn.min = -1000;
          this.newColumn.max = 1000;
          this.newColumn.numberStepValue = 1;
          this.nullableOption = true;
          this.columnConstraints = [
            {
              id: 'newcolumn-min',
              title: 'Valeur minimum',
              cible: this.newColumn.min,
              type: 'number',
            },
            {
              id: 'newcolumn-max',
              title: 'Valeur maximum',
              cible: this.newColumn.max,
              type: 'number',
            },
            {
              id: 'step-value',
              title: 'Valeur du pas',
              cible: this.newColumn.numberStepValue,
              type: 'number',
              helper: 'Exemple: 0.01, 0.1, 1, 10',
            },
          ];
          break;
        case 'shorttext':
          this.nullableOption = true;
          this.newColumn.min = 0;
          this.newColumn.max = 20;
          this.columnConstraints = [
            {
              id: 'default-text',
              title: 'Texte par défaut',
              cible: this.newColumn.defaultStringValue,
              type: 'text',
            },
            {
              id: 'newcolumn-min',
              title: 'Longueur minimum',
              cible: this.newColumn.min,
              type: 'number',
            },
            {
              id: 'newcolumn-max',
              title: 'Longueur maximum',
              cible: this.newColumn.max,
              type: 'number',
            },
          ];
          break;
        case 'longtext':
          this.newColumn.min = 0;
          this.newColumn.max = 250;
          this.nullableOption = true;
          this.columnConstraints = [
            {
              id: 'default-text',
              title: 'Texte par défaut',
              cible: this.newColumn.defaultStringValue,
              type: 'text',
            },
            {
              id: 'newcolumn-min',
              title: 'Longueur minimum',
              cible: this.newColumn.min,
              type: 'number',
            },
            {
              id: 'newcolumn-max',
              title: 'Longueur maximum',
              cible: this.newColumn.max,
              type: 'number',
            },
          ];
          break;
        case 'date':
          this.nullableOption = false;
          this.columnConstraints = [
            {
              id: 'select-type-date',
              title: 'Type de date',
              cible: this.typeDate,
              type: 'select',
              options: [
                { name: 'Libre', id: '1' },
                { name: 'Compris entre deux dates', id: '2' },
                { name: 'Date du jour', id: '3' },
              ],
              input: this.getDateSettings,
            },
          ];
          break;
        case 'boolean':
          this.columnConstraints = [];
          break;
        default:
          this.columnConstraints = [];
          break;
      }
    },
  },
};
</script>
