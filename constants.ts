import { Question, QuestionType, Difficulty, Species } from './types';

export const EXAM_QUESTION_COUNT = 60;
export const PASS_MARK = 45;
export const EXAM_TIME_LIMIT = 90 * 60;

export const SPECIES_DB: Species[] = [
  // =========================
  // HIRVIELÄIMET / SORKKAELÄIMET
  // =========================
{ name: 'Hirvi', latin: 'Alces alces', en: 'moose', group: 'Hirvieläimet', info: 'Suomen suurin nisäkäs. Tunnista koosta, kyhmyisestä turvasta ja vaaleista jaloista.', commonsCategory: 'Category:Alces_alces', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Alces%20alces%20(Linnaeus,%201758).jpg'] },
{ name: 'Valkohäntäpeura', latin: 'Odocoileus virginianus', en: 'white-tailed deer', group: 'Hirvieläimet', info: 'Tunnista pystyyn nousevasta, alta lumivalkoisesta hännästä.', commonsCategory: 'Category:Odocoileus_virginianus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/White-tailed%20deer.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Adult%20white%20tailed%20deer%20buck%20odocoileus%20virginianus.jpg'] },
{ name: 'Metsäkauris', latin: 'Capreolus capreolus', en: 'roe deer', group: 'Hirvieläimet', info: 'Pieni koko, ei häntää, valkoinen peräpeili. Lyhyet pystyt sarvet.', commonsCategory: 'Category:Capreolus_capreolus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Capreolus%20Capreolus%20(102611263).jpeg'] },
{ name: 'Metsäpeura', latin: 'Rangifer tarandus fennicus', en: 'Finnish forest reindeer', group: 'Hirvieläimet', info: 'Siro ja pitkäjalkainen verrattuna poroon. Sarvet kapeat.', commonsCategory: 'Category:Rangifer_tarandus_fennicus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Rangifer%20tarandus%20fennicus%20Mets%C3%A4peura%20IMG%205663%20C.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Rangifer%20tarandus%20fennicus%20(juvenile).jpg'] },
{ name: 'Kuusipeura', latin: 'Dama dama', en: 'fallow deer', group: 'Hirvieläimet', info: 'Täplikäs turkki, lapiomaiset sarvet.', commonsCategory: 'Category:Dama_dama', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Dama%20dama%2001.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Dama%20dama.JPG'] },
{ name: 'Villisika', latin: 'Sus scrofa', en: 'wild boar', group: 'Hirvieläimet', info: 'Tunnista jykevästä rungosta, kärsästä ja usein tummasta harjaksesta.', commonsCategory: 'Category:Sus_scrofa', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Wild%20Boar%20frontal.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Wild%20boar%20(Sus%20scrofa).jpg'] },
 
{ name: 'Saksanhirvi', latin: 'Cervus elaphus', en: 'red deer', group: 'Hirvieläimet', info: 'Suuri hirvieläin. Uroksella monihaaraiset sarvet (”kruunu”).', commonsCategory: 'Category:Cervus_elaphus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Male%20red%20deer%20(Cervus%20elaphus),%20Munich,%20Germany%20-%2020060530.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Cervus%20elaphus%20elaphus%20herd.jpg'] },
{ name: 'Japaninpeura', latin: 'Cervus nippon', en: 'sika deer', group: 'Hirvieläimet', info: 'Keskikokoinen peura. Usein täpläinen turkki ja vaalea peräpeili.', commonsCategory: 'Category:Cervus_nippon', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Cervus%20nippon%2001.jpg'] },
{ name: 'Mufloni', latin: 'Ovis orientalis musimon', en: 'mouflon', group: 'Hirvieläimet', info: 'Villilampaan tyyppinen. Uroksella voimakkaasti kiertyneet sarvet.', commonsCategory: 'Category:Ovis_orientalis_musimon', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Ovis%20orientalis%20musimon.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mufl%C3%B3n.jpg'] },
 
   // =========================
   // JÄNISELÄIMET & JYRSIJÄT
   // =========================
{ name: 'Villikani', latin: 'Oryctolagus cuniculus', en: 'European rabbit', group: 'Jäniseläimet & jyrsijät', info: 'Kani on yleensä pienempi ja pyöreämpi kuin jänikset. Korvat suhteessa lyhyemmät.', commonsCategory: 'Category:Oryctolagus_cuniculus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Oryctolagus%20cuniculus.jpg'] },
{ name: 'Metsäjänis', latin: 'Lepus timidus', en: 'mountain hare', group: 'Jäniseläimet & jyrsijät', info: 'Talviturkki vaalenee/valkenee. Korvan kärjet usein tummat. Suomessa yleinen.', commonsCategory: 'Category:Lepus_timidus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Lepus%20timidus%2001.JPG', 'https://commons.wikimedia.org/wiki/Special:FilePath/Lepus%20timidus%20Oulu%2020120428b.JPG'] },
{ name: 'Rusakko', latin: 'Lepus europaeus', en: 'brown hare', group: 'Jäniseläimet & jyrsijät', info: 'Isompi ja pitkäkorvaisempi kuin metsäjänis. Talvella yleensä ruskea.', commonsCategory: 'Category:Lepus_europaeus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/20220502%20Lepus%20europaeus.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Lepus%20europaeus%20Oulu%2020130716.JPG'] },
{ name: 'Orava', latin: 'Sciurus vulgaris', en: 'red squirrel', group: 'Jäniseläimet & jyrsijät', info: 'Tunnista tuuheasta hännästä ja usein korvatupsuista. Väritys vaihtelee.', commonsCategory: 'Category:Sciurus_vulgaris', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Sciurus%20vulgaris.jpg'] },
{ name: 'Euroopanmajava', latin: 'Castor fiber', en: 'Eurasian beaver', group: 'Jäniseläimet & jyrsijät', info: 'Iso jyrsijä. Tunnista leveästä, litteästä hännästä ja patoamisesta.', commonsCategory: 'Category:Castor_fiber', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Bever%20-%20Eurasian%20beaver%20-%20Castor%20fiber%205.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Eurasian%20beaver%20(Castor%20fiber)%20Wizna.jpg'] },
{ name: 'Kanadanmajava', latin: 'Castor canadensis', en: 'North American beaver', group: 'Jäniseläimet & jyrsijät', info: 'Majava kuten euroopanmajava, mutta laji eri.', commonsCategory: 'Category:Castor_canadensis', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Castor%20canadensis.jpg'] },
{ name: 'Piisami', latin: 'Ondatra zibethicus', en: 'muskrat', group: 'Jäniseläimet & jyrsijät', info: 'Vesistöjen jyrsijä. Pitkä, sivuilta litteä häntä.', commonsCategory: 'Category:Ondatra_zibethicus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Ondatra%20zibethicus%20CT.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ondatra%20zibethicus.jpg'] },
{ name: 'Rämemajava', latin: 'Myocastor coypus', en: 'coypu (nutria)', group: 'Jäniseläimet & jyrsijät', info: 'Iso vesijyrsijä. Usein oranssit etuhampaat.', commonsCategory: 'Category:Myocastor_coypus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Ragondin%20(Myocastor%20coypus)%20(39).jpg'] },
 
   // =========================
   // METSÄKANALINNUT
   // =========================
{ name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras ruskeankirjava.', commonsCategory: 'Category:Tetrao_urogallus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Tetrao%20urogallus.JPG'] },
{ name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö.', commonsCategory: 'Category:Lyrurus_tetrix', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Black%20Grouse%20-%20Finland%20050068%20(15357063249)%20A.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Korhoen%20-%20black%20grouse%20-%20Lyrurus%20tetrix%204.jpg'] },
{ name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava.', commonsCategory: 'Category:Tetrastes_bonasia', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Tetrastes%20bonasia.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Pyy%20(Tetrastes%20bonasia).jpg'] },
{ name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen.', commonsCategory: 'Category:Lagopus_lagopus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Male%20Willow%20Ptarmigan%20(Lagopus%20lagopus).jpg'] },
{ name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturialueiden laji.', commonsCategory: 'Category:Lagopus_muta', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Rock%20Ptarmigan%20(Lagopus%20Muta).jpg'] },
{ name: 'Peltopyy', latin: 'Perdix perdix', en: 'grey partridge', group: 'Metsäkanalinnut', info: 'Peltomaisemien kanalintu.', commonsCategory: 'Category:Perdix_perdix', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Perdix%20perdix%2001.JPG'] },
{ name: 'Fasaani', latin: 'Phasianus colchicus', en: 'common pheasant', group: 'Metsäkanalinnut', info: 'Uroksella näyttävä väritys.', commonsCategory: 'Category:Phasianus_colchicus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Phasianus%20colchicus%20female%20Vanhankaupunginlahti%20Finland.jpg'] },
 
   // =========================
   // VESILINNUT
   // =========================
{ name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa.', commonsCategory: 'Category:Anas_platyrhynchos', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Anas%20platyrhynchos%20male%20female.jpg'] },
{ name: 'Tavi', latin: 'Anas crecca', en: 'common teal', group: 'Vesilinnut', info: 'Pienikokoinen sorsa.', commonsCategory: 'Category:Anas_crecca', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Common%20teal%20(Anas%20crecca)%20male%202.jpg'] },
{ name: 'Heinätavi', latin: 'Spatula querquedula', en: 'garganey', group: 'Vesilinnut', info: 'Vaalea kulmakarvajuova.', commonsCategory: 'Category:Spatula_querquedula', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Garganey%20(Spatula%20querquedula)%20male%20and%20female%202.jpg'] },
{ name: 'Haapana', latin: 'Mareca penelope', en: 'Eurasian wigeon', group: 'Vesilinnut', info: 'Punaruskea pää.', commonsCategory: 'Category:Mareca_penelope', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Mareca%20penelope%20Oulu%2020110515%2002.jpg'] },
{ name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern pintail', group: 'Vesilinnut', info: 'Pitkä pyrstö.', commonsCategory: 'Category:Anas_acuta', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Anas%20acuta%20-Westham%20Island%20-Canada-8.jpg'] },
{ name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'northern shoveler', group: 'Vesilinnut', info: 'Lusikkamainen nokka.', commonsCategory: 'Category:Spatula_clypeata', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Spatula%20clypeata%20Oulu%20Finland%202016-05-07.jpg'] },
{ name: 'Punasotka', latin: 'Aythya ferina', en: 'common pochard', group: 'Vesilinnut', info: 'Sukeltajasorsa.', commonsCategory: 'Category:Aythya_ferina', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Aythya%20ferina%20(cropped).jpg'] },
{ name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted duck', group: 'Vesilinnut', info: 'Päässä töyhtö.', commonsCategory: 'Category:Aythya_fuligula', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Aythya%20Fuligula%20Oulu%2020120519.JPG'] },
{ name: 'Telkkä', latin: 'Bucephala clangula', en: 'common goldeneye', group: 'Vesilinnut', info: 'Valkoinen poskilaikku.', commonsCategory: 'Category:Bucephala_clangula', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Bucephala%20clangula%2018042024%20Kaijonlahti,%20Finland%2002.jpg'] },
{ name: 'Haahka', latin: 'Somateria mollissima', en: 'common eider', group: 'Vesilinnut', info: 'Suuri merisorsa.', commonsCategory: 'Category:Somateria_mollissima', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Somateria%20mollissima%20(cropped).jpg'] },
{ name: 'Alli', latin: 'Clangula hyemalis', en: 'long-tailed duck', group: 'Vesilinnut', info: 'Pitkä pyrstö.', commonsCategory: 'Category:Clangula_hyemalis', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Long-tailed%20duck%20(Clangula%20hyemalis).jpg'] },
{ name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Pitkä punainen nokka.', commonsCategory: 'Category:Mergus_merganser', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Mergus%20merganser,%20female%20and%20male,%20Vaxholm,%20Sweden.jpg'] },
{ name: 'Tukkakoskelo', latin: 'Mergus serrator', en: 'red-breasted merganser', group: 'Vesilinnut', info: 'Töyhtöinen.', commonsCategory: 'Category:Mergus_serrator', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Mergus%20serrator%20IMG%205623%20hurum.JPG'] },
{ name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean goose', group: 'Vesilinnut', info: 'Musta-oranssi nokka.', commonsCategory: 'Category:Anser_fabalis', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Anser%20fabalis%20fabalis%20(Taiga%20Bean%20Goose),%20Naturschutzgebiet%20Schellbruch,%20L%C3%BCbeck,%20Germany.jpg'] },
{ name: 'Merihanhi', latin: 'Anser anser', en: 'greylag goose', group: 'Vesilinnut', info: 'Oranssi nokka.', commonsCategory: 'Category:Anser_anser', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Anser%20Anser%20Oulu%2020240427.jpg', 'https://commons.wikimedia.org/wiki/Special:FilePath/Anser%20anser.jpg'] },
{ name: 'Kanadanhanhi', latin: 'Branta canadensis', en: 'Canada goose', group: 'Vesilinnut', info: 'Musta kaula.', commonsCategory: 'Category:Branta_canadensis', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Branta%20canadensis%20-Seurasaari%20-Finland%20-parents%20and%20goslings-8.jpg'] },
 
   // =========================
   // PIENPEDOT
   // =========================
{ name: 'Kettu', latin: 'Vulpes vulpes', en: 'red fox', group: 'Pienpedot', info: 'Punainen turkki.', commonsCategory: 'Category:Vulpes_vulpes', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Vulpes_vulpes_in_snow.jpg'] },
{ name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon dog', group: 'Pienpedot', info: 'Musta naamarikuvio.', commonsCategory: 'Category:Nyctereutes_procyonoides', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Nyctereutes_procyonoides_16072008.jpg'] },
{ name: 'Mäyrä', latin: 'Meles meles', en: 'European badger', group: 'Pienpedot', info: 'Valkoiset juovat.', commonsCategory: 'Category:Meles_meles', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Badger-badger.jpg'] },
   { name: 'Näätä', latin: 'Martes martes', en: 'pine marten', group: 'Pienpedot', info: 'Keltainen kurkkulaikku.', commonsCategory: 'Category:Martes_martes' },
{ name: 'Minkki', latin: 'Neovison vison', en: 'American mink', group: 'Pienpedot', info: 'Tumma turkki.', commonsCategory: 'Category:Neovison_vison', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Neovison_vison_-_Bod%C3%B8,_Norway_04.jpg'] },
   { name: 'Pesukarhu', latin: 'Procyon lotor', en: 'raccoon', group: 'Pienpedot', info: 'Naamio kasvoissa.', commonsCategory: 'Category:Procyon_lotor' },
{ name: 'Kärppä', latin: 'Mustela erminea', en: 'stoat', group: 'Pienpedot', info: 'Musta hännänpää.', commonsCategory: 'Category:Mustela_erminea', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Mustela_erminea_winter.jpg'] },
   { name: 'Hilleri', latin: 'Mustela putorius', en: 'European polecat', group: 'Pienpedot', info: 'Vaalea kuono.', commonsCategory: 'Category:Mustela_putorius' },
   { name: 'Saukko', latin: 'Lutra lutra', en: 'Eurasian otter', group: 'Pienpedot', info: 'Virtaviivainen.', commonsCategory: 'Category:Lutra_lutra' },
 
   // =========================
   // SUURPEDOT
   // =========================
{ name: 'Susi', latin: 'Canis lupus', en: 'wolf', group: 'Suurpedot', info: 'Koiramainen.', commonsCategory: 'Category:Canis_lupus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Canis_lupus_laying.jpg'] },
   { name: 'Tarhattu naali', latin: 'Vulpes lagopus', en: 'Arctic fox', group: 'Suurpedot', info: 'Pienikokoinen.', commonsCategory: 'Category:Vulpes_lagopus' },
{ name: 'Karhu', latin: 'Ursus arctos', en: 'brown bear', group: 'Suurpedot', info: 'Massiivinen.', commonsCategory: 'Category:Ursus_arctos', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Brown%20bear%20(Ursus%20arctos),%20Viiksimo,%20Kainuu%20region,%20Finland,%2016%20June%202018%20(43094873292).jpg'] },
{ name: 'Ahma', latin: 'Gulo gulo', en: 'wolverine', group: 'Suurpedot', info: 'Jykevä.', commonsCategory: 'Category:Gulo_gulo', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Gulo_gulo_in_Ranua_zoo.JPG'] },
{ name: 'Ilves', latin: 'Lynx lynx', en: 'Eurasian lynx', group: 'Suurpedot', info: 'Korvatupsut.', commonsCategory: 'Category:Lynx_lynx', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Lynx_Helsinki_Zoo.JPG'] },
 
   // =========================
   // HYLKEET
   // =========================
{ name: 'Itämeren norppa', latin: 'Pusa hispida botnica', en: 'Baltic ringed seal', group: 'Hylkeet', info: 'Pieni hylje.', commonsCategory: 'Category:Pusa_hispida_botnica', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Pusa_hispida_botnica_Oulu_20150516_04.JPG'] },
   { name: 'Kirjohylje', latin: 'Phoca vitulina', en: 'harbour seal', group: 'Hylkeet', info: 'Täpläinen.', commonsCategory: 'Category:Phoca_vitulina' },
{ name: 'Halli', latin: 'Halichoerus grypus', en: 'grey seal', group: 'Hylkeet', info: 'Pitkä kuono.', commonsCategory: 'Category:Halichoerus_grypus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Halichoerus_grypus_grypus,_Vakka-Suomi,_Finland_1.jpg'] },
 
   // =========================
   // MUUT RIISTALINNUT
   // =========================
{ name: 'Sepelkyyhky', latin: 'Columba palumbus', en: 'common wood pigeon', group: 'Muut riistalinnut', info: 'Valkoinen kaulalaikku.', commonsCategory: 'Category:Columba_palumbus', images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Columba_palumbus_Sepelkyyhky_IM5373_C.JPG'] },
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
  },
  {
    id: "q2",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Miten asetta tulee käsitellä perussääntönä kaikissa tilanteissa?",
    options: [
      "Aina kuin se olisi ladattu",
      "Vain ladattuna, muuten huoletta",
      "Turvallisena jos varmistin on päällä",
      "Turvallisena jos lipas on irti"
    ],
    correctIndex: 0,
    explanation: "Turvallisuuden perusajatus on käsitellä asetta aina kuin se olisi ladattu."
  },
  {
    id: "q3",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Missä liipaisinsormen tulee olla, kun et ole juuri ampumassa?",
    options: [
      "Liipaisimella valmiina",
      "Liipaisinkaaren sisällä",
      "Rungon päällä liipaisinkaaren ulkopuolella",
      "Tukin alla"
    ],
    correctIndex: 2,
    explanation: "Sormi pidetään pois liipaisimelta, kunnes tähtäys on kohteessa ja ampumapäätös tehty."
  },
  {
    id: "q4",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Milloin varmistin poistetaan päältä?",
    options: [
      "Heti kun ase ladataan",
      "Vasta juuri ennen laukausta, kun ampumapäätös on tehty",
      "Kun saalis havaitaan",
      "Kun saavutaan passiin"
    ],
    correctIndex: 1,
    explanation: "Varmistin poistetaan vasta ampumatilanteessa juuri ennen laukausta."
  },
  {
    id: "q5",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on tärkein syy tarkistaa tausta ennen laukausta?",
    options: [
      "Jotta osuma olisi parempi",
      "Jotta luoti/hauli ei vaaranna ihmisiä, eläimiä tai omaisuutta",
      "Jotta ase ei likaannu",
      "Jotta koira ei säikähdä"
    ],
    correctIndex: 1,
    explanation: "Ammunta on sallittua vain, jos kohde ja tausta ovat turvalliset."
  },
  {
    id: "q6",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mitä teet, jos et ole 100 % varma mitä olet ampumassa?",
    options: [
      "Ammut nopeasti ennen kuin tilanne menee ohi",
      "Ammut varoituslaukauksen",
      "Et ammu",
      "Pyydät kaveria ampumaan puolestasi"
    ],
    correctIndex: 2,
    explanation: "Tunnistamatonta tai epävarmaa kohdetta ei saa ampua."
  },
  {
    id: "q7",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on turvallisin tapa siirtyä paikasta toiseen metsästyksen aikana?",
    options: [
      "Ase ladattuna olalla",
      "Ase tyhjänä, toiminta avattuna (esim. taitettuna / lukko auki)",
      "Ase varmistimella ja sormi liipaisimella",
      "Ase ladattuna repussa"
    ],
    correctIndex: 1,
    explanation: "Siirtymisten aikana ase pidetään tyhjänä ja avattuna, jotta vahinkolaukaus estyy."
  },
  {
    id: "q8",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mitä teet ennen kuin luovutat aseen toiselle henkilölle?",
    options: [
      "Käännät varmistimen päälle",
      "Irrotat hihnan",
      "Tarkistat ja näytät selvästi, että ase on tyhjä",
      "Kysyt onko toisella lupa"
    ],
    correctIndex: 2,
    explanation: "Ase luovutetaan vain tyhjänä ja niin, että tyhjyys on helposti todennettavissa."
  },
  {
    id: "q9",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on turvallinen toiminta auton tai muun kulkuneuvon lähellä?",
    options: [
      "Ase ladataan autossa valmiiksi",
      "Ase pidetään ladattuna mutta varmistimella",
      "Ase pidetään tyhjänä ja avattuna kuljetuksen ja siirtymien aikana",
      "Ase jätetään takakonttiin ladattuna"
    ],
    correctIndex: 2,
    explanation: "Kuljetuksessa ja ajoneuvojen yhteydessä korostuu tyhjä ja avattu ase."
  },
  {
    id: "q10",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: "Mikä on paras tapa varmistaa, ettei patruuna jää vahingossa pesään lippaan irrotuksen jälkeen?",
    options: [
      "Luotat siihen, että lipas irti = tyhjä",
      "Vedät lukon taakse ja tarkistat pesän silmämääräisesti ja tuntumalla",
      "Käännät varmistimen päälle",
      "Pidät aseen piipun maassa"
    ],
    correctIndex: 1,
    explanation: "Lipas irti ei takaa tyhjyyttä: pesä tulee tarkistaa erikseen."
  },
  {
    id: "q11",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mitä teet, jos aseessa tulee toimintahäiriö (esim. nallivika) ampumatilanteessa?",
    options: [
      "Käännät piipun itseä kohti ja katsot pesään",
      "Pidät aseen turvalliseen suuntaan ja toimit häiriönpoiston periaatteilla rauhallisesti",
      "Lyöt asetta maahan",
      "Yrität ampua heti uudestaan ilman tarkistusta"
    ],
    correctIndex: 1,
    explanation: "Toimintahäiriössä piippu pidetään turvalliseen suuntaan ja toimitaan hallitusti."
  },
  {
    id: "q12",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on turvallinen toimintatapa esteen ylityksen lisäksi silloin, kun kompastut tai kaadut ase kädessä?",
    options: [
      "Pidät sormen liipaisimella ettei ote irtoa",
      "Yrität suojata asetta vaikka piippu kääntyy minne sattuu",
      "Pidät piipun poispäin ihmisistä ja sormi pois liipaisimelta; jos mahdollista avaat/tyhjennät aseen",
      "Ammut varoituslaukauksen"
    ],
    correctIndex: 2,
    explanation: "Kaaduttaessa tärkeintä on piipun suunta ja liipaisinkuri; tilanteen jälkeen ase tarkistetaan."
  },
  {
    id: "q13",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mitä tarkoittaa 'kohde ja tausta' ampumaturvallisuudessa?",
    options: [
      "Vain sitä, että kohde näkyy",
      "Että sekä kohde että sen takana oleva alue ovat turvallisia laukaukselle",
      "Että tausta on kaunis",
      "Että kohde on lähellä"
    ],
    correctIndex: 1,
    explanation: "Myös kohteen takana oleva alue on arvioitava, jotta laukaus ei aiheuta vaaraa."
  },
  {
    id: "q14",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Miksi alkoholi ja metsästys eivät kuulu yhteen?",
    options: [
      "Koska se on kallista",
      "Koska se heikentää arviointikykyä ja reaktiota, mikä lisää onnettomuusriskiä",
      "Koska se heikentää kuulon suojausta",
      "Koska se pilaa varusteet"
    ],
    correctIndex: 1,
    explanation: "Metsästys vaatii tarkkaa harkintaa ja turvallisuutta; päihteet heikentävät näitä."
  },
  {
    id: "q15",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä käytäntö ennen jahtipäivää aseen ja optiikan osalta?",
    options: [
      "Et tarkista mitään, koska viimeksi toimi",
      "Tarkistat kiinnitykset, toiminnan ja että ase toimii turvallisesti",
      "Kiristät ruuvit 'tappiin asti' ilman momenttia",
      "Vaihtoehtoisesti annat kaverin tarkistaa"
    ],
    correctIndex: 1,
    explanation: "Ennakko-tarkistus vähentää toimintahäiriöitä ja vaaratilanteita."
  },
  {
    id: "q16",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: "Mikä on turvallisin tapa käsitellä asetta sisätiloissa (esim. mökissä) metsästyspäivän jälkeen?",
    options: [
      "Ase jätetään ladattuna oven viereen",
      "Ase tyhjennetään, tarkistetaan pesä ja säilytetään turvallisesti lukittuna",
      "Ase nojaa nurkassa varmistimella",
      "Ase puretaan lattialle"
    ],
    correctIndex: 1,
    explanation: "Sisätiloissa ase tyhjennetään ja tarkistetaan huolellisesti; säilytys turvallisesti."
  },
  {
    id: "q17",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä seuraavista on turvallinen käytäntö, kun koira tai toinen metsästäjä on lähellä?",
    options: [
      "Ammut jos 'ehkä osuu'",
      "Ammut vain, jos turvallinen ampumasektori on varma",
      "Ammut aina ylöspäin",
      "Ammut maata pitkin jotta ei lennä pitkälle"
    ],
    correctIndex: 1,
    explanation: "Ampuminen edellyttää varmaa turvallisuutta ihmisille ja eläimille; sektorit ja tausta varmistetaan."
  },
  {
    id: "q18",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mikä on paras tapa kantaa asetta niin, että piippu pysyy turvallisessa suunnassa?",
    options: [
      "Miten sattuu, kunhan varmistin on päällä",
      "Niin, että piippu ei osoita ihmisiin ja asento on hallittu",
      "Piippu taaksepäin kohti ryhmää",
      "Piippu sivulle kohti polkua"
    ],
    correctIndex: 1,
    explanation: "Kantotavan on pidettävä piippu pois ihmisistä ja mahdollistettava hallittu käsittely."
  },
  {
    id: "q19",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mitä tarkoittaa 'ampumapäätös' turvallisuusmielessä?",
    options: [
      "Päätös ampua tehdään vasta kun kohde on tunnistettu ja laukaus on turvallinen",
      "Päätös tehdään, kun ääni kuuluu metsästä",
      "Päätös tehdään, kun muut ovat ampuneet",
      "Päätös tehdään, kun ase on ladattu"
    ],
    correctIndex: 0,
    explanation: "Ampumapäätös tehdään vasta, kun tunnistus ja turvallisuus (kohde/tausta) ovat varmoja."
  },
  {
    id: "q20",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on paras toiminta, jos joku ryhmässäsi toimii vaarallisesti aseen kanssa?",
    options: [
      "Et sano mitään, ettei tule riitaa",
      "Keskeytät tilanteen ja huomautat asiallisesti, jotta turvallisuus palautuu",
      "Odotat että vahinko tapahtuu ja sitten opetus menee perille",
      "Lähdet pois sanaakaan sanomatta"
    ],
    correctIndex: 1,
    explanation: "Turvallisuus on yhteinen asia: vaarallinen toiminta pitää katkaista ja korjata heti."
  },
  {
    id: "q21",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mikä on oikein aseen kanssa liikkumisessa liukkaalla tai vaikeassa maastossa?",
    options: [
      "Pidät aseen ladattuna koska voi tulla saalis",
      "Pidät aseen tyhjänä/avattuna ja keskityt tasapainoon",
      "Pidät sormen liipaisimella ettei ote lipsu",
      "Kannat asetta piippu alaspäin kohti jalkoja"
    ],
    correctIndex: 1,
    explanation: "Vaikeassa maastossa korostuu hallinta ja vahinkolaukauksen estäminen."
  },
  {
    id: "q22",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on turvallinen tapa varmistaa, että ase on tyhjä?",
    options: [
      "Katson vain lippaan",
      "Tarkistan pesän ja lippaan/patruunapesän silmämääräisesti ja tarvittaessa koskettamalla",
      "Käännän varmistimen päälle",
      "Kysyn kaverilta"
    ],
    correctIndex: 1,
    explanation: "Tyhjyys varmistetaan tarkistamalla pesä (ja lipas/putkimakasiini) itse."
  },
  {
    id: "q23",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: "Mikä on turvallisin periaate, jos ase putoaa maahan?",
    options: [
      "Nostat sen ja jatkat ampumista heti",
      "Tarkistat aseen kunnon ja piipun esteettömyyden ennen käyttöä",
      "Puhallat piippuun varmistukseksi",
      "Ammut kerran 'puhdistuslaukauksen'"
    ],
    correctIndex: 1,
    explanation: "Putoamisen jälkeen pitää varmistaa, ettei piippu ole tukossa ja että ase on kunnossa."
  },
  {
    id: "q24",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on turvallinen toiminta passiketjussa, kun joku tulee ohi?",
    options: [
      "Pidät asetta valmiina osoittaen kohti kulkusuuntaa",
      "Käännät piipun turvalliseen suuntaan ja pidät aseen tyhjänä/varmistettuna tilanteen mukaan",
      "Ammut varoituslaukauksen",
      "Et tee mitään"
    ],
    correctIndex: 1,
    explanation: "Ihmisten liike lähellä vaatii piipun suunnan hallintaa ja turvallista aseen tilaa."
  },
  {
    id: "q25",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mitä teet ennen kuin kosket liipaisimeen?",
    options: [
      "Varmistat että sormi on liipaisimella",
      "Varmistat kohteen, taustan ja oman ampumasektorin",
      "Suljet silmät hetkeksi",
      "Luotat että ääni kertoo kohteen"
    ],
    correctIndex: 1,
    explanation: "Liipaisimelle mennään vasta kun kohde/tausta/sektori ovat kunnossa ja ampumapäätös tehty."
  },
  {
    id: "q26",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Miksi 'piippu aina turvalliseen suuntaan' on tärkeä sääntö, vaikka ase olisi tyhjä?",
    options: [
      "Koska se näyttää hienolta",
      "Koska ihmiset erehtyvät: varmistus ja tyhjyys voivat pettää",
      "Koska piippu ruostuu muuten",
      "Koska se on laki joka koskee vain haulikoita"
    ],
    correctIndex: 1,
    explanation: "Turvallisuusrutiinit suojaavat inhimillisiltä virheiltä: ase voi olla luultua ladatumpi."
  },
  {
    id: "q27",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.HARD,
    question: "Mikä on paras toimintatapa, jos ammunnan jälkeen et heti löydä saalista ja epäilet osumaa?",
    options: [
      "Jatkat metsästystä ja katsot myöhemmin",
      "Merkitset paikan, rauhoitat tilanteen ja aloitat järjestelmällisen jäljityksen",
      "Lähdet kotiin",
      "Ilmoitat somessa"
    ],
    correctIndex: 1,
    explanation: "Eettisyys ja turvallisuus: epäilty osuma tarkoittaa järjestelmällistä jäljitystä."
  },
  {
    id: "q28",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä käytäntö kuulonsuojauksessa metsästyksessä?",
    options: [
      "Kuulonsuojaus ei ole tarpeen metsässä",
      "Käytät tilanteeseen sopivia kuulonsuojaimia (esim. aktiivikuulosuojaimet) aina kun mahdollista",
      "Käytät suojaimia vain ampumaradalla",
      "Käytät suojaimia vain jos muistat"
    ],
    correctIndex: 1,
    explanation: "Kuulon suojaaminen on osa turvallisuutta; metsästyslaukaukset voivat vaurioittaa kuuloa."
  },
  {
    id: "q29",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.EASY,
    question: "Mikä on turvallisin käytäntö, kun noustaan ampumatorniin tai passipaikkaan?",
    options: [
      "Ase ladattuna mukana ylös",
      "Ase tyhjänä; ase nostetaan/annetaan erikseen turvallisesti",
      "Ase selässä piippu alaspäin",
      "Ase kädessä ja sormi liipaisimella"
    ],
    correctIndex: 1,
    explanation: "Korkealle noustessa ase pidetään tyhjänä ja käsitellään erikseen, jotta pudotus/laukaus ei tapahdu."
  },
  {
    id: "q30",
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: "Mitä tarkoittaa käytännössä 'tunne oma varma ampumaetäisyytesi'?",
    options: [
      "Ammut aina kauemmas kuin ennen",
      "Ammut vain etäisyyksille, joilla osut varmasti ja eettisesti",
      "Ammut aina samaa etäisyyttä riippumatta tilanteesta",
      "Ammut vain jos muutkin ampuvat"
    ],
    correctIndex: 1,
    explanation: "Eettinen ja turvallinen ampuminen edellyttää, että laukaus on hallittu ja osuma varma."
  },
  {
    id: "q31",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mihin metsästykseen tarvitaan lähtökohtaisesti metsästysoikeus tai lupa?",
    options: [
      "Vain valokuvaukseen",
      "Riistaeläinten pyydystämiseen tai tappamiseen",
      "Marjastukseen",
      "Lintujen tarkkailuun"
    ],
    correctIndex: 1,
    explanation: "Metsästys ei kuulu jokamiehenoikeuksiin; siihen tarvitaan metsästysoikeus/lupa."
  },
  {
    id: "q32",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Kuka on viime kädessä vastuussa siitä, että oma metsästys on sääntöjen mukaista?",
    options: [
      "Metsästysseura",
      "Poliisi",
      "Metsästäjä itse",
      "Kaveri, jolla on enemmän kokemusta"
    ],
    correctIndex: 2,
    explanation: "Vastuu omasta toiminnasta on metsästäjällä."
  },
  {
    id: "q33",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on järkevin toimintatapa, jos et ole varma jonkin teon luvallisuudesta?",
    options: [
      "Toimit ja tarkistat myöhemmin",
      "Jätät tekemättä ja varmistat asian luotettavasta lähteestä",
      "Kysyt satunnaiselta foorumilta",
      "Teet kuten viime vuonna"
    ],
    correctIndex: 1,
    explanation: "Epäselvissä tilanteissa vastuullinen metsästäjä varmistaa asian ennen toimintaa."
  },
  {
    id: "q34",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mitä tarkoittaa, että metsästys on säädeltyä toimintaa?",
    options: [
      "Sitä, että metsässä saa tehdä mitä haluaa",
      "Sitä, että metsästykselle on asetettu velvollisuuksia, rajoja ja vastuita",
      "Sitä, että metsästys on aina kiellettyä",
      "Sitä, että vain varusteet ratkaisevat"
    ],
    correctIndex: 1,
    explanation: "Sääntely tarkoittaa vastuita ja rajoja, joita metsästäjän tulee noudattaa."
  },
  {
    id: "q35",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Miksi metsästäjäkokeessa kysytään lainsäädännöstä?",
    options: [
      "Koska laki on viihdettä",
      "Koska metsästäjän pitää tuntea oikeudet ja velvollisuudet",
      "Koska laki korvaa käytännön harjoittelun",
      "Koska se on vain muodollisuus"
    ],
    correctIndex: 1,
    explanation: "Metsästäjän on tunnettava velvollisuutensa ja rajoituksensa, jotta toiminta on laillista ja turvallista."
  },
  {
    id: "q36",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mikä seuraavista on luotettava paikka tarkistaa metsästyslain sanamuoto?",
    options: [
      "Finlex",
      "Somekommentit",
      "Kaverin muistiinpanot ilman lähdettä",
      "Satunnainen blogi"
    ],
    correctIndex: 0,
    explanation: "Finlex on virallinen lainsäädäntölähde."
  },
  {
    id: "q37",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mitä teet, jos havainto voi koskea rauhoitettua tai muuten kiellettyä kohdetta?",
    options: [
      "Ammut nopeasti, ettei karkaa",
      "Et ammu ja varmistat lajin tunnistuksen",
      "Ammut koska 'näytti riistalta'",
      "Ammut varoituslaukauksen"
    ],
    correctIndex: 1,
    explanation: "Jos kohde voi olla rauhoitettu tai muuten kielletty, ampuminen jätetään tekemättä."
  },
  {
    id: "q38",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä kuvaa parhaiten metsästyksen ydintä lainsäädännön hengessä?",
    options: [
      "Vain ampuminen",
      "Riistaeläimen pyydystäminen/tappaminen ja saaliin ottaminen haltuun vastuullisesti",
      "Vain koiran ulkoilutus",
      "Vain loukun virittäminen"
    ],
    correctIndex: 1,
    explanation: "Metsästys käsittää saaliin ottamisen haltuun ja siihen liittyvät vastuut."
  },
  {
    id: "q39",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: "Miksi metsästyslainsäädäntöön liittyviä 'päivämäärä- ja lajipoikkeus' -kysymyksiä kannattaa versionoida kysymyspankissa?",
    options: [
      "Koska ne eivät koskaan muutu",
      "Koska ne voivat muuttua, jolloin vanha kysymys muuttuu vääräksi",
      "Koska ne ovat aina liian helppoja",
      "Koska ne ovat tekijänoikeuden suojaamia"
    ],
    correctIndex: 1,
    explanation: "Tietyt yksityiskohdat muuttuvat ajan myötä, joten bankin pitää pysyä ajantasaisena tai välttää niitä."
  },
  {
    id: "q40",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on metsästäjän velvollisuus suhteessa metsästysalueen rajoihin?",
    options: [
      "Rajoilla ei ole merkitystä",
      "Metsästys rajautuu metsästysoikeuden alueelle; rajoista pitää olla selvillä",
      "Rajat koskevat vain hirviä",
      "Rajat selviävät vasta jälkikäteen"
    ],
    correctIndex: 1,
    explanation: "Metsästys tapahtuu metsästysoikeuden puitteissa; alueen rajat on tunnettava."
  },
  {
    id: "q41",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mitä metsästyskortti ja riistanhoitomaksu käytännössä liittyvät?",
    options: [
      "Ne ovat sama asia kuin metsästysoikeus",
      "Ne liittyvät metsästäjän oikeuteen toimia metsästäjänä, mutta eivät yksinään anna metsästysoikeutta alueelle",
      "Ne korvaavat aseenkantoluvan",
      "Ne eivät liity mihinkään"
    ],
    correctIndex: 1,
    explanation: "Metsästäjästatus ja alueen metsästysoikeus ovat eri asioita."
  },
  {
    id: "q42",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on realistinen tapa pitää kysymyspankki luotettavana pitkällä aikavälillä?",
    options: [
      "Lisätään kysymyksiä muistista ilman lähteitä",
      "Tehdään kysymykset periaatteista ja varmistetaan epäselvät kohdat virallisista lähteistä",
      "Kopioidaan pitkiä tekstipätkiä suoraan",
      "Jätetään selitykset pois"
    ],
    correctIndex: 1,
    explanation: "Luotettavuus syntyy periaatteista, lähteisiin nojaamisesta ja selityksistä."
  },
  {
    id: "q43",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Miksi 'en tiennyt' ei yleensä ole hyvä puolustus, jos toimit lainvastaisesti?",
    options: [
      "Koska laki olettaa, että metsästäjä tuntee säännöt ja toimii huolellisesti",
      "Koska kaikki tietävät kaiken",
      "Koska poliisi ei kuuntele koskaan",
      "Koska metsässä ei ole sääntöjä"
    ],
    correctIndex: 0,
    explanation: "Metsästäjän velvollisuus on toimia huolellisesti ja tuntea perussäännöt."
  },
  {
    id: "q44",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mikä on paras ensisijainen lähde metsästäjäkokeen teoriaan Suomessa?",
    options: [
      "Riistainfon/Riistakeskuksen metsästäjäkoulutuksen materiaali",
      "Satunnainen ulkomainen sivu",
      "Vain YouTube",
      "Kaverin tarinat"
    ],
    correctIndex: 0,
    explanation: "Riistainfo ja riistakeskuksen koulutusmateriaalit on tehty tutkintoon valmistautumiseen."
  },
  {
    id: "q45",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä kuvaa parhaiten metsästäjän vastuun luonnetta yhteisjahdissa?",
    options: [
      "Vastuu on aina vain johtajalla",
      "Jokainen vastaa omista laukauksistaan ja toiminnastaan, vaikka jahdissa olisi johtaja",
      "Vastuu jakautuu niin, ettei kukaan ole vastuussa",
      "Vastuu on aina koiralla"
    ],
    correctIndex: 1,
    explanation: "Johtaminen auttaa, mutta yksilön vastuu omista teoista säilyy."
  },
  {
    id: "q46",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä periaate, kun liikut toisen mailla metsästyksen yhteydessä?",
    options: [
      "Voit aina kulkea ja metsästää vapaasti",
      "Kunnioitat maanomistajan oikeuksia ja varmistat, että sinulla on lupa metsästää",
      "Kysyt luvan vasta jälkikäteen",
      "Et kerro kenellekään"
    ],
    correctIndex: 1,
    explanation: "Metsästys edellyttää metsästysoikeutta; maanomistajan oikeudet huomioidaan."
  },
  {
    id: "q47",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: "Miksi kysymys 'saako rauhoitettua eläintä metsästää?' on hyvä tehdä varovaisesti yleisbankkiin?",
    options: [
      "Koska vastaus riippuu poikkeusluvasta ja tilanteesta; yleisohje on että ei ilman erillistä lupaa",
      "Koska se on aina sallittua",
      "Koska se on aina kielletty myös poikkeusluvalla",
      "Koska se koskee vain ulkomaita"
    ],
    correctIndex: 0,
    explanation: "Pääsääntö on kielto, mutta poikkeuksia voi olla luvilla; siksi muotoilu pitää tehdä yksiselitteiseksi."
  },
  {
    id: "q48",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on fiksu tapa käsitellä metsästyksen sääntöjä oppimisen kannalta?",
    options: [
      "Opetella vain muistilistat ilman ymmärrystä",
      "Ymmärtää periaatteet ja tarkistaa yksityiskohdat virallisista lähteistä",
      "Arvailla kokeessa",
      "Luottaa pelkkään intuition"
    ],
    correctIndex: 1,
    explanation: "Periaatteiden ymmärtäminen tekee osaamisesta kestävää ja vähentää virheitä."
  },
  {
    id: "q49",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mikä on suositeltava tapa pysyä ajantasalla tärkeistä muutoksista metsästyksen säännöissä?",
    options: [
      "Seurata viranomais- ja koulutuslähteitä (Riistakeskus/Riistainfo)",
      "Seurata vain kaverin päivityksiä",
      "Olettaa, ettei mikään muutu",
      "Seurata vain ulkomaisia kanavia"
    ],
    correctIndex: 0,
    explanation: "Ajantasaisuus kannattaa hakea virallisista lähteistä."
  },
  {
    id: "q50",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Miksi metsästyksen hyväksyttävyys yhteiskunnassa on sidoksissa sääntöjen noudattamiseen?",
    options: [
      "Koska se on muotia",
      "Koska vastuullinen ja laillinen toiminta ylläpitää luottamusta metsästykseen",
      "Koska se lisää saalismääriä",
      "Koska se tekee metsästyksestä halvempaa"
    ],
    correctIndex: 1,
    explanation: "Sääntöjen noudattaminen ja vastuullisuus ylläpitävät metsästyksen hyväksyttävyyttä."
  },
  {
    id: "q51",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä käytäntö, jos haluat tehdä kysymysbankista helposti ylläpidettävän?",
    options: [
      "Ei käytetä id:tä",
      "Lisätään id ja selitys jokaiseen kysymykseen",
      "Jätetään selitys tyhjäksi",
      "Käytetään samaa id:tä kaikille"
    ],
    correctIndex: 1,
    explanation: "Yksilöllinen id ja selitys helpottavat virheiden korjausta ja ylläpitoa."
  },
  {
    id: "q52",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mikä seuraavista on totta metsästäjätutkinnosta yleisellä tasolla?",
    options: [
      "Se on pääosin kirjallinen koe, joka testaa perusosaamista turvallisuudesta, laista ja etiikasta",
      "Se testaa vain ampumataitoa",
      "Se testaa vain lajien latinankielisiä nimiä",
      "Se testaa vain varusteiden hintoja"
    ],
    correctIndex: 0,
    explanation: "Tutkinto painottaa turvallisuutta, sääntöjä, etiikkaa ja metsästyksen perusteita."
  },
  {
    id: "q53",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on järkevä periaate riitatilanteissa (esim. maastossa kohtaaminen)?",
    options: [
      "Ratkotaan huutamalla",
      "Toimitaan asiallisesti ja turvallisuus edellä; tarvittaessa keskeytetään metsästys",
      "Näytetään asetta auktoriteettina",
      "Jatketaan metsästystä vaikka tilanne on epäselvä"
    ],
    correctIndex: 1,
    explanation: "Turvallisuus ja asiallinen käytös ovat ensisijaisia; konfliktit eivät saa eskaloitua aseiden kanssa."
  },
  {
    id: "q54",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: "Mikä on paras tapa välttää 'laillinen mutta huono idea' -tilanteita?",
    options: [
      "Teet aina minimin mitä laki vaatii, muusta ei väliä",
      "Noudatat lakia ja lisäksi hyviä käytäntöjä (turvallisuus/etiikka)",
      "Toimit vain perinteen mukaan",
      "Toimit vain oman edun mukaan"
    ],
    correctIndex: 1,
    explanation: "Lain lisäksi hyvät käytännöt ja etiikka ohjaavat vastuulliseen toimintaan."
  },
  {
    id: "q55",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Miksi lähdemateriaalin parafraasointi on tärkeää, vaikka faktat olisivat oikein?",
    options: [
      "Koska faktat ovat tekijänoikeuden suojaamia",
      "Koska lähteen sanamuoto voi olla tekijänoikeuden suojaamaa",
      "Koska se on pakko tehdä kaikissa tapauksissa",
      "Koska se tekee kysymyksistä sekavia"
    ],
    correctIndex: 1,
    explanation: "Faktat eivät ole suojattuja, mutta sanamuoto voi olla; siksi oma muotoilu on turvallinen."
  },
  {
    id: "q56",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä nyrkkisääntö, jos et erota varmasti kahta samannäköistä lajia?",
    options: [
      "Ammut ja katsot myöhemmin",
      "Et ammu",
      "Ammut pienemmän",
      "Ammut suuremman"
    ],
    correctIndex: 1,
    explanation: "Epävarmassa tunnistuksessa ei ammuta."
  },
  {
    id: "q57",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mitä tarkoittaa käytännössä 'huolellisuusvelvoite' metsästyksessä?",
    options: [
      "Teet asiat nopeasti",
      "Toimit suunnitelmallisesti, turvallisesti ja varmistat olennaiset asiat ennen toimintaa",
      "Teet kuten muutkin",
      "Luotat tuuriin"
    ],
    correctIndex: 1,
    explanation: "Huolellisuus on perusperiaate: varmistetaan asiat etukäteen ja minimoidaan riskit."
  },
  {
    id: "q58",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: "Miksi 'metsästysalueen rajat' on hyvä aihe koetyyliselle tilannekysymykselle?",
    options: [
      "Koska se testaa käytännön vastuuta ja huolellisuutta ilman muuttuvia päivämääriä",
      "Koska se on aina triviaalia",
      "Koska se liittyy vain karttoihin",
      "Koska se on pelkkä mielipide"
    ],
    correctIndex: 0,
    explanation: "Rajojen tunteminen on konkreettinen osa vastuullista metsästystä ja pysyy relevanttina."
  },
  {
    id: "q59",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: "Mikä on metsästyksen eettinen perusperiaate saaliin suhteen?",
    options: [
      "Saalista ei tarvitse hyödyntää",
      "Saalis pyritään hyödyntämään mahdollisimman hyvin ja kunnioittavasti",
      "Otetaan vain trofee",
      "Saalis jätetään aina metsään"
    ],
    correctIndex: 1,
    explanation: "Eettinen metsästys korostaa saaliin hyödyntämistä ja kunnioitusta."
  },
  {
    id: "q60",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mitä tulee tehdä, jos epäilet haavoittaneesi riistaa?",
    options: [
      "Jatkat jahtia, kyllä se löytyy myöhemmin",
      "Aloitat järjestelmällisen jäljityksen ja pyrit lopettamaan eläimen mahdollisimman nopeasti",
      "Lopetat päivän ja lähdet kotiin",
      "Ilmoitat kavereille ja unohdat"
    ],
    correctIndex: 1,
    explanation: "Haavoittuneen riistan kärsimys tulee minimoida: jäljitys aloitetaan viipymättä."
  },
  {
    id: "q61",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi varma osuma on eettinen vaatimus, ei vain tekninen?",
    options: [
      "Koska se säästää patruunoita",
      "Koska se minimoi eläimen kärsimyksen ja vähentää haavakkoja",
      "Koska se näyttää paremmalta",
      "Koska se on helpompaa"
    ],
    correctIndex: 1,
    explanation: "Eettisyys painottaa kärsimyksen minimointia: ammutaan vain, kun osuma on todennäköinen ja hallittu."
  },
  {
    id: "q62",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate luonnossa liikkuvien muiden ihmisten suhteen?",
    options: [
      "Muut väistäkööt",
      "Huomioidaan muiden turvallisuus ja viestitään asiallisesti",
      "Ei tarvitse välittää",
      "Keskitytään vain saaliiseen"
    ],
    correctIndex: 1,
    explanation: "Eettisyys sisältää muiden huomioimisen ja turvallisen toiminnan."
  },
  {
    id: "q63",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi saaliin nopea ja hygieeninen käsittely on osa vastuullisuutta?",
    options: [
      "Koska se lisää metsästysonnea",
      "Koska se vaikuttaa ruoan turvallisuuteen ja vähentää hävikkiä",
      "Koska se on vain esteettistä",
      "Koska se on pakollista vain ravintoloissa"
    ],
    correctIndex: 1,
    explanation: "Hyvä käsittely parantaa elintarviketurvaa ja kunnioittaa saalista."
  },
  {
    id: "q64",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on eettisesti hyvä asenne, jos oma taito tai varmuus ei riitä tilanteeseen?",
    options: [
      "Kokeilet silti, koska oppii tekemällä",
      "Pidättäydyt ja haet lisää harjoitusta/ohjausta",
      "Ammut vain varoituslaukauksen",
      "Teet kuten muutkin"
    ],
    correctIndex: 1,
    explanation: "Vastuullinen metsästäjä tunnistaa rajansa ja toimii sen mukaan."
  },
  {
    id: "q65",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.HARD,
    question: "Mikä on paras tapa edistää metsästyksen hyväksyttävyyttä?",
    options: [
      "Keskittyä vain saalismääriin",
      "Toimia laillisesti, turvallisesti ja eettisesti sekä käyttäytyä asiallisesti maastossa",
      "Välttää kaikkia keskusteluja",
      "Korostaa että 'aina on tehty näin'"
    ],
    correctIndex: 1,
    explanation: "Hyväksyttävyys rakentuu vastuullisesta toiminnasta ja esimerkillisestä käytöksestä."
  },
  {
    id: "q66",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on eettisesti oikea tapa suhtautua ympäristöön ja roskaamiseen metsästyksessä?",
    options: [
      "Jätät hylsyt ja roskat luontoon",
      "Keräät roskat ja hylsyt pois ja jätät paikan vähintään yhtä siistiksi kuin se oli",
      "Peität roskat lehtiin",
      "Poltat muovit nuotiossa"
    ],
    correctIndex: 1,
    explanation: "Luonnon kunnioitus on keskeistä: roskat ja hylsyt kerätään talteen."
  },
  {
    id: "q67",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: "Mikä seuraavista on eettisesti oikein saaliin hyödyntämisessä?",
    options: [
      "Hyödynnät saaliin mahdollisimman hyvin ja vältät turhaa hukkaa",
      "Otat vain sisäfileen",
      "Heität loput pois",
      "Annan pedoille aina"
    ],
    correctIndex: 0,
    explanation: "Saalista kunnioitetaan hyödyntämällä se mahdollisimman hyvin."
  },
  {
    id: "q68",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi 'ampumatta jättäminen' voi olla eettisesti paras ratkaisu?",
    options: [
      "Koska se on laiskuutta",
      "Koska epävarmassa tilanteessa ampuminen lisää haavakkoriskiä ja vaarantaa turvallisuuden",
      "Koska silloin saa enemmän saalista myöhemmin",
      "Koska se on aina pakko"
    ],
    correctIndex: 1,
    explanation: "Epävarmassa tilanteessa eettisin ja turvallisin ratkaisu on jättää ampumatta."
  },
  {
    id: "q69",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä kuvaa parhaiten hyvää metsästyskulttuuria?",
    options: [
      "Vain saalismäärä ratkaisee",
      "Turvallisuus, yhteistyö, sääntöjen noudattaminen ja riistan kunnioitus",
      "Se, että ei puhuta kenellekään",
      "Se, että ammutaan ensimmäisenä"
    ],
    correctIndex: 1,
    explanation: "Hyvä metsästyskulttuuri on vastuullisuutta ja kunnioitusta."
  },
  {
    id: "q70",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.HARD,
    question: "Mikä on eettisesti oikea tapa toimia, jos huomaat toisen toimivan vaarallisesti tai epäeettisesti?",
    options: [
      "Katsot muualle",
      "Puuttua asiallisesti tilanteeseen ja tarvittaessa keskeyttää toiminta turvallisuuden vuoksi",
      "Kuvaat videon ja jaat",
      "Aloitat riidan"
    ],
    correctIndex: 1,
    explanation: "Vastuullisuus tarkoittaa myös puuttumista vaaralliseen toimintaan."
  },
  {
    id: "q71",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi eläimen kunnioittaminen kuuluu metsästyksen etiikkaan?",
    options: [
      "Koska se on trendi",
      "Koska metsästys kohdistuu elävään olentoon ja kärsimys tulee minimoida",
      "Koska se tekee varusteista kalliimpia",
      "Koska se takaa osuman"
    ],
    correctIndex: 1,
    explanation: "Etiikka pohjautuu kärsimyksen minimointiin ja kunnioittavaan suhtautumiseen."
  },
  {
    id: "q72",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on eettisesti hyvä periaate kuvaamisessa/saaliskuvissa?",
    options: [
      "Kaikki käy, kunhan saat kuvan",
      "Kunnioitat saalista ja pidät esitystavan asiallisena",
      "Teet pilaa saaliista",
      "Jätät saaliin huonoon asentoon"
    ],
    correctIndex: 1,
    explanation: "Saalista käsitellään kunnioittavasti myös esittämisessä."
  },
  {
    id: "q73",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: "Mikä on eettinen tavoite metsästyksessä eläimen kärsimyksen suhteen?",
    options: [
      "Lisätä jännitystä",
      "Minimoida kärsimys",
      "Sillä ei ole merkitystä",
      "Siirtää vastuu muille"
    ],
    correctIndex: 1,
    explanation: "Eettinen metsästys minimoi kärsimyksen."
  },
  {
    id: "q74",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi hyvä ampumaharjoittelu liittyy etiikkaan?",
    options: [
      "Koska se tekee metsästyksestä kalliimpaa",
      "Koska se parantaa varmuutta ja vähentää haavakkoja",
      "Koska se on pakollista kaikille",
      "Koska se korvaa tunnistuksen"
    ],
    correctIndex: 1,
    explanation: "Harjoittelu parantaa osumavarmuutta ja vähentää eläinten kärsimystä."
  },
  {
    id: "q75",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä periaate metsästysseuran/ryhmän sisällä?",
    options: [
      "Jokainen tekee mitä haluaa",
      "Sovitaan pelisäännöt, viestitään ja pidetään turvallisuus yhteisenä asiana",
      "Ei puhuta koskaan",
      "Johtaja ampuu kaiken"
    ],
    correctIndex: 1,
    explanation: "Yhteiset pelisäännöt ja viestintä vähentävät riskejä ja parantavat vastuullisuutta."
  },
  {
    id: "q76",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.HARD,
    question: "Mikä on eettisesti kestävä tapa suhtautua riistakannan kestävyyteen?",
    options: [
      "Ammut aina kun näet",
      "Toimit niin, että metsästys ei vaaranna kannan tulevaisuutta",
      "Keskityt vain suurimpiin",
      "Et välitä"
    ],
    correctIndex: 1,
    explanation: "Kestävyys tarkoittaa, ettei metsästys vaaranna kannan tulevaisuutta."
  },
  {
    id: "q77",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Miksi saaliin asianmukainen talteenotto on osa etiikkaa?",
    options: [
      "Koska se näyttää paremmalta",
      "Koska se liittyy kunnioitukseen ja hävikin minimointiin",
      "Koska se on helpompaa",
      "Koska se on vain perinne"
    ],
    correctIndex: 1,
    explanation: "Saalis otetaan talteen ja hyödynnetään vastuullisesti."
  },
  {
    id: "q78",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä perusperiaate aseen säilytyksessä kotona?",
    options: [
      "Ase esillä seinällä",
      "Ase lukitussa säilytyksessä niin, etteivät asiattomat pääse siihen käsiksi",
      "Ase ladattuna yöpöydällä",
      "Ase autossa"
    ],
    correctIndex: 1,
    explanation: "Turvallinen säilytys tarkoittaa, että asiattomat eivät pääse aseeseen käsiksi."
  },
  {
    id: "q79",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi patruunoiden säilyttäminen erillään aseesta on hyvä käytäntö?",
    options: [
      "Koska se näyttää siistiltä",
      "Koska se vähentää väärinkäytön ja vahinkojen riskiä",
      "Koska patruunat pilaantuvat muuten",
      "Koska se on aina pakollista kaikkialla"
    ],
    correctIndex: 1,
    explanation: "Erottelu pienentää riskejä ja tukee turvallista säilytystä."
  },
  {
    id: "q80",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä varuste on käytännössä tärkeä turvallisuuden kannalta myös metsässä?",
    options: [
      "Kuulonsuojaimet",
      "Solmio",
      "Hajuvesi",
      "Aurinkolasit aina pimeässä"
    ],
    correctIndex: 0,
    explanation: "Kuulonsuojaimet suojaavat kuulovaurioilta ja parantavat turvallisuutta."
  },
  {
    id: "q81",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi ensiaputarvikkeet ovat hyvä osa metsästysvarustusta?",
    options: [
      "Koska ne lisäävät saalista",
      "Koska maastossa voi sattua tapaturmia ja apu voi olla kaukana",
      "Koska se on muodissa",
      "Koska se korvaa turvallisuuden"
    ],
    correctIndex: 1,
    explanation: "Maasto-olosuhteet voivat aiheuttaa tapaturmia; ensiapu parantaa valmiutta."
  },
  {
    id: "q82",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate varusteiden testaamisessa ennen jahtia?",
    options: [
      "Testaan ensimmäistä kertaa jahdissa",
      "Testaan etukäteen turvallisessa ympäristössä",
      "En testaa koskaan",
      "Annan koiran testata"
    ],
    correctIndex: 1,
    explanation: "Etukäteistestaus vähentää virheitä tositilanteessa."
  },
  {
    id: "q83",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi näkyvä pukeutuminen voi olla tärkeää metsästyksessä?",
    options: [
      "Koska se on aina pakollista kaikkialla",
      "Koska se parantaa muiden metsästäjien havaittavuutta ja vähentää vaaratilanteita",
      "Koska se pelottaa riistan aina pois",
      "Koska se korvaa taustatarkistuksen"
    ],
    correctIndex: 1,
    explanation: "Havaittavuus vähentää onnettomuusriskiä ja tukee turvallista jahtia."
  },
  {
    id: "q84",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä toimintatapa, jos epäilet piipun olevan tukossa (esim. maa/lumi)?",
    options: [
      "Ammun varmuuden vuoksi 'puhdistuslaukauksen'",
      "Keskeytän ja tarkistan/puolustan piipun esteettömyyden ennen käyttöä",
      "Koputan piippua puuhun ja jatkan",
      "Ignoroin"
    ],
    correctIndex: 1,
    explanation: "Tukos voi rikkoa aseen ja aiheuttaa vaaran; piippu tarkistetaan ennen ampumista."
  },
  {
    id: "q85",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate otsalampun/valon käyttöön (turvallisuus)?",
    options: [
      "Valoa ei tarvita koskaan",
      "Riittävä valaistus auttaa liikkumisessa ja vähentää kompastumisia",
      "Valo on vain esteettinen",
      "Valo häiritsee aina"
    ],
    correctIndex: 1,
    explanation: "Hyvä näkyvyys vähentää tapaturmariskiä maastossa."
  },
  {
    id: "q86",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi kartta/GPS voi olla turvallisuusvaruste metsästyksessä?",
    options: [
      "Koska se tekee metsästyksestä laittomampaa",
      "Koska se auttaa pysymään alueella ja löytämään paikkoja (esim. osumapaikka)",
      "Koska se korvaa suunnistustaidon aina",
      "Koska se lisää saalisvarmuutta taianomaisesti"
    ],
    correctIndex: 1,
    explanation: "Paikkatieto auttaa turvallisuudessa ja vastuullisuudessa (rajat, osumapaikka, reitit)."
  },
  {
    id: "q87",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate varavirtalähteen suhteen pidemmällä reissulla?",
    options: [
      "Ei tarvita koskaan",
      "Varavirtalähde voi auttaa pitämään puhelimen/GPS:n toiminnassa hätätilanteessa",
      "Se on vain mukavuus",
      "Se tekee metsästyksestä vaarallisempaa"
    ],
    correctIndex: 1,
    explanation: "Yhteydenpito ja paikannus voivat olla kriittisiä; varavirta parantaa valmiutta."
  },
  {
    id: "q88",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi koiran varusteisiin (esim. heijastin/huomioväri, paikannin) panostetaan usein?",
    options: [
      "Koska koira on koriste",
      "Koska se voi parantaa koiran turvallisuutta ja löytymistä",
      "Koska se on pakollista aina",
      "Koska se korvaa koulutuksen"
    ],
    correctIndex: 1,
    explanation: "Koiran havaittavuus ja löytyminen parantavat turvallisuutta."
  },
  {
    id: "q89",
    type: QuestionType.GEAR,
    difficulty: Difficulty.HARD,
    question: "Mikä on järkevä tapa pitää varusteet turvallisina ja toimintakuntoisina?",
    options: [
      "Säilytän märät varusteet kassissa",
      "Kuivaan ja huollan varusteet käytön jälkeen",
      "Heitän varusteet nurkkaan",
      "En tarkista mitään"
    ],
    correctIndex: 1,
    explanation: "Huolto ja kuivaus lisäävät käyttövarmuutta ja turvallisuutta."
  },
  {
    id: "q90",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä periaate laukkujen ja varusteiden sijoittelussa autossa?",
    options: [
      "Ase ja patruunat irrallaan penkillä",
      "Varusteet järjestyksessä niin, että ase kulkee turvallisesti ja hallitusti",
      "Kaikki samaan kasaan",
      "Patruunat lattialle"
    ],
    correctIndex: 1,
    explanation: "Järjestys ja turvallinen kuljetus vähentävät vahinkoja ja sekaannuksia."
  },
  {
    id: "q91",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Miksi lämpimät ja säänmukaiset varusteet ovat myös turvallisuutta?",
    options: [
      "Koska ne näyttävät paremmalta",
      "Koska kylmä ja kastuminen heikentävät toimintakykyä ja harkintaa",
      "Koska ne lisäävät saalista",
      "Koska ne korvaavat ensiavun"
    ],
    correctIndex: 1,
    explanation: "Paleltuminen/kylmä heikentää toimintakykyä ja voi lisätä riskejä."
  },
  {
    id: "q92",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä periaate veitsen käytössä ja säilytyksessä retkellä?",
    options: [
      "Pidän terän aina esillä",
      "Käytän hallitusti ja säilytän turvallisesti (tuppi/teräsuoja)",
      "Heitän repun pohjalle ilman suojaa",
      "Annan lasten leikkiä"
    ],
    correctIndex: 1,
    explanation: "Teräaseet säilytetään turvallisesti ja käytetään hallitusti tapaturmien välttämiseksi."
  },
  {
    id: "q93",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Miksi vaihtovaatteet voivat olla hyödyllisiä jahdissa?",
    options: [
      "Koska muoti",
      "Koska kastuminen/kylmettyminen voi olla turvallisuusriski ja vaihtovaatteet parantavat toimintakykyä",
      "Koska se lisää saalista",
      "Koska se on aina pakollista"
    ],
    correctIndex: 1,
    explanation: "Olosuhteet voivat muuttua; kuivana ja lämpimänä pysyminen tukee turvallisuutta."
  },
  {
    id: "q94",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate radiopuhelimen/viestintävälineen käytössä porukassa?",
    options: [
      "Ei viestitä koskaan",
      "Sovitaan kanava ja perusviestit etukäteen, jotta tieto kulkee selkeästi",
      "Viestitään vain huutamalla",
      "Viestitään vain jos joku loukkaantuu"
    ],
    correctIndex: 1,
    explanation: "Selkeä viestintä vähentää sekaannuksia ja parantaa turvallisuutta."
  },
  {
    id: "q95",
    type: QuestionType.GEAR,
    difficulty: Difficulty.HARD,
    question: "Miksi ampumaharjoitteluun liittyvät varusteet (esim. tuki, hihna, optiikan säädöt) kannattaa opetella etukäteen?",
    options: [
      "Koska se tekee aseesta laittoman",
      "Koska se parantaa hallintaa ja vähentää hutiosumia/haavakoita",
      "Koska se on vain kilpailijoille",
      "Koska se korvaa taustatarkistuksen"
    ],
    correctIndex: 1,
    explanation: "Hallinta parantaa osumavarmuutta ja vähentää riskejä ja eläimen kärsimystä."
  },
  {
    id: "q96",
    type: QuestionType.GEAR,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä periaate varusteiden määrässä aloittelijalle?",
    options: [
      "Mitä enemmän, sen parempi",
      "Perusvarusteet ensin: turvallisuus ja olosuhteissa pärjääminen, sitten lisävarusteet tarpeen mukaan",
      "Ostat vain kalleimman",
      "Et hanki mitään"
    ],
    correctIndex: 1,
    explanation: "Ydin on turvallisuus ja käytettävyys; liika tavara voi myös hankaloittaa toimintaa."
  },
  {
    id: "q97",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on hyvä tapa toimia, jos et tiedä varmasti metsästysalueen rajaa maastossa?",
    options: [
      "Jatkat jahtia rajan yli, koska 'varmaan saa'",
      "Pysähdyt ja varmistat rajan (kartta/GPS/porukan tieto) ennen jatkamista",
      "Ammut nopeasti ja palaat",
      "Kysyt myöhemmin"
    ],
    correctIndex: 1,
    explanation: "Rajoista epävarmassa tilanteessa toimitaan huolellisesti ja varmistetaan ennen etenemistä."
  },
  {
    id: "q98",
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on järkevä periaate metsästyksen suunnittelussa porukalla?",
    options: [
      "Suunnitelmaa ei tarvita",
      "Sovitaan roolit, ampumasektorit, viestintä ja turvallisuusrutiinit ennen aloittamista",
      "Sovitaan vain saalismäärä",
      "Sovitaan vain lähtöaika"
    ],
    correctIndex: 1,
    explanation: "Yhteiset pelisäännöt ja sektorit vähentävät vaaratilanteita ja lisäävät hallittavuutta."
  },
  {
    id: "q99",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.NORMAL,
    question: "Mikä on eettisesti paras tapa suhtautua hutilaukauksiin ja epävarmuuteen?",
    options: [
      "Ammut silti, koska tilaisuus ei tule takaisin",
      "Pidät riman korkealla: ammut vain varmoissa tilanteissa ja harjoittelet lisää",
      "Syytät varusteita ja jatkat",
      "Ammut useamman kerran nopeasti"
    ],
    correctIndex: 1,
    explanation: "Eettisyys vaatii varmuutta; harjoittelu on parempi ratkaisu kuin riskilaukaukset."
  },
  {
    id: "q100",
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä periaate metsästyksen ja luonnonhoidon suhteessa?",
    options: [
      "Niillä ei ole yhteyttä",
      "Vastuullinen metsästys ja riistanhoito tukevat kestävää luonnon käyttöä",
      "Riistanhoito on vain koriste",
      "Luonto hoitaa aina kaiken"
    ],
    correctIndex: 1,
    explanation: "Kestävä metsästys liittyy myös riistanhoitoon ja luonnon kunnioitukseen."
  },
  {
    id: "q101",
    type: QuestionType.GEAR,
    difficulty: Difficulty.EASY,
    question: "Mikä on hyvä käytäntö, jotta puhelimesta on hyötyä hätätilanteessa?",
    options: [
      "Akku aina tyhjänä",
      "Pidät puhelimen ladattuna ja tiedät, miten saat sijainnin jaettua",
      "Puhelin lentotilassa aina",
      "Puhelin kotona"
    ],
    correctIndex: 1,
    explanation: "Hätätilanteessa yhteydenpito ja sijainnin jakaminen voivat olla olennaisia, joten valmistautuminen auttaa."
  }


  // --- DATE-SENSITIVE (metsästysajat / rauhoitusajat) ---
  {
    id: 'q102',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Hirven metsästysaika (pyyntiluvalla) päättyy koko maassa milloin metsästysvuonna 2025–2026?',
    options: [
      '31.12.2025',
      '15.1.2026',
      '15.2.2026',
      '31.3.2026'
    ],
    correctIndex: 1,
    explanation: 'Suomen riistakeskuksen tiedotteen mukaan hirven metsästysaika päättyy koko maassa 15.1.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q103',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Valkohäntäpeuran varsinainen metsästysaika (pyyntiluvalla) on koko maassa metsästysvuonna 2025–2026 pääosin:',
    options: [
      '1.9.2025–26.9.2025',
      '27.9.2025–15.2.2026',
      '10.9.2025–31.12.2025',
      '1.10.2025–15.1.2026'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n mukaan valkohäntäpeuran varsinainen metsästysaika alkaa 27.9.2025 ja päättyy 15.2.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q104',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Valkohäntäpeuraa saa vahtimalla metsästää pyyntiluvalla myös ennen varsinaista kautta. Mikä ajanjakso on mainittu riista.fi:ssä metsästysvuodelle 2025–2026 (ei Lapin maakunnassa)?',
    options: [
      '1.8.2025–31.8.2025',
      '1.9.2025–26.9.2025',
      '16.5.2025–15.6.2025',
      '1.9.2025–15.2.2026'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n valkohäntäpeura-sivun mukaan vahtimalla metsästys on 1.9.2025–26.9.2025, ei Lapin maakunnassa. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q105',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Metsäkauriin metsästysaika on koko maassa metsästysvuonna 2025–2026 pääosin:',
    options: [
      '1.9.2025–15.2.2026',
      '27.9.2025–15.1.2026',
      '10.9.2025–31.3.2026',
      '1.10.2025–31.12.2025'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n metsäkauris-sivun mukaan metsäkaurista saa metsästää koko maassa 1.9.2025–15.2.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q106',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n mukaan metsäkauriin uroksen (pukki) metsästys on erikseen sallittu keväällä. Mikä ajanjakso on mainittu metsästysvuodelle 2025?',
    options: [
      '16.5.2025–15.6.2025',
      '1.4.2025–30.4.2025',
      '1.6.2025–31.7.2025',
      '1.9.2025–26.9.2025'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n metsäkauris-sivulla on erillinen ajanjakso urokselle 16.5.2025–15.6.2025. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q107',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Metsäkauriin metsästyksessä ajavan koiran käyttö on riista.fi:n mukaan sallittua metsästysvuonna 2025–2026 alkaen:',
    options: [
      '1.9.2025',
      '10.9.2025',
      '27.9.2025',
      '1.1.2026'
    ],
    correctIndex: 2,
    explanation: 'Riista.fi:n metsäkauris-sivun mukaan ajavan koiran käyttö on sallittua 27.9.2025 alkaen. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q108',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n mukaan hirven metsästys (pyyntiluvalla) alkaa metsästysvuonna 2025–2026 eri aikaan eri alueilla. Mikä on aloituspäivä Lapin, Pohjois-Pohjanmaan ja Kainuun maakunnissa?',
    options: [
      '1.9.2025',
      '4.10.2025',
      '11.10.2025',
      '27.9.2025'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n hirvi-sivulla Lapin, Pohjois-Pohjanmaan ja Kainuun pyyntijakso on 4.10.2025–15.1.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q109',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n mukaan hirven metsästys (pyyntiluvalla) alkaa metsästysvuonna 2025–2026 muualla kuin Lapin, Pohjois-Pohjanmaan ja Kainuun maakunnissa:',
    options: [
      '1.9.2025',
      '4.10.2025',
      '11.10.2025',
      '27.9.2025'
    ],
    correctIndex: 2,
    explanation: 'Riista.fi:n hirvi-sivun mukaan muualla aloitus on 11.10.2025 ja kausi päättyy 15.1.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q110',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n hirvi-sivulla mainitaan poronhoitoalueen koirankäyttörajoitus hirven metsästyksessä. Mikä ajanjakso on mainittu?',
    options: [
      '1.1.–15.1.2026',
      '1.9.–20.9.2025',
      '27.9.–15.2.2026',
      '10.9.–31.10.2025'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n hirvi-sivulla todetaan, että poronhoitoalueella koiran käyttäminen hirven metsästykseen on kielletty 1.1.–15.1.2026 (ei koske haavoittuneen jäljittämistä). Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q111',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n Lapin hirvilupauutisen mukaan hirvenmetsästyksessä Lapissa on ensimmäinen pyyntijakso. Mikä ajanjakso on mainittu?',
    options: [
      '1.9.–20.9.2025',
      '4.10.–15.1.2026',
      '11.10.–15.1.2026',
      '27.9.–15.2.2026'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n uutisen mukaan Lapissa ensimmäinen pyyntijakso on 1.9.–20.9.2025. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q112',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Samassa Lapin hirvilupauutisessa mainitaan toinen pyyntijakso. Mikä ajanjakso on mainittu?',
    options: [
      '1.9.–20.9.2025',
      '4.10.2025–15.1.2026',
      '11.10.2025–15.1.2026',
      '10.9.2025–31.3.2026'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n uutisen mukaan Lapissa toinen pyyntijakso alkaa 4.10.2025 ja päättyy 15.1.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q113',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n mukaan riekon metsästysaika metsästysvuonna 2025–2026 Enontekiössä, Inarissa ja Utsjoella on:',
    options: [
      '10.9.2025–31.3.2026',
      '10.9.2025–31.10.2025',
      '1.9.2025–15.2.2026',
      '27.9.2025–15.2.2026'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n riekko-sivun mukaan Enontekiössä, Inarissa ja Utsjoella metsästysaika on 10.9.2025–31.3.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q114',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Riista.fi:n mukaan kiirunan metsästysaika Lapin maakuntaan kuuluvissa Enontekiön, Inarin ja Utsjoen kunnissa metsästysvuonna 2025–2026 on:',
    options: [
      '10.9.2025–31.3.2026',
      '10.9.2025–31.10.2025',
      '1.9.2025–15.2.2026',
      'Ei metsästystä missään'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n kiiruna-sivun mukaan metsästysaika Enontekiössä, Inarissa ja Utsjoella on 10.9.2025–31.3.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q115',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Riista.fi:n mukaan kiirunaa saa metsästää muualla Suomessa kuin Enontekiössä, Inarissa ja Utsjoella:',
    options: [
      'Kyllä, koko maassa',
      'Kyllä, vain Etelä-Suomessa',
      'Ei, muualla maassa ei metsästystä',
      'Vain saaristossa'
    ],
    correctIndex: 2,
    explanation: 'Riista.fi:n kiiruna-sivun mukaan muualla maassa ei ole metsästystä. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q116',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Riista.fi:n mukaan metsäkanalintujen metsästys käynnistyy metsästysvuonna 2025–2026 milloin?',
    options: [
      '1.9.2025',
      '10.9.2025',
      '27.9.2025',
      '11.10.2025'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n tiedotteen mukaan metsäkanalinnustus alkaa 10.9.2025. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q117',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Valkohäntäpeuran varsinainen metsästysaika (pyyntiluvalla) päättyy metsästysvuonna 2025–2026 milloin?',
    options: [
      '15.1.2026',
      '15.2.2026',
      '31.3.2026',
      '30.11.2025'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n mukaan valkohäntäpeuran varsinainen metsästysaika päättyy 15.2.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q118',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Metsäkauriin pääasiallinen metsästysaika (koko maassa) päättyy riista.fi:n mukaan milloin metsästysvuonna 2025–2026?',
    options: [
      '15.1.2026',
      '15.2.2026',
      '31.12.2025',
      '31.3.2026'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n metsäkauris-sivun mukaan kausi päättyy 15.2.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q119',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.EASY,
    question: 'Hirven metsästyskauden päättymispäivä koko maassa metsästysvuonna 2025–2026 on:',
    options: [
      '15.1.2026',
      '15.2.2026',
      '31.3.2026',
      '20.9.2025'
    ],
    correctIndex: 0,
    explanation: 'Riista.fi:n mukaan hirven metsästysaika päättyy 15.1.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q120',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Riekon metsästysaika Enontekiössä, Inarissa ja Utsjoella päättyy metsästysvuonna 2025–2026 milloin?',
    options: [
      '31.10.2025',
      '15.2.2026',
      '15.1.2026',
      '31.3.2026'
    ],
    correctIndex: 3,
    explanation: 'Riista.fi:n mukaan riekon metsästysaika mainituissa kunnissa päättyy 31.3.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
  {
    id: 'q121',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Kiirunan metsästysaika Enontekiössä, Inarissa ja Utsjoella päättyy metsästysvuonna 2025–2026 milloin?',
    options: [
      '31.10.2025',
      '31.3.2026',
      '15.2.2026',
      '15.1.2026'
    ],
    correctIndex: 1,
    explanation: 'Riista.fi:n mukaan kiirunan metsästysaika mainituissa kunnissa päättyy 31.3.2026. Ajantasaisuus: 3.1.2026 tiedon mukaisesti – tarkista aina ajantasaiset metsästysajat riista.fi/Finlexistä ennen pyyntiä.'
  },
];
