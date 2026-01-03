
import { Question, QuestionType, Difficulty } from './types';

export const EXAM_QUESTION_COUNT = 60;
export const PASS_MARK = 45;
export const EXAM_TIME_LIMIT = 90 * 60;

// Laskee nimen perusteella numeron, jotta samalle lajille tulee aina sama kuva, mutta eri lajeille eri
const getDeterministicLock = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1000;
};

export const SPECIES_DB = [
  // HIRVIELÄIMET
  { name: 'Hirvi', latin: 'Alces alces', en: 'moose', group: 'Hirvieläimet', info: 'Suomen suurin nisäkäs. Tunnista koosta, kyhmyisestä turvasta ja vaaleista jaloista.' },
  { name: 'Valkohäntäpeura', latin: 'Odocoileus virginianus', en: 'white-tailed-deer', group: 'Hirvieläimet', info: 'Tunnista pystyyn nousevasta, alta lumivalkoisesta hännästä.' },
  { name: 'Metsäkauris', latin: 'Capreolus capreolus', en: 'roe-deer', group: 'Hirvieläimet', info: 'Pieni koko, ei häntää, valkoinen peräpeili. Lyhyet pystyt sarvet.' },
  { name: 'Metsäpeura', latin: 'Rangifer tarandus', en: 'reindeer', group: 'Hirvieläimet', info: 'Siro ja pitkäjalkainen verrattuna poroon. Sarvet kapeat.' },
  { name: 'Kuusipeura', latin: 'Dama dama', en: 'fallow-deer', group: 'Hirvieläimet', info: 'Täplikäs turkki, lapiomaiset sarvet.' },

  // METSÄKANALINNUT
  { name: 'Metso', latin: 'Tetrao urogallus', en: 'capercaillie', group: 'Metsäkanalinnut', info: 'Uros on suuri ja musta, naaras (koppelo) ruskeankirjava ja rinnasta ruosteenvärinen.' },
  { name: 'Teeri', latin: 'Lyrurus tetrix', en: 'black-grouse', group: 'Metsäkanalinnut', info: 'Uroksella lyyrapyrstö. Naaraalla selvä lovi pyrstössä.' },
  { name: 'Pyy', latin: 'Tetrastes bonasia', en: 'hazel-grouse', group: 'Metsäkanalinnut', info: 'Pieni, harmaankirjava. Tunnusomainen töyhtö päässä.' },
  { name: 'Riekko', latin: 'Lagopus lagopus', en: 'willow-ptarmigan', group: 'Metsäkanalinnut', info: 'Talvella valkoinen, pyrstön reunasulat mustat. Kesällä ruskea, siivet valkoiset.' },
  { name: 'Kiiruna', latin: 'Lagopus muta', en: 'rock-ptarmigan', group: 'Metsäkanalinnut', info: 'Tunturiylänköjen lintu. Kesällä harmaampi kuin riekko.' },

  // VESILINNUT
  { name: 'Heinäsorsa', latin: 'Anas platyrhynchos', en: 'mallard', group: 'Vesilinnut', info: 'Yleisin sorsa. Uroksella vihreä pää, naaras on ruskeankirjava.' },
  { name: 'Tavi', latin: 'Anas crecca', en: 'teal-duck', group: 'Vesilinnut', info: 'Pienin sorsa. Vihreä silmäjuova ja kirkas vihreä siipipeili.' },
  { name: 'Haapana', latin: 'Mareca penelope', en: 'wigeon', group: 'Vesilinnut', info: 'Uroksella punaruskea pää ja keltainen otsa. Vaalea siipilaikku.' },
  { name: 'Jouhisorsa', latin: 'Anas acuta', en: 'northern-pintail', group: 'Vesilinnut', info: 'Siro kaula, piikkimäinen pyrstö.' },
  { name: 'Lapasorsa', latin: 'Spatula clypeata', en: 'shoveler', group: 'Vesilinnut', info: 'Erittäin suuri, lusikkamainen nokka.' },
  { name: 'Tukkasotka', latin: 'Aythya fuligula', en: 'tufted-duck', group: 'Vesilinnut', info: 'Mustavalkoinen sukeltajasorsa, päässä selvä töyhtö.' },
  { name: 'Telkkä', latin: 'Bucephala clangula', en: 'goldeneye-duck', group: 'Vesilinnut', info: 'Kuparinruskea (naaras) tai mustavalkoinen (uros) pää. Keltainen silmä.' },
  { name: 'Isokoskelo', latin: 'Mergus merganser', en: 'goosander', group: 'Vesilinnut', info: 'Suuri, virtaviivainen. Pitkä punainen nokka.' },
  { name: 'Metsähanhi', latin: 'Anser fabalis', en: 'bean-goose', group: 'Vesilinnut', info: 'Ruskeanharmaa hanhi, nokka musta-oranssi.' },
  { name: 'Merihanhi', latin: 'Anser anser', en: 'greylag-goose', group: 'Vesilinnut', info: 'Vaalea, oranssi nokka, vaaleanharmaat siiven etureunat.' },

  // PIENPEDOT
  { name: 'Kettu', latin: 'Vulpes vulpes', en: 'red-fox', group: 'Pienpedot', info: 'Punainen turkki, valkoinen hännänpää. Suuret korvat.' },
  { name: 'Supikoira', latin: 'Nyctereutes procyonoides', en: 'raccoon-dog', group: 'Pienpedot', info: 'Vieraslaji. Musta naamarikuvio, lyhyet jalat.' },
  { name: 'Mäyrä', latin: 'Meles meles', en: 'badger', group: 'Pienpedot', info: 'Valkoiset juovat naaman sivuilla.' },
  { name: 'Näätä', latin: 'Martes martes', en: 'pine-marten', group: 'Pienpedot', info: 'Ruskea, keltainen kurkkulaikku. Kiipeilee puissa.' },
  { name: 'Minkki', latin: 'Neovison vison', en: 'mink', group: 'Pienpedot', info: 'Tummanruskea/musta, pieni valkoinen laikku alaleuassa.' },
  
  // RAUHOITETUT
  { name: 'Merikotka', latin: 'Haliaeetus albicilla', en: 'white-tailed-eagle', group: 'Rauhoitetut', info: 'Valtava koko, tasaleveät siivet. Vanhoilla yksilöillä valkoinen pyrstö.' },
  { name: 'Maakotka', latin: 'Aquila chrysaetos', en: 'golden-eagle', group: 'Rauhoitetut', info: 'Suuri, niskassa kultaista sävyä. Pyrstö usein tummempi.' },
  { name: 'Kanahaukka', latin: 'Accipiter gentilis', en: 'goshawk', group: 'Rauhoitetut', info: 'Poikittaisviiruinen vatsa, keltaiset silmät.' },
  { name: 'Sääksi', latin: 'Pandion haliaetus', en: 'osprey', group: 'Rauhoitetut', info: 'Valkoinen vatsa, musta silmäjuova. Siivet tyvestä taitteella.' },
  { name: 'Laulujoutsen', latin: 'Cygnus cygnus', en: 'whooper-swan', group: 'Rauhoitetut', info: 'Suomen kansallislintu. Kokovalkoinen, nokka keltainen ja musta.' },
];

