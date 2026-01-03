import { Question, QuestionType, Difficulty, Species } from './types';

export const EXAM_QUESTION_COUNT = 60;
export const PASS_MARK = 45;
export const EXAM_TIME_LIMIT = 90 * 60;

export const SPECIES_DB: Species[] = [
  // HIRVIELÄIMET
  { name: 'Hirvi', latin: 'Alces alces', en: 'moose', group: 'Hirvieläimet', info: 'Suomen suurin nisäkäs. Tunnista koosta, kyhmyisestä turvasta ja vaaleista jaloista.', commonsCategory: 'Category:Alces_alces' },
  { name: 'Valkohäntäpeura', latin: 'Odocoileus virginianus', en: 'white-tailed-deer', group: 'Hirvieläimet', info: 'Tunnista pystyyn nousevasta, alta lumivalkoisesta hännästä.', commonsCategory: 'Category:Odocoileus_virginianus' },
  { name: 'Metsäkauris', latin: 'Capreolus capreolus', en: 'roe-deer', group: 'Hirvieläimet', info: 'Pieni koko, ei häntää, valkoinen peräpeili. Lyhyet pystyt sarvet.', commonsCategory: 'Category:Capreolus_capreolus' },
  { name: 'Metsäpeura', latin: 'Rangifer tarandus fennicus', en: 'reindeer', group: 'Hirvieläimet', info: 'Siro ja pitkäjalkainen verrattuna poroon. Sarvet kapeat.', commonsCategory: 'Category:Rangifer_tarandus_fennicus' },
  { name: 'Kuusipeura', latin: 'Dama dama', en: 'fallow-deer', group: 'Hirvieläimet', info: 'Täplikäs turkki, lapiomaiset sarvet.', commonsCategory: 'Category:Dama_dama' },

  // METSÄKANALINNUT
  { name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras (koppelo) ruskeankirjava ja rinnasta ruosteenvärinen.', commonsCategory: 'Category:Tetrao_urogallus' },
  { name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black-grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö. Naaraalla selvä lovi pyrstössä.', commonsCategory: 'Category:Lyrurus_tetrix' },
  { name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel-grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava. Tunnusomainen töyhtö päässä.', commonsCategory: 'Category:Tetrastes_bonasia' },
  { name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow-ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen, pyrstön reunasulat mustat. Kesällä ruskea, siivet valkoiset.', commonsCategory: 'Category:Lagopus_lagopus' },
  { name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock-ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturiylänköjen lintu. Kesällä harmaampi kuin riekko.', commonsCategory: 'Category:Lagopus_muta' },

  // VESILINNUT
  { name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa. Uroksella vihreä pää, naaras on ruskeankirjava.', commonsCategory: 'Category:Anas_platyrhynchos' },
  { name: 'Tavi', latin: 'Anas crecca', en: 'teal-duck', group: 'Vesilinnut', info: 'Pienin sorsa. Vihreä silmäjuova ja kirkas vihreä siipipeili.', commonsCategory: 'Category:Anas_crecca' },
  { name: 'Haapana', latin: 'Mareca penelope', en: 'wigeon', group: 'Vesilinnut', info: 'Uroksella punaruskea pää ja keltainen otsa. Vaalea siipilaikku.', commonsCategory: 'Category:Mareca_penelope' },
  { name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern-pintail', group: 'Vesilinnut', info: 'Siro kaula, piikkimäinen pyrstö.', commonsCategory: 'Category:Anas_acuta' },
  { name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'shoveler', group: 'Vesilinnut', info: 'Erittäin suuri, lusikkamainen nokka.', commonsCategory: 'Category:Spatula_clypeata' },
  { name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted-duck', group: 'Vesilinnut', info: 'Mustavalkoinen sukeltajasorsa, päässä selvä töyhtö.', commonsCategory: 'Category:Aythya_fuligula' },
  { name: 'Telkkä', latin: 'Bucephala clangula', en: 'goldeneye-duck', group: 'Vesilinnut', info: 'Kuparinruskea (naaras) tai mustavalkoinen (uros) pää. Keltainen silmä.', commonsCategory: 'Category:Bucephala_clangula' },
  { name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Suuri, virtaviivainen. Pitkä punainen nokka.', commonsCategory: 'Category:Mergus_merganser' },
  { name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean-goose', group: 'Vesilinnut', info: 'Ruskeanharmaa hanhi, nokka musta-oranssi.', commonsCategory: 'Category:Anser_fabalis' },
  { name: 'Merihanhi', latin: 'Anser anser', en: 'greylag-goose', group: 'Vesilinnut', info: 'Vaalea, oranssi nokka, vaaleanharmaat siiven etureunat.', commonsCategory: 'Category:Anser_anser' },

  // PIENPEDOT
  { name: 'Kettu', latin: 'Vulpes vulpes', en: 'red-fox', group: 'Pienpedot', info: 'Punainen turkki, valkoinen hännänpää. Suuret korvat.', commonsCategory: 'Category:Vulpes_vulpes' },
  { name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon-dog', group: 'Pienpedot', info: 'Vieraslaji. Musta naamarikuvio, lyhyet jalat.', commonsCategory: 'Category:Nyctereutes_procyonoides' },
  { name: 'Mäyrä', latin: 'Meles meles', en: 'badger', group: 'Pienpedot', info: 'Valkoiset juovat naaman sivuilla.', commonsCategory: 'Category:Meles_meles' },
  { name: 'Näätä', latin: 'Martes martes', en: 'pine-marten', group: 'Pienpedot', info: 'Ruskea, keltainen kurkkulaikku. Kiipeilee puissa.', commonsCategory: 'Category:Martes_martes' },
  { name: 'Minkki', latin: 'Neovison vison', en: 'mink', group: 'Pienpedot', info: 'Tummanruskea/musta, pieni valkoinen laikku alaleuassa.', commonsCategory: 'Category:Neovison_vison' },

  // RAUHOITETUT
  { name: 'Merikotka', latin: 'Haliaeetus albicilla', en: 'white-tailed-eagle', group: 'Rauhoitetut', info: 'Valtava koko, tasaleveät siivet. Vanhoilla yksilöillä valkoinen pyrstö.', commonsCategory: 'Category:Haliaeetus_albicilla' },
  { name: 'Maakotka', latin: 'Aquila chrysaetos', en: 'golden-eagle', group: 'Rauhoitetut', info: 'Suuri, niskassa kultaista sävyä. Pyrstö usein tummempi.', commonsCategory: 'Category:Aquila_chrysaetos' },
  { name: 'Kanahaukka', latin: 'Accipiter gentilis', en: 'goshawk', group: 'Rauhoitetut', info: 'Poikittaisviiruinen vatsa, keltaiset silmät.', commonsCategory: 'Category:Accipiter_gentilis' },
  { name: 'Sääksi', latin: 'Pandion haliaetus', en: 'osprey', group: 'Rauhoitetut', info: 'Valkoinen vatsa, musta silmäjuova. Siivet tyvestä taitteella.', commonsCategory: 'Category:Pandion_haliaetus' },
  { name: 'Laulujoutsen', latin: 'Cygnus cygnus', en: 'whooper-swan', group: 'Rauhoitetut', info: 'Suomen kansallislintu. Kokovalkoinen, nokka keltainen ja musta.', commonsCategory: 'Category:Cygnus_cygnus' },
];

// Nämä jäi sinulla vanhasta koodista käyttöön muualla, joten pidetään Sample-questit edelleen kasassa.
const STATIC_POOL: Question[] = [
  {
    id: 'safe-1',
    type: QuestionType.SAFETY,
    difficulty: Difficulty.NORMAL,
    question: 'Milloin metsästäjällä on velvollisuus tunnistaa kohde?',
    options: ['Vain hämärässä.', 'Aina ennen varmistusotetta ja laukausta.', 'Vain jos kyseessä on hirvieläin.', 'Jos alueella on muita metsästäjiä.'],
    correctIndex: 1,
    explanation: 'Lajin ja kohteen täydellinen tunnistaminen on metsästäjän perusvelvollisuus aina ennen laukausta.'
  },
  {
    id: 'reg-1',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.HARD,
    question: 'Mitä tarkoitetaan riistanhoitomaksulla?',
    options: ['Vapaaehtoista lahjoitusta luonnolle.', 'Valtiolle suoritettavaa vuosittaista maksua (metsästyskortti).', 'Metsästysseuran jäsenmaksua.', 'Aseenkantolupamaksua.'],
    correctIndex: 1,
    explanation: 'Riistanhoitomaksu on lakisääteinen maksu, joka on suoritettava vuosittain metsästysoikeuden säilyttämiseksi.'
  }
];

export const SAMPLE_QUESTIONS: Question[] = [
  // Tunnistuspelissä luodaan kysymykset erikseen (IdentificationGames.tsx), mutta pidetään tämä varalla muun appin osalta.
  ...STATIC_POOL
];
