<template>
  <div class="table-container" v-if="!loading" style="overflow-y: scroll;">
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

    <div class="btnformtable">
        <router-link :to="{ name: 'table', params: { id: base._id, idTable: table._id }}">
      <button> <i class="fa fa-arrow-left" aria-hidden="true"></i> Retour à la base </button>
        </router-link>
    </div>
    <!-- BLOC INSERT DATA -->
    <div class="table-settings-content">
      <p>Les données seront ajoutées dans la table <strong>{{ table.name }}</strong></p>
      <div v-if="errorsAddData.length > 0" class="error-bloc">
        <p v-for="e in errorsAddData" v-bind:key="e.column"><strong>{{ e.column }}</strong> : {{ e.message }}</p>
      </div>

      <form class="formformulaire">
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
            <md-button type="reset" class="md-raised md-primary" @click="addData">
              <a class="envoyer-form" @click="$bvModal.show('bv-modal-comfirm-add-line')">
                Envoyer
              </a>
              </md-button>
            <md-button type="reset"> Reset</md-button>
          </form>
      </div>
      <b-modal id="bv-modal-comfirm-add-line" hide-footer>
        <template v-slot:modal-title>
          Comfirmation
        </template>
        <p>Les données ont bien été ajoutées dans la table <strong>{{ table.name }}</strong></p>
        <md-button class="md-raised md-primary" @click="$bvModal.hide('bv-modal-comfirm-add-line')">Continuer</md-button>
      </b-modal>
      <!-- END BLOC INSERT DATA -->
    </div>
</template>

<script>
import format from 'date-fns/format';

export default {
  name: 'RegularCheckboxes',
  name: 'table',
  name: 'base',
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
    const url = this.$adresse+`/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
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
      const url = this.$adresse+`/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
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
      var adr = this.$adresse;
      this.table.columns.forEach(function(e) {
        if(e.type.realName === 'relation') {
          const url = adr+`/bases/${baseId}/${e.tableReference}/data-selectors`;
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
        const url = this.$adresse+`/bases/${this.base._id}/${this.table._id}/column/${column._id}`;
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
        var adr = this.$adresse;

        this.dataSelected.forEach(function(i) {
          const url = adr+`/bases/${base._id}/${table._id}/data/line/${i._id}`;
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
      const url = this.$adresse+`/bases/${this.base._id}`;
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
      //console.log('START LABEL MODIFICATIONS');
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
      var adr = this.$adresse;
      dataRelation.forEach(function(obj) {
        if(linesLabel[obj] === null || linesLabel[obj] === undefined) {
          const url = adr+`/bases/line/${obj}/label`;
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
                    const url = this.$adresse+`/bases/line/${objId}/label`;
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
      //console.log(x);
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

      const url = this.$adresse+`/bases/${this.base._id}/${this.table._id}/data/line`;
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
            //console.log('ERRORS :' + rep);
          } else {
            //console.log(rep);
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
      const url = this.$adresse+`/bases/${this.base._id}/${this.table._id}/data/line/${this.dataSelected[0]._id}`;
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
           // console.log('ERRORS :' + rep);
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
        const url = this.$adresse+`/bases/${this.base._id}/${this.table._id}/column`;
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