export const generateQuestionsFromDb = (): Question[] => {
  return SPECIES_DB.map((s, idx) => {
    const distractors = SPECIES_DB
      .filter(x => x.name !== s.name && x.group === s.group)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => x.name);
    
    if (distractors.length < 3) {
      const extra = SPECIES_DB
        .filter(x => x.name !== s.name && x.group !== s.group)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - distractors.length)
        .map(x => x.name);
      distractors.push(...extra);
    }

    const options = [s.name, ...distractors].sort(() => Math.random() - 0.5);
    const lock = getDeterministicLock(s.name);

    // TESTATTU URL: Poistettu /all/, käytetään lockia nimen perusteella
    // Tämä varmistaa, että 'fox' palauttaa ketun ja 'moose' hirven, ja lock pitää ne erillään
    const primaryUrl = `https://loremflickr.com/800/600/${s.en},animal?lock=${lock}`;
    const secondaryUrl = `https://loremflickr.com/800/600/${s.group.toLowerCase()},wildlife?lock=${lock + 10}`;

    return {
      id: `id-${idx}`,
      type: QuestionType.IDENTIFICATION,
      difficulty: Difficulty.NORMAL,
      question: `Mikä eläin on kyseessä?`,
      options,
      correctIndex: options.indexOf(s.name),
      explanation: s.info,
      imageUrl: primaryUrl,
      fallbackImageUrl: secondaryUrl,
      imageCaption: `${s.group}: Havainto suomalaisessa luonnossa.`
    };
  });
};

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
  ...generateQuestionsFromDb(),
  ...STATIC_POOL
];
