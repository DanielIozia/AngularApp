# UrbanConnect

## Panoramica

L'applicazione si concentra sullo sviluppo urbano e si integra con la piattaforma GoRest per fornire funzionalità di gestione degli utenti, post e commenti. 
Le principali funzionalità includono:

## Login e Registrazione

L'applicazione offre la possibilità agli utenti di autenticarsi o registrarsi tramite la piattaforma GoRest. Ecco alcuni dettagli specifici riguardo a questa funzionalità:

### Form di Login

Il form di login richiede l'autenticazione attraverso la piattaforma GoRest. 
Per completare con successo il processo di login, è necessario fornire il token e una mail già registrata nella piattaforma.
Il token può essere ottenuto tramite l'autenticazione su [https://gorest.co.in/consumer/login](https://gorest.co.in/consumer/login).

### Form di Registrazione

Il processo di registrazione richiede anche l'autenticazione su [https://gorest.co.in/consumer/login](https://gorest.co.in/consumer/login) per ottenere il token di registrazione. Questo token è essenziale per completare con successo la registrazione.

Per ottenere il token di registrazione:

1. Autenticarsi su [https://gorest.co.in/consumer/login](https://gorest.co.in/consumer/login) tramite Google, Github o Microsoft.
2. Utilizzare il token ottenuto durante l'autenticazione per completare il processo di registrazione nell'applicazione.

## Pagina Utenti

La pagina degli utenti offre una visione completa di tutti gli utenti disponibili, consentendo agli utenti loggati di effettuare ricerche.

### Visualizzazione Utenti

Gli utenti sono visualizzati utilizzando delle card. Ogni card mostra:

- **Nome**: Nome dell'utente.
- **Stato**: Indicato da un pallino colorato:
  - Verde se lo stato è `active`.
  - Rosso se lo stato è `inactive`.
- **Email**: Email dell'utente.
- **Icona Delete**: Un'icona per eliminare l'utente.

### Ricerca Utenti

Per semplificare la ricerca degli utenti, la pagina fornisce un input di ricerca. Gli utenti possono utilizzare questo input per filtrare la lista in base al nome e all'email degli utenti. 

#### Istruzioni per la Ricerca

Per effettuare una ricerca:

1. Accedi alla pagina degli utenti.
2. Utilizza l'input di ricerca per inserire i criteri desiderati (email e nome).
3. La lista degli utenti sarà automaticamente filtrata in base ai criteri inseriti.


### Eliminazione Utenti

Ogni card dell'utente presenta un'icona di eliminazione. Se premuta, questa icona apre una componente di dialogo che chiede se si vuole davvero eliminare l'utente. La componente di dialogo presenta due opzioni: "yes" o "no".

#### Utilizzo della Componente di Dialogo

Per eliminare un utente:

1. Clicca sull'icona delete nella card dell'utente che desideri eliminare.
2. Si aprirà una componente di dialogo con il messaggio di conferma.
3. Seleziona "no" per annullare l'operazione e lasciare tutto invariato.
4. Seleziona "yes" per confermare l'eliminazione dell'utente. L'utente sarà rimosso dalla lista.

### Creazione Utenti

Nella pagina utenti è presente un bottone con scritto "Create New User" che permette di creare un nuovo utente. Premendo questo bottone si apre un form che consente di inserire i dettagli dell'utente.

#### Utilizzo del Form di Creazione Utente

Il form di creazione utente richiede i seguenti input:

- **Name**: Nome dell'utente
- **Email**: Email dell'utente
- **Gender**: Genere dell'utente
- **Status**: Stato dell'utente

Il form contiene due bottoni:

- **Cancel**: Annulla l'operazione e chiude il form.
- **Create**: Controlla se un utente con la stessa email esiste già. Se non esiste, crea un nuovo utente e lo aggiunge alla lista. Se esiste, mostra un messaggio di errore e non crea l'utente.

### Paginatore e Selezionatore di Utenti per Pagina

Alla fine della pagina degli utenti, è presente un paginatore che consente di cambiare pagina. Inoltre, è disponibile un selezionatore che permette di selezionare la visione di 10, 25, 50 o 100 utenti per pagina.

#### Utilizzo del Paginatore

Per navigare tra le pagine degli utenti:

1. Scorri fino alla fine della pagina degli utenti.
2. Utilizza il paginatore per passare alla pagina successiva o precedente.

#### Utilizzo del Selezionatore di Utenti per Pagina

Per selezionare il numero di utenti da visualizzare per pagina:

1. Scorri fino alla fine della pagina degli utenti.
2. Utilizza il selezionatore per scegliere tra 10, 25, 50 o 100 utenti per pagina.
3. La lista degli utenti si aggiornerà automaticamente in base alla selezione.

## Pagina Dettaglio Utente

La pagina dettaglio utente permette di vedere i dettagli di un utente, quali:

- **ID**: L'identificatore univoco dell'utente.
- **Email**: L'indirizzo email dell'utente.
- **Stato**: Lo stato dell'utente (attivo o inattivo).
- **Genere**: Il genere dell'utente.

Oltre ai dettagli dell'utente, la pagina mostra tutti i post relativi a quell'utente con la possibilità di vedere i commenti di ogni post.

### Visualizzazione Post e Commenti

- **Post dell'Utente**: Se l'utente ha pubblicato dei post, questi saranno visualizzati sotto i dettagli dell'utente.
- **Show Comments**: Ogni post ha un bottone verde "Show Comments" che, se premuto, mostra i commenti relativi a quel post.
- **Aggiungi Commento**: Se non ci sono commenti, è comunque possibile aggiungere un commento a nome dell'account con cui si è loggati.

### Messaggio di Nessun Post

Se l'utente non ha pubblicato alcun post, verrà visualizzato un messaggio indicante che quell'utente non ha pubblicato nessun post:
`{User name} has not published any posts!`

Questa funzionalità permette agli utenti di esplorare i dettagli degli altri utenti e interagire con i loro post attraverso i commenti, migliorando l'interazione e la partecipazione all'interno della piattaforma UrbanConnect.

## Profilo

Nella pagina del profilo puoi visualizzare i dettagli dell'account con cui sei loggato, che includono:

- **ID**: L'identificatore univoco dell'utente.
- **Email**: L'indirizzo email dell'utente.
- **Status**: Lo stato dell'utente (attivo o inattivo). 
- **Gender**: Il genere dell'utente.

## Post e Commenti

La pagina del profilo mostra tutti i post associati al tuo account e consente di visualizzare e gestire i commenti su questi post. Puoi:

- **Visualizzare i Post**: Tutti i post creati dall'utente sono visualizzati sotto i dettagli del profilo.
- **Show Comments**: Ogni post ha un bottone verde "Show Comments" che, se premuto, mostra i commenti relativi a quel post.
- **Aggiungere Commenti**: Anche se non ci sono commenti, puoi aggiungere un commento a nome del tuo account.

## Funzionalità di Gestione dell'Account

### Aggiornamento del Profilo

- **Update**: Il bottone "Update" ti permette di modificare i dettagli del tuo account. Quando premi questo bottone, si apre un form che consente di cambiare:
  - Nome
  - Genere
  - Stato
  - Email (se l'email non esiste già nel sistema)
  
  Il form presenta due bottoni:
  - **Cancel**: Annulla l'operazione e lascia tutto inalterato.
  - **Update**: Modifica effettivamente i dettagli dell'utente.

### Disiscrizione

- **Unsubscribe**: Premendo il bottone "Unsubscribe" si apre una componente di dialogo che chiede conferma per eliminare l'account. La dialog presenta due bottoni:
  - **No**: Annulla l'operazione e lascia tutto inalterato.
  - **Yes**: Elimina l'account e reindirizza al login.

### Creazione di un Nuovo Post

- **Create New Post**: Il bottone "Create New Post" apre un form per la creazione di un nuovo post. Il form richiede:
  - Titolo del post
  - Corpo del post

  Il form presenta due bottoni:
  - **Cancel**: Chiude il form senza creare il post.
  - **Create**: Crea effettivamente il post e lo aggiunge alla lista dei post.

## Post
La pagina dei post consente di visualizzare, filtrare e gestire i post. Di seguito sono descritte le principali caratteristiche e funzionalità della pagina:

## Filtraggio dei Post

- **Input di Filtraggio**: C'è un input che consente di filtrare i post per titolo. Inserendo del testo, la lista dei post viene filtrata in base ai titoli che contengono il testo specificato.
  - **Messaggio di Nessun Post**: Se il testo inserito non corrisponde a nessun titolo di post, viene mostrato il messaggio: `No posts available. Check back later!`.

## Creazione di un Nuovo Post

- **Create New Post**: Al centro della pagina c'è un bottone "Create New Post" che, se premuto, apre un form per creare un nuovo post. Il form per la creazione di un post è simile a quello del profilo e include le seguenti funzionalità:
  - Inserimento del titolo del post
  - Inserimento del corpo del post
  - Due bottoni:
    - **Cancel**: Annulla l'operazione e chiude il form senza creare il post.
    - **Create**: Crea effettivamente il post e lo aggiunge alla lista dei post.

## Visualizzazione dei Post

- **Dettagli del Post**: Ogni post è visualizzato con:
  - **Titolo**: In grassetto.
  - **Corpo**: Sotto il titolo, mostra il corpo del post.

- **Show Comments**: Ogni post ha un bottone "Show Comments" che permette di visualizzare i commenti relativi al post. Quando premuto, oltrei ai commenti, viene mostrato un input di testo che consente di inserire un nuovo commento.

## Paginazione e Selezionatore

 In basso a destra della pagina è presente una freccia che reindirizza direttamente alla fine della pagina, dove si trovano:
  - **Paginatore**: Permette di navigare tra le pagine dei post.
  - **Selezionatore di Post per Pagina**: Consente di selezionare il numero di post da visualizzare per pagina (10, 25, 50, 100), con le stesse funzionalità della pagina degli utenti.

## Logout 
Quando premuto il bottone di Logout, viene aperta una componente di dialogo che chiede se si vuole davvero eseguire il Logout. Sono presenti due bottoni: 
 - **No**: Chiude la componente di dialogo e lascia tutto inalterato.
  - **Yes**: Esegue il logout e si viene reindirizzati alla pagina di login.
##
##
# Come Utilizzare

1. **Clona il repository**: `git clone <https://github.com/DanielIozia/AngularApp.git>`
2. **Installa le dipendenze**: `npm install`
3. **Avvia il progetto**: `ng serve`
4. **Accedi all'applicazione**: Apri `http://localhost:4200` nel tuo browser.

Per autenticarti, segui le istruzioni nella pagina di login per ottenere il token di accesso dalla piattaforma [GoRest](https://gorest.co.in/).






