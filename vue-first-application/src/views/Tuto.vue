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
          <h3>Utiliser Power Data</h3>
        </div>
        <div class="tutoriel-picture">
          <img src="../assets/img/learn.svg" alt="tutoriel"/>
        </div>
      </div>
    </div>

    <div class="tutoriel-content">
      <div class="tutoriel-element">
        <h3>Créer une base</h3>
        <p>Une base est composé d'une ou plusieurs tables. Cela permet de créer un groupe de tables.
          Pour créer une cliquez sur "créer une base" dans le menu à gauche, entrez le nom de votre base puis cliquez sur créer
        </p>
      </div>
      <div class="tutoriel-element">
        <h3>Créer une table</h3>
        <p>
          Une table est composée des colonnes et de lignes. Chaque colonnes possede autant de lignes que spuhaité avec des parametres déffinissable
          Pour créer une base, aller sur le bouton "créer une base" entrez le nom de votre base puis cliquez sur créer.
          AJOUTER ICI pour créer une colonne et un ligne.
          Vous pouvez aussi créer des liens entre plusieurs tables d’une même base. Par exemple reprendre une liste de prénoms
        </p>
      </div>
      <div class="tutoriel-element">
        <h3>Collecter des données</h3>
        <p>Le formulaire est très pratique pour récolter les informations d’autres personnes.
          Vous pouvez générer un formulaire à partir de votre table et ensuite partager le lien avec les personnes de votre choix. Une fois qu’elles auront rempli le formulaire les données iront directement dans votre table.
        </p>
      </div>
    </div>

     <div class="tutoriel-footer">
      <p>Convaincu ?
        <router-link to="/register"> <md-icon style="color: #2AB7CA ;">keyboard_arrow_right</md-icon> S'inscrire maintenant</router-link>
      </p>
    </div>
  </div>
</template>

