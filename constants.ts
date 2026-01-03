import { Question, QuestionType, Difficulty, Species } from './types';

export const EXAM_QUESTION_COUNT = 60;
export const PASS_MARK = 45;
export const EXAM_TIME_LIMIT = 90 * 60;

export const SPECIES_DB: Species[] = [
  // =========================
  // SORKKAELÄIMET / HIRVIELÄIMET (pidetään sun ryhmänimi, vaikka mukana myös villisika & mufloni)
  // =========================
  { name: 'Hirvi', latin: 'Alces alces', en: 'moose', group: 'Hirvieläimet', info: 'Suomen suurin nisäkäs. Tunnista koosta, kyhmyisestä turvasta ja vaaleista jaloista.', commonsCategory: 'Category:Alces_alces' },
  { name: 'Valkohäntäpeura', latin: 'Odocoileus virginianus', en: 'white-tailed deer', group: 'Hirvieläimet', info: 'Tunnista pystyyn nousevasta, alta lumivalkoisesta hännästä.', commonsCategory: 'Category:Odocoileus_virginianus' },
  { name: 'Metsäkauris', latin: 'Capreolus capreolus', en: 'roe deer', group: 'Hirvieläimet', info: 'Pieni koko, ei häntää, valkoinen peräpeili. Lyhyet pystyt sarvet.', commonsCategory: 'Category:Capreolus_capreolus' },
  { name: 'Metsäpeura', latin: 'Rangifer tarandus fennicus', en: 'Finnish forest reindeer', group: 'Hirvieläimet', info: 'Siro ja pitkäjalkainen verrattuna poroon. Sarvet kapeat.', commonsCategory: 'Category:Rangifer_tarandus_fennicus' },
  { name: 'Kuusipeura', latin: 'Dama dama', en: 'fallow deer', group: 'Hirvieläimet', info: 'Täplikäs turkki, lapiomaiset sarvet.', commonsCategory: 'Category:Dama_dama' },

  // PUUTTUI: villisika, saksanhirvi, japaninpeura, mufloni
  // Placeholder: commonsCategory puuttuu tarkoituksella → SafeImage näyttää placeholderin.
  { name: 'Villisika', latin: 'Sus scrofa', en: 'wild boar', group: 'Hirvieläimet', info: 'Tunnista jykevästä rungosta, kärsästä ja usein tummasta harjaksesta. Usein kulkee porsaineen.', images: [] },
  { name: 'Saksanhirvi', latin: 'Cervus elaphus', en: 'red deer', group: 'Hirvieläimet', info: 'Suuri hirvieläin. Uroksella monihaaraiset sarvet (”kruunu”).', images: [] },
  { name: 'Japaninpeura', latin: 'Cervus nippon', en: 'sika deer', group: 'Hirvieläimet', info: 'Keskikokoinen peura. Usein täpläinen turkki ja vaalea peräpeili.', images: [] },
  { name: 'Mufloni', latin: 'Ovis orientalis musimon', en: 'mouflon', group: 'Hirvieläimet', info: 'Villilampaan tyyppinen. Uroksella voimakkaasti kiertyneet sarvet.', images: [] },

  // =========================
  // JÄNISELÄIMET & JYRSIJÄT (uusi ryhmä → valittavaksi UI:ssa)
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
  // METSÄKANALINNUT (sun ryhmä)
  // =========================
  { name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras (koppelo) ruskeankirjava ja rinnasta ruosteenvärinen.', commonsCategory: 'Category:Tetrao_urogallus' },
  { name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö. Naaraalla selvä lovi pyrstössä.', commonsCategory: 'Category:Lyrurus_tetrix' },
  { name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava. Tunnusomainen töyhtö päässä.', commonsCategory: 'Category:Tetrastes_bonasia' },
  { name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen, pyrstön reunasulat mustat. Kesällä ruskea, siivet valkoiset.', commonsCategory: 'Category:Lagopus_lagopus' },
  { name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturiylänköjen lintu. Kesällä harmaampi kuin riekko.', commonsCategory: 'Category:Lagopus_muta' },

  // PUUTTUI: peltopyy, fasaani
  { name: 'Peltopyy', latin: 'Perdix perdix', en: 'grey partridge', group: 'Metsäkanalinnut', info: 'Peltomaisemien kanalintu. Harmaanruskea, usein oranssia naaman seudussa.', images: [] },
  { name: 'Fasaani', latin: 'Phasianus colchicus', en: 'common pheasant', group: 'Metsäkanalinnut', info: 'Uroksella näyttävä väritys ja pitkä pyrstö. Naaraat ruskeankirjavia.', images: [] },

  // =========================
  // VESILINNUT (sun ryhmä)
  // =========================
  { name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa. Uroksella vihreä pää, naaras on ruskeankirjava.', commonsCategory: 'Category:Anas_platyrhynchos' },
  { name: 'Tavi', latin: 'Anas crecca', en: 'common teal', group: 'Vesilinnut', info: 'Pienin sorsa. Vihreä silmäjuova ja kirkas vihreä siipipeili.', commonsCategory: 'Category:Anas_crecca' },
  { name: 'Haapana', latin: 'Mareca penelope', en: 'Eurasian wigeon', group: 'Vesilinnut', info: 'Uroksella punaruskea pää ja keltainen otsa. Vaalea siipilaikku.', commonsCategory: 'Category:Mareca_penelope' },
  { name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern pintail', group: 'Vesilinnut', info: 'Siro kaula, piikkimäinen pyrstö.', commonsCategory: 'Category:Anas_acuta' },
  { name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'northern shoveler', group: 'Vesilinnut', info: 'Erittäin suuri, lusikkamainen nokka.', commonsCategory: 'Category:Spatula_clypeata' },
  { name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted duck', group: 'Vesilinnut', info: 'Mustavalkoinen sukeltajasorsa, päässä selvä töyhtö.', commonsCategory: 'Category:Aythya_fuligula' },
  { name: 'Telkkä', latin: 'Bucephala clangula', en: 'common goldeneye', group: 'Vesilinnut', info: 'Kuparinruskea (naaras) tai mustavalkoinen (uros) pää. Keltainen silmä.', commonsCategory: 'Category:Bucephala_clangula' },
  { name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Suuri, virtaviivainen. Pitkä punainen nokka.', commonsCategory: 'Category:Mergus_merganser' },
  { name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean goose', group: 'Vesilinnut', info: 'Ruskeanharmaa hanhi, nokka musta-oranssi.', commonsCategory: 'Category:Anser_fabalis' },
  { name: 'Merihanhi', latin: 'Anser anser', en: 'greylag goose', group: 'Vesilinnut', info: 'Vaalea, oranssi nokka, vaaleanharmaat siiven etureunat.', commonsCategory: 'Category:Anser_anser' },

  // PUUTTUI: kanadanhanhi, heinätavi, punasotka, haahka, alli, tukkakoskelo
  { name: 'Kanadanhanhi', latin: 'Branta canadensis', en: 'Canada goose', group: 'Vesilinnut', info: 'Tunnista mustasta kaulasta ja valkoisesta poskilaikusta. Yleinen kaupunkivesillä.', images: [] },
  { name: 'Heinätavi', latin: 'Anas querquedula', en: 'garganey', group: 'Vesilinnut', info: 'Pienikokoinen sorsa. Uroksella vaalea kulmakarvajuova.', images: [] },
  { name: 'Punasotka', latin: 'Aythya ferina', en: 'common pochard', group: 'Vesilinnut', info: 'Uroksella punaruskea pää ja harmaa kylki. Sukeltajasorsa.', images: [] },
  { name: 'Haahka', latin: 'Somateria mollissima', en: 'common eider', group: 'Vesilinnut', info: 'Merilintu. Uros mustavalkoinen ja iso, naaras ruskeankirjava.', images: [] },
  { name: 'Alli', latin: 'Clangula hyemalis', en: 'long-tailed duck', group: 'Vesilinnut', info: 'Merilintu. Uroksella (talvella) pitkä pyrstö ja kontrastinen mustavalkoisuus.', images: [] },
  { name: 'Tukkakoskelo', latin: 'Mergus serrator', en: 'red-breasted merganser', group: 'Vesilinnut', info: 'Koskeloista “töyhtöisin”. Uroksella usein punaruskea rinta ja rosoinen töyhtö.', images: [] },

  // =========================
  // PIENPEDOT (sun ryhmä)
  // =========================
  { name: 'Kettu', latin: 'Vulpes vulpes', en: 'red fox', group: 'Pienpedot', info: 'Punainen turkki, valkoinen hännänpää. Suuret korvat.', commonsCategory: 'Category:Vulpes_vulpes' },
  { name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon dog', group: 'Pienpedot', info: 'Vieraslaji. Musta naamarikuvio, lyhyet jalat.', commonsCategory: 'Category:Nyctereutes_procyonoides' },
  { name: 'Mäyrä', latin: 'Meles meles', en: 'badger', group: 'Pienpedot', info: 'Valkoiset juovat naaman sivuilla.', commonsCategory: 'Category:Meles_meles' },
  { name: 'Näätä', latin: 'Martes martes', en: 'pine marten', group: 'Pienpedot', info: 'Ruskea, keltainen kurkkulaikku. Kiipeilee puissa.', commonsCategory: 'Category:Martes_martes' },
  { name: 'Minkki', latin: 'Neovison vison', en: 'American mink', group: 'Pienpedot', info: 'Tummanruskea/musta, pieni valkoinen laikku alaleuassa.', commonsCategory: 'Category:Neovison_vison' },

  // PUUTTUI: pesukarhu, kärppä, hilleri, saukko
  { name: 'Pesukarhu', latin: 'Procyon lotor', en: 'raccoon', group: 'Pienpedot', info: 'Tunnista “naamio” kasvoissa ja rengashännästä. Vieraslaji.', images: [] },
  { name: 'Kärppä', latin: 'Mustela erminea', en: 'stoat (ermine)', group: 'Pienpedot', info: 'Pieni näätäeläin. Talviturkki voi valkaistua. Musta hännänpää on tyypillinen.', images: [] },
  { name: 'Hilleri', latin: 'Mustela putorius', en: 'European polecat', group: 'Pienpedot', info: 'Tummasävyinen näätäeläin, usein vaaleampi kuono/naamio.', images: [] },
  { name: 'Saukko', latin: 'Lutra lutra', en: 'Eurasian otter', group: 'Pienpedot', info: 'Vesistöjen virtaviivainen näätäeläin. Paksu häntä ja usein vaalea kurkku.', images: [] },

  // =========================
  // SUURPEDOT (uusi ryhmä → valittavaksi UI:ssa)
  // =========================
  { name: 'Susi', latin: 'Canis lupus', en: 'wolf', group: 'Suurpedot', info: 'Koiramainen peto. Suorat jalat, pitkä kuono, häntä roikkuu usein alhaalla.', images: [] },
  { name: 'Tarhattu naali', latin: 'Vulpes lagopus', en: 'Arctic fox (farmed)', group: 'Suurpedot', info: 'Naali on pienikokoinen kettulaji. “Tarhattu” viittaa kasvatettuihin yksilöihin.', images: [] },
  { name: 'Karhu', latin: 'Ursus arctos', en: 'brown bear', group: 'Suurpedot', info: 'Hyvin suuri peto. Tunnista massiivisesta rungosta ja lyhyestä hännästä.', images: [] },
  { name: 'Ahma', latin: 'Gulo gulo', en: 'wolverine', group: 'Suurpedot', info: 'Jykevä näätäeläin. Tummanruskea, usein vaalea “sivuraita”.', images: [] },
  { name: 'Ilves', latin: 'Lynx lynx', en: 'Eurasian lynx', group: 'Suurpedot', info: 'Kissamainen peto. Lyhyt häntä mustalla kärjellä, korvissa tupsut.', images: [] },

  // =========================
  // HYLKEET (uusi ryhmä → valittavaksi UI:ssa)
  // =========================
  { name: 'Itämeren norppa', latin: 'Pusa hispida botnica', en: 'Saimaa/ Baltic ringed seal (Baltic subspecies)', group: 'Hylkeet', info: 'Pieni hylje. Pyöreähkö pää, usein “renkaalliset” kuviot turkissa.', images: [] },
  { name: 'Kirjohylje', latin: 'Phoca vitulina', en: 'harbour seal', group: 'Hylkeet', info: 'Usein täpläinen turkki, pyöreämpi pää kuin hallilla.', images: [] },
  { name: 'Halli', latin: 'Halichoerus grypus', en: 'grey seal', group: 'Hylkeet', info: 'Suurempi hylje. Pitkä “hevosenpää”-tyylinen kuono.', images: [] },

  // =========================
  // MUUT RIISTALINNUT (uusi ryhmä)
  // =========================
  { name: 'Nokikana', latin: 'Fulica atra', en: 'Eurasian coot', group: 'Muut riistalinnut', info: 'Mustahko vesilintu, valkoinen otsakilpi ja nokka.', images: [] },
  { name: 'Lehtokurppa', latin: 'Scolopax rusticola', en: 'Eurasian woodcock', group: 'Muut riistalinnut', info: 'Lyhytjalkaisen oloinen kahlaaja. Pitkä suora nokka ja ruskeankirjava suojaväri.', images: [] },
  { name: 'Sepelkyyhky', latin: 'Columba
