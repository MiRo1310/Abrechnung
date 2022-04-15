isInWebAppiOS = (window.navigator.standalone == true);
isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);

let pwaSupport = false;

if ("serviceWorker" in navigator) {
	pwaSupport = true; // iOS 11 oder neuer
	navigator.serviceWorker.register ("serviceworker.js").then (function (result) {
		console.log ("Service Worker registriert");
	}, function (error) {
		console.log ("Service Worker Registrierung fehlgeschlagen " + error);
	});
} else {
	console.log ("Service Worker nicht unterstützt");
}

window.onload = function () {
	if (pwaSupport) {
		let platform = navigator.platform;
		if (platform === 'iPhone' || platform === 'iPad') {
			// Die App ist noch nicht installiert
			if (!navigator.standalone) {
				let lastShown = parseInt (localStorage.getItem ('lastShown'));
				let now = new Date().getTime ();
				// lastShown NaN – App wurde noch nie geladen und Anweisung seit 7 Tagen nicht gezeigt
				if (isNaN (lastShown) || (lastShown + 1000 * 60 * 60 * 24 * 7) <= now) {
					document.getElementById("instructions").style.display = "block";
					localStorage.setItem ("lastShown", now);
				}
			}
		}
	}
}

function hideInstructions () {
	document.getElementById("instructions").style.display = "none";
}


// ANCHOR Values
let values = {
    holzspalter:{
        menge_holzspalter : 0,
        stundenlohn : 150,
        stundenlohnRabatt : 140,
    },
    anfahrtKm :{
        menge_kilometer: 0,
        p_kilometer : 0.95,
    },
    anfahrtPauschal:{
        menge : 0,
        kilometer_pauschal: 35,
    },
    eurovignette:{
        tage : 0,
        eurovignette: 12,
    },
    sonstiges :{
        menge : 0,
        sonstiges: 0,
    },   
    mwstsatz: 19,
    gesamtBetrag: 0,
    ausland: false,
    zaehlen:{
        val : {
            fuenf : 0,
            zehn : 0,
            zwanzig : 0,
            fuenfzig : 0,
            hundert : 0,
            zweihundert : 0,
            fuenfhundert : 0,
        },
        soll : 0,
        ist : 0,
        differenz: 0

        }
    }
    

let storgekey = "Abrechnung Roling"

// ANCHOR Reset Object
// Local Storage zurück setzen
if (false){
    localStorage.setItem(storgekey, JSON.stringify(""))
}
// Auf Änderungen reagieren
let objectsOfChange = document.getElementsByClassName("input")
for (const element of objectsOfChange){
    element.addEventListener("change", function(){
        console.log(values);
        
        values.holzspalter.menge_holzspalter = parseFloat(document.getElementById("zeit").value)
        values.holzspalter.stundenlohn = parseFloat(document.getElementById("p_stunde").value)

        values.anfahrtKm.menge_kilometer = parseFloat(document.getElementById("kilometer").value)
        values.anfahrtKm.p_kilometer = parseFloat(document.getElementById("p_kilo").value)

        values.anfahrtPauschal.menge = parseFloat(document.getElementById("pauschal").value)
        values.anfahrtPauschal.kilometer_pauschal = parseFloat(document.getElementById("p_kilo_pauschal").value)
        
        values.eurovignette.tage = parseFloat(document.getElementById("euro").value)
        values.eurovignette.eurovignette = parseFloat(document.getElementById("p_euro").value)
        
        values.sonstiges.menge = parseFloat(document.getElementById("sonstiges").value)
        values.sonstiges.sonstiges = parseFloat(document.getElementById("p_sonstiges").value)

        values.mwstsatz = parseFloat(document.getElementById("mwstsatz").value)
        save();
        berechnung()
    })
}

