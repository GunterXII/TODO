// ——————————————
// 1) Selettori unici
// ——————————————
const aggiungi       = document.getElementById("aggiungi");
const form           = document.querySelector(".task");
const aggiungiForm   = document.getElementById("aggiungiform");
const calendarione   = document.getElementById("calendar");
const questaSettimana= document.getElementById("questasettimana");
const taskDettagliata= document.querySelector(".card");
const bottoneImportantiSidebar = document.getElementById("importanti");
const btnImportante  = document.querySelector(".importante")
const sezioneImportanti = document.getElementById("sezioneImportanti");    // il wrapper
const listaImportanti  = document.querySelector(".listaImportanti");        // la lista interna


// ——————————————
// 2) Variabili di stato
// ——————————————
let giornoSelezionato = null; 
const taskImportanti = []; 

// ——————————————
// 3) Funzioni di rendering
// ——————————————
function renderCalendario() {
  calendarione.style.display = "block";
  taskDettagliata.style.display = "none";
  sezioneImportanti.style.display = "none";
  sezioneOggi.style.display="none"

  // Rimuovi classe se già presente (per far ripartire animazione)
  calendarione.classList.remove("entrata-sinistra");

  // Forza un reflow per "resettare" animazione (trick)
  void calendarione.offsetWidth;

  // Aggiungi classe per animazione
  calendarione.classList.add("entrata-sinistra");
}

questaSettimana.addEventListener("click", renderCalendario);

function renderForm() {
  form.style.display = "flex";               // Rende visibile il form
  form.classList.remove("esci");             // Rimuove eventuali vecchie classi
  form.classList.add("entra");               // Aggiunge animazione
  calendarione.style.display="none"
  sezioneImportanti.style.display="none"
  sezioneOggi.style.display="none"
}

aggiungi.addEventListener("click", renderForm);

// ——————————————
// 4) Prendere dati dal form
// ——————————————
function prendiInfo() {
  const titolo      = document.getElementById("titolo").value;
  const descrizione = document.getElementById("descrizione").value;
  const data        = document.getElementById("data").value;
  return [titolo, descrizione, data];
}

// ——————————————
// 5) Creare un nuovo giorno nel calendario
// ——————————————
function creaCalendario([titolo, descrizione, data] = prendiInfo()) {
  const giorno = document.createElement("div");
  giorno.classList.add("day");

  // Salva i dati per dopo
  giorno.dataset.titolo      = titolo;
  giorno.dataset.descrizione = descrizione;
  giorno.dataset.data        = data;

  // Struttura interna
  giorno.innerHTML = `
    <strong>${data}</strong>
    <span>${titolo}</span>
  `;

  // Click sul giorno per vedere dettagli
  giorno.addEventListener("click", () => {
    dettagli(giorno);
  });

  calendarione.appendChild(giorno);

}

aggiungiForm.addEventListener("click", e => {
  e.preventDefault();
  creaCalendario();

  // Avvia l'animazione di uscita del form
  form.classList.remove("entra");
  form.classList.add("esci");

  // Ingrandisci la barra "questa settimana"
  questaSettimana.classList.add("ingrandisci");

  // Dopo 500ms (fine animazione form)
  setTimeout(() => {
    form.style.display = "none";
    form.classList.remove("esci");

    // Torna normale la barra "questa settimana" dopo un po'
    setTimeout(() => {
      questaSettimana.classList.remove("ingrandisci");
    }, 0); // puoi regolare il tempo che vuoi
  }, 500);
});


// ——————————————
// 6) Mostrare i dettagli di un giorno selezionato
// ——————————————
function dettagli(giorno) {
  const { titolo, descrizione, data } = giorno.dataset;

  document.querySelector(".titolotask").textContent = titolo;
  document.querySelector(".placeholder").textContent = descrizione;
  document.querySelector(".card input[type='date']").value = data;

  // Aggiungi animazione uscita calendario
  calendarione.classList.add("uscendo");

  // Quando termina l'animazione del calendario
  calendarione.addEventListener("animationend", function handler() {
    // Nascondi calendario e rimuovi classe uscente
    calendarione.style.display = "none";
    calendarione.classList.remove("uscendo");
    calendarione.removeEventListener("animationend", handler);

    // Mostra la card e fai entrare con animazione
    taskDettagliata.style.display = "block";
    taskDettagliata.classList.add("entrando");
  });

  giornoSelezionato = giorno;
}


// ——————————————
// 7) Funzione “Cancella”
// ——————————————
function cancella() {
  if (giornoSelezionato) {
    // Animazione prima di rimuovere dal calendario
    giornoSelezionato.classList.add("esci");

    setTimeout(() => {
      giornoSelezionato.remove();
      giornoSelezionato = null;
    }, 500); // 500ms = durata animazione
  }

  // Anche la card (dettagli task) esce con animazione
  taskDettagliata.classList.add("esci");

  setTimeout(() => {
    taskDettagliata.style.display = "none";
    taskDettagliata.classList.remove("esci");

    // Pulizia testi
    document.querySelector(".titolotask").textContent = "";
    document.querySelector(".placeholder").textContent = "";
    document.querySelector(".card input[type='date']").value = "";
  }, 500);
}


// Assumi che il bottone cancella abbia id="cancellaBtn"

