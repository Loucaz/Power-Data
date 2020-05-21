<template>
  <tr :id="data._id">
    <td>{{ data.title }}</td>
    <td>{{ data.body }}</td>
    <td><a href="#" @click="deletePost">delete</a> | <a href="#" @click="openUpdateModal">update</a></td>
  </tr>
</template>

<script>
export default {
  name: 'Post',
  props: {
    data: Object,
  },
  methods: {
    updatePost: function updatePost() {
      const url = this.$adresse+`/posts/${this.data._id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: this.data.title,
          body: this.data.body,
        }),
      })
        .then(res => res.json());
    },
    deletePost: function deletePost() {
      const url = this.$adresse+`/posts/${this.data._id}`;
      fetch(url, { method: 'DELETE' })
        .then(res => res.json())
        .then(this.$emit('updateTable', this.data._id));
    },
    openUpdateModal: function openUpdateModal() {
      this.$emit('updateModal', this.data);
    },
  },
};
</script>

<style scoped>
* {
  text-align: left;
}
</style>
