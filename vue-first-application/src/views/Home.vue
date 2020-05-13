<template>
<div class="container-fluid">
  <div class="container home">
    <h1 class="bienvenu">Bienvenue sur Power Data</h1>
    <div class="row button-home">
      <div class="col"></div>
      <router-link to="/register" class="col"> <a><button class="inscrire">S'inscrire</button></a></router-link>
      <div class="col"><a href="#ancresavoirplus"> <button class="ensavoirplus">En savoir plus</button></a></div>
       <div class="col"></div>
    </div>
  </div>
    <h2 id="ancresavoirplus">Que-est-ce que PowerData ?</h2>
    <p class="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita repellendus optio laboriosam blanditiis nobis, nemo, earum totam deleniti ducimus quia hic saepe ipsam omnis aspernatur iste libero, doloribus id quis sunt. Eius odio, nam maiores amet, eos quis totam a sunt quidem aperiam iste eveniet perspiciatis tenetur repellendus rerum modi. Sit molestiae delectus dolor velit! Molestias dolores a corporis placeat consectetur ad ipsum accusamus exercitationem officiis magni eum, minima ipsa voluptates qui dolorem quidem illum, eos, culpa sequi mollitia. A sit, aut commodi soluta dolores ab dignissimos! Nostrum velit possimus illum praesentium. At a maiores qui laborum earum libero accusamus.</p>
    <h2>Comment l'utiliser ?</h2>
    <div class="row">
      <div class="col-3"></div>
      <div class="col video"><p>Mettre la video de presentation</p></div>
      <div class="col-3"></div>
    </div>
    <h3>Apprenez grace aux tutoriels </h3>
    <div class="row lignetuto">
      <div class="col"></div>
     <div class="col-2 tuto">
          <router-link to="/tutobases">
            <div class="table-icon table-blue">
            <i class="fa fa-database" aria-hidden="true"></i>
          </div>
          <p>Tuto : <br/> Créer une base</p>
          </router-link>
      </div>
      <div class="col"></div>
      <div class="col-2 tuto">
        <router-link to="/tutotables">
            <div class="table-icon table-orange">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </div>
          <p>Tuto : <br/> Créer des tables</p>
        </router-link>
      </div>
      <div class="col"></div>
      <div class="col-2 tuto">
          <router-link to="/tutoformulaires">
            <div class="table-icon table-green">
            <i class="fa fa-check-square-o" aria-hidden="true"></i>
          </div>
          <p>Tuto : <br/> Créer des formulaires</p>
          </router-link>
      </div>
      <div class="col"></div>
     <div class="col-2 tuto">
          <router-link to="/tutodonnees">
            <div class="table-icon table-red">
            <i class="fa fa-flag-checkered" aria-hidden="true"></i>
          </div>
          <p>Tuto : <br/> Collecte données</p>
          </router-link>
      </div>
      <div class="col"></div>
    </div>
</div>
</template>

<script>


</script>
