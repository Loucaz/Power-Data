<template>
<div class="container">

  <div class="homepage-header">
    <h1>Power-Data</h1>
    <div class="links-header">
      <router-link to="/register" class="btn-register">S'inscrire</router-link>
      <router-link to="/login" class="btn-infos">Se connecter</router-link>
    </div>
  </div>

  <div class="main-illustration-bloc">
    <div class="description">
      <h2>Collectez des données</h2>
      <p>Power-data permet de créer votre propre base de données facilement pour collecter rapidement des informations grâce à des formulaires générés automatiquement !</p>
    </div>
    <div class="illustration">
      <img src="../assets/img/collect.svg" alt="collect"/>
    </div>
  </div>

  <div class="tutoriels-bloc">
    <div class="description">
      <h2>Envie d'en savoir plus ?</h2>
      <p>Apprenez en plus sur le fonctionnement et les différentes fonctionnalitées de l'application grâce au tutoriel</p>
    </div>
    <div class="tutoriels-list">

      <router-link to="/tuto">
        <div class="table-icon table-blue">
          <i class="fa fa-database" aria-hidden="true"></i>
        </div>
        <p>comment utiliser Power data</p>
      </router-link>

    </div>
  </div>
</div>
</template>

<script>


</script>
