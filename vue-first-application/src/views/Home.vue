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
      <p>Apprenez en plus sur le fonctionnement et les différentes fonctionnalitées de l'application grâce aux tutoriels disponibles</p>
    </div>
    <div class="tutoriels-list">

      <router-link to="/tutobases">
        <div class="table-icon table-blue">
          <i class="fa fa-database" aria-hidden="true"></i>
        </div>
        <p>Créer une base</p>
      </router-link>

      <router-link to="/tutotables">
        <div class="table-icon table-orange">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </div>
        <p>Créer des tables</p>
      </router-link>

      <router-link to="/tutoformulaires">
        <div class="table-icon table-green">
          <i class="fa fa-check-square-o" aria-hidden="true"></i>
        </div>
        <p>Créer des formulaires</p>
      </router-link>

      <router-link to="/tutodonnees">
        <div class="table-icon table-red">
          <i class="fa fa-flag-checkered" aria-hidden="true"></i>
        </div>
        <p>Collecter des données</p>
      </router-link>

    </div>
  </div>
</div>
</template>

<script>


</script>
