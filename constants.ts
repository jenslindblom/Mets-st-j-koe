import { Question, QuestionType, Difficulty, Species } from './types';

export const EXAM_QUESTION_COUNT = 60;
export const PASS_MARK = 45;
export const EXAM_TIME_LIMIT = 90 * 60;

export const SPECIES_DB: Species[] = [
  // =========================
  // HIRVIELÄIMET / SORKKAELÄIMET
  // =========================
  { name: 'Hirvi', latin: 'Alces alces', en: 'moose', group: 'Hirvieläimet', info: 'Suomen suurin nisäkäs. Tunnista koosta, kyhmyisestä turvasta ja vaaleista jaloista.', commonsCategory: 'Category:Alces_alces' },
  { name: 'Valkohäntäpeura', latin: 'Odocoileus virginianus', en: 'white-tailed deer', group: 'Hirvieläimet', info: 'Tunnista pystyyn nousevasta, alta lumivalkoisesta hännästä.', commonsCategory: 'Category:Odocoileus_virginianus' },
  { name: 'Metsäkauris', latin: 'Capreolus capreolus', en: 'roe deer', group: 'Hirvieläimet', info: 'Pieni koko, ei häntää, valkoinen peräpeili. Lyhyet pystyt sarvet.', commonsCategory: 'Category:Capreolus_capreolus' },
  { name: 'Metsäpeura', latin: 'Rangifer tarandus fennicus', en: 'Finnish forest reindeer', group: 'Hirvieläimet', info: 'Siro ja pitkäjalkainen verrattuna poroon. Sarvet kapeat.', commonsCategory: 'Category:Rangifer_tarandus_fennicus' },
  { name: 'Kuusipeura', latin: 'Dama dama', en: 'fallow deer', group: 'Hirvieläimet', info: 'Täplikäs turkki, lapiomaiset sarvet.', commonsCategory: 'Category:Dama_dama' },
  { name: 'Villisika', latin: 'Sus scrofa', en: 'wild boar', group: 'Hirvieläimet', info: 'Tunnista jykevästä rungosta, kärsästä ja usein tummasta harjaksesta.', commonsCategory: 'Category:Sus_scrofa' },

  { name: 'Saksanhirvi', latin: 'Cervus elaphus', en: 'red deer', group: 'Hirvieläimet', info: 'Suuri hirvieläin. Uroksella monihaaraiset sarvet (”kruunu”).', commonsCategory: 'Category:Cervus_elaphus' },
  { name: 'Japaninpeura', latin: 'Cervus nippon', en: 'sika deer', group: 'Hirvieläimet', info: 'Keskikokoinen peura. Usein täpläinen turkki ja vaalea peräpeili.', commonsCategory: 'Category:Cervus_nippon' },
  { name: 'Mufloni', latin: 'Ovis orientalis musimon', en: 'mouflon', group: 'Hirvieläimet', info: 'Villilampaan tyyppinen. Uroksella voimakkaasti kiertyneet sarvet.', commonsCategory: 'Category:Ovis_orientalis_musimon' },

  // =========================
  // JÄNISELÄIMET & JYRSIJÄT
  // =========================
  { name: 'Villikani', latin: 'Oryctolagus cuniculus', en: 'European rabbit', group: 'Jäniseläimet & jyrsijät', info: 'Kani on yleensä pienempi ja pyöreämpi kuin jänikset. Korvat suhteessa lyhyemmät.', commonsCategory: 'Category:Oryctolagus_cuniculus' },
  { name: 'Metsäjänis', latin: 'Lepus timidus', en: 'mountain hare', group: 'Jäniseläimet & jyrsijät', info: 'Talviturkki vaalenee/valkenee. Korvan kärjet usein tummat. Suomessa yleinen.', commonsCategory: 'Category:Lepus_timidus' },
  { name: 'Rusakko', latin: 'Lepus europaeus', en: 'brown hare', group: 'Jäniseläimet & jyrsijät', info: 'Isompi ja pitkäkorvaisempi kuin metsäjänis. Talvella yleensä ruskea.', commonsCategory: 'Category:Lepus_europaeus' },
  { name: 'Orava', latin: 'Sciurus vulgaris', en: 'red squirrel', group: 'Jäniseläimet & jyrsijät', info: 'Tunnista tuuheasta hännästä ja usein korvatupsuista. Väritys vaihtelee.', commonsCategory: 'Category:Sciurus_vulgaris' },
  { name: 'Euroopanmajava', latin: 'Castor fiber', en: 'Eurasian beaver', group: 'Jäniseläimet & jyrsijät', info: 'Iso jyrsijä. Tunnista leveästä, litteästä hännästä ja patoamisesta.', commonsCategory: 'Category:Castor_fiber' },
  { name: 'Kanadanmajava', latin: 'Castor canadensis', en: 'North American beaver', group: 'Jäniseläimet & jyrsijät', info: 'Majava kuten euroopanmajava, mutta laji eri.', commonsCategory: 'Category:Castor_canadensis' },
  { name: 'Piisami', latin: 'Ondatra zibethicus', en: 'muskrat', group: 'Jäniseläimet & jyrsijät', info: 'Vesistöjen jyrsijä. Pitkä, sivuilta litteä häntä.', commonsCategory: 'Category:Ondatra_zibethicus' },
  { name: 'Rämemajava', latin: 'Myocastor coypus', en: 'coypu (nutria)', group: 'Jäniseläimet & jyrsijät', info: 'Iso vesijyrsijä. Usein oranssit etuhampaat.', commonsCategory: 'Category:Myocastor_coypus' },

  // =========================
  // METSÄKANALINNUT
  // =========================
  { name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras ruskeankirjava.', commonsCategory: 'Category:Tetrao_urogallus' },
  { name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö.', commonsCategory: 'Category:Lyrurus_tetrix' },
  { name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava.', commonsCategory: 'Category:Tetrastes_bonasia' },
  { name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen.', commonsCategory: 'Category:Lagopus_lagopus' },
  { name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturialueiden laji.', commonsCategory: 'Category:Lagopus_muta' },
  { name: 'Peltopyy', latin: 'Perdix perdix', en: 'grey partridge', group: 'Metsäkanalinnut', info: 'Peltomaisemien kanalintu.', commonsCategory: 'Category:Perdix_perdix' },
  { name: 'Fasaani', latin: 'Phasianus colchicus', en: 'common pheasant', group: 'Metsäkanalinnut', info: 'Uroksella näyttävä väritys.', commonsCategory: 'Category:Phasianus_colchicus' },

  // =========================
  // VESILINNUT
  // =========================
  { name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa.', commonsCategory: 'Category:Anas_platyrhynchos' },
  { name: 'Tavi', latin: 'Anas crecca', en: 'common teal', group: 'Vesilinnut', info: 'Pienikokoinen sorsa.', commonsCategory: 'Category:Anas_crecca' },
  { name: 'Heinätavi', latin: 'Spatula querquedula', en: 'garganey', group: 'Vesilinnut', info: 'Vaalea kulmakarvajuova.', commonsCategory: 'Category:Spatula_querquedula' },
  { name: 'Haapana', latin: 'Mareca penelope', en: 'Eurasian wigeon', group: 'Vesilinnut', info: 'Punaruskea pää.', commonsCategory: 'Category:Mareca_penelope' },
  { name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern pintail', group: 'Vesilinnut', info: 'Pitkä pyrstö.', commonsCategory: 'Category:Anas_acuta' },
  { name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'northern shoveler', group: 'Vesilinnut', info: 'Lusikkamainen nokka.', commonsCategory: 'Category:Spatula_clypeata' },
  { name: 'Punasotka', latin: 'Aythya ferina', en: 'common pochard', group: 'Vesilinnut', info: 'Sukeltajasorsa.', commonsCategory: 'Category:Aythya_ferina' },
  { name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted duck', group: 'Vesilinnut', info: 'Päässä töyhtö.', commonsCategory: 'Category:Aythya_fuligula' },
  { name: 'Telkkä', latin: 'Bucephala clangula', en: 'common goldeneye', group: 'Vesilinnut', info: 'Valkoinen poskilaikku.', commonsCategory: 'Category:Bucephala_clangula' },
  { name: 'Haahka', latin: 'Somateria mollissima', en: 'common eider', group: 'Vesilinnut', info: 'Suuri merisorsa.', commonsCategory: 'Category:Somateria_mollissima' },
  { name: 'Alli', latin: 'Clangula hyemalis', en: 'long-tailed duck', group: 'Vesilinnut', info: 'Pitkä pyrstö.', commonsCategory: 'Category:Clangula_hyemalis' },
  { name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Pitkä punainen nokka.', commonsCategory: 'Category:Mergus_merganser' },
  { name: 'Tukkakoskelo', latin: 'Mergus serrator', en: 'red-breasted merganser', group: 'Vesilinnut', info: 'Töyhtöinen.', commonsCategory: 'Category:Mergus_serrator' },
  { name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean goose', group: 'Vesilinnut', info: 'Musta-oranssi nokka.', commonsCategory: 'Category:Anser_fabalis' },
  { name: 'Merihanhi', latin: 'Anser anser', en: 'greylag goose', group: 'Vesilinnut', info: 'Oranssi nokka.', commonsCategory: 'Category:Anser_anser' },
  { name: 'Kanadanhanhi', latin: 'Branta canadensis', en: 'Canada goose', group: 'Vesilinnut', info: 'Musta kaula.', commonsCategory: 'Category:Branta_canadensis' },

  // =========================
  // PIENPEDOT
  // =========================
  { name: 'Kettu', latin: 'Vulpes vulpes', en: 'red fox', group: 'Pienpedot', info: 'Punainen turkki.', commonsCategory: 'Category:Vulpes_vulpes' },
  { name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon dog', group: 'Pienpedot', info: 'Musta naamarikuvio.', commonsCategory: 'Category:Nyctereutes_procyonoides' },
  { name: 'Mäyrä', latin: 'Meles meles', en: 'European badger', group: 'Pienpedot', info: 'Valkoiset juovat.', commonsCategory: 'Category:Meles_meles' },
  { name: 'Näätä', latin: 'Martes martes', en: 'pine marten', group: 'Pienpedot', info: 'Keltainen kurkkulaikku.', commonsCategory: 'Category:Martes_martes' },
  { name: 'Minkki', latin: 'Neovison vison', en: 'American mink', group: 'Pienpedot', info: 'Tumma turkki.', commonsCategory: 'Category:Neovison_vison' },
  { name: 'Pesukarhu', latin: 'Procyon lotor', en: 'raccoon', group: 'Pienpedot', info: 'Naamio kasvoissa.', commonsCategory: 'Category:Procyon_lotor' },
  { name: 'Kärppä', latin: 'Mustela erminea', en: 'stoat', group: 'Pienpedot', info: 'Musta hännänpää.', commonsCategory: 'Category:Mustela_erminea' },
  { name: 'Hilleri', latin: 'Mustela putorius', en: 'European polecat', group: 'Pienpedot', info: 'Vaalea kuono.', commonsCategory: 'Category:Mustela_putorius' },
  { name: 'Saukko', latin: 'Lutra lutra', en: 'Eurasian otter', group: 'Pienpedot', info: 'Virtaviivainen.', commonsCategory: 'Category:Lutra_lutra' },

  // =========================
  // SUURPEDOT
  // =========================
  { name: 'Susi', latin: 'Canis lupus', en: 'wolf', group: 'Suurpedot', info: 'Koiramainen.', commonsCategory: 'Category:Canis_lupus' },
  { name: 'Tarhattu naali', latin: 'Vulpes lagopus', en: 'Arctic fox', group: 'Suurpedot', info: 'Pienikokoinen.', commonsCategory: 'Category:Vulpes_lagopus' },
  { name: 'Karhu', latin: 'Ursus arctos', en: 'brown bear', group: 'Suurpedot', info: 'Massiivinen.', commonsCategory: 'Category:Ursus_arctos' },
  { name: 'Ahma', latin: 'Gulo gulo', en: 'wolverine', group: 'Suurpedot', info: 'Jykevä.', commonsCategory: 'Category:Gulo_gulo' },
  { name: 'Ilves', latin: 'Lynx lynx', en: 'Eurasian lynx', group: 'Suurpedot', info: 'Korvatupsut.', commonsCategory: 'Category:Lynx_lynx' },

  // =========================
  // HYLKEET
  // =========================
  { name: 'Itämeren norppa', latin: 'Pusa hispida botnica', en: 'Baltic ringed seal', group: 'Hylkeet', info: 'Pieni hylje.', commonsCategory: 'Category:Pusa_hispida_botnica' },
  { name: 'Kirjohylje', latin: 'Phoca vitulina', en: 'harbour seal', group: 'Hylkeet', info: 'Täpläinen.', commonsCategory: 'Category:Phoca_vitulina' },
  { name: 'Halli', latin: 'Halichoerus grypus', en: 'grey seal', group: 'Hylkeet', info: 'Pitkä kuono.', commonsCategory: 'Category:Halichoerus_grypus' },

  // =========================
  // MUUT RIISTALINNUT
  // =========================
  { name: 'Sepelkyyhky', latin: 'Columba palumbus', en: 'common wood pigeon', group: 'Muut riistalinnut', info: 'Valkoinen kaulalaikku.', commonsCategory: 'Category:Columba_palumbus' },
  { name: 'Nokikana', latin: 'Fulica atra', en: 'Eurasian coot', group: 'Muut riistalinnut', info: 'Valkoinen otsakilpi.', commonsCategory: 'Category:Fulica_atra' },
  { name: 'Lehtokurppa', latin: 'Scolopax rusticola', en: 'Eurasian woodcock', group: 'Muut riistalinnut', info: 'Pitkä nokka.', commonsCategory: 'Category:Scolopax_rusticola' },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on tärkein sääntö asetta ylitettäessä estettä (esim. aita)?',
    options: [
      'Asetta pidetään vireessä valmiina',
      'Ase tyhjennetään ja taitetaan/avataan lukko',
      'Ase heitetään esteen yli pehmeälle alustalle',
      'Asetta pidetään hihnasta selässä'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuus vaatii, että ase on tyhjä ja toiminta tehty mahdottomaksi esteitä ylitettäessä.'
  }
  ,
  {
    id: 'q2',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: 'Mikä on turvallisen aseenkäsittelyn peruslähtökohta aina ja kaikkialla?',
    options: [
      'Ase on turvallinen, jos se on kotelossa',
      'Ase oletetaan aina ladatuksi',
      'Ase on turvallinen, jos varmistin on päällä',
      'Ase on turvallinen, jos lipas on irrotettu'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuuden perussääntö: älä koskaan oleta asetta lataamattomaksi, vaan toimi kuin se olisi ladattu ja tarkista itse. (Riistainfo)'
  },
  {
    id: 'q3',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: 'Mitä aseen piipulla ei saa koskaan tehdä?',
    options: [
      'Osoittaa mitään sellaista kohti, mitä et aio ampua',
      'Osoittaa maata kohti',
      'Osoittaa maalia kohti ennen ampumapäätöstä',
      'Osoittaa taivasta kohti'
    ],
    correctIndex: 0,
    explanation: 'Perussääntö: älä koskaan osoita piipulla mitään, mitä et ole valmis ampumaan. (Riistainfo)'
  },
  {
    id: 'q4',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on oikea toiminta liipaisinsormen suhteen?',
    options: [
      'Sormi pidetään liipaisimella aina kun ase on kädessä',
      'Sormi pidetään liipaisinkaarella, kun varmistin on päällä',
      'Sormi pidetään pois liipaisimelta, kunnes aiot ampua',
      'Sormi pidetään liipaisimella vain juostessa'
    ],
    correctIndex: 2,
    explanation: 'Sormi pidetään pois liipaisimelta kunnes tähtäät ja olet aikeissa ampua. (Riistainfo)'
  },
  {
    id: 'q5',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mitä “ole varma kohteesta” tarkoittaa käytännössä ennen laukausta?',
    options: [
      'Riittää, että näet eläimen siluetin',
      'Varmistat lajin lisäksi myös turvallisen taustan ja ampumasektorin',
      'Varmistat vain etäisyyden',
      'Varmistat vain että ase on ladattu'
    ],
    correctIndex: 1,
    explanation: 'Turvallinen laukaus edellyttää varmuutta kohteesta sekä taustasta/ampumasektorista. (Riistainfo)'
  },
  {
    id: 'q6',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: 'Kun metsästetään veneestä, mikä on turvallisin yleisperiaate ampujan suhteen?',
    options: [
      'Kaikki voivat ampua samanaikaisesti eri suuntiin',
      'Vain yksi toimii ampujana kerrallaan',
      'Aina nuorin ampuu',
      'Aina se ampuu, jolla on isoin ase'
    ],
    correctIndex: 1,
    explanation: 'Veneestä metsästäessä turvallisinta on, että vain yksi henkilö toimii ampujana kerrallaan. (Riistainfo)'
  },
  {
    id: 'q7',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Jos kuljetat mukanasi useampaa asetta, mikä on turvallinen perusohje lataamisen suhteen?',
    options: [
      'Kaikki aseet ladattuina, jotta ollaan valmiina',
      'Vain käsissä oleva ase voi olla ladattuna, muut lataamattomina',
      'Vain pisin ase ladattuna',
      'Vain haulikko ladattuna'
    ],
    correctIndex: 1,
    explanation: 'Yleisohje: jos mukana on useampia aseita, korkeintaan käsissä oleva ase on ladattuna ja muut lataamattomina. (Riistainfo)'
  },

  {
    id: 'q8',
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: 'Mikä on poliisin ohjeiden mukaan keskeinen velvollisuus ampuma-aseiden säilytyksessä?',
    options: [
      'Aseet säilytetään aina autossa lukittuna',
      'Aseet säilytetään turvakaapissa tai poliisin hyväksymässä säilytystilassa (tilanteen mukaan)',
      'Aseet säilytetään aina näkyvillä',
      'Aseet säilytetään ladattuina nopeaa käyttöä varten'
    ],
    correctIndex: 1,
    explanation: 'Poliisi korostaa velvollisuutta säilyttää aseet turvakaapissa tai poliisin hyväksymässä säilytystilassa säädettyjen edellytysten mukaan. (Poliisi)'
  },
  {
    id: 'q9',
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on hyvä periaate patruunoiden säilytyksessä kotona?',
    options: [
      'Patruunat voidaan säilyttää vapaasti missä vain',
      'Patruunat säilytetään erillään aseista siten, etteivät ne joudu asiattomille',
      'Patruunat säilytetään aina lippaassa aseessa',
      'Patruunat säilytetään ulkovarastossa kosteuden vuoksi'
    ],
    correctIndex: 1,
    explanation: 'Patruunat tulee säilyttää erillään aseista niin, etteivät ne joudu asiattomien haltuun. (Poliisi / yleiset säilytysohjeet)'
  },
  {
    id: 'q10',
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä väite kuvaa parhaiten aseen kuljettamisen turvallista periaatetta?',
    options: [
      'Ase kuljetetaan aina ladattuna, koska varmistin riittää',
      'Ase kuljetetaan lataamattomana ja suojattuna (esim. pussissa/kotelossa) hyväksyttävästä syystä',
      'Ase voidaan jättää valvomatta taukopaikalle',
      'Ase kuljetetaan aina näkyvillä, jotta muut huomaavat'
    ],
    correctIndex: 1,
    explanation: 'Kuljetuksessa korostuu lataamattomuus, suojaaminen ja hyväksyttävä syy (matkalla metsälle/ampumaradalle). (Poliisin ohjeet)'
  },

  {
    id: 'q11',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Mitä metsästyslaki soveltamisalan perusteella koskee?',
    options: [
      'Vain ampumaratatoimintaa',
      'Metsästystä sekä rauhoittamattomien eläinten pyydystämistä ja tappamista, sekä riistanhoitoa',
      'Vain kalastusta',
      'Vain luonnonvalokuvausta'
    ],
    correctIndex: 1,
    explanation: 'Metsästyslaki soveltuu metsästykseen, rauhoittamattomien eläinten pyydystämiseen/tappamiseen sekä riistanhoitoon. (Finlex)'
  },
  {
    id: 'q12',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on turvallinen ja laillinen peruslähtökohta, jos et ole varma onko jokin pyyntitapa sallittu?',
    options: [
      'Toimit ja tarkistat myöhemmin',
      'Kysyt satunnaiselta keskustelupalstalta',
      'Varmistat asian luotettavasta lähteestä (esim. Finlex / Riistakeskus) ennen toimintaa',
      'Teet kuten “aina ennenkin”'
    ],
    correctIndex: 2,
    explanation: 'Epäselvissä tilanteissa toiminta varmistetaan virallisista lähteistä ennen kuin tehdään mitään. (Finlex / Riistainfo)'
  },

  {
    id: 'q13',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: 'Mikä on metsästyksen eettinen perusajatus eläimen kannalta?',
    options: [
      'Tavoitellaan mahdollisimman suurta saalismäärää',
      'Minimoidaan eläimen tarpeeton kärsimys',
      'Toimitaan niin nopeasti kuin mahdollista, vaikka olisi epävarmaa',
      'Jätetään haavoittunut eläin oman onnensa nojaan'
    ],
    correctIndex: 1,
    explanation: 'Vastuullinen metsästys pyrkii minimoimaan tarpeettoman kärsimyksen ja toimimaan huolellisesti. (Riistainfo)'
  },
  {
    id: 'q14',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: 'Miksi saaliin huolellinen käsittely on myös eettinen asia?',
    options: [
      'Koska se vaikuttaa riistan hyödyntämiseen ja hävikin minimointiin',
      'Koska se tekee metsästyksestä jännittävämpää',
      'Koska se liittyy vain ruoan ulkonäköön',
      'Koska se korvaa turvallisuuskoulutuksen'
    ],
    correctIndex: 0,
    explanation: 'Huolellinen käsittely tukee saaliin hyödyntämistä ja vähentää hävikkiä – osa vastuullisuutta. (Riistainfo)'
  },

  // --- lisää REGULATION (6) ---
  {
    id: 'q15',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Miksi metsästäjäkokeessa kysytään lainsäädännöstä?',
    options: [
      'Koska metsästys on säädeltyä toimintaa ja metsästäjän on tunnettava velvollisuutensa ja rajat',
      'Koska metsästys on sama asia kuin jokamiehenoikeudet',
      'Koska laki kertoo parhaat metsästysreseptit',
      'Koska laki korvaa käytännön taidot'
    ],
    correctIndex: 0,
    explanation: 'Metsästys on luvanvaraista ja säädeltyä; metsästäjän on tunnettava oikeudet, velvollisuudet ja rajoitukset. (Riistainfo / Finlex)'
  },
  {
    id: 'q16',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Mikä seuraavista ei kuulu jokamiehenoikeuksiin Suomessa?',
    options: [
      'Kävellen liikkuminen luonnossa tietyin ehdoin',
      'Marjojen ja sienten poiminta tietyin ehdoin',
      'Metsästysoikeus',
      'Tilapäinen oleskelu luonnossa tietyin ehdoin'
    ],
    correctIndex: 2,
    explanation: 'Metsästysoikeus ei kuulu jokamiehenoikeuksiin; metsästys edellyttää metsästysoikeutta/lupaa. (Yleinen oikeusperiaate; metsästyslaki soveltamisala)'
  },

  // --- lisää SAFETY (7) ---
  {
    id: 'q17',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on hyvä käytäntö ennen kuin annat aseen toiselle henkilölle?',
    options: [
      'Pidät varmistimen päällä ja annat aseen',
      'Tarkistat ja näytät, että ase on tyhjä (pesä/patruunapesä)',
      'Pidät sormen liipaisimella ja annat aseen',
      'Suljet lukon ja annat aseen'
    ],
    correctIndex: 1,
    explanation: 'Ase luovutetaan vasta, kun se on tarkistettu tyhjäksi ja asia on selvästi havaittavissa. (Turvallisuusperiaatteet)'
  },
  {
    id: 'q18',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: 'Mikä on turvallisin toimintatapa, jos aseessa tulee toimintahäiriö?',
    options: [
      'Käännät piipun kohti kaveria ja pyydät apua',
      'Pidät piipun turvalliseen suuntaan ja toimit aseen käyttöohjeiden mukaisesti rauhallisesti',
      'Avaat lukon nopeasti miten sattuu',
      'Lyöt asetta maahan, jotta patruuna irtoaa'
    ],
    correctIndex: 1,
    explanation: 'Toimintahäiriössä korostuu piipun suunta, rauhallisuus ja hallittu toiminta. (Turvallisuusperiaatteet)'
  },
  {
    id: 'q19',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: 'Mikä on turvallinen tapa kantaa asetta ryhmässä liikuttaessa?',
    options: [
      'Piippu vaihtelee suuntaa, kunhan varmistin on päällä',
      'Piippu pidetään johdonmukaisesti turvalliseen suuntaan ja ase tyhjänä siirtymillä',
      'Ase kannetaan aina ladattuna, jotta ei menetetä mahdollisuuksia',
      'Ase kannetaan aina kohti maalia'
    ],
    correctIndex: 1,
    explanation: 'Siirtymillä ase pidetään tyhjänä ja piippu turvalliseen suuntaan – ryhmässä korostuu ennakoitavuus. (Riistainfo / turvallisuus)'
  },
  {
    id: 'q20',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mitä tarkoittaa “ampumasektori” turvallisuudessa?',
    options: [
      'Alue, josta eläin voi tulla',
      'Alue, jonne on turvallista ampua (huomioiden tausta ja muut ihmiset)',
      'Ainoastaan etäisyysmittarin näyttämä',
      'Alue, jossa koira liikkuu'
    ],
    correctIndex: 1,
    explanation: 'Ampumasektori tarkoittaa aluetta, jossa laukaus on turvallinen: tausta ja muiden sijainti huomioidaan. (Turvallisuusperiaatteet)'
  },

  // --- lisää GEAR (6) ---
  {
    id: 'q21',
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: 'Miksi aseen kunto ja huolto liittyvät turvallisuuteen?',
    options: [
      'Huolto vaikuttaa vain ulkonäköön',
      'Huolto vähentää toimintahäiriöitä ja parantaa hallittua toimintaa',
      'Huolto on tärkeää vain kilpailuissa',
      'Huolto tekee aseesta aina tarkemman kuin muut'
    ],
    correctIndex: 1,
    explanation: 'Huolto ja kunto vähentävät toimintahäiriöitä ja vaaratilanteita. (Turvallisuusperiaatteet)'
  },
  {
    id: 'q22',
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on hyvä periaate, jos aseita on useita tai mukana on erityisen vaarallinen ampuma-ase?',
    options: [
      'Säilytys voi olla vapaamuotoista',
      'Säilytysvaatimukset tiukentuvat (esim. turvakaappi tai hyväksytyt säilytystilat)',
      'Aseet pitää aina säilyttää ladattuina',
      'Aseet pitää aina säilyttää ulkovarastossa'
    ],
    correctIndex: 1,
    explanation: 'Poliisin ohjeissa korostuu, että tietyissä tilanteissa säilytysvaatimukset ovat tiukemmat (turvakaappi / hyväksytyt tilat). (Poliisi)'
  },

  // --- lisää ETHICS (6) ---
  {
    id: 'q23',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: 'Mitä tarkoittaa vastuullinen toiminta, jos laukaus on epävarma (esim. huono näkyvyys)?',
    options: [
      'Ammut silti, koska mahdollisuus voi mennä ohi',
      'Odotat parempaa tilannetta tai jätät ampumatta',
      'Ammut varoituslaukauksen kohti maalia',
      'Ammut vain jos kaveri käskee'
    ],
    correctIndex: 1,
    explanation: 'Vastuullisuus tarkoittaa, että epävarmassa tilanteessa ei ammuta. (Turvallisuus + etiikka, Riistainfo)'
  },
  {
    id: 'q24',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: 'Miksi metsästyksen turvallisuus on myös eettinen kysymys?',
    options: [
      'Koska se tekee metsästyksestä hitaampaa',
      'Koska se suojaa sekä ihmisiä että eläimiä tarpeettomilta vahingoilta',
      'Koska se liittyy vain varusteiden hintaan',
      'Koska se on vain muodollisuus'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuus ehkäisee vahinkoja ja on siten myös eettisesti välttämätöntä. (Riistainfo / Metsästäjäliitto)'
  }

  ,
  {
    id: 'q25',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on turvallinen toimintatapa, kun saavut passipaikalle?',
    options: [
      'Lataat aseen jo autolla',
      'Lataat aseen vasta passipaikalla, kun suunta ja toiminta ovat hallinnassa',
      'Pidät aseen ladattuna koko ajan ja liikut nopeasti',
      'Et koskaan tarkista aseen tilaa'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuusperiaate: ase ladataan vasta kun toiminta alkaa ja aseen suunta sekä ympäristö ovat hallinnassa. (Riistainfo)'
  },
  {
    id: 'q26',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: 'Mikä on turvallinen periaate, jos metsästyksessä on mukana koira ja ihmiset liikkuvat maastossa?',
    options: [
      'Ampua saa aina, kun näkee liikettä',
      'Ampua saa vain kun kohde ja tausta ovat täysin varmistettu, eikä ampumasektorissa ole koiraa tai ihmisiä',
      'Koira kyllä väistää',
      'Jos koira haukkuu, voi ampua sokkona'
    ],
    correctIndex: 1,
    explanation: 'Kohde ja tausta varmistetaan aina; koira tai ihmiset ampumasektorissa tekee laukauksesta vaarallisen. (Riistainfo turvallisuus)'
  },
  {
    id: 'q27',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Mikä on paras paikka tarkistaa metsästykseen liittyvä ajantasainen lainsäädäntö?',
    options: [
      'Finlex',
      'Satunnainen somepostaus',
      'Kaverin vanha muistiinpano',
      'Mainoslehti'
    ],
    correctIndex: 0,
    explanation: 'Ajantasainen lainsäädäntö tarkistetaan Finlexistä. (Finlex)'
  },
  {
    id: 'q28',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Miksi metsästyksen sääntöihin liittyvä “pikkutarkkuus” on tärkeää käytännössä?',
    options: [
      'Koska se tekee metsästyksestä elitististä',
      'Koska se vähentää riskejä ja varmistaa, että toimitaan lain ja vastuullisuuden mukaisesti',
      'Koska se lisää saalismäärää automaattisesti',
      'Koska se korvaa turvallisuussäännöt'
    ],
    correctIndex: 1,
    explanation: 'Sääntöjen tunteminen vähentää sekä turvallisuus- että laillisuusriskejä ja tukee vastuullista toimintaa. (Riistainfo / Finlex)'
  },
  {
    id: 'q29',
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on poliisin ohjeiden hengessä järkevä periaate aseen säilytyksen riskienhallinnassa?',
    options: [
      'Säilytä avaimet turvakaapin päällä',
      'Huolehdi, etteivät aseet tai avaimet joudu asiattomille',
      'Säilytä ase lataamattomana, mutta jätä se esille',
      'Säilytä ase aina autossa, jotta se on “turvassa”'
    ],
    correctIndex: 1,
    explanation: 'Keskeistä on estää aseiden (ja säilytyksen hallinnan) päätyminen asiattomille. (Poliisi)'
  },
  {
    id: 'q30',
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: 'Miksi näkyvä vaatetus on metsästyksessä usein turvallisuusvaruste?',
    options: [
      'Koska se näyttää hyvältä kuvissa',
      'Koska se parantaa havaittavuutta ja vähentää erehdyksen riskiä',
      'Koska se on pakollinen kaikissa lajeissa aina',
      'Koska se tekee äänettömäksi'
    ],
    correctIndex: 1,
    explanation: 'Havaittavuus pienentää erehdyksen riskiä ja tukee turvallista toimintaa. (Turvallisuusperiaatteet)'
  },
  {
    id: 'q31',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä kuvaa parhaiten “vastuullista päätöksentekoa” metsästyksessä?',
    options: [
      'Ammutaan aina kun on mahdollisuus',
      'Punnitaan oma osaaminen ja tilanteen varmuus – ja jätetään tarvittaessa ampumatta',
      'Luotetaan, että joku muu korjaa virheet',
      'Toimitaan vain perinteen mukaan'
    ],
    correctIndex: 1,
    explanation: 'Vastuullinen metsästäjä tunnistaa omat rajansa ja tilanteen riskit, eikä ammu epävarmasti. (Riistainfo)'
  },
  {
    id: 'q32',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.HARD,
    question: 'Miksi “nopea jälkitoiminta” (esim. tilanteen arvio ja tarvittaessa viipymätön toiminta) liittyy eettisyyteen?',
    options: [
      'Koska se parantaa some-sisältöä',
      'Koska se vähentää tarpeetonta kärsimystä ja parantaa saaliin hyödyntämistä',
      'Koska se on vain kilpailuissa tärkeää',
      'Koska se tekee metsästyksestä helpompaa'
    ],
    correctIndex: 1,
    explanation: 'Eettinen toiminta pyrkii minimoimaan kärsimystä ja hyödyntämään saaliin asianmukaisesti. (Riistainfo)'
  },
  {
    id: 'q33',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: 'Mitä teet ensimmäisenä, kun otat aseen käsiisi?',
    options: [
      'Tarkistat aseen tilan (onko se ladattu) ja varmistat turvallisen suunnan',
      'Laitat sormen liipaisimelle',
      'Katsot vain varmistinta',
      'Käännät piipun kohti maalia “valmiiksi”'
    ],
    correctIndex: 0,
    explanation: 'Perussääntö: tarkista aseen tila jokaisen käsittelykerran aluksi ja pidä piippu turvalliseen suuntaan. (Riistainfo)'
  },
  {
    id: 'q34',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on turvallinen toiminta, jos joku kävelee ampumasektorille yllättäen?',
    options: [
      'Jatkat tähtäämistä ja odotat',
      'Keskeytät tilanteen ja varmistat, ettei laukausta voi lähteä',
      'Ammut nopeasti ennen kuin hän ehtii pysähtyä',
      'Ammut varoituslaukauksen'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuus menee aina edelle: keskeytä ja varmista, ettei laukausta voi lähteä. (Turvallisuusperiaatteet)'
  },
  {
    id: 'q35',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on hyvä tapa rakentaa kestävä harjoituskysymyspankki lainsäädännöstä?',
    options: [
      'Kysytään vain metsästysaikojen päivämääriä',
      'Painotetaan periaatteita ja yleisiä sääntöjä, vältetään helposti muuttuvat detaljit',
      'Kysytään vain harvinaisia poikkeuksia',
      'Kysytään vain lain numerot ulkoa'
    ],
    correctIndex: 1,
    explanation: 'Periaatteet ja yleiset säännöt vanhenevat hitaammin kuin detaljit kuten päivämäärät. (Finlex / ylläpitoperiaate)'
  },
  {
    id: 'q36',
    type: QuestionType.GEAR,
    difficulty: Difficulty.HARD,
    question: 'Mikä on turvallisin tapa varmistaa, ettei ase päädy asiattoman käyttöön kotona?',
    options: [
      'Säilytät asekaapin avaimen helposti löydettävässä paikassa',
      'Säilytät aseen lukitussa säilytyksessä ja huolehdit myös avainten/avauskoodien hallinnasta',
      'Säilytät aseen piilossa sohvan alla',
      'Säilytät aseen ladattuna yöpöydällä'
    ],
    correctIndex: 1,
    explanation: 'Säilytys tarkoittaa sekä fyysistä lukitusta että sitä, etteivät avaimet/koodit päädy asiattomille. (Poliisi)'
  },
  {
    id: 'q37',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: 'Mikä on asiallinen suhtautuminen metsästyksen hyväksyttävyyteen muiden silmissä?',
    options: [
      'Se ei kuulu muille',
      'Vastuullisuus, turvallisuus ja saaliin hyödyntäminen ovat keskeisiä hyväksyttävyyden kannalta',
      'Tärkeintä on vain määrä',
      'Tärkeintä on vain trofee'
    ],
    correctIndex: 1,
    explanation: 'Metsästyksen hyväksyttävyys rakentuu vastuullisuudesta: turvallisuus, sääntöjen noudattaminen ja saaliin hyödyntäminen. (Riistainfo)'
  },
  {
    id: 'q38',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä on eettisesti hyvä toimintatapa saaliin hyödyntämisessä?',
    options: [
      'Hyödynnät saaliin mahdollisimman hyvin ja käsittelet sen huolellisesti',
      'Otat vain parhaat palat ja jätät loput',
      'Jätät saaliin aina luontoon',
      'Et välitä käsittelystä'
    ],
    correctIndex: 0,
    explanation: 'Huolellinen käsittely ja saaliin hyödyntäminen ovat vastuullisen metsästäjän perusasioita. (Riistainfo)'
  },
  {
    id: 'q39',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Mikä väite on oikein: miten suhtaudut “tyhjään aseeseen”?',
    options: [
      'Tyhjä ase on aina turvallinen osoittaa mihin vain',
      'Tyhjä asekin pidetään aina turvallisessa suunnassa',
      'Tyhjä ase on turvallinen, jos varmistin on päällä',
      'Tyhjä ase on turvallinen, jos lukko on kiinni'
    ],
    correctIndex: 1,
    explanation: 'Turvallisuussääntö pätee myös oletettuun tyhjään aseeseen: piippu turvalliseen suuntaan. (Riistainfo)'
  },
  {
    id: 'q40',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Mikä organisaatio Suomessa vastaa metsästäjätutkinnon järjestämisestä ja tutkintoon liittyvästä koulutustiedosta?',
    options: [
      'Suomen riistakeskus / Riistainfo (metsästäjätutkinto)',
      'Traficom',
      'THL',
      'Kela'
    ],
    correctIndex: 0,
    explanation: 'Metsästäjätutkinnon koulutussisällöt ja järjestämiseen liittyvä tieto löytyvät riistakeskuksen/Riistainfon kanavista. (Riistainfo)'
  },
  {
    id: 'q41',
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: 'Miksi “vain yksi ampuja kerrallaan” -periaate on tärkeä myös varusteiden ja roolien näkökulmasta ryhmässä?',
    options: [
      'Koska muuten tulee riitaa',
      'Koska roolit selkeytyvät ja vahinkoriskit pienenevät, kun vastuu ampumisesta on yhdellä kerrallaan',
      'Koska se lisää saalismäärää',
      'Koska se korvaa turvallisuussäännöt'
    ],
    correctIndex: 1,
    explanation: 'Selkeä roolitus vähentää sekaannusta ja riskejä, etenkin liikkuvissa tilanteissa (esim. vene). (Riistainfo)'
  }


];
