<template>
  <div class="login-bloc">
    <form class="formregister">
      <h4 class="formtitle">Inscription</h4>

      <p class="error" v-if="error">{{ error }}</p>

      <md-field>
        <label>Nom</label>
        <md-input v-model="name" md-counter="30" required></md-input>
      </md-field>

      <md-field>
        <label>Adresse email</label>
        <md-input v-model="email" type="email" md-counter="40" required></md-input>
      </md-field>

      <md-field>
        <label>Mot de passe</label>
        <md-input v-model="password" type="password" required></md-input>
      </md-field>

      <md-field>
        <label>Confirmation</label>
        <md-input v-model="password_confirmation" type="password" required></md-input>
      </md-field>

      <md-button class="md-dense md-raised md-primary" @click="handleSubmit">inscription</md-button>

      <p>Déjà un compte ? <br>  <router-link to="/login"> Se connecter </router-link> </p>

    </form>
  </div>
</template>

<script>
  export default {
    props: ["nextUrl"],
    data() {
      return {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        error: "",
      }
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()

        if (this.password === this.password_confirmation && this.password.length > 0) {
          fetch(this.$adresse + '/users/register', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              username: this.name,
              email: this.email,
              password: this.password
            }),
          })
            .then(res => res.json())
            .then((response) => {
              if (response.error != null) {
                // console.log(response);
                this.error = response.error;
              } else {

                if (response.userId != null) {
                  this.$emit('loggedIn')
                  if (this.$route.params.nextUrl != null) {
                    this.$router.push(this.$route.params.nextUrl)
                  } else {
                    this.$router.push('/login')
                  }
                }
              }
            })
            .catch(error => {
              // console.error(error)
            });
        } else {
          this.password = "";
          this.password_confirmation = "";

          this.error = "Le mot de passe ne correspond pas";
        }
      }
    }
  }
</script>

<style scoped>

</style>
