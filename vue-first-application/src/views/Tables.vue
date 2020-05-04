<template>
  <div>
    <h2>Tables</h2>
    <div class="list-tables">
      <a href="#" @click="$bvModal.show('modal-create-table')">
        <i class="material-icons">add</i>
        <h3>créer</h3>
      </a>
    </div>

    <div>
      <b-modal id="modal-create-table" hide-footer>
        <template v-slot:modal-title>
          Nouvelle table
        </template>

        <div class="d-block text-center">
          <md-field>
            <label>Nom de la table</label>
            <md-input v-model="newTable.name" md-counter="30"></md-input>
          </md-field>
          <div>
            <h3>Colonnes :</h3>
            <div class="column-group">
              <md-field>
                <label>Nom de la table</label>
                <md-input v-model="newTable.name" md-counter="30"></md-input>
              </md-field>
              <md-field>
                <label for="types">Type</label>
                <md-select v-model="types" name="types" id="types" md-dense>
                  <md-option value="Texte court">Australia</md-option>
                  <md-option value="Texte long">Brazil</md-option>
                  <md-option value="Lien">Japan</md-option>
                  <md-option value="Image">United States</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tables',
  data: function data() {
    return {
      newTable: {
        name: '',
        columns: [],
      },
    };
  },
};
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,700,900&display=swap');
  .list-tables {
    display: flex;
    width: 100%;
    padding: 0 10%;
  }

  .list-tables a {
    width: 150px;
    color: #fff;
    background-color: #56CBF9;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow:
      0 6.7px 5.3px rgba(0, 0, 0, 0.028),
      0 22.3px 17.9px rgba(0, 0, 0, 0.042),
      0 100px 80px rgba(0, 0, 0, 0.07);
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    transition: all 0.3s;
  }

  .list-tables a i {
    font-size: 2.4rem;
  }

  .list-tables a h3 {
    font-size: 1rem;
    margin-top: 1rem;
    text-transform: uppercase;
  }

  .list-tables a:hover {
    text-decoration: none;
    color: #fff;
    box-shadow:
      0 3.2px 6.7px rgba(0, 0, 0, 0.062),
      0 8.9px 18.5px rgba(0, 0, 0, 0.086),
      0 21.4px 44.6px rgba(0, 0, 0, 0.096),
      0 71px 148px rgba(0, 0, 0, 0.1);
  }
</style>
