// Vatriablen 

let storgekey = "Abrechnung Roling"
let values;

//ANCHOR DOM Contend Loaded

document.addEventListener("DOMContentLoaded", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("serviceworker.js", { scope: "/" })
            .then(() => { console.log("Service Worker registriert") })
            .catch((error) => { console.log("Service Worker Registrierung fehlgeschlagen " + error) })
    } else {
        console.log("Service Worker nicht unterstützt");
    }

    // console.log(this.localStorage.getItem(storgekey || valuesOb))
    // if (this.localStorage.getItem(storgekey) && localStorage.getItem(storgekey) != '""') {
    //     console.log("Loading")

    values = JSON.parse(localStorage.getItem(storgekey)) || valuesOb;
    save();
    if (document.URL.includes("index.html")) {
        if (values.ausland) {
            let eu = this.document.getElementById("eu-ausland")
            eu.setAttribute("checked", "checked")
            euAusland()

        }
        berechnung();
        if (values) {
            refreshDisplay();
        }
    } else if (document.URL.includes("zaehlen.html")) {
        refreshDisplayZaehlen();
    } else if (document.URL.includes("zeit.html")) {
        refreshDisplayZeit();
    }
    // } else {
    //     console.log("First Value")
    //     values = valuesOb
    //     save();
    // }    

})
// ANCHOR Values
let valuesOb = {
    holzspalter: {
        menge_holzspalter: null,
        stundenlohn: 150,
        stundenlohnRabatt: 140,
    },
    anfahrtKm: {
        menge_kilometer: null,
        p_kilometer: 0.95,
    },
    anfahrtPauschal: {
        menge: null,
        kilometer_pauschal: 35,
    },
    eurovignette: {
        tage: null,
        eurovignette: 12,
    },
    sonstiges: {
        menge: null,
        sonstiges: null,
    },
    mwstsatz: 19,
    gesamtBetrag: 0,
    ausland: false,
    zaehlen: {
        val: {
            fuenf: 0,
            zehn: 0,
            zwanzig: 0,
            fuenfzig: 0,
            hundert: 0,
            zweihundert: 0,
            fuenfhundert: 0,
        },
        soll: 0,
        ist: 0,
        differenz: 0

    },
    zeiten: {
        gesamtStunden: 0,
        tag1: {
            start: null,
            ende: null,
            pause1: null,
            pause2: null,
            pause3: null,
            pause4: null
        },
        tag2: {
            start: null,
            ende: null,
            pause1: null,
            pause2: null,
            pause3: null,
            pause4: null
        },
        tag3: {
            start: null,
            ende: null,
            pause1: null,
            pause2: null,
            pause3: null,
            pause4: null
        },
        tag4: {
            start: null,
            ende: null,
            pause1: null,
            pause2: null,
            pause3: null,
            pause4: null
        },
        tag5: {
            start: null,
            ende: null,
            pause1: 0,
            pause2: 0,
            pause3: 0,
            pause4: 0
        },
    }
}




// ANCHOR Reset Object
// Local Storage zurück setzen
//  if (true){localStorage.setItem(storgekey, JSON.stringify(""))}

