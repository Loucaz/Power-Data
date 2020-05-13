<template>
  <div>
    <h4>Register</h4>
    <form>
      <label for="name">Name</label>
      <div>
        <input id="name" type="text" v-model="name" required autofocus>
      </div>

      <label for="email" >E-Mail Address</label>
      <div>
        <input id="email" type="email" v-model="email" required>
      </div>

      <label for="password">Password</label>
      <div>
        <input id="password" type="password" v-model="password" required>
      </div>

      <label for="password-confirm">Confirm Password</label>
      <div>
        <input id="password-confirm" type="password" v-model="password_confirmation" required>
      </div>

      <div>
        <button type="submit" @click="handleSubmit">
          Register
        </button>

        <p class="error" v-if="error">{{ error }}</p>
      </div>
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
          fetch('http://localhost:3000/users/register', {
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
