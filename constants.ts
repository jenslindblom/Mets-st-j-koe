
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
{ name: 'Tarhattu naali', latin: 'Vulpes lagopus', en: 'Arctic fox', group: 'Suurpedot', info: 'Pienikokoinen ja siro.', commonsCategory: 'Category:Vulpes_lagopus' },
{ name: 'Karhu', latin: 'Ursus arctos', en: 'brown bear', group: 'Suurpedot', info: 'Massiivinen.', commonsCategory: 'Category:Ursus_arctos' },
{ name: 'Ahma', latin: 'Gulo gulo', en: 'wolverine', group: 'Suurpedot', info: 'Jykevä.', commonsCategory: 'Category:Gulo_gulo' },
{ name: 'Ilves', latin: 'Lynx lynx', en: 'Eurasian lynx', group: 'Suurpedot', info: 'Korvatupsut.', commonsCategory: 'Category:Lynx_lynx' },
 
   // =========================
   // HYLKEET
   // =========================
{ name: 'Itämeren norppa', latin: 'Pusa hispida botnica', en: 'Baltic ringed seal', group: 'Hylkeet', info: 'Pieni hylje.', commonsCategory: 'Category:Pusa_hispida_botnica' },
{ name: 'Kirjohylje', latin: 'Phoca vitulina', en: 'harbour seal', group: 'Hylkeet', info: 'Täpläinen ja siro.', commonsCategory: 'Category:Phoca_vitulina' },
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
  },
  // ... muut kysymykset pidetään samoina ...
];