// Auf Änderungen reagieren
let objectsOfChange = document.getElementsByClassName("input")
for (const element of objectsOfChange) {
    element.addEventListener("change", function () {
        console.log(JSON.stringify(values));

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
addEventListener("load", function () {

})


// ANCHOR Nav Button
// Nav Button unsichbar machen, wenn auf der Seite geklickt wird

const elemets = document.querySelectorAll("*:not(#mobile-nav-button)")
console.log(elemets)
for (let element of elemets) {
    element.addEventListener("click", function () {
        console.log("Test")

    })

}


// // Nav Button steuern

// const mobileNavButton = document.getElementById("mobile-nav-button")
// mobileNavButton.addEventListener("click", function (){
//     document.getElementById("mobile-nav-content").classList.toggle("display")

// })




// ANCHOR Save
function save() {
    localStorage.setItem(storgekey, JSON.stringify(values))
}

// ANCHOR Refresh Display
function refreshDisplay() {

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
function berechnung() {

    // Holzspalter
    if (values.holzspalter.menge_holzspalter && values.holzspalter.stundenlohn) {
        gesamtStundenlohn = values.holzspalter.menge_holzspalter * values.holzspalter.stundenlohn

    } else {
        gesamtStundenlohn = 0;
    }
    g_stunde.innerHTML = gesamtStundenlohn.toFixed(2);

    // Kilometer
    if (values.anfahrtKm.menge_kilometer && values.anfahrtKm.p_kilometer) {
        gesamtKilometer = values.anfahrtKm.menge_kilometer * values.anfahrtKm.p_kilometer;
    } else {
        gesamtKilometer = 0;
    }
    g_kilo.innerHTML = gesamtKilometer.toFixed(2);

    // Kilometer pauschal
    if (values.anfahrtPauschal.menge && values.anfahrtPauschal.kilometer_pauschal) {
        gesamtKilometerPauschal = values.anfahrtPauschal.menge * values.anfahrtPauschal.kilometer_pauschal;
    } else {
        gesamtKilometerPauschal = 0;
    }
    g_kilo_pauschal.innerHTML = gesamtKilometerPauschal.toFixed(2);

    // Eurovignette
    if (values.eurovignette.tage && values.eurovignette.eurovignette) {
        gesamtEuro = values.eurovignette.tage * values.eurovignette.eurovignette;
    } else {
        gesamtEuro = 0;
    }
    g_euro.innerHTML = gesamtEuro.toFixed(2);

    // Sonstiges
    if (values.sonstiges.menge && values.sonstiges.sonstiges) {
        gesamtSonstiges = values.sonstiges.menge * values.sonstiges.sonstiges;
    } else {
        gesamtSonstiges = 0;
    }
    g_sonstiges.innerHTML = gesamtSonstiges.toFixed(2);

    // Berechnung Ergebnis
    gesamtNetto = (gesamtStundenlohn + gesamtKilometer + gesamtKilometerPauschal + gesamtEuro + gesamtSonstiges).toFixed(2)
    g_netto.innerHTML = gesamtNetto;
    mwst = gesamtNetto * values.mwstsatz / 100;
    g_mwst.innerHTML = mwst.toFixed(2);
    gesamtBrutto = gesamtNetto * (100 + values.mwstsatz) / 100;
    gesamt.innerHTML = gesamtBrutto.toFixed(2);
    if (values.ausland) {
        values.gesamtBetrag = gesamtNetto
    } else {
        values.gesamtBetrag = gesamtBrutto
    }
    save();
}

// ANCHOR Button Zurücksetzen Abrechung
const zuruecksetzen = document.getElementById("zuruecksetzen")
if (zuruecksetzen) {
    zuruecksetzen.addEventListener("click", function () {

        if (confirm("Soll wirklich alles gelöscht werden?")) {
            values.holzspalter.menge_holzspalter = null;
            values.anfahrtKm.menge_kilometer = null;
            values.anfahrtPauschal.menge = null;
            values.eurovignette.tage = null;
            values.sonstiges.menge = null;
            // save();
            refreshDisplay();
            berechnung();
        }

    })
}

// ANCHOR Button Zurücksetzen Zählen
const zuruecksetzenZaehlen = document.getElementById("zuruecksetzen2")
if (zuruecksetzenZaehlen) {
    zuruecksetzenZaehlen.addEventListener("click", function () {
        if (confirm("Soll wirklich alles gelöscht werden?")) {
            values.zaehlen.val.fuenf = null;
            values.zaehlen.val.zehn = null;
            values.zaehlen.val.zwanzig = null;
            values.zaehlen.val.fuenfzig = null;
            values.zaehlen.val.hundert = null;
            values.zaehlen.val.zweihundert = null;
            values.zaehlen.val.fuenfhundert = null;
            refreshDisplayZaehlen();
        }
    })
}

// ANCHOR EU Ausland Event
const euAuslandEvent = document.getElementById("eu-ausland")
if (euAuslandEvent) {
    euAuslandEvent.addEventListener("click", function () {
        euAusland()

    })
}

// ANCHOR EU Ausland Funktion
const euAusland = function () {
    if (document.getElementById("eu-ausland").checked == true) {
        values.ausland = true;

        document.getElementById("textEu").innerHTML = "Gesamt";
        for (let i = 0; i < document.getElementsByClassName("displayNone").length; i++) {
            document.getElementsByClassName("displayNone")[i].style.visibility = "hidden"
        }

    } else {
        values.ausland = false;
        document.getElementById("textEu").innerHTML = "Netto";
        for (let i = 0; i < document.getElementsByClassName("displayNone").length; i++) {
            document.getElementsByClassName("displayNone")[i].style.visibility = "visible"
        }
        document.getElementsByClassName("button-feld")[0].style.bottom = "10px"
    }
    save();
    berechnung();

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
for (const element of valuechange) {
    element.addEventListener("change", function () {
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

function refreshDisplayZaehlen() {

    soll.innerHTML = parseFloat(values.gesamtBetrag).toFixed(2)
    values.zaehlen.soll = parseFloat(values.gesamtBetrag).toFixed(2)

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

function wertErmitteln() {
    inputMult();
    gesamtErrechnen();
    save();
}



function inputMult() {
    const val = values.zaehlen.val;
    ergFünf = val.fuenf * 5;
    ergZehn = val.zehn * 10;
    ergZwanzig = val.zwanzig * 20;
    ergFünfzig = val.fuenfzig * 50;
    ergHundert = val.hundert * 100;
    ergZweiHundert = val.zweihundert * 200;
    ergFünfHundert = val.fuenfhundert * 500;

}


function gesamtErrechnen() {
    values.zaehlen.ist = ergFünf + ergZehn + ergZwanzig + ergFünfzig + ergHundert + ergZweiHundert + ergFünfHundert;
    gezaehlt.innerHTML = values.zaehlen.ist;
    values.zaehlen.differenz = values.zaehlen.soll - values.zaehlen.ist
    differenz.innerHTML = values.zaehlen.differenz.toFixed(2)
    style(parseFloat(values.zaehlen.differenz));
}

// ANCHOR Farbe Differenz Anpassen
const style = function (val) {

    const dif = document.getElementById("dif")
    if (val === 0) {
        console.log("ist gleich")
        dif.style.backgroundColor = "#66ff33"
    } else if (val != 0) {
        dif.style.backgroundColor = "red"
    }

}

// ANCHOR Übernahme Zeit 
const buttonUebernahmeZeit = document.getElementById("uebernahmeStd")
if (buttonUebernahmeZeit) {
    buttonUebernahmeZeit.addEventListener("click", function () {
        if (confirm("Soll die Zeit übernommen weren?")) {
            zeit.value = values.zeiten.gesamtStunden
            values.holzspalter.menge_holzspalter = values.zeiten.gesamtStunden
            save()
            berechnung()
        }
    })
}

// ANCHOR Zeiten

// ANCHOR Refresh Display Zeit
const refreshDisplayZeit = function () {
    for (let i = 1; i <= 5; i++) {

        // Arbeitsbeginn
        let tB = document.getElementById("tB" + i)
        tB.value = values.zeiten["tag" + i].start
        // Arbeitsende
        let tE = document.getElementById("tE" + i)
        tE.value = values.zeiten["tag" + i].ende
        // Pausen
        let tP = document.getElementsByClassName("t" + i + "P")
        tP[0].value = values.zeiten["tag" + i].pause1
        tP[1].value = values.zeiten["tag" + i].pause2
        tP[2].value = values.zeiten["tag" + i].pause3
    }
    // // Arbeitsbeginn
    // tB1.value = values.zeiten.tag1.start
    // tB2.value = values.zeiten.tag2.start
    // tB3.value = values.zeiten.tag3.start
    // tB4.value = values.zeiten.tag4.start
    // tB5.value = values.zeiten.tag5.start

    // // Arbeitsende
    // tE1.value = values.zeiten.tag1.ende
    // tE2.value = values.zeiten.tag2.ende
    // tE3.value = values.zeiten.tag3.ende
    // tE4.value = values.zeiten.tag4.ende
    // tE5.value = values.zeiten.tag5.ende

    // // Pausen
    // const tag1Pause = document.getElementsByClassName("t1P")
    // tag1Pause[0].value = values.zeiten.tag1.pause1
    // tag1Pause[1].value = values.zeiten.tag1.pause2
    // tag1Pause[2].value = values.zeiten.tag1.pause3
    // //tag1Pause[3].value = values.zeiten.tag1.pause4

    // const tag2Pause = document.getElementsByClassName("t2P")
    // tag2Pause[0].value = values.zeiten.tag2.pause1
    // tag2Pause[1].value = values.zeiten.tag2.pause2
    // tag2Pause[2].value = values.zeiten.tag2.pause3
    // //tag2Pause[3].value = values.zeiten.tag2.pause4

    // const tag3Pause = document.getElementsByClassName("t3P")
    // tag3Pause[0].value = values.zeiten.tag3.pause1
    // tag3Pause[1].value = values.zeiten.tag3.pause2
    // tag3Pause[2].value = values.zeiten.tag3.pause3
    // //tag3Pause[3].value = values.zeiten.tag3.pause4

    // const tag4Pause = document.getElementsByClassName("t4P")
    // tag4Pause[0].value = values.zeiten.tag4.pause1
    // tag4Pause[1].value = values.zeiten.tag4.pause2
    // tag4Pause[2].value = values.zeiten.tag4.pause3
    // //tag4Pause[3].value = values.zeiten.tag4.pause4

    // const tag5Pause = document.getElementsByClassName("t5P")
    // tag5Pause[0].value = values.zeiten.tag5.pause1
    // tag5Pause[1].value = values.zeiten.tag5.pause2
    // tag5Pause[2].value = values.zeiten.tag5.pause3
    // //tag5Pause[3].value = values.zeiten.tag5.pause4

    mathTime()

}

// ANCHOR Event Change Zeiten
const fields = document.querySelectorAll(".field input")
for (const input of fields) {
    input.addEventListener("change", function () {


        const zeiten = values.zeiten;
        for (let i = 1; i <= 5; i++) {
            // Zeit Beginn          
            const tB = document.getElementById("tB" + i)
            zeiten["tag" + i].start = tB.value;
            // Zeit Ende
            const tE = document.getElementById("tE" + i)
            zeiten["tag" + i].ende = tE.value;

            const tag = document.getElementsByClassName("t" + i + "P")
            values.zeiten["tag" + i].pause1 = tag[0].value
            values.zeiten["tag" + i].pause2 = tag[1].value
            values.zeiten["tag" + i].pause3 = tag[2].value
            // values.zeiten["tag"+i].pause4 = tag[3].value   

        }

        save()
        mathTime()
    })
}

// ANCHOR Berechnen Zeit

const mathTime = function () {
    let gesamtStunden = 0;
    for (let i = 1; i <= 5; i++) {

        const tB = document.getElementById("tB" + i)
        const tE = document.getElementById("tE" + i)
        const pausen = document.getElementsByClassName("t" + i + "P")

        // Zeiten in Array Zerlegen
        const timeBArray = (tB.value.split(":"))
        const timeEArray = (tE.value.split(":"))

        const timeB = new Date(00, 00, 00, timeBArray[0], timeBArray[1]).getTime()
        const timeE = new Date(00, 00, 00, timeEArray[0], timeEArray[1]).getTime()

        let zeitPause = 0
        // Pausen zusammen addieren eines Tages
        for (const pause of pausen) {
            // Abfrage ob die Pause existiert
            if (pause.value) {
                zeitPause += parseFloat(pause.value)
            } else {
                zeitPause += 0
            }


        }

        // if (timeE > timeB){
        const arbeitszeit = (timeE - timeB) / 60000 - zeitPause
        const gesamtTag = document.getElementById("t" + i + "G")

        if (arbeitszeit >= 0) {
            gesamtTag.value = (arbeitszeit / 60).toFixed(2);
            gesamtStunden += parseFloat(arbeitszeit / 60);
        } else {
            let value = 0
            gesamtTag.value = value.toFixed(2);
        }


        gesamtStd.innerHTML = gesamtStunden.toFixed(2)
        values.zeiten.gesamtStunden = gesamtStunden.toFixed(2)

        // }
        save()
    }

}

// ANCHOR Button zurücksetzen Zeit

const zeitZurueck = document.getElementById("zuruecksetzenZeit")
if (zeitZurueck) {

    zeitZurueck.addEventListener("click", function () {

        if (confirm("Soll wirklich alles gelöscht werden?")) {
            for (let i = 1; i <= 5; i++) {

                // Arbeitsbeginn
                values.zeiten["tag" + i].start = null;
                // Arbeitsende
                values.zeiten["tag" + i].ende = null;
                // Pausen
                values.zeiten["tag" + i].pause1 = null;
                values.zeiten["tag" + i].pause2 = null;
                values.zeiten["tag" + i].pause3 = null;
            }
            save()
            mathTime()
            refreshDisplayZeit()
        }


    })
}
