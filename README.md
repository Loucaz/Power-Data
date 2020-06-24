# Readme

Comment installer l'application Power-Data en mode développeur ?

Travail effectué dans le cadre d'un projet tutoré.
Application inspirée d'Airtable.

## Installation

Il vous faut un éditeur du genre phpstorm.
```bash
git clone https://forge.univ-lyon1.fr/p1702967/ptut-airtable.git
```
## Client
```bash
cd vue-first-application

npm install
```
Corrigez les erreurs éventuelles avec notamment:
```bash
npm install vue
```

Pensez à changer cette ligne pour y mettre l'adresse de votre serveur'. Line 18 dans "main.js":
```python
Vue.prototype.$adresse = "http://localhost:3000";
```

## Serveur
Pensez à changer cette ligne pour y mettre le nom de votre base de données. Line 26 dans "server.js": 
```python
mongoose.connect('mongodb://localhost:27017/vue-js-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
```
## Usage

Allumez votre serveur avec node.js:
```python
cd TPNODE
node server.js
```
Puis votre client:
```python
cd vue-first-application
npm run serve
```