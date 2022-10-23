let assets = [
  "/",
  "/zaehlen.html",
  "/zeit.html",
  "/css/style.css",
  "/app.js"
]

let cacheTypes = ["main", "font", "image"];
let cacheVersion = "_v1"



self.addEventListener('install', event => {
  // Serviceworker aktivieren
  self.skipWaiting();

  // Erst weiter machen wenn der Code fertig ist
  event.waitUntil(
    // Cache öffnen , wenn nicht vorhanden wird er angelegt. Es wird ein Promise zurück gegeben
    caches.open(cacheTypes[0] + cacheVersion).then((cache) => {
      cache.addAll(assets);
    })
  );

});

function putInCache(request, response) {
  let chacheKey = cacheTypes.includes(request.destination)
    ? request.destination
    : "main";
  caches.open(chacheKey + cacheVersion).then((cache) => {
    // put hinzufügen und ersetzen, add nur hinzufügen wenn nicht vorhanden
    cache.put(request, response)
  })
}

async function cacheFirst(request) {
  // Abfrage ob der Request im Cache liegt
  let responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  // Wenn im Cache nichts gefunden wird, soll der Server angefragt werden
  // Den Response vom fetch(request) gibt es nur einmal,und muss daher kopiert werden .clone() 
  let responseFromNetwork = await (await fetch(request));
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
}

async function networkFirst(request) {
  try {
    let responseFromNetwork = await fetch(request)
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  }
  catch {
    let responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
  }


}


self.addEventListener('fetch', event => {
  //console.log(event.request)
  let response = ""
  switch (event.request.destination) {
    case "font": response = cacheFirst(event.request);
      break;
    case "image": response = cacheFirst(event.request);
      break;
    default: response = networkFirst(event.request)
  }

  event.respondWith(response);

});

async function deleteOldCaches() {
  let cacheKeepList = []
  cacheTypes.forEach((element) => {
    cacheKeepList.push(element + cacheVersion);
  });
  console.log("Cache To Keep : " + cacheKeepList) 

  let keyList = await caches.keys();
  console.log("Keylist: " + keyList)
  let cacheToDelete = keyList.filter((key) => !cacheKeepList.includes(key))

  console.log("Cache To Delete: " + cacheToDelete) 
  await Promise.all(
    cacheToDelete.map((key) => {
      caches.delete(key)
    })
  )
}

self.addEventListener('activate', event => {
  event.waitUntil(
    deleteOldCaches().then(() => {
      // Den Serviceworker für alle Seiten benutzen
      clients.claim();
    })
  );

});

