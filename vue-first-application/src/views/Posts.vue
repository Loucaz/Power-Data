<template>
  <div>
    <h2>Posts</h2>

    <div>
      <md-button class="md-dense md-raised md-primary" @click="$bvModal.show('modal-1')">NOUVEAU</md-button>
      <b-modal id="modal-1" hide-footer title="Nouveau post">
        <md-field>
          <label>Titre</label>
          <md-input v-model="newPost.title" md-counter="30"></md-input>
        </md-field>
        <md-field>
          <label>Contenu</label>
          <md-textarea v-model="newPost.body" md-counter="80"></md-textarea>
        </md-field>
        <md-button class="md-primary" @click="addPost">Ajouter</md-button>
        <md-button @click="$bvModal.hide('modal-1')">Fermer</md-button>
      </b-modal>
    </div>

    <div>
      <b-modal id="modal-2" hide-footer title="Modifier Post">
        <md-field>
          <label>Titre</label>
          <md-input v-model="updatePostObject.title" md-counter="30"></md-input>
        </md-field>
        <md-field>
          <label>Contenu</label>
          <md-textarea v-model="updatePostObject.body" md-counter="80"></md-textarea>
        </md-field>
        <md-button class="md-primary" @click="updatePost">Modifier</md-button>
        <md-button @click="$bvModal.hide('modal-2')">Fermer</md-button>
      </b-modal>
    </div>

    <p v-if="loading">Chargement en cours</p>
    <p v-else-if="!posts">Il n'y a pas de posts.</p>
    <table class="table" v-else>
      <thead class="thead-dark">
        <tr>
          <th>Titre</th>
          <th>Body</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      <Post v-for="post in posts" :key="post.id" :data="post" @updateTable="updateTable" v-on:updateModal="updateModal"></Post>
      </tbody>
    </table>
  </div>
</template>

<script>
import Post from '@/components/Post.vue';

export default {
  name: 'Posts',
  data: function data() {
    return {
      posts: [],
      loading: true,
      newPost: {
        title: '',
        body: '',
      },
      updatePostObject: Object,
    };
  },
  created() {
    fetch(this.$adresse+'/posts')
      .then(res => res.json())
      .then((posts) => {
        this.posts = posts;
        this.loading = false;
      });
  },
  components: { Post },
  methods: {
    updateTable: function updateTable(id) {
      document.getElementById(id).remove();
    },
    addPost: function addPost() {
      //console.log(this.newPost);
      fetch(this.$adresse+'/posts', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: this.newPost.title,
          body: this.newPost.body,
        }),
      })
        .then(res => res.json())
        .then((post) => {
          this.posts.push(post);
          this.newPost.title = '';
          this.newPost.body = '';
        });
    },
    updateModal: function updateModal(dataPost) {
      this.updatePostObject = dataPost;
      this.$bvModal.show('modal-2');
    },
    updatePost: function updatePost() {
      const url = this.$adresse+`/posts/${this.updatePostObject._id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: this.updatePostObject.title,
          body: this.updatePostObject.body,
        }),
      })
        .then(res => res.json());
    },
  },
};
</script>

<style>
  table {
    border-collapse: collapse;
  }

  table, th, td {
    border: 1px solid black;
  }
</style>
