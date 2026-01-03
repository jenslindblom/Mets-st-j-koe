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
  { name: 'Villisika', latin: 'Sus scrofa', en: 'wild boar', group: 'Hirvieläimet', info: 'Tunnista jykevästä rungosta, kärsästä ja usein tummasta harjaksesta.', images: [] },

  // PUUTTUVAT SORKKAELÄIMET (placeholderit)
  { name: 'Saksanhirvi', latin: 'Cervus elaphus', en: 'red deer', group: 'Hirvieläimet', info: 'Suuri hirvieläin. Uroksella monihaaraiset sarvet (”kruunu”).', images: [] },
  { name: 'Japaninpeura', latin: 'Cervus nippon', en: 'sika deer', group: 'Hirvieläimet', info: 'Keskikokoinen peura. Usein täpläinen turkki ja vaalea peräpeili.', images: [] },
  { name: 'Mufloni', latin: 'Ovis orientalis musimon', en: 'mouflon', group: 'Hirvieläimet', info: 'Villilampaan tyyppinen. Uroksella voimakkaasti kiertyneet sarvet.', images: [] },

  // =========================
  // JÄNISELÄIMET & JYRSIJÄT (uusi ryhmä)
  // =========================
  { name: 'Villikani', latin: 'Oryctolagus cuniculus', en: 'European rabbit', group: 'Jäniseläimet & jyrsijät', info: 'Kani on yleensä pienempi ja pyöreämpi kuin jänikset. Korvat suhteessa lyhyemmät.', images: [] },
  { name: 'Metsäjänis', latin: 'Lepus timidus', en: 'mountain hare', group: 'Jäniseläimet & jyrsijät', info: 'Talviturkki vaalenee/valkenee. Korvan kärjet usein tummat. Suomessa yleinen.', images: [] },
  { name: 'Rusakko', latin: 'Lepus europaeus', en: 'brown hare', group: 'Jäniseläimet & jyrsijät', info: 'Isompi ja pitkäkorvaisempi kuin metsäjänis. Talvella yleensä ruskea.', images: [] },
  { name: 'Orava', latin: 'Sciurus vulgaris', en: 'red squirrel', group: 'Jäniseläimet & jyrsijät', info: 'Tunnista tuuheasta hännästä ja usein korvatupsuista. Väritys vaihtelee.', images: [] },
  { name: 'Euroopanmajava', latin: 'Castor fiber', en: 'Eurasian beaver', group: 'Jäniseläimet & jyrsijät', info: 'Iso jyrsijä. Tunnista leveästä, litteästä hännästä ja patoamisesta.', images: [] },
  { name: 'Kanadanmajava', latin: 'Castor canadensis', en: 'North American beaver', group: 'Jäniseläimet & jyrsijät', info: 'Majava kuten euroopanmajava, mutta laji eri. Harjoittelussa tärkeintä tunnistaa “majava”.', images: [] },
  { name: 'Piisami', latin: 'Ondatra zibethicus', en: 'muskrat', group: 'Jäniseläimet & jyrsijät', info: 'Vesistöjen jyrsijä. Pitkä, sivuilta litteä häntä (ei “melahäntä”).', images: [] },
  { name: 'Rämemajava', latin: 'Myocastor coypus', en: 'coypu (nutria)', group: 'Jäniseläimet & jyrsijät', info: 'Iso vesijyrsijä. Usein oranssit etuhampaat. Suomessa harvinainen, mutta listattu riistaeläimiin.', images: [] },

  // =========================
  // METSÄKANALINNUT
  // =========================
  { name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras ruskeankirjava ja rinnasta ruosteenvärinen.', commonsCategory: 'Category:Tetrao_urogallus' },
  { name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö. Naaraalla selvä lovi pyrstössä.', commonsCategory: 'Category:Lyrurus_tetrix' },
  { name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava. Tunnusomainen töyhtö päässä.', commonsCategory: 'Category:Tetrastes_bonasia' },

  // PUUTTUVAT METSÄKANALINNUT (placeholderit)
  { name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen, pyrstön reunasulat mustat. Kesällä ruskea, siivet valkoiset.', images: [] },
  { name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturiylänköjen lintu. Kesällä harmaampi kuin riekko.', images: [] },
  { name: 'Peltopyy', latin: 'Perdix perdix', en: 'grey partridge', group: 'Metsäkanalinnut', info: 'Peltomaisemien kanalintu. Harmaanruskea, usein oranssia naaman seudussa.', images: [] },
  { name: 'Fasaani', latin: 'Phasianus colchicus', en: 'common pheasant', group: 'Metsäkanalinnut', info: 'Uroksella näyttävä väritys ja pitkä pyrstö. Naaraat ruskeankirjavia.', images: [] },

  // =========================
  // VESILINNUT
  // =========================
  { name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa. Uroksella vihreä pää, naaras on ruskeankirjava.', commonsCategory: 'Category:Anas_platyrhynchos' },

  // PUUTTUVAT VESILINNUT (placeholderit)
  { name: 'Tavi', latin: 'Anas crecca', en: 'common teal', group: 'Vesilinnut', info: 'Pienikokoinen sorsa. Uroksella vihreä silmäjuova ja kirkas siipipeili.', images: [] },
  { name: 'Heinätavi', latin: 'Spatula querquedula', en: 'garganey', group: 'Vesilinnut', info: 'Pienikokoinen sorsa. Uroksella vaalea kulmakarvajuova.', images: [] },
  { name: 'Haapana', latin: 'Mareca penelope', en: 'Eurasian wigeon', group: 'Vesilinnut', info: 'Uroksella punaruskea pää ja vaalea otsa. Vaalea siipilaikku.', images: [] },
  { name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern pintail', group: 'Vesilinnut', info: 'Siro kaula ja pitkä, piikkimäinen pyrstö.', images: [] },
  { name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'northern shoveler', group: 'Vesilinnut', info: 'Erittäin suuri, lusikkamainen nokka.', images: [] },
  { name: 'Punasotka', latin: 'Aythya ferina', en: 'common pochard', group: 'Vesilinnut', info: 'Sukeltajasorsa. Uroksella punaruskea pää ja harmaat kyljet.', images: [] },
  { name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted duck', group: 'Vesilinnut', info: 'Mustavalkoinen sukeltajasorsa, päässä selvä töyhtö.', images: [] },
  { name: 'Telkkä', latin: 'Bucephala clangula', en: 'common goldeneye', group: 'Vesilinnut', info: 'Uroksella mustavalkoinen pää ja valkoinen poskilaikku, keltainen silmä.', images: [] },
  { name: 'Haahka', latin: 'Somateria mollissima', en: 'common eider', group: 'Vesilinnut', info: 'Merilintu. Uros mustavalkoinen ja suuri, naaras ruskeankirjava.', images: [] },
  { name: 'Alli', latin: 'Clangula hyemalis', en: 'long-tailed duck', group: 'Vesilinnut', info: 'Merilintu. Uroksella pitkä pyrstö ja voimakas kontrasti (talvella).', images: [] },
  { name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Suuri koskelo. Pitkä punainen sahalaitainen nokka.', images: [] },
  { name: 'Tukkakoskelo', latin: 'Mergus serrator', en: 'red-breasted merganser', group: 'Vesilinnut', info: 'Koskeloista “töyhtöisin”. Uroksella usein punaruskea rinta ja rosoinen töyhtö.', images: [] },
  { name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean goose', group: 'Vesilinnut', info: 'Ruskeanharmaa hanhi, nokka musta-oranssi.', images: [] },
  { name: 'Merihanhi', latin: 'Anser anser', en: 'greylag goose', group: 'Vesilinnut', info: 'Vaaleampi hanhi, oranssi nokka.', images: [] },
  { name: 'Kanadanhanhi', latin: 'Branta canadensis', en: 'Canada goose', group: 'Vesilinnut', info: 'Musta kaula ja valkoinen poskilaikku. Yleinen vesillä ja pelloilla.', images: [] },

  // =========================
  // PIENPEDOT
  // =========================
  { name: 'Kettu', latin: 'Vulpes vulpes', en: 'red fox', group: 'Pienpedot', info: 'Punainen turkki, valkoinen hännänpää. Suuret korvat.', commonsCategory: 'Category:Vulpes_vulpes' },
  { name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon dog', group: 'Pienpedot', info: 'Vieraslaji. Musta naamarikuvio, lyhyet jalat.', commonsCategory: 'Category:Nyctereutes_procyonoides' },

  // PUUTTUVAT PIENPEDOT (placeholderit)
  { name: 'Mäyrä', latin: 'Meles meles', en: 'European badger', group: 'Pienpedot', info: 'Valkoiset juovat naaman sivuilla.', images: [] },
  { name: 'Näätä', latin: 'Martes martes', en: 'pine marten', group: 'Pienpedot', info: 'Ruskea, keltainen kurkkulaikku. Kiipeilee puissa.', images: [] },
  { name: 'Minkki', latin: 'Neovison vison', en: 'American mink', group: 'Pienpedot', info: 'Tummanruskea/musta, usein pieni valkoinen laikku alaleuassa.', images: [] },
  { name: 'Pesukarhu', latin: 'Procyon lotor', en: 'raccoon', group: 'Pienpedot', info: 'Tunnista “naamio” kasvoissa ja rengashännästä. Vieraslaji.', images: [] },
  { name: 'Kärppä', latin: 'Mustela erminea', en: 'stoat', group: 'Pienpedot', info: 'Pieni näätäeläin. Talviturkki voi valkaistua. Musta hännänpää on tyypillinen.', images: [] },
  { name: 'Hilleri', latin: 'Mustela putorius', en: 'European polecat', group: 'Pienpedot', info: 'Tummasävyinen näätäeläin, usein vaaleampi kuono/naamio.', images: [] },
  { name: 'Saukko', latin: 'Lutra lutra', en: 'Eurasian otter', group: 'Pienpedot', info: 'Vesistöjen virtaviivainen näätäeläin. Paksu häntä ja usein vaalea kurkku.', images: [] },

  // =========================
  // SUURPEDOT (uusi ryhmä)
  // =========================
  { name: 'Susi', latin: 'Canis lupus', en: 'wolf', group: 'Suurpedot', info: 'Koiramainen peto. Suorat jalat, pitkä kuono, häntä roikkuu usein alhaalla.', images: [] },
  { name: 'Tarhattu naali', latin: 'Vulpes lagopus', en: 'Arctic fox (farmed)', group: 'Suurpedot', info: 'Naali on pienikokoinen kettulaji. “Tarhattu” viittaa kasvatettuihin yksilöihin.', images: [] },
  { name: 'Karhu', latin: 'Ursus arctos', en: 'brown bear', group: 'Suurpedot', info: 'Hyvin suuri peto. Tunnista massiivisesta rungosta ja lyhyestä hännästä.', images: [] },
  { name: 'Ahma', latin: 'Gulo gulo', en: 'wolverine', group: 'Suurpedot', info: 'Jykevä näätäeläin. Tummanruskea, usein vaalea “sivuraita”.', images: [] },
  { name: 'Ilves', latin: 'Lynx lynx', en: 'Eurasian lynx', group: 'Suurpedot', info: 'Kissamainen peto. Lyhyt häntä mustalla kärjellä, korvissa tupsut.', images: [] },

  // =========================
  // HYLKEET (uusi ryhmä)
  // =========================
  { name: 'Itämeren norppa', latin: 'Pusa hispida botnica', en: 'Baltic ringed seal', group: 'Hylkeet', info: 'Pieni hylje. Pyöreähkö pää, usein “renkaalliset” kuviot turkissa.', images: [] },
  { name: 'Kirjohylje', latin: 'Phoca vitulina', en: 'harbour seal', group: 'Hylkeet', info: 'Usein täpläinen turkki, pyöreämpi pää kuin hallilla.', images: [] },
  { name: 'Halli', latin: 'Halichoerus grypus', en: 'grey seal', group: 'Hylkeet', info: 'Suurempi hylje. Pitkä kuono (“hevosenpää”).', images: [] },

  // =========================
  // MUUT RIISTALINNUT
  // =========================
  { name: 'Sepelkyyhky', latin: 'Columba palumbus', en: 'common wood pigeon', group: 'Muut riistalinnut', info: 'Suurin kyyhkymme. Valkoinen kaulalaikku ja siipijuova.', commonsCategory: 'Category:Columba_palumbus' },

  // PUUTTUVAT MUUT RIISTALINNUT (placeholderit)
  { name: 'Nokikana', latin: 'Fulica atra', en: 'Eurasian coot', group: 'Muut riistalinnut', info: 'Mustahko vesilintu, valkoinen otsakilpi ja nokka.', images: [] },
  { name: 'Lehtokurppa', latin: 'Scolopax rusticola', en: 'Eurasian woodcock', group: 'Muut riistalinnut', info: 'Lyhytjalkaisen oloinen kahlaaja. Pitkä suora nokka ja ruskeankirjava suojaväri.', images: [] },
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
    id: 'q2',
    type: QuestionType.REGULATION,
    difficulty: Difficulty.NORMAL,
    question: 'Milloin metsästysrikkomuksesta voidaan määrätä metsästyskielto?',
    options: [
      'Aina kun saa sakon',
      'Kun rikotaan säännöksiä törkeästi tai toistuvasti',
      'Vain jos kyseessä on hirvieläin',
      'Ei koskaan, vain sakko on mahdollinen'
    ],
    correctIndex: 1,
    explanation: 'Metsästyskielto on turvaamistoimi, jota käytetään vakavissa tai toistuvissa rikkomuksissa.'
  },
  {
    id: 'q3',
    type: QuestionType.ETHICS,
    difficulty: Difficulty.EASY,
    question: 'Miten haavoittunutta riistaeläintä tulee kohdella?',
    options: [
      'Annetaan sen paeta rauhassa',
      'Lopetetaan eläin mahdollisimman nopeasti kärsimysten välttämiseksi',
      'Odotetaan seuraavaan päivään ennen etsintää',
      'Soitetaan poliisille ja odotetaan lupaa'
    ],
    correctIndex: 1,
    explanation: 'Metsästäjän eettinen velvollisuus on estää eläimen tarpeeton kärsimys.'
  }
];
