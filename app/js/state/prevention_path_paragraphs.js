'use strict';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { pages } from '../style';
const { customPrevention: globSt } = pages;


const myStyle = StyleSheet.create({
  parText: {
    fontFamily: 'GillSans',
    fontSize: globSt.textFontSize,
    color: globSt.textColor,
  },
});


/* ---------------- screening yes ------------------------------------------- */
const screeningYesLessThan45 = `Attenzione: prima dei 45 anni non è prevista la partecipazione allo screening mammografico. Se rispondi NO avrai informazioni specifiche per la tua età.`;

const screeningYesFrom45To49 = `Ottimo, continua a partecipare allo screening mammografico.
Sei tra i 45 e i 50 anni: in questa fascia di età il rischio di sviluppare un tumore del seno è maggiore e la mammografia ha dimostrato di essere uno strumento efficace. La Regione Toscana ha previsto di allargare lo screening anche alle donne della tua età, raccomandando un invito annuale (servizio gratuito). Questa estensione del programma di screening inizierà, gradualmente, a partire dal 2017.

Se hai qualche dubbio al riguardo, puoi rivolgerti all’Ufficio Relazioni con il Pubblico dell’ISPO (vedi pagina strutture nell'applicazione).

Se pensi di avere problemi di familiarità, puoi parlarne con il tuo medico curante o rivolgerti ad un Centro di Senologia
(vedi il capitolo su Familiarità e genetica in: SAPERNE DI PIÙ -> Cause e fattori di Rischio)
`;

const screeningYesFrom50To69 = `Ottimo, continua a partecipare allo screening mammografico.
Sei tra tra i 50 e i 69 anni: in questa fascia di età il rischio di sviluppare un tumore del seno è maggiore e la mammografia ha dimostrato di essere uno strumento efficace per cui dall’inizio degli anni 1990 è attivo il programma di screening.
Le donne tra i 50 e i 69 anni, residenti nella Regione Toscana, possono accedere al programma di screening, che provvede ad invitare al controllo mammografico con periodicità biennale (servizio gratuito).

Se non hai ricevuto l’invito, se non trovi più la lettera, o se hai qualche dubbio al riguardo, puoi rivolgerti all’Ufficio Relazioni con il Pubblico dell’ISPO (vedi pagina strutture nell'applicazione).`;

const screeningYesFrom70To74 = `Ottimo, continua a partecipare allo screening mammografico.
Dopo i 74 anni dovrai decidere tu, parlandone con il tuo medico curante, se continuare a sottoporti all’esame mammografico.
In generale la necessità e l’opportunità di fare una diagnosi precoce del tumore della mammella diminuiscono con l’avanzare dell’età, ma non perdere l’abitudine di fare attenzione ad eventuali cambiamenti del seno.
Nel dubbio rivolgiti sempre al tuo medico di riferimento.

Se non hai ricevuto l’invito, se non trovi più la lettera, o hai qualche dubbio al riguardo, puoi rivolgerti all’URP dell’ISPO (vedi pagina strutture nell'applicazione).`;

const screeningYesMoreThan74 = `Attenzione: dopo i 74 anni non è prevista la partecipazione allo screening mammografico. Se rispondi NO avrai informazioni specifiche per la tua età.`;
/* -------------------------------------------------------------------------- */


/* ---------------- screening no -------------------------------------------- */
const screeningNoLessThan45 = `Fino ai 45 anni non sono previsti esami particolari né è suggerito di sottoporsi a visita annuale, se non per la presenza di cambiamenti a carico del seno che potrebbero richiedere approfondimenti. In questo caso è necessario rivolgersi al proprio medico curante.
La mammografia non è raccomandata, se non su consiglio del medico curante, e l’ecografia ha notevoli limitazioni nel diagnosticare lesioni tumorali.

Se pensi di avere problemi di familiarità, puoi parlarne con il tuo medico curante o rivolgerti ad un Centro di Senologia (vedi capitolo SAPERNE DI PIÙ/Cause e fattori di Rischio/Familiarità e genetica).`;