// ANCHOR Load
addEventListener("load", function(){
                
    if (localStorage.getItem(storgekey) != '""'){
        console.log("Loading")
        console.log(values)
        values = JSON.parse(localStorage.getItem(storgekey));
        
        if (document.URL.includes("index.html")){
            if (values.ausland){
                let eu = this.document.getElementById("eu-ausland")
                eu.setAttribute("checked", "checked")
                euAusland()

            }
            berechnung(); 
            if (values){    
                refreshDisplay();
            }
        } else if (document.URL.includes("zaehlen.html")){
            refreshDisplayZaehlen();
        }        
    } 
    
})


// ANCHOR Nav Button
// Nav Button sichtbar machen
const mobileNavButton = document.getElementById("mobile-nav-button")
mobileNavButton.addEventListener("click", function (){
    document.getElementById("mobile-nav-content").style.display ="block";
})

// ANCHOR Save
function save(){
    localStorage.setItem(storgekey, JSON.stringify(values))
}

// ANCHOR Refresh Display
function refreshDisplay(){
       
            // Holzspalter
            zeit.value = values.holzspalter.menge_holzspalter;
            p_stunde.value = values.holzspalter.stundenlohn;
            // Anfahrt km
            kilometer.value = values.anfahrtKm.menge_kilometer;
            p_kilo.value = values.anfahrtKm.p_kilometer.toFixed(2);
            // Anfahrt pauschal
            pauschal.value = values.anfahrtPauschal.menge
            p_kilo_pauschal.value = values.anfahrtPauschal.kilometer_pauschal;
            // Eurovignette
            euro.value = values.eurovignette.tage;
            p_euro.value = values.eurovignette.eurovignette;
            // Sonstiges
            sonstiges.value = values.sonstiges.menge;
            p_sonstiges.value = values.sonstiges.sonstiges;
            // MwSt
            mwstsatz.value = values.mwstsatz;
            
}

// ANCHOR Berechung
function berechnung(){

    // Holzspalter
    gesamtStundenlohn = values.holzspalter.menge_holzspalter * values.holzspalter.stundenlohn//document.getElementById("zeit").value * p_stunde.value;
    g_stunde.innerHTML = gesamtStundenlohn.toFixed(2);
    
    // Kilometer
    gesamtKilometer = values.anfahrtKm.menge_kilometer * values.anfahrtKm.p_kilometer;
    g_kilo.innerHTML = gesamtKilometer.toFixed(2);

    // Kilometer pauschal
    gesamtKilometerPauschal = values.anfahrtPauschal.menge * values.anfahrtPauschal.kilometer_pauschal;
    g_kilo_pauschal.innerHTML = gesamtKilometerPauschal.toFixed(2);

    // Eurovignette
    gesamtEuro = values.eurovignette.tage * values.eurovignette.eurovignette;
    g_euro.innerHTML = gesamtEuro.toFixed(2);

    // Sonstiges
    gesamtSonstiges = values.sonstiges.menge * values.sonstiges.sonstiges;
    g_sonstiges.innerHTML = gesamtSonstiges.toFixed(2);

    // Berechnung Ergebnis
    gesamtNetto = (gesamtStundenlohn + gesamtKilometer + gesamtKilometerPauschal + gesamtEuro + gesamtSonstiges).toFixed(2)
    g_netto.innerHTML = gesamtNetto;
    mwst = gesamtNetto * values.mwstsatz / 100;
    g_mwst.innerHTML = mwst.toFixed(2);
    gesamtBrutto = gesamtNetto * (100 + values.mwstsatz) / 100;
    gesamt.innerHTML = gesamtBrutto.toFixed(2);
    if (values.ausland){
        values.gesamtBetrag = gesamtNetto
    } else{
        values.gesamtBetrag = gesamtBrutto
    }
    save();
}

// ANCHOR Button Zurücksetzen
const zuruecksetzen = document.getElementById("zuruecksetzen")
if(zuruecksetzen){
    zuruecksetzen.addEventListener("click", function() {
        values.holzspalter.menge_holzspalter = 0;
        values.anfahrtKm.menge_kilometer = 0;
        values.anfahrtPauschal.menge = 0;
        values.eurovignette.tage = 0;
        values.sonstiges.menge = 0;
        save();
        refreshDisplay();
        berechnung();  
    })
}

