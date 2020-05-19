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
          <a class="dropdown-item" @click="showToolBar('add-column')">Ajouter une colonne</a>
          <a class="dropdown-item" @click="showToolBar('add-data')">Ajouter une ligne</a>
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
    </div>
    <div class="table-data-container">
      <div class="table-datas">
        <md-table v-if="!loadingLabels && !loadingArray">
          <md-table-toolbar v-if="dataSelected.length > 0" style="background-color: #ffdcdc;">
            <div class="md-toolbar-section-start">{{ getLabel(dataSelected.length) }}</div>
              <md-button class="md-icon-button" @click="deleteSelected">
                <md-icon>delete</md-icon>
              </md-button>
          </md-table-toolbar>

          <tr class="md-table-row">
            <th class="md-table-head md-numeric">
              <div class="md-table-head-container">
                <div class="md-table-head-label">ID</div>
              </div>
            </th>
            <th class="md-table-head" v-for="c in table.columns" v-bind:key="c.id" @click="changeIsLabel(c)">
              <div class="md-table-head-container">
                <div class="md-table-head-label">
                  <md-icon v-if="c.type.realName !== 'relation' && (c.isLabel === null ||c.isLabel === undefined || !c.isLabel)">
                    star_outline
                    <md-tooltip md-direction="bottom">Définir comme label de la table</md-tooltip>
                  </md-icon>
                  <md-icon v-if="c.type.realName !== 'relation' && c.isLabel">
                    star
                    <md-tooltip md-direction="bottom">Ne plus définir comme label de la table</md-tooltip>
                  </md-icon>
                  {{ c.name }}
                </div>
              </div>
            </th>
          </tr>

          <md-table-row v-for="(l, index) in table.lines" v-bind:key="l.id" @click="onSelect(l)" :style="getClass(l)">
            <md-table-cell md-numeric>{{ index }}</md-table-cell>
            <md-table-cell v-for="c in table.columns" v-bind:key="c.id">
              <p v-for="d in l.data" v-bind:key="d.id">
                <span v-if="d.column == c._id && c.type.realName != 'relation'">{{ getDataLabel(d, c) }}</span>
                <span v-if="d.column == c._id && c.type.realName == 'relation'"><span v-for="objId in d.valueObjectId" v-bind:key="objId">- {{ linesLabel[objId].label }}</span></span>
              </p>
            </md-table-cell>
          </md-table-row>

          <md-table-row @click="showToolBar('add-data')" style="cursor: pointer;">
            <md-table-cell md-numeric>+</md-table-cell>
            <md-table-cell v-for="c in table.columns" v-bind:key="c.id"></md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <!-- BLOC CREATE COLUMN -->
      <transition name="slide-fade">
        <div class="table-bloc-settings" v-if="showAddColumn">
          <div class="table-settings-header">
            <a class="table-settings-close-btn" @click="showToolBar">x</a>
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
                <md-field v-if="c.type !== 'checkbox' && c.type !== 'date'">
                  <label>{{ c.title }}</label>
                  <md-input v-if="c.type === 'text'" v-model="c.cible" :id="c.id" :ref="c.id" md-counter="30"></md-input>
                  <md-input v-if="c.type === 'number'" v-model="c.cible" type="number" :id="c.id" :ref="c.id"></md-input>
                  <md-select v-if="c.type === 'select'" v-model="c.cible" name="typeDate" :id="c.id" :ref="c.id" @input="c.input" md-dense>
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
              <div v-if="tableChoice != null && tableChoice !== undefined">
                <div class="choice-relation-bloc">
                  <md-radio v-model="newColumn.relationType" value="one-to-one" class="md-primary">Relation "Un pour un"</md-radio>
                  <span class="md-helper-text">1 ligne de "{{ table.name }}" pourra être liée au plus à une seule ligne de "{{ tableChoice.name }}"</span>
                </div>
                <div class="choice-relation-bloc">
                  <md-radio v-model="newColumn.relationType" value="one-to-many" class="md-primary">Relation "Un pour plusieurs"</md-radio>
                  <span class="md-helper-text">1 ligne de "{{ table.name }}" pourra être liée à plusieurs lignes de "{{ tableChoice.name }}"</span>
                </div>
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
            <a class="table-settings-close-btn" @click="showToolBar">x</a>
            <h3 class="table-settings-title">Ajouter une ligne</h3>
          </div>
          <div class="table-settings-content">
            <p>Les données seront ajoutées dans la table <strong>{{ table.name }}</strong></p>

            <div v-if="errorsAddData.length > 0" class="error-bloc">
              <p v-for="e in errorsAddData" v-bind:key="e.column"><strong>{{ e.column }}</strong> : {{ e.message }}</p>
            </div>

            <div v-for="(c, index) in table.columns" :key="c.id">
              <md-field v-if="c.type.realName != 'date'">
                <label>{{ c.name }}</label>
                <md-input v-if="c.type.realName == 'shorttext' || c.type.realName == 'longtext'" v-model="newDatas.datas[index].valueString" md-counter="30"></md-input>
                <md-input v-if="c.type.realName == 'number'" v-model="newDatas.datas[index].valueNumber" type="number"></md-input>
                <md-select v-if="c.type.realName == 'boolean'" v-model="newDatas.datas[index].valueBoolean" md-dense>
                  <md-option value="1">Oui</md-option>
                  <md-option value="0">Non</md-option>
                </md-select>
                <md-select v-if="c.type.realName === 'relation' && c.relationType === 'one-to-many'" v-model="newDatas.datas[index].valueObjectId" md-dense multiple>
                  <md-option v-for="ds in dataSelectors[c._id]" :value="ds.id" v-bind:key="ds.id">{{ ds.label }}</md-option>
                </md-select>
                <md-select v-if="c.type.realName === 'relation' && c.relationType === 'one-to-one'" v-model="newDatas.datas[index].valueObjectId" md-dense>
                  <md-option v-for="ds in dataSelectors[c._id]" :value="ds.id" v-bind:key="ds.id">{{ ds.label }}</md-option>
                </md-select>
                <span v-if="c.helper != null" class="md-helper-text">{{ c.helper }}</span>
              </md-field>
              <md-datepicker v-if="c.type.realName == 'date'" v-model="newDatas.datas[index].valueDate">
                <label>{{ c.name }}</label>
              </md-datepicker>
            </div>
            <md-button class="md-primary" @click="addData">Créer</md-button>
            <md-button @click="showAddColumn = !showAddColumn">Annuler</md-button>
          </div>
        </div>
      </transition>
      <!-- END BLOC INSERT DATA -->
      <!-- BLOC EDIT DATA -->
      <transition name="slide-fade">
        <div class="table-bloc-settings" v-if="showEditData">
          <div class="table-settings-header">
            <a class="table-settings-close-btn" @click="showToolBar">x</a>
            <h3 class="table-settings-title">Modifier une ligne</h3>
          </div>
          <div class="table-settings-content">
            <div v-if="errorsAddData.length > 0" class="error-bloc">
              <p v-for="e in errorsAddData" v-bind:key="e.column"><strong>{{ e.column }}</strong> : {{ e.message }}</p>
            </div>

            <div v-for="(d, index) in lineUpdate.datas" :key="d.id">
              <md-field v-if="d.column.type.realName != 'date'">
                <label>{{ d.column.name }}</label>
                <md-input v-if="d.column.type.realName == 'shorttext' || d.column.type.realName == 'longtext'" v-model="lineUpdate.datas[index].valueString" md-counter="30"></md-input>
                <md-input v-if="d.column.type.realName == 'number'" v-model="lineUpdate.datas[index].valueNumber" type="number"></md-input>
                <md-select v-if="d.column.type.realName == 'boolean'" v-model="lineUpdate.datas[index].valueBoolean" md-dense>
                  <md-option value="1">Oui</md-option>
                  <md-option value="0">Non</md-option>
                </md-select>
                <span v-if="d.helper != null" class="md-helper-text">{{ d.helper }}</span>
              </md-field>
              <md-datepicker v-if="d.column.type.realName == 'date'" v-model="lineUpdate.datas[index].valueDate">
                <label>{{ d.column.name }}</label>
              </md-datepicker>
            </div>

            <md-button class="md-primary" @click="updateLine">Modifier</md-button>
            <md-button @click="showEditData = !showEditData">Annuler</md-button>
          </div>
        </div>
      </transition>
      <!-- END BLOC EDIT DATA -->
    </div>
  </div>