const screeningNoFrom45To74 = `Ti invitiamo ad aderire al programma di screening per il tumore della mammella, un programma di diagnosi precoce rivolto alle donne tra i 45 e i 74 anni.
La ricerca scientifica ha dimostrato che la mammografia è efficace per identificare precocemente il tumore al seno e consente quindi di salvare le vite di molte persone.

La diagnosi precoce - o prevenzione secondaria - consiste nella diagnosi di un tumore in fase iniziale, cioè in un momento in cui la lesione è ancora piccola e localizzata ed è quindi più facilmente eliminabile senza conseguenze per altri tessuti o organi. È effettuata attraverso lo screening mammografico, cioè un programma di controllo periodico che utilizza come test la mammografia (radiografia della mammella) e che è organizzato dal Servizio Sanitario Nazionale e/o Regionale, in accordo con le principali Società Scientifiche Europee e Italiane.

Tra i 45 e i 49 anni il rischio di sviluppare un tumore del seno è elevato. Per questo, recentemente la Regione Toscana ha deciso di allargare lo screening anche alle donne di questa età, con una mammografia annuale (servizio gratuito). L’estensione dello screening sarà rivolta anche a chi ha tra i 70 e i 74 anni, con controllo ogni due anni. Le lettere di invito saranno spedite, gradualmente, a partire dal 2017.

Se hai qualche dubbio al riguardo, puoi rivolgerti all’Ufficio Relazioni con il Pubblico dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const screeningNoMoreThan74 = `Lo screening per il tumore della mammella nella Regione Toscana si rivolge alle donne di età compresa tra i 45 e i 74 anni.

Dopo i 74 anni devi decidere tu, parlandone con il tuo medico curante, se continuare a sottoporti all’esame mammografico.

In generale la necessità e l’opportunità di fare una diagnosi precoce del tumore della mammella diminuiscono con l’avanzare dell’età, ma non perdere l’abitudine di fare attenzione ad eventuali cambiamenti del seno. Nel dubbio rivolgiti sempre al tuo medico curante.`;
/* -------------------------------------------------------------------------- */


/* ---------------- mammografia yes ----------------------------------------- */
const mammografiaYesLessThan45 = `Se hai già fatto una mammografia ti consigliamo di continuare a seguire i consigli del tuo medico curante.

Fino ai 45 anni infatti non è previsto l’accesso ai programmi di screening mammografico organizzati dalla Regione Toscana e le indicazioni sui percorsi da seguire vengono date dal medico curante, che terrà conto della storia personale, della familiarità e di eventuali fattori di rischio.`;

const mammografiaYesFrom45To49 = `Se hai già fatto una mammografia ti consigliamo di continuare a seguire i consigli del tuo medico curante.

Ti ricordiamo che la Regione Toscana ha recentemente esteso il programma di screening mammografico alle donne tra i 45 e i 49 anni, che a partire dal 2017 riceveranno, annualmente, l’invito alla mammografia di screening.

Se hai qualche dubbio al riguardo, puoi rivolgerti all’URP dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const mammografiaYesFrom50To69 = `Se hai già fatto una mammografia ti consigliamo di continuare a seguire i consigli del tuo medico curante.

Le donne tra i 50 e i 69 anni, residenti nella Regione Toscana, possono accedere al programma di screening, che invita al controllo mammografico con periodicità biennale (servizio gratuito).

Se non hai ricevuto l’invito, se non trovi più la lettera, o se hai qualche dubbio al riguardo, puoi rivolgerti all’Ufficio Relazioni con il Pubblico dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const mammografiaYesFrom70To74 = `Se hai già fatto una mammografia ti consigliamo di continuare a seguire i consigli del tuo medico curante.

Ti ricordiamo che la Regione Toscana ha recentemente esteso il programma di screening mammografico alle donne tra i 70 e i 74 anni, che a partire dal 2017 riceveranno, ogni due anni, l’invito alla mammografia di screening.

Se hai qualche dubbio al riguardo, puoi rivolgerti all’URP dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const mammografiaYesMoreThan74 = `Se hai già fatto una mammografia ti consigliamo di continuare a seguire i consigli del tuo medico curante.

Lo screening per il tumore della mammella nella Regione Toscana si rivolge alle donne di età compresa tra i 45 e i 74 anni.

In generale la necessità e l’opportunità di fare una diagnosi precoce del tumore della mammella diminuiscono con l’avanzare dell’età, ma è molto importante non perdere l’abitudine di fare attenzione ad eventuali cambiamenti del seno.`;
/* -------------------------------------------------------------------------- */