// ANCHOR EU Ausland Event
const euAuslandEvent = document.getElementById("eu-ausland")
if (euAuslandEvent){
    euAuslandEvent.addEventListener("click", function(){
        euAusland()
        
    })
}

// ANCHOR EU Ausland Funtion
const euAusland = function(){
    if (document.getElementById("eu-ausland").checked == true){
            values.ausland = true;
            
            document.getElementById("textEu").innerHTML = "Gesamt";
            for(let i = 0; i<document.getElementsByClassName("displayNone").length; i++) {
                document.getElementsByClassName("displayNone")[i].style.visibility ="hidden"
            }     
            document.getElementsByClassName("button-feld")[0].style.top ="435px"             
        } else {
            values.ausland = false;
            document.getElementById("textEu").innerHTML = "Netto";
            for(let i = 0; i<document.getElementsByClassName("displayNone").length; i++) {
                document.getElementsByClassName("displayNone")[i].style.visibility ="visible"
            }                        
            document.getElementsByClassName("button-feld")[0].style.bottom ="10px"    
        }
        berechnung();
        save();
}

// ANCHOR Zählen
// Zählen

let ergFünf;
let ergZehn;
let ergZwanzig;
let ergFünfzig;
let ergHundert;
let ergZweiHundert;
let ergFünfHundert;

let gesamtZaehlen;

// ANCHOR Auf Änderungen reagieren

const valuechange = document.getElementsByClassName("compute");
for (const element of valuechange){
    element.addEventListener("change", function(){
        values.zaehlen.val.fuenf = fuenf.value
        values.zaehlen.val.zehn = zehn.value
        values.zaehlen.val.zwanzig = zwanzig.value
        values.zaehlen.val.fuenfzig = fuenfzig.value
        values.zaehlen.val.hundert = hundert.value
        values.zaehlen.val.zweihundert = zweihundert.value
        values.zaehlen.val.fuenfhundert = fuenfhundert.value
        console.log(values)
        wertErmitteln();
    })
}

// ANCHOR Refresh Display Zählen

function refreshDisplayZaehlen(){
    
    soll.innerHTML = values.gesamtBetrag.toFixed(2)
    values.zaehlen.soll = values.gesamtBetrag.toFixed(2)
    
    fuenf.value = values.zaehlen.val.fuenf
    zehn.value = values.zaehlen.val.zehn
    zwanzig.value = values.zaehlen.val.zwanzig
    fuenfzig.value = values.zaehlen.val.fuenfzig
    hundert.value = values.zaehlen.val.hundert
    zweihundert.value = values.zaehlen.val.zweihundert
    fuenfhundert.value = values.zaehlen.val.fuenfhundert

    
    gezaehlt.innerHTML = values.zaehlen.ist
    differenz.innerHTML = values.zaehlen.differenz
    wertErmitteln()
}
    
function  wertErmitteln(){
    inputMult();
    gesamtErrechnen();
    save();
}



function inputMult(){
    const val = values.zaehlen.val;
    ergFünf = val.fuenf * 5;
    ergZehn = val.zehn * 10;
    ergZwanzig = val.zwanzig * 20;
    ergFünfzig = val.fuenfzig * 50;
    ergHundert = val.hundert * 100;
    ergZweiHundert = val.zweihundert * 200;
    ergFünfHundert = val.fuenfhundert * 500;
   
}


function gesamtErrechnen(){
 values.zaehlen.ist = ergFünf + ergZehn + ergZwanzig + ergFünfzig + ergHundert + ergZweiHundert + ergFünfHundert;
 gezaehlt.innerHTML = values.zaehlen.ist;
 values.zaehlen.differenz = values.zaehlen.soll - values.zaehlen.ist
 differenz.innerHTML = values.zaehlen.differenz.toFixed(2)

}

// function datenAusAbrechnung(){
//     soll.innerHTML = parseFloat(gesamtZaehlen).toFixed(2);
    
// }