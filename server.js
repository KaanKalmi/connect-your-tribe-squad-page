/*** Express setup & start ***/
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


/*** Routes & data ***/
// Haal alle squads uit de WHOIS API op

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items/'


const squadData = await fetchJson(apiUrl + '/squad')


// Define functie om avatar te krijgen
function getAvatar(person) {
  return person.avatar || '/pfp.png';
}

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiUrl + '/person/?sort=name').then((apiData) => {
    // apiData bevat gegevens van alle personen uit alle squads
    // geef iedereen een avatar
    apiData.data.forEach(person => {
      person.avatar = getAvatar(person);
    });
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    response.render('index', { persons: apiData.data, squads: squadData.data });
  });
});

// Sorteert de data van voornaam in ASCending order
app.get('/sort', function (request, response) {
  fetchJson(apiUrl + '/person/?sort=name').then((apiData) => {
    apiData.data.sort((a, b) => a.name.localeCompare(b.name));
    // geef iedereen een avatar
    apiData.data.forEach(person => {
      person.avatar = getAvatar(person);
    });
    response.render('index', { persons: apiData.data, squads: squadData.data });
  });
});

// Sorteert de data van voornaam in DESCending order
app.get('/sort-desc', function (request, response) {
  fetchJson(apiUrl + '/person/?sort=name').then((apiData) => {
    apiData.data.sort((a, b) => b.name.localeCompare(a.name));
    // geef iedereen een avatar
    apiData.data.forEach(person => {
      person.avatar = getAvatar(person);
    });
    response.render('index', { persons: apiData.data, squads: squadData.data });
  });
});


// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', { person: apiData.data, squads: squadData.data })
  })
})


//Als we vanuir de browser een POST doen op de detailpagina van een persoon

app.post('/detail/:id/SE-GL-emoji', function (request, response) {

  //Stap 1: Haal de huidige gegevens voor deze persoon op, uit de WHOIS API

  fetchJson('https://fdnd.directus.app/items/person/' + request.params.id).then((apiResponse) => {
    // Het custom field is een String, dus die moeten we eerst omzetten (= parsen)
    // naar een Object, zodat we er mee kunnen werken
    try {
      apiResponse.data.custom = JSON.parse(apiResponse.data.custom)
    } catch (e) {
      apiResponse.data.custom = {}
    }

    //STAP 2: Voeg de emoji toe aan het custom object

    if (apiResponse.data.custom.emojis === true || !apiResponse.data.custom.emojis) {
      apiResponse.data.custom.emojis = {}
    }

    if (request.body.emoji == 'star-eyes') {
      if (!apiResponse.data.custom.emojis.starEyes) {
        apiResponse.data.custom.emojis.starEyes = 0
      }
      apiResponse.data.custom.emojis.starEyes++
    }

    if (request.body.emoji == 'glasses-eyes') {
      if (!apiResponse.data.custom.emojis.glassesEyes) {
        apiResponse.data.custom.emojis.glassesEyes = 0
      }
      apiResponse.data.custom.emojis.glassesEyes++
    }

    //STAP 3: Overschrijf het custom field voor deze persoon

    fetchJson('https://fdnd.directus.app/items/person/' + request.params.id, {
      method: 'PATCH',
      body: JSON.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then((patchResponse) => {
      //redirect naar de persoon pagina
      response.redirect(303, '/');
    });
  }
  );
});
// Filter by squad_id
app.get('/squad/:squad_id', function (request, response) {
  // Use the request parameter squad_id to filter persons from the WHOIS API
  fetchJson(apiUrl + '/person/?filter[squad_id][_eq]=' + request.params.squad_id).then((apiData) => {
    // Fetch the squads data
    fetchJson(apiUrl + '/squad').then((squadData) => {
      // Render index.ejs from the views folder and pass the fetched data as variables
      response.render('index', { persons: apiData.data, squads: squadData.data });
    });
  });
});