</template>


<script>
import format from 'date-fns/format';

export default {
  name: 'RegularCheckboxes',
  name: 'table',
  data: function data() {
    const dateFormat = 'yyyy-MM-dd';
    const now = new Date();
    return {
      weekday: 1,
      array: [],
      obj2: {name: 'obj1'},
      obj: null,
      form: {
          email: '',
          name: '',
          food: null,
          checked: []
        },
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
        lines: [],
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
        relationType: String,
        tableReference: String,
        isLabel: false,
      },
      dataSelected: [],
      newDatas: {
        datas : [{
          value: String,
          valueString: String,
          valueNumber: Number,
          valueBoolean: Boolean,
          valueDate: Date,
          valueObjectId: Array,
          line: Number,
          Column: String,
        }]
      },
      lineUpdate: {
        datas : [{
          value: String,
          valueString: String,
          valueNumber: Number,
          valueBoolean: Boolean,
          valueDate: Date,
          line: Number,
          Column: String,
          _id: String,
        }]
      },
      typeDate: Number,
      dateInterval: false,
      nullableOption: true,
      columnConstraints: [],
      c: String,
      constraint: {
        label: String,
      },
      errorsAddData: [],
      types: [],
      newType: {
        name: String,
        realName: String,
        description: String,
      },
      loading: true,
      loadingArray: true,
      loadingLabels: true,
      showAddColumn: false,
      showInsertData: false,
      showEditData: false,
      tableChoice: null,
      dataSelectors: [],
      linesLabel: [],
    };
  },
  created() {
    const url = `http://localhost:3000/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
    fetch(url)
      .then(res => res.json())
      .then((rep) => {
        this.loading = false;
        this.base = rep.base;
        this.table = rep.table;
        this.initArrayData();
        this.initLabelsReferences();
        this.getDataSelectors();
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

    getLabel: function getLabel(count) {
      if(count > 1) return `${count} lignes selectionnées`;
      else return `${count} ligne selectionnée`;
    },

    reloadTable: function reloadTable() {
      const url = `http://localhost:3000/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
      fetch(url)
        .then(res => res.json())
        .then((rep) => {
          this.base = rep.base;
          this.table = rep.table;
          this.initArrayData();
        });
    },

    getDataSelectors: function getDataSelectors() {
      var baseId = this.base._id;
      var dataSelectors = [];
      this.table.columns.forEach(function(e) {
        if(e.type.realName === 'relation') {
          const url = `http://localhost:3000/bases/${baseId}/${e.tableReference}/data-selectors`;
          fetch(url)
            .then(res => res.json())
            .then((rep) => {
              dataSelectors[e._id] = rep;
            });
        }
      });
      this.dataSelectors = dataSelectors;
    },

    getDataLabel: function getDataLabel(data, column)
    {
      if((column !== undefined && column !== null) &&
          (column.type !== undefined && column.type !== null) &&
            (column.type.realName !== undefined && column.type.realName !== null)) {

        let label = '';
        switch(column.type.realName) {
          case 'date':
            let date = new Date(data.valueDate);
            return date.getDate() +'/'+ date.getMonth() +'/'+ date.getFullYear();
            break;
          default:
            return data.value;
            break;
        }
      } else return '';
    },

    changeIsLabel: function changeIsLabel(column) {
      if(column.type.realName !== 'relation') {
        column.isLabel = (null === column.isLabel || undefined === column.isLabel) ? false : !column.isLabel;
        const url = `http://localhost:3000/bases/${this.base._id}/${this.table._id}/column/${column._id}`;
        fetch(url, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(column),
        })
          .then(res => res.json())
          .then((rep) => {
          });
      }
    },

    onSelect: function onSelect(item) {
      if(this.dataSelected.includes(item)) {
        let index = this.dataSelected.indexOf(item);
        if (index > -1) {
          this.dataSelected.splice(index, 1);
        }
        item.selected = false;
      } else {
        this.dataSelected.push(item)
        item.selected = true;
      }

      if(this.dataSelected.length === 1) this.showToolBar('edit-data');
      else this.showToolBar();

      /*

      if(this.dataSelected.includes(item)) {
        let index = this.dataSelected.indexOf(item);
        if (index > -1) {
          this.dataSelected.splice(index, 1);
        }
        item.selected = false;
        if(this.dataSelected.length === 1) this.showToolBar('edit-data');
        else this.showToolBar();
      } else {
        item.selected = true;
        this.dataSelected.push(item)
        if(this.dataSelected.length === 1) this.showToolBar('edit-data');
        else this.showToolBar();
      }
       */
    },

    deleteSelected: function deleteSelected() {
      if(this.dataSelected.length > 0) {
        var base = this.base;
        var table = this.table;

        this.dataSelected.forEach(function(i) {
          const url = `http://localhost:3000/bases/${base._id}/${table._id}/data/line/${i._id}`;
          fetch(url, { method: 'DELETE' });
          let index = table.lines.indexOf(i);
          if (index > -1) {
            table.lines.splice(index, 1);
          }
        })
        this.table = table;
        this.dataSelected = [];
        this.showToolBar();
      }
    },

    getClass: function getStyle(l) {
      if(l.selected) return 'cursor: pointer; background-color: #448aff; color: #fff;';
      else return 'cursor: pointer;';
    },

    deleteTable: function deleteTable() {
      const url = `http://localhost:3000/bases/${this.base._id}`;
      fetch(url, { method: 'DELETE' });
      this.$router.push({ name: 'home' });
    },

    initArrayData: function initArrayData() {
      for(let i = 0; i<this.table.columns.length; i++)
      {
        this.newDatas.datas[i] = {
          value: null,
          valueString: null,
          valueNumber: null,
          valueBoolean: null,
          valueObjectId: null,
          valueDate: null,
          line: null,
          column: this.table.columns[i],
        };
      }
      this.loadingArray = false;
    },

    initLabelsReferences: function initLabelsReferences() {
      console.log('START LABEL MODIFICATIONS');
      var table = this.table;
      var linesLabel = this.linesLabel;
      var columnsRelation = [];

      table.columns.forEach(function(c) {
        if(c.type.realName === 'relation') columnsRelation.push(c._id);
      });

      var dataRelation = [];
      table.lines.forEach(function (line) {
        line.data.forEach(function (data) {
          if (columnsRelation.includes(data.column)) {
            data.valueObjectId.forEach((objectId) => dataRelation.push(objectId));
          }
        })
      });

      var index = 0;
      if(dataRelation.length <= 0) this.loadingLabels = false;
      dataRelation.forEach(function(obj) {
        if(linesLabel[obj] === null || linesLabel[obj] === undefined) {
          const url = `http://localhost:3000/bases/line/${obj}/label`;
          fetch(url)
            .then(res => res.json())
            .then((rep) => {
              linesLabel[obj] = rep
              index++;
              if(index >= dataRelation.length) {
                this.linesLabel = linesLabel;
                this.loadingLabels = false;
              }
            });
        } else {
          index++;
          if(index >= dataRelation.length) {
            this.linesLabel = linesLabel;
            this.loadingLabels = false;
          }
        }
      }, this);

      /*
      var index = 0;

      table.lines.forEach(function(l) {
        index++;
        console.log('check line ');
        table.columns.forEach(function(c) {
          console.log('check colunm ' + c.name);
          l.data.forEach(function(d) {
            console.log('check data ' + d.value);
            if(d.column === c._id && c.type.realName === 'relation') {
              console.log('Column relation ' + c.name);
              if(d.valueObjectId !== undefined && d.valueObjectId !== null && Array.isArray(d.valueObjectId)) {
                console.log('Data contain object id');
                var i = 0;
                d.valueObjectId.forEach(function(objId) {
                  i++;
                  console.log('check data ' + objId);
                  if(linesLabel[objId] === null || linesLabel[objId] === undefined) {
                    const url = `http://localhost:3000/bases/line/${objId}/label`;
                    fetch(url)
                      .then(res => res.json())
                      .then((rep) => {
                        linesLabel[objId] = rep
                        if(index >= table.lines.length && i >= d.valueObjectId.length) {
                          this.linesLabel = linesLabel;
                          console.log(this.linesLabel);
                        }
                        console.log('ID: ' + objId + ', LABEL: ' + rep.label);
                        console.log(this.linesLabel[objId]);
                      }, this);
                  }
                }, this)
              }
            }
          }, this);
        }, this);
        if(index >= table.lines.length) {
          this.linesLabel = linesLabel;
          console.log(this.linesLabel);
        }
      }, this);

       */

    },

    initArrayUpdateLine: function initArrayUpdateLine(line) {
      for (let i = 0; i < this.table.columns.length; i++) {
        let x = 0
        while (x < line.data.length && line.data[x].column !== this.table.columns[i]._id) x++;
        if (x >= line.data.length) {
          this.lineUpdate.datas[i] = {
            value: null,
            valueString: null,
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
            line: line.number,
            column: this.table.columns[i],
          };
        } else {
          let dateFormat = 'yyyy-MM-dd';

          let vDate;
          if(this.table.columns[i].type.realName === 'date') vDate = format(new Date(line.data[x].valueDate), dateFormat);
          else vDate = null;

          this.lineUpdate.datas[i] = {
            value: line.data[x].value,
            valueString: line.data[x].valueString,
            valueNumber: line.data[x].valueNumber,
            valueBoolean: line.data[x].valueBoolean,
            valueDate: vDate,
            _id: line.data[x]._id,
            line: line.number,
            column: this.table.columns[i],
          }
        }
      }
    },

    debug: function debug(x) {
      console.log(x);
    },

    addData: function addData() {
      this.errorsAddData = [];

      this.newDatas.datas.forEach(function(e) {
        e.value =
          (e.valueDate != null) ? e.valueDate :
            (e.valueString != null) ? e.valueString :
              (e.valueNumber != null) ? e.valueNumber :
                (e.valueBoolean != null) ? e.valueBoolean :
                  (e.valueObjectId != null) ? e.valueObjectId.toString() : null;

        if(e.line == null) e.line = -1;
        if(e.valueBoolean === '0') e.valueBoolean = false;
        if(e.valueBoolean === '1') e.valueBoolean = true;
        if(e.column.type.realName === 'relation') {
          if((e.valueObjectId !== null && e.valueObjectId !== undefined) && !Array.isArray(e.valueObjectId)) {
            e.valueObjectId = [e.valueObjectId];
          } else if(!Array.isArray(e.valueObjectId)) e.valueObjectId = [];
        }
      });

      const url = `http://localhost:3000/bases/${this.base._id}/${this.table._id}/data/line`;
      fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(this.newDatas),
        })
        .then(res => res.json())
        .then((rep) => {
          if(Array.isArray(rep)) {
            this.errorsAddData = rep;
            console.log('ERRORS :' + rep);
          } else {
            console.log(rep);
            this.table = rep;
            this.loadingLabels = true;
            this.initLabelsReferences();
          }
        });
    },

    updateLine: function updateLine() {
      this.errorsAddData = [];
      this.lineUpdate.datas.forEach(function(e) {
        e.value =
          (e.valueDate != null) ? e.valueDate :
            (e.valueString != null) ? e.valueString :
              (e.valueNumber != null) ? e.valueNumber :
                (e.valueBoolean != null) ? e.valueBoolean : null;
        if(e.valueBoolean === '0') e.valueBoolean = false;
        if(e.valueBoolean === '1') e.valueBoolean = true;
      });
      var index = this.table.lines.indexOf(this.dataSelected[0]);
      const url = `http://localhost:3000/bases/${this.base._id}/${this.table._id}/data/line/${this.dataSelected[0]._id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(this.lineUpdate),
      })
        .then(res => res.json())
        .then((rep) => {
          if(Array.isArray(rep)) {
            this.errorsAddData = rep;
            console.log('ERRORS :' + rep);
          } else {
            this.reloadTable();
            this.dataSelected = [];
            this.showToolBar();
            this.table.lines.splice(index, 1, rep);
          }
        });
    },

    showToolBar: function showToolBar(name) {
      switch(name) {
        case 'add-column':
          this.showInsertData = false;
          this.showAddColumn = true;
          this.showEditData = false;
          break;
        case 'add-data':
          this.showAddColumn = false;
          this.showInsertData = true;
          this.showEditData = false;
          break;
        case 'edit-data':
          if(this.dataSelected.length === 1) {
            this.showAddColumn = false;
            this.showInsertData = false;
            this.showEditData = true;
            this.initArrayUpdateLine(this.dataSelected[0]);
          } else {
            this.showAddColumn = false;
            this.showInsertData = false;
            this.showEditData = false;
          }
          break;
        default:
          this.showAddColumn = false;
          this.showInsertData = false;
          this.showEditData = false;
          break;
      }
    },

    addColumn: function addColumn() {

      if(this.$refs['newcolumn-min'] !== undefined && this.$refs['newcolumn-min'][0] !== undefined) this.newColumn.min = this.$refs['newcolumn-min'][0].value;
      if(this.$refs['newcolumn-max'] !== undefined && this.$refs['newcolumn-max'][0] !== undefined) this.newColumn.max = this.$refs['newcolumn-max'][0].value;
      if(this.$refs['step-value'] !== undefined && this.$refs['step-value'][0] !== undefined) this.newColumn.numberStepValue = this.$refs['step-value'][0].value;
      if(this.$refs['default-text'] !== undefined && this.$refs['default-text'][0] !== undefined) this.newColumn.defaultStringValue = this.$refs['default-text'][0].value;

      if (this.newColumn.name.length > 0 && this.newColumn.type.length > 0) {
        const url = `http://localhost:3000/bases/${this.base._id}/${this.table._id}/column`;
        fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(this.newColumn),
        })
          .then(rep => rep.json())
          .then((res) => {
            const tmp = this.table;
            tmp.columns.push(res);
            this.table = tmp;
            this.initArrayData();
            this.getDataSelectors();
            this.tableChoice = null;
            this.newColumn = {
              name: '',
              type: String,
              nullable: true,
              min: Number,
              max: Number,
              defaultStringValue: String,
              numberStepValue: Number,
              dateIsToday: false,
              dateIsFree: false,
              relationType: null,
              tableReference: String,
            };
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
    getRelationSettings: function getRelationSettings(tableId) {
      var table = null;
      this.base.tables.forEach(function(e) {
        if(e._id === tableId) {
          table = e;
        }
      });
      this.newColumn.tableReference = (table !== null && table !== undefined) ? table._id : null;
      this.tableChoice = table;
    },
    getColumnSettings: function getColumnSettings(typeRealname) {
      this.dateInterval = false;
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
          this.newColumn.defaultStringValue = '';
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
          this.newColumn.defaultStringValue = '';
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
        case 'relation':
          this.nullableOption = true;
          this.tableChoice = null;
          var options = [];
          var tableId = this.table._id;
          this.base.tables.forEach(function(e) {
            if(tableId !== e._id) {
              let obj = { name: e.name, id: e._id };
              options.push(obj);
            }
          });
          this.columnConstraints = [
            {
              id: 'select-relation-table',
              title: 'Table ciblée',
              cible: this.typeDate,
              type: 'select',
              options: options,
              input: this.getRelationSettings,
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