/* ---------------- mammografia no ------------------------------------------ */
const mammografiaNoLessThan45 = `Hai meno di 45 anni e non sono previsti esami particolari né è suggerito di sottoporsi a visita annuale, se non per la presenza di cambiamenti a carico del seno che potrebbero richiedere approfondimenti. In questo caso è necessario rivolgersi al proprio medico curante.

La mammografia non è raccomandata, se non su consiglio del medico che ti segue, e l’ecografia ha notevoli limitazioni nel diagnosticare lesioni tumorali.`;

const mammografiaNoFrom45To49 = `Attenzione: non partecipi ai programmi di screening e non hai mai fatto una mammografia.

La ricerca scientifica ha dimostrato che la mammografia è efficace per identificare precocemente il tumore al seno e consente quindi di salvare le vite di molte persone.

La Regione Toscana ha recentemente esteso il programma di screening mammografico anche a chi, come te, ha tra i 45 e i 49 anni. Le lettere di invito saranno spedite, gradualmente, a partire dal 2017.

Ti invitiamo ad aderire al programma di screening.

Se hai qualche dubbio al riguardo, puoi rivolgerti all’URP dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const mammografiaNoFrom50To74 = `Attenzione: non partecipi ai programmi di screening e non hai mai fatto una mammografia.

In questa fascia di età il rischio di sviluppare un tumore del seno è maggiore e la mammografia ha dimostrato di essere uno strumento efficace per cui dall’inizio degli anni novanta è attivo il programma di screening. La ricerca scientifica ha dimostrato che la mammografia uno strumento affidabile per identificare precocemente il tumore al seno e consente quindi di salvare le vite di molte persone.

Se risiedi nella Regione Toscana puoi accedere al programma di screening su invito, che provvede ad invitare al controllo mammografico con periodicità biennale (servizio gratuito).

La Regione Toscana ha recentemente esteso lo screening anche alle donne tra i 70 e i 74 anni: per questa fascia di età, le lettere di invito saranno spedite, gradualmente, a partire dal 2017.

Ti invitiamo ad aderire al programma di screening.

Se non hai ricevuto l’invito, se non trovi più la lettera, o hai qualche dubbio al riguardo, puoi rivolgerti all’URP dell’ISPO (vedi sezione "Strutture" all'interno di questa APP).`;

const mammografiaNoMoreThan74 = `Se non hai mai fatto una mammografia, parlane con il tuo medico curante, per valutare l’opportunità di  sottoporti all’esame mammografico.
In ogni caso, non perdere l’abitudine di fare attenzione ad eventuali cambiamenti del seno.

In generale la necessità e l’opportunità di fare una diagnosi precoce del tumore della mammella diminuiscono con l’avanzare dell’età: lo screening per il tumore della mammella nella Regione Toscana si rivolge alle donne di età compresa tra i 45 e i 74 anni.`;
/* -------------------------------------------------------------------------- */


/* ---------------- tumore -------------------------------------------------- */
const tumoreNo = `Non hai avuto un tumore della mammella e quindi non hai un rischio più elevato.
Ti consigliamo di continuare a controllare il tuo seno e di parlare con il tuo medico curante se dovessi notare qualche cambiamento.

Leggi con attenzione le sezioni “prevenzione” e “diagnosi precoce” di questa APP.

Se hai meno di 50 anni e pensi di avere problemi di familiarità, puoi parlarne con il tuo medico curante o rivolgerti ad un Centro di Senologia LINK ALLE BREAST UNIT IN CONTATTI
(vedi il capitolo su Familiarità e genetica in: SAPERNE DI PIÙ/Cause e fattori di Rischio)`;

const tumoreYes = `Dopo una prima diagnosi di cancro della mammella il rischio che la malattia si ripresenti (cosiddetta recidiva) o il rischio di un nuovo tumore è aumentato.
Gli esami senologici (in particolare la mammografia in corso di follow-up) ed uno stile di vita sano contribuiscono a permettere una diagnosi più precoce e verosimilmente anche a ridurre il rischio di ammalarsi nuovamente.

Leggi con attenzione le sezioni “prevenzione” e “diagnosi precoce” di questa APP.

Se sei interessata ad un percorso di riabilitazione, a Firenze LILT e ISPO, grazie anche al contributo di Corri la Vita e Toscana Donna, hanno dato vita al Centro di Riabilitazione Oncologica (Ce.Ri.On.), una realtà innovativa che si fonda sulla condivisione di risorse e obiettivi a cavallo tra il servizio pubblico e il mondo del volontariato.

Al Ce.Ri.On., mettendo insieme il sapere medico e il sapere psicologico, si accompagna il paziente oncologico in un percorso riabilitativo integrato e individualizzato, grazie alla sinergia tra diverse figure professionali.
LINK AL CERION`;
/* -------------------------------------------------------------------------- */


/* ---------------- fumo ---------------------------------------------------- */
const fumoYes = `Il fumo può provocare anche il cancro della mammella, ma se il rischio sembra meno forte per questo tipo di tumore rispetto ad altri.

Nel mondo, il fumo di tabacco è la principale causa prevenibile di malattie e di mortalità: cancro, malattie cardiovascolari, malattie respiratorie, ridotta fertilità sono solo alcune delle più importanti. Anche il fumo passivo, quello che facciamo respirare ai nostri figli se fumiamo in macchina o in casa, o che ci fanno respirare amici o colleghi fumatori, aumenta il rischio di molte malattie, tra cui quelle respiratorie, cardiovascolari e il cancro del polmone. L’esposizione a fumo passivo durante la gravidanza può anche causare nel feto un basso peso alla nascita.

In media, chi fuma perde 10 anni di vita, rispetto a chi non ha mai fumato. Smettere di fumare, a qualsiasi età, riduce il rischio di ammalarsi. Il beneficio è immediato sulla circolazione sanguigna e sulla funzione respiratoria. Dopo un anno si dimezza il rischio di patologia coronarica, rispetto a chi ancora fuma. Il rischio di tumore al polmone si dimezza dopo 10 anni.

Quindi: non iniziare è la cosa migliore, ma comunque non è mai troppo tardi per smettere e prima si smette e meglio è.

Se hai bisogno di aiuto per smettere di fumare puoi rivolgerti alla LILT (vedi sezione "About LILT" per contatti ed email)`;

const fumoYesInThePast = `Sei stata molto brava a smettere di fumare: smettere di fumare, a qualsiasi età, riduce il rischio di ammalarsi.
Il beneficio è inoltre immediato sulla circolazione sanguigna e sulla funzione respiratoria. Dopo un anno, ad esempio, si dimezza il rischio di patologia coronarica, rispetto a chi ancora fuma. Il rischio di tumore al polmone si dimezza dopo 10 anni.`;

const fumoNo = `Bene, continua così ed evita di esporti al fumo passivo sul lavoro o nel tempo libero.`;
/* -------------------------------------------------------------------------- */


/* ---------------- alcool -------------------------------------------------- */
const alcoolNo = `Fai bene a non consumare bevande alcoliche.

L’alcool è una sostanza cancerogena. Anche piccole quantità di alcool aumentano il rischio di cancro della mammella. Non esiste una quantità “sicura”, ma il rischio cresce all’aumentare delle quantità di alcool assunte.`;

const alcoolYesLessThan1 = `L’alcool è una sostanza cancerogena. Anche piccole quantità di alcool aumentano il rischio di cancro della mammella. Non esiste una quantità “sicura”, ma il rischio cresce all’aumentare delle quantità di alcool assunte.
Se proprio non vuoi rinunciare a un po’ di vino o di birra, non bere più di 1 bicchiere di vino (o una lattina di birra) al giorno.
Evita i superalcolici.

Una unità alcolica contiene 10-12 g di alcool puro e corrisponde ad un bicchiere di vino (125 ml), una lattina di birra (330 ml) oppure un bicchierino di superalcolico (30-40 ml)`;

const alcoolYesMoreThan1 = `L’alcool è una sostanza cancerogena. Anche piccole quantità di alcool aumentano il rischio di cancro della mammella. Non esiste una quantità “sicura”, ma il rischio aumenta all’aumentare delle quantità di alcool assunte. Ridurre il proprio consumo da 4 o più unità alcoliche al giorno a non più di una unità, può ridurre il rischio del 30%.

Se proprio non vuoi rinunciare a un po’ di vino o di birra, non bere più di 1 bicchiere di vino (o una lattina di birra) al giorno.
Evita i superalcolici.

Una unità alcolica contiene 10-12 g di alcool puro e corrisponde ad un bicchiere di vino (125 ml), una lattina di birra (330 ml) oppure un bicchierino di superalcolico (30-40 ml)

Se sei interessato a fare un percorso per muoverti verso una riduzione del consumo di alcolici, puoi contattare il centro Alcologico Regionale  CART (LINK)`;
/* -------------------------------------------------------------------------- */


/* ---------------- fitness ------------------------------------------------- */
const fitnessNo = `Il rischio di cancro della mammella è più basso in chi ha una vita più attiva e un ridotto livello di sedentarietà.

Cerca quindi di bruciare più energia, iniziando da questi piccoli accorgimenti, utili per farti consumare di più: stai in piedi, cammina, spostati in bicicletta o a piedi (anziché in auto), non prendere l’ascensore o le scale mobili, ma sali e scendi le scale a piedi, riduci il tempo che passi in poltrona o davanti al computer o alla TV.
Più ti muovi e meglio è!

In aggiunta a queste buone pratiche quotidiane, 30 minuti di attività fisica moderata 5 volte alla settimana (ad esempio camminare a passo sostenuto) contribuiranno al tuo benessere e a ridurre il rischio di tumore della mammella.

Comincia gradualmente e poi, quando sarai un po’ più allenata, potrai aggiungere attività più intense (palestra, esercizi di forza, attività aerobiche come ballare, correre, sciare, nuotare, ecc.) per ottenere una maggior protezione dal tumore al seno e da altre malattie cronico degenerative.`;

const fitnessYesModerate = `Un’ottività moderata, per almeno 30 minuti due volte alla settimana, è un buon inizio!

Il rischio di cancro della mammella infatti è più basso in chi ha una vita più attiva e un ridotto livello di sedentarietà.

Cerca di aumentare la frequenza di questa attività, inglobandola nelle tue attività giornaliere: 30 minuti di camminata a passo sostenuto (o 30 minuti in bicicletta o sulla cyclette) per 5 volte alla settimana, contribuiranno al tuo benessere e a ridurre il rischio di tumore della mammella.

Diminuisci tutte le attività sedentarie, riducendo il tempo che passi in poltrona o davanti al computer o alla TV, e cerca di bruciare più energia nelle attività di tutti i giorni: stai in piedi, cammina, spostati in bicicletta o a piedi (anziché in auto), non prendere l’ascensore o le scale mobili, ma sali e scendi le scale a piedi.

Quando sarai un po’ più allenata, aggiungendo 75 minuti alla settimana di attività più intense (palestra, esercizi di forza, attività aerobiche come ballare, correre, sciare, nuotare, ecc.) otterrai una maggior protezione dal tumore al seno e da altre malattie cronico degenerative.`;


const fitnessYesIntense = (
  <View>
    <Text style={myStyle.parText}>{`Ottimo, uno stile di vita attivo e un ridotto livello di sedentarietà riducono il rischio di cancro della mammella e ti proteggono anche da altre malattie cronico degenerative.

    Aiuta anche chi ti sta intorno ad assumere uno stile di vita più attivo. Puoi dare questi consigli:
    `}</Text>

    <View style={{flexDirection: 'row'}}>
      <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
      <View style={{flex: 1}}>
        <Text style={myStyle.parText}>{`stare in piedi, camminare, spostarsi in bicicletta o a piedi (anziché in auto), non prendere l’ascensore o le scale mobili, salire e scendere le scale a piedi`}</Text>
      </View>
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
      <View style={{flex: 1}}>
        <Text style={myStyle.parText}>{`ridurre le attività sedentarie, come stare in poltrona o davanti al computer o alla TV`}</Text>
      </View>
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
      <View style={{flex: 1}}>
        <Text style={myStyle.parText}>{`aggiungere alle abitudini quotidiane 30 minuti di attività fisica moderata 5 volte alla settimana (ad esempio camminare a passo sostenuto, andare in bicicletta, fare la cyclette in casa, ecc.)`}</Text>
      </View>
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text style={{marginLeft: 10, marginRight: 10}}>{"\u2022"}</Text>
      <View style={{flex: 1}}>
        <Text style={myStyle.parText}>{`75 minuti alla settimana di attività più intense (palestra, esercizi di forza, attività aerobiche come ballare, correre, sciare, nuotare, ecc.)`}</Text>
      </View>
    </View>
  </View>
  );
/* -------------------------------------------------------------------------- */


/* ---------------- bmi ----------------------------------------------------- */
const bmiUnderweight = `Attenzione, il tuo peso è molto basso.
Puoi essere sottopeso per diversi motivi, come per esempio una alimentazione insufficiente, una situazione di stress, una patologia che andrebbe diagnosticata (ad esempio la tiroide troppo attiva).

Essere sottopeso può avere conseguenze anche gravi sulla tua salute: scarse difese immunitarie, ossa fragili, stanchezza.

Per rimanere in salute, cerca di mantenere il peso nei limiti del normale, mangiando in modo sano ed equilibrato: una dieta sana può aiutarti a riportare il peso nella norma e, insieme agli altri componenti dello stile di vita sano, a ridurre il rischio di sviluppare i tumori.

Se non riesci ad aumentare di peso o se hai perso peso involontariamente, consulta un dietista, un nutrizionista o un medico.
Se vuoi avere consigli per una corretta alimentazione puoi rivolgerti alla LILT Firenze
(vedi sezione "About LILT" per contatti ed email)`;

const bmiNormalweight = `Bene, il tuo peso è giusto.
Per rimanere in salute, controlla periodicamente il tuo peso e cerca di mangiare in modo sano ed equilibrato: una dieta sana contribuisce, insieme agli altri componenti dello stile di vita sano, a ridurre il rischio di sviluppare i tumori.

Ecco qualche consiglio:

dai la precedenza a vegetali, frutta, cereali integrali e legumi, variando più che puoi i tipi e i colori della frutta e della verdura, che segnalano i loro diversi contenuti vitaminici e di altre sostanze antiossidanti. Ortaggi, legumi e cereali integrali sono anche ricchi di fibra, una componente importante della dieta, sia per il funzionamento intestinale che per la prevenzione di diabete, malattie cardiovascolari e tumori. Ricorda che una abbondante porzione di verdura fornisce pochissime calorie: se ti abitui a saziarti di verdure, potrai ridurre il consumo di alimenti più calorici.

riduci il consumo di alimenti molto calorici, ricchi di zuccheri semplici e di grassi saturi (burro, lardo, salumi e carni grasse, olio di palma). L’eccesso di alimenti ricchi di energia, abbinato a poco movimento, porta inevitabilmente all’aumento di peso, un importante fattore di rischio per il tumore della mammella. Se non vuoi rinunciare ai tuoi alimenti preferiti, riduci la porzione, togli la glassa dalla fetta di torta, non aggiungere zucchero alle bevande, bevi acqua e non bibite!

tieniti sempre in movimento, come indicato nella sezione “prevenzione”.`;

const bmiOverweight = `Attenzione, il tuo peso è maggiore di quello considerato normale: il peso in eccesso è un fattore di rischio per il tumore della mammella, soprattutto in post-menopausa.

Una dieta sana e attività fisica svolta regolarmente, insieme agli altri componenti dello stile di vita sano, possono aiutarti a riportare il peso nella norma e a ridurre il rischio di sviluppare i tumori.

Ecco qualche consiglio:

una abbondante porzione di verdura fornisce pochissime calorie: se ti abitui a saziarti di verdure, potrai ridurre il consumo di alimenti più calorici. Dai la precedenza a vegetali, frutta, cereali integrali e legumi, variando più che puoi i tipi e i colori della frutta e della verdura, che segnalano i loro diversi contenuti vitaminici e di altre sostanze antiossidanti. Ortaggi, legumi e cereali integrali sono anche ricchi di fibra, una componente importante della dieta, sia per il funzionamento intestinale che per la prevenzione di diabete, malattie cardiovascolari e tumori.

riduci il consumo di alimenti molto calorici, ricchi di zuccheri semplici e di grassi saturi (burro, lardo, salumi e carni grasse, olio di palma). L’eccesso di alimenti ricchi di energia, abbinato a poco movimento, porta inevitabilmente all’aumento di peso, un importante fattore di rischio per il tumore della mammella.

se non vuoi rinunciare ai tuoi alimenti preferiti, riduci la porzione, togli la glassa dalla fetta di torta, non aggiungere zucchero alle bevande, bevi acqua e non bibite!

muoviti regolarmente, aumentando gradualmente il livello di attività fisica.

Segui i consigli dati nella sezione prevenzione di questa APP e se non riesci a perdere peso consulta un dietista, nutrizionista o un medico. Se vuoi avere consigli per una corretta alimentazione puoi rivolgerti alla LILT Firenze
(vedi sezione "About LILT" per contatti ed email)`;

const bmiObese = `Attenzione, il tuo peso è maggiore di quello considerato normale e ti trovi attualmente in una condizione di obesità: il peso in eccesso è un fattore di rischio per il tumore della mammella, soprattutto in post-menopausa.

Una dieta sana, insieme agli altri componenti dello stile di vita sano, può aiutarti a riportare il peso nella norma e a ridurre il rischio di sviluppare i tumori, anche se il legame diretto con il tumore della mammella non è così evidente.

È importante correre ai ripari subito ed iniziare a ridurre il peso corporeo: cambiamenti graduali dello stile di vita hanno un effetto più duraturo rispetto alle diete drastiche che fanno perdere il peso velocemente, ma non determinano cambiamenti stabili dello stile di vita.

Ecco qualche consiglio:

una abbondante porzione di verdura fornisce pochissime calorie: se ti abitui a saziarti di verdure, potrai ridurre il consumo di alimenti più calorici. Dai la precedenza a vegetali, frutta, cereali integrali e legumi, variando più che puoi i tipi e i colori della frutta e della verdura, che segnalano i loro diversi contenuti vitaminici e di altre sostanze antiossidanti. Ortaggi, legumi e cereali integrali sono anche ricchi di fibra, una componente importante della dieta, sia per il funzionamento intestinale che per la prevenzione di diabete, malattie cardiovascolari e tumori.

riduci il consumo di alimenti molto calorici, ricchi di zuccheri semplici e di grassi saturi (burro, lardo, salumi e carni grasse, olio di palma). L’eccesso di alimenti ricchi di energia, abbinato a poco movimento, porta inevitabilmente all’aumento di peso, un importante fattore di rischio per il tumore della mammella.`;
/* -------------------------------------------------------------------------- */


const wrap = (text) => {
  return (
    <Text style={myStyle.parText}>
      {text}
    </Text>
  );
};


const paragraphs = {
  // screening
  screeningYesLessThan45: wrap(screeningYesLessThan45),
  screeningYesFrom45To49: wrap(screeningYesFrom45To49),
  screeningYesFrom50To69: wrap(screeningYesFrom50To69),
  screeningYesFrom70To74: wrap(screeningYesFrom70To74),
  screeningYesMoreThan74: wrap(screeningYesMoreThan74),
  screeningNoLessThan45: wrap(screeningNoLessThan45),
  screeningNoFrom45To74: wrap(screeningNoFrom45To74),
  screeningNoMoreThan74: wrap(screeningNoMoreThan74),
  // mammografia
  mammografiaYesLessThan45: wrap(mammografiaYesLessThan45),
  mammografiaYesFrom45To49: wrap(mammografiaYesFrom45To49),
  mammografiaYesFrom50To69: wrap(mammografiaYesFrom50To69),
  mammografiaYesFrom70To74: wrap(mammografiaYesFrom70To74),
  mammografiaYesMoreThan74: wrap(mammografiaYesMoreThan74),
  mammografiaNoLessThan45: wrap(mammografiaNoLessThan45),
  mammografiaNoFrom45To49: wrap(mammografiaNoFrom45To49),
  mammografiaNoFrom50To74: wrap(mammografiaNoFrom50To74),
  mammografiaNoMoreThan74: wrap(mammografiaNoMoreThan74),
  // tumore
  tumoreYes: wrap(tumoreYes),
  tumoreNo: wrap(tumoreNo),
  // fumo
  fumoYes: wrap(fumoYes),
  fumoYesInThePast: wrap(fumoYesInThePast),
  fumoNo: wrap(fumoNo),
  // alcool
  alcoolNo: wrap(alcoolNo),
  alcoolYesLessThan1: wrap(alcoolYesLessThan1),
  alcoolYesMoreThan1: wrap(alcoolYesMoreThan1),
  // fitness
  fitnessNo: wrap(fitnessNo),
  fitnessYesModerate: wrap(fitnessYesModerate),
  fitnessYesIntense,
  // bmi
  bmiUnderweight: wrap(bmiUnderweight),
  bmiNormalweight: wrap(bmiNormalweight),
  bmiOverweight: wrap(bmiOverweight),
  bmiObese: wrap(bmiObese),
};

module.exports = paragraphs;
