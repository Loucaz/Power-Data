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

   <div class="btnformtable">

        <router-link :to="{ name: 'table', params: { id: base._id, idTable: table._id }}">
      <button> <i class="fa fa-arrow-left" aria-hidden="true"></i> Retour à la base </button>
        </router-link>

    </div>

          <div>
            <md-checkbox v-model="array" value="1">Array</md-checkbox>
            <md-checkbox v-model="obj" :value="obj2"  v-for="c in table.columns" v-bind:key="c.id"> {{ c.name }} </md-checkbox>
            <table>
              <tr>
                <th>Array</th>
                <th>Object</th>
              </tr>

              <tr>
                <td>{{ array }}</td>
                <td>{{ obj }}</td>
              </tr>
            </table>
          </div>



          <div>
            <form>
              <h2>selection des données</h2>
              <b-form-group
                v-for="c in table.columns" v-bind:key="c.id"
                v-model="selected">
                  <b-form-checkbox-group
                    id="checkbox-group"
                    v-model="selected"
                  >
                  <b-form-checkbox> {{ c.name }} </b-form-checkbox>
                  </b-form-checkbox-group>
              </b-form-group>
              <b-button type="reset" variant="danger">Reset</b-button>
            </form>

            <div>Selected: <strong>{{ selected }}</strong></div>

            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
              <h2>rempir les données</h2>
              <b-form-group
              v-for="c in table.columns" v-bind:key="c.id"
              id="input-group"
              label-for="input"
              >
                <p>{{ c.name }} :</p>
                <!-- label="Email address:" -->
                <!-- description="We'll never share your email with anyone else." -->
                <b-form-input
                  id="input"
                  class="col-3"
                  required=""
                >
                </b-form-input>
              </b-form-group>
              <b-button type="submit" class="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
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
      },
      dataSelected: [],
      newDatas: {
        datas : [{
          value: String,
          valueString: String,
          valueNumber: Number,
          valueBoolean: Boolean,
          valueDate: Date,
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
      showAddColumn: false,
      showInsertData: false,
      showEditData: false,
    };
  },
  created() {
    const url = this.$adresse+`/bases/${this.$route.params.id}/${this.$route.params.idTable}`;
    fetch(url)
      .then(res => res.json())
      .then((rep) => {
        this.base = rep.base;
        this.table = rep.table;
        this.initArrayData();
      });

    const urlTypes = this.$adresse+'/types';
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
          const url = this.$adresse+`/bases/${base._id}/${table._id}/data/line/${i._id}`;
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
          valueDate: null,
          line: null,
          column: this.table.columns[i],
        };
      }
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
      console.log(this.lineUpdate)
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
                (e.valueBoolean != null) ? e.valueBoolean : null;
        if(e.line == null) e.line = -1;
        if(e.valueBoolean === '0') e.valueBoolean = false;
        if(e.valueBoolean === '1') e.valueBoolean = true;
      });

      console.log("FUNCTION ADD DATA");

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
            console.log('ERRORS :' + rep);
          }
          else {
            this.table = rep;
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
      console.log("FUNCTION UPDATE LINE");
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
            console.log('ERRORS :' + rep);
          } else {
            this.reloadTable();
            this.dataSelected = [];
            this.showToolBar();
            this.table.lines.splice(index, 1, rep);
            console.log(this.table.lines);
          }
        });
    },

    addType: function addType() {
      if (this.newType.name.length > 0 && this.newType.realName.length > 0 && this.newType.description.length > 0) {
        const url = this.$adresse+'/types';
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
      if(this.$refs['newcolumn-max'] !== undefined) this.newColumn.max = this.$refs['newcolumn-max'][0].value;
      if(this.$refs['step-value'] !== undefined) this.newColumn.numberStepValue = this.$refs['step-value'][0].value;
      if(this.$refs['default-text'] !== undefined) this.newColumn.defaultStringValue = this.$refs['default-text'][0].value;

      if (this.newColumn.name.length > 0 && this.newColumn.type.length > 0) {
        const url = this.$adresse+`/bases/${this.base._id}/${this.table._id}/column`;
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
            this.initArrayData();
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
