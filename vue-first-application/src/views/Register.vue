<template>
  <div class="fondbleu">
    <form class="formregister">
      <h4 class="formtitle">Register</h4>

      <label for="name">Name</label> <br>
      <input id="name" type="text" v-model="name" required autofocus>
      <br>
      <label for="email" >E-Mail Address</label> <br>
      <input id="email" type="email" v-model="email" required>
      <br>
      <label for="password">Password</label> <br>
      <input id="password" type="password" v-model="password" required>
      <br>
      <label for="password-confirm">Confirm Password</label> <br>
      <input id="password-confirm" type="password" v-model="password_confirmation" required>
      <br>
        <button class="registerbtn" type="submit" @click="handleSubmit">
          Register
        </button>
         <p>vous avez déja un compte ? <br>  <router-link to="/login"> connectez vous </router-link> </p>
        <p class="error" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
  export default {
    props : ["nextUrl"],
    data(){
      return {
        name : "",
        email : "",
        password : "",
        password_confirmation : "",
        error : "",
      }
    },
    methods : {
      handleSubmit(e) {
        e.preventDefault()

        if (this.password === this.password_confirmation && this.password.length > 0)
        {
          fetch(this.$adresse+'/users/register', {
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
              if(response.error != null){
                console.log(response);
                this.error=response.error;
              }else {

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
              console.error(error)
            });
        } else {
          this.password = ""
          this.passwordConfirm = ""

          return alert("Passwords do not match")
        }
      }
    }
  }
</script>

<style scoped>

</style>
