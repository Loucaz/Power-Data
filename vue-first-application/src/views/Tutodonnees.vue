<template>
  <div class="container">
    <div class="homepage-header">
      <h1>Power-Data</h1>
      <div class="links-header">
        <router-link to="/register" class="btn-register">S'inscrire</router-link>
        <router-link to="/login" class="btn-infos">Se connecter</router-link>
      </div>
    </div>

    <div class="tutoriel-header">
      <div class="tutoriel-top-header">
        <div class="tutoriel-description">
          <h4>tutoriel</h4>
          <h3>Comment collecter des données</h3>
        </div>
        <div class="tutoriel-picture">
          <img src="../assets/img/learn.svg" alt="tutoriel"/>
        </div>
      </div>
      <div class="tutoriel-footer-header">
        <span>Difficulté: facile</span>
        <span>Temps: 5 minutes</span>
      </div>
    </div>

    <div class="tutoriel-content">
      <div class="tutoriel-element">
        <h3>Créer un formulaire</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nulla optio tempore dolorem sint commodi eos consequatur aspernatur, nam amet, ipsum assumenda eum, maiores velit! Sit nam voluptatibus quis quibusdam maxime dolore deleniti! Earum necessitatibus maxime sunt architecto repellendus dignissimos veniam quis a nisi, sequi nulla dolorum quos. Rerum vero ullam, odio velit alias sint tenetur repellat ea eveniet suscipit accusantium voluptas ut eligendi quos est repudiandae facilis porro aspernatur saepe blanditiis reiciendis natus quisquam! Fuga pariatur dicta tenetur, numquam velit minima nihil quo, impedit, iste laboriosam a id amet vel ad architecto dolorum tempora. Praesentium natus nihil tenetur dolore.</p>
      </div>
      <div class="tutoriel-element">
        <h3>Partager un formulaire</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nulla optio tempore dolorem sint commodi eos consequatur aspernatur, nam amet, ipsum assumenda eum, maiores velit! Sit nam voluptatibus quis quibusdam maxime dolore deleniti! Earum necessitatibus maxime sunt architecto repellendus dignissimos veniam quis a nisi, sequi nulla dolorum quos. Rerum vero ullam, odio velit alias sint tenetur repellat ea eveniet suscipit accusantium voluptas ut eligendi quos est repudiandae facilis porro aspernatur saepe blanditiis reiciendis natus quisquam! Fuga pariatur dicta tenetur, numquam velit minima nihil quo, impedit, iste laboriosam a id amet vel ad architecto dolorum tempora. Praesentium natus nihil tenetur dolore.</p>
      </div>
    </div>

    <div class="tutoriel-footer">
      <p>Convaincu ?
        <router-link to="/register"> <md-icon style="color: #2AB7CA ;">keyboard_arrow_right</md-icon> S'inscrire maintenant</router-link>
      </p>
    </div>
  </div>
</template>