// ——————————————
//ogni volta che clicco importante , viene aggiunto un paragrafo p che ha il titolo uguale alla task scelta
function importanti() {
  if (!giornoSelezionato) return;         // nessun giorno selezionato
  const { titolo, descrizione, data } = giornoSelezionato.dataset;
  const paragrafo = document.createElement("p");
  paragrafo.classList.add("paragrafoImportante")
  paragrafo.innerHTML = `<div id="iconaP">${data} – ${titolo} <img src="/svg/star-svgrepo-com.svg" alt="" width="20" id="aggiungiform"></div>`;
  listaImportanti.appendChild(paragrafo);
  paragrafo.addEventListener("click", cancellaImportanti);
   // 1. Crea una stellina animata
  const stellina = document.createElement("img");
  stellina.src = "/svg/star-svgrepo-com.svg";
  stellina.classList.add("stellina-animata");
  document.body.appendChild(stellina);

  // 2. Rimuovila dopo l'animazione (dura 1s)
  setTimeout(() => {
    stellina.remove();
  }, 1000);
} 
function cancellaImportanti(e) {
  const elemento = e.currentTarget; // il paragrafo cliccato
  elemento.classList.add("esci");

  setTimeout(() => {
    elemento.remove();
  }, 500); // 500ms come la durata dell'animazione
}
btnImportante.addEventListener("click", importanti);
bottoneImportantiSidebar.addEventListener("click", () => {
  // Nascondi tutto il resto
  calendarione.style.display = "none";
  taskDettagliata.style.display = "none";
  form.style.display = "none";
  sezioneOggi.style.display="none"

  // Mostra la sezione importanti
  sezioneImportanti.style.display = "block";

  // Rimuovi la classe se già presente per far ripartire animazione
  sezioneImportanti.classList.remove("entrata-cresci");

  // Forza reflow per "resettare" l'animazione
  void sezioneImportanti.offsetWidth;

  // Aggiungi la classe animata
  sezioneImportanti.classList.add("entrata-cresci");
});

function aggiornaOrologio() {
  const adesso = new Date();
  let ore = adesso.getHours();
  let minuti = adesso.getMinutes();
  let secondi = adesso.getSeconds();

  // Aggiungi lo 0 davanti se sono numeri < 10
  ore = ore < 10 ? "0" + ore : ore;
  minuti = minuti < 10 ? "0" + minuti : minuti;
  secondi = secondi < 10 ? "0" + secondi : secondi;

  const oraAttuale = `${ore}:${minuti}:${secondi}`;

  document.getElementById("orologio").textContent = oraAttuale;
}

// Avvia l'orologio subito e aggiorna ogni secondo
aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);
const sezioneOggi = document.querySelector(".oggi");
const bottoneOggi = document.getElementById("oggiSidebar");

bottoneOggi.addEventListener("click", () => {
  // Nascondi tutte le altre sezioni
  calendarione.style.display = "none";
  taskDettagliata.style.display = "none";
  form.style.display = "none";
  sezioneImportanti.style.display = "none";
 controllaData();
  document.querySelector(".oggi").style.display = "flex"
  // Mostra solo la sezione OGGI
  sezioneOggi.style.display = "block";   // o "block" se preferisci
  sezioneOggi.style.animation = "entraDaSinistra3 0.6s ease";
});

const messaggioOggi = document.getElementById("messaggioOggi");

// 1) Prende tutti i div.day
function prendiTutteLeCard() {
  return document.querySelectorAll(".day");
}

// 2) Estrae un array di numeri (i giorni)
function prendiGiorniDelleCard() {
  const cards = prendiTutteLeCard();
  return Array.from(cards).map(card => {
    // card.dataset.data è "2025-07-21"
    const parts = card.dataset.data.split("-");
    return parseInt(parts[2], 10); // estrae il giorno "21" → 21
  });
}

// 3) Controlla se oggi è in quell’array
function controllaData() {
  const today = new Date().getDate();  // numero 1–31
  const giorni = prendiGiorniDelleCard();

  if (giorni.includes(today)) {
    messaggioOggi.textContent = "Hai delle cose da fare oggi!Vai Al Calendario📌🗓️";
  } else {
    messaggioOggi.textContent = "Oggi non hai eventi in programma";
  }
}
// ——————————————
// Selettori per editing
// ——————————————
const titoloEl  = document.querySelector(".titolotask");
const descrEl   = document.querySelector(".placeholder");
const dataInput = document.querySelector(".card input[type='date']");
const btnSalva  = document.getElementById("btnSalva");

// ——————————————
// 1) Abilita editing al doppio click
// ——————————————
titoloEl.addEventListener("dblclick", () => {
  titoloEl.contentEditable = "true";
  titoloEl.focus();
});
descrEl.addEventListener("dblclick", () => {
  descrEl.contentEditable = "true";
  descrEl.focus();
});

// ——————————————
// 2) Salva le modifiche al click su “Salva”
// ——————————————
btnSalva.addEventListener("click", () => {
  if (!giornoSelezionato) return;

  // legge i nuovi valori
  const nuovoTitolo = titoloEl.textContent.trim();
  const nuovaDesc   = descrEl.textContent.trim();
  const nuovaData   = dataInput.value;

  // aggiorna il dataset
  giornoSelezionato.dataset.titolo      = nuovoTitolo;
  giornoSelezionato.dataset.descrizione = nuovaDesc;
  giornoSelezionato.dataset.data        = nuovaData;

  // aggiorna la vista nel calendario
  giornoSelezionato.querySelector("strong").textContent = nuovaData;
  giornoSelezionato.querySelector("span").textContent   = nuovoTitolo;

  // disabilita l’editing
  titoloEl.contentEditable = "false";
  descrEl.contentEditable  = "false";

  // feedback di salvataggio
  btnSalva.textContent = "Salvato!";
  setTimeout(() => {
    btnSalva.textContent = "Salva modifiche";
  }, 1500);
});


