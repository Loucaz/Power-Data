<template>
  <div>
    <h4>Login</h4>
    <form>
      <label for="email" >E-Mail Address</label>
      <div>
        <input id="email" type="email" v-model="email" required autofocus>

      </div>
      <div>
        <label for="password" >Password</label>
        <div>
          <input id="password" type="password" v-model="password" required>
        </div>
      </div>
      <div>
        <button type="submit" @click="handleSubmit">
          Login
        </button>
        <p class="error" v-if="error">{{ error }}</p>
      </div>
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
