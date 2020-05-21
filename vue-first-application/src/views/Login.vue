<template>
  <div class="login-bloc">
    <form class="formregister">
      <h4 class="formtitle">Connexion</h4>

      <p class="error" v-if="error">{{ error }}</p>

      <md-field>
        <label>Adresse email</label>
        <md-input v-model="email" required></md-input>
      </md-field>

      <md-field>
        <label>Mot de passe</label>
        <md-input v-model="password" type="password" required></md-input>
      </md-field>

      <md-button class="md-dense md-raised md-primary" @click="handleSubmit">connexion</md-button>

      <p>Pas encore de compte ? <router-link to="/register"> S'inscrire maintenant </router-link> </p>
    </form>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        email : "",
        password : "",
        error: "",
      }
    },
    methods : {
      handleSubmit(e){
        e.preventDefault()
        if (this.password.length > 0) {
          fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            }),
          })
            .then(res => res.json())
            .then((response) => {
              if(response.error != null){
                console.log(response);
                this.error=response.error;
              }else {
                localStorage.setItem('user', response.userId);
                localStorage.setItem('jwt', response.token);
                localStorage.setItem('username', response.username);
                if (localStorage.getItem('jwt') != null) {
                  this.$emit('loggedIn')
                  if (this.$route.params.nextUrl != null) {
                    this.$router.push(this.$route.params.nextUrl)
                  } else {
                      this.$router.push('/')
                  }
                }
              }
            })
            .catch(error => {
              console.error(error)
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>
