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
        <p>Une base est composée d'une ou plusieurs tables. Cela permet de créer un groupe de tables.
         <br />
          Pour créer une base, cliquez sur "créer" dans le menu à gauche, entrez le nom de votre base puis cliquez sur "Créer"
        </p>
      </div>
      <div class="tutoriel-element">
        <h3>Créer une table</h3>
        <p>
          Une table est composée des colonnes et de lignes. Chaque colonne possède autant de lignes que souhaité avec des paramètres définissables. 
          <br />
          Pour créer une table, Rendez vous sur votre base puis cliquez sur "Ajouter", entrez le nom de votre base puis cliquez sur créer.
          <br />
          Une fois sur la table vous pouvez ajouter une colonne ou une ligne en cliquant sur le bouton "Table".(1)
          Un panneau s'affiche à droite pour entrer le nom de la colonne ou de la ligne puis cliquez sur "Créer".(2)
          <br />
          Vous pouvez aussi créer des liens entre plusieurs tables d’une même base. Par exemple reprendre une liste de prénoms dans une autre table.
          Pour ce faire cliquez sur l'étoile de la colonne où se trouve votre liste.(3) 
          Dans l'autre table, créez en une de type "Relation avec une table" (4) ensuite sélectionnez la table correspondante.
          Vous aurez votre liste de prénom qui s'affichera lorsque vous ajouterez une ligne. 
        </p>
        <div class="row">
          <div class="col tutophoto1">(1)</div>
          <div class="col tutophoto2">(2)</div>
          
        </div>
        <div class="row">
          <div class="col-3 tutophoto3">(3)</div>
          <div class="col tutophoto4">(4)</div>
          <div class="col tutophoto5">(5)</div>
        </div>
      </div>
      <div class="tutoriel-element">
        <h3>Collecter des données</h3>
        <p>Le formulaire est très pratique pour récolter les informations d’autres personnes.
          Vous pouvez générer un formulaire à partir de votre table et ensuite partager le lien avec les personnes de votre choix. Une fois qu’elles auront rempli le formulaire les données iront directement dans votre table.
          <br />
          Il suffit d'appuyer sur "Formulaire" dans la table pour créer le formulaire. Le bouton "Envoyer" permet d'envoyer les données du formulaire dans la table.
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

