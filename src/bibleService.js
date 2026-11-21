const axios = require('axios');

class BibleService {
  constructor() {
    this.baseUrl = 'https://api.scripture.api.bible/v1';
    this.apiKey = process.env.BIBLE_API_KEY || 'WaMabcq9X0tDx02Vd4-4s';

    this.bookCodes = {
      'genesis': 'GEN', 'exodus': 'EXO', 'leviticus': 'LEV', 'numbers': 'NUM',
      'deuteronomy': 'DEU', 'joshua': 'JOS', 'judges': 'JDG', 'ruth': 'RUT',
      '1 samuel': '1SA', '2 samuel': '2SA', '1 kings': '1KI', '2 kings': '2KI',
      '1 chronicles': '1CH', '2 chronicles': '2CH', 'ezra': 'EZR', 'nehemiah': 'NEH',
      'esther': 'EST', 'job': 'JOB', 'psalms': 'PSA', 'psalm': 'PSA',
      'proverbs': 'PRO', 'ecclesiastes': 'ECC', 'song of solomon': 'SNG',
      'song of songs': 'SNG', 'isaiah': 'ISA', 'jeremiah': 'JER',
      'lamentations': 'LAM', 'ezekiel': 'EZK', 'daniel': 'DAN', 'hosea': 'HOS',
      'joel': 'JOL', 'amos': 'AMO', 'obadiah': 'OBA', 'jonah': 'JON',
      'micah': 'MIC', 'nahum': 'NAM', 'habakkuk': 'HAB', 'zephaniah': 'ZEP',
      'haggai': 'HAG', 'zechariah': 'ZEC', 'malachi': 'MAL', 'matthew': 'MAT',
      'mark': 'MRK', 'luke': 'LUK', 'john': 'JHN', 'acts': 'ACT',
      'romans': 'ROM', '1 corinthians': '1CO', '2 corinthians': '2CO',
      'galatians': 'GAL', 'ephesians': 'EPH', 'philippians': 'PHP',
      'colossians': 'COL', '1 thessalonians': '1TH', '2 thessalonians': '2TH',
      '1 timothy': '1TI', '2 timothy': '2TI', 'titus': 'TIT', 'philemon': 'PHM',
      'hebrews': 'HEB', 'james': 'JAS', '1 peter': '1PE', '2 peter': '2PE',
      '1 john': '1JN', '2 john': '2JN', '3 john': '3JN', 'jude': 'JUD',
      'revelation': 'REV', 'revelations': 'REV',

      // Spanish
      'genesis': 'GEN', 'exodo': 'EXO', 'levitico': 'LEV', 'numeros': 'NUM',
      'deuteronomio': 'DEU', 'josue': 'JOS', 'jueces': 'JDG', 'rut': 'RUT',
      '1 samuel': '1SA', '2 samuel': '2SA', '1 reyes': '1KI', '2 reyes': '2KI',
      '1 cronicas': '1CH', '2 cronicas': '2CH', 'esdras': 'EZR', 'nehemias': 'NEH',
      'ester': 'EST', 'salmos': 'PSA', 'salmo': 'PSA', 'proverbios': 'PRO',
      'eclesiastes': 'ECC', 'cantares': 'SNG', 'isaias': 'ISA', 'jeremias': 'JER',
      'lamentaciones': 'LAM', 'ezequiel': 'EZK', 'oseas': 'HOS', 'amos': 'AMO',
      'abdias': 'OBA', 'jonas': 'JON', 'miqueas': 'MIC', 'nahum': 'NAM',
      'habacuc': 'HAB', 'sofonias': 'ZEP', 'hageo': 'HAG', 'zacarias': 'ZEC',
      'malaquias': 'MAL', 'mateo': 'MAT', 'marcos': 'MRK', 'lucas': 'LUK',
      'juan': 'JHN', 'hechos': 'ACT', 'romanos': 'ROM',
      '1 corintios': '1CO', '2 corintios': '2CO', 'galatas': 'GAL',
      'efesios': 'EPH', 'filipenses': 'PHP', 'colosenses': 'COL',
      '1 tesalonicenses': '1TH', '2 tesalonicenses': '2TH',
      '1 timoteo': '1TI', '2 timoteo': '2TI', 'tito': 'TIT', 'filemon': 'PHM',
      'hebreos': 'HEB', 'santiago': 'JAS',
      '1 pedro': '1PE', '2 pedro': '2PE',
      '1 juan': '1JN', '2 juan': '2JN', '3 juan': '3JN',
      'judas': 'JUD', 'apocalipsis': 'REV',

      // French
      'genese': 'GEN', 'exode': 'EXO', 'levitique': 'LEV', 'nombres': 'NUM',
      'deuteronome': 'DEU', 'juges': 'JDG', 'ruth': 'RUT',
      '1 rois': '1KI', '2 rois': '2KI',
      '1 chroniques': '1CH', '2 chroniques': '2CH', 'nehemie': 'NEH',
      'esther': 'EST', 'psaumes': 'PSA', 'psaume': 'PSA', 'proverbes': 'PRO',
      'ecclesiaste': 'ECC', 'cantique des cantiques': 'SNG',
      'esaie': 'ISA', 'jeremie': 'JER', 'ezechiel': 'EZK',
      'osee': 'HOS', 'joel': 'JOL', 'abdias': 'OBA', 'jonas': 'JON',
      'michee': 'MIC', 'sophonie': 'ZEP', 'aggee': 'HAG', 'zacharie': 'ZEC',
      'malachie': 'MAL', 'matthieu': 'MAT', 'marc': 'MRK', 'luc': 'LUK',
      'jean': 'JHN', 'actes': 'ACT', 'romains': 'ROM',
      '1 corinthiens': '1CO', '2 corinthiens': '2CO', 'galates': 'GAL',
      'ephesiens': 'EPH', 'philippiens': 'PHP', 'colossiens': 'COL',
      '1 thessaloniciens': '1TH', '2 thessaloniciens': '2TH',
      '1 timothee': '1TI', '2 timothee': '2TI', 'tite': 'TIT',
      'philemon': 'PHM', 'hebreux': 'HEB', 'jacques': 'JAS',
      '1 pierre': '1PE', '2 pierre': '2PE',
      '1 jean': '1JN', '2 jean': '2JN', '3 jean': '3JN',
      'jude': 'JUD', 'apocalypse': 'REV'
    };

    this.bibleVersions = {
      'KJV': 'de4e12af7f28f599-02',
      'NIV': '78a9f6124f344018-01',
      'NASB': 'a761ca71e0b3ddcf-01',
      'NLT': 'd6e14a625393b4da-01',
      'NKJV': '63097d2a0a2f7db3-01',
      'ASV': '06125adad2d5898a-01'
    };

    this.defaultVersion = 'KJV';

    // Keys are normalized (lowercase, no apostrophes/punctuation).
    // Multiple keys can point to the same story for alias support.
    this.stories = {
      // The Beginning
      'creation of the world':       { ref: 'GEN.1.1-GEN.2.3',   title: 'The Creation of the World' },
      'creation':                    { ref: 'GEN.1.1-GEN.2.3',   title: 'The Creation' },
      'in the beginning':            { ref: 'GEN.1.1-GEN.2.3',   title: 'In the Beginning' },
      'adam and eve':                { ref: 'GEN.2.15-GEN.3.24', title: 'Adam and Eve' },
      'garden of eden':              { ref: 'GEN.2.15-GEN.3.24', title: 'The Garden of Eden' },
      'cain and abel':               { ref: 'GEN.4.1-GEN.4.16',  title: 'Cain and Abel' },
      'noahs ark':                   { ref: 'GEN.6.9-GEN.9.17',  title: "Noah's Ark" },
      'noahs ark and the flood':     { ref: 'GEN.6.9-GEN.9.17',  title: "Noah's Ark and the Flood" },
      'the flood':                   { ref: 'GEN.6.9-GEN.9.17',  title: 'The Flood' },
      'noah':                        { ref: 'GEN.6.9-GEN.9.17',  title: "Noah's Ark" },
      'tower of babel':              { ref: 'GEN.11.1-GEN.11.9', title: 'The Tower of Babel' },
      'babel':                       { ref: 'GEN.11.1-GEN.11.9', title: 'The Tower of Babel' },

      // Patriarchs
      'gods covenant with abram':    { ref: 'GEN.12.1-GEN.12.9',  title: "God's Covenant with Abram" },
      'abrahams covenant':           { ref: 'GEN.12.1-GEN.12.9',  title: "Abraham's Covenant" },
      'the three visitors':          { ref: 'GEN.18.1-GEN.18.15', title: 'The Three Visitors' },
      'sodom and gomorrah':          { ref: 'GEN.19.15-GEN.19.29', title: 'Sodom and Gomorrah' },
      'hagar and ishmael':           { ref: 'GEN.21.8-GEN.21.21', title: 'Hagar and Ishmael' },
      'abraham tested':              { ref: 'GEN.22.1-GEN.22.19', title: 'Abraham Tested' },
      'abraham and isaac':           { ref: 'GEN.22.1-GEN.22.19', title: 'Abraham and Isaac' },
      'binding of isaac':            { ref: 'GEN.22.1-GEN.22.19', title: 'The Binding of Isaac' },
      'isaac and rebekah':           { ref: 'GEN.24.1-GEN.24.27', title: 'Isaac and Rebekah' },
      'jacob and esau':              { ref: 'GEN.25.19-GEN.25.34', title: 'Jacob and Esau' },
      'jacob gets isaacs blessing':  { ref: 'GEN.27.1-GEN.27.40', title: "Jacob Gets Isaac's Blessing" },
      'jacobs dream':                { ref: 'GEN.28.10-GEN.28.22', title: "Jacob's Dream" },
      'jacobs dream at bethel':      { ref: 'GEN.28.10-GEN.28.22', title: "Jacob's Dream at Bethel" },
      'jacob marries leah and rachel': { ref: 'GEN.29.14-GEN.29.30', title: 'Jacob Marries Leah and Rachel' },
      'joseph and his brothers':     { ref: 'GEN.37.1-GEN.37.36', title: 'Joseph and His Brothers' },
      'joseph coat of many colors':  { ref: 'GEN.37.1-GEN.37.36', title: 'Joseph and His Coat of Many Colors' },
      'the cupbearer and the baker': { ref: 'GEN.40.1-GEN.40.23', title: 'The Cupbearer and the Baker' },
      'pharaohs dreams':             { ref: 'GEN.41.1-GEN.41.57', title: "Pharaoh's Dreams" },
      'josephs brothers go to egypt': { ref: 'GEN.42.1-GEN.42.38', title: "Joseph's Brothers Go to Egypt" },
      'joseph reveals himself':      { ref: 'GEN.45.1-GEN.45.15', title: 'Joseph Reveals Himself' },

      // Deliverance from Egypt
      'birth of moses':              { ref: 'EXO.1.8-EXO.2.10',  title: 'The Birth of Moses' },
      'moses and the burning bush':  { ref: 'EXO.3.1-EXO.3.15',  title: 'Moses and the Burning Bush' },
      'burning bush':                { ref: 'EXO.3.1-EXO.3.15',  title: 'The Burning Bush' },
      'the ten plagues':             { ref: 'EXO.7.14-EXO.9.12', title: 'The Ten Plagues' },
      'ten plagues':                 { ref: 'EXO.7.14-EXO.9.12', title: 'The Ten Plagues' },
      'the passover':                { ref: 'EXO.12.1-EXO.12.42', title: 'The Passover' },
      'passover':                    { ref: 'EXO.12.1-EXO.12.42', title: 'The Passover' },
      'crossing the red sea':        { ref: 'EXO.13.17-EXO.14.31', title: 'Crossing the Red Sea' },
      'moses parts the red sea':     { ref: 'EXO.13.17-EXO.14.31', title: 'Moses Parts the Red Sea' },
      'red sea':                     { ref: 'EXO.13.17-EXO.14.31', title: 'The Parting of the Red Sea' },

      // In the Wilderness
      'water in the wilderness':     { ref: 'EXO.15.22-EXO.15.27', title: 'Water in the Wilderness' },
      'manna and quail':             { ref: 'EXO.16.1-EXO.16.36', title: 'Manna and Quail' },
      'moses at mount sinai':        { ref: 'EXO.19.1-EXO.20.21', title: 'Moses at Mount Sinai' },
      'ten commandments':            { ref: 'EXO.20.1-EXO.20.17', title: 'The Ten Commandments' },
      'the commandments':            { ref: 'EXO.20.1-EXO.20.17', title: 'The Ten Commandments' },
      'golden calf':                 { ref: 'EXO.32.1-EXO.32.35', title: 'The Golden Calf' },
      'balaams donkey':              { ref: 'NUM.22.21-NUM.22.38', title: "Balaam's Donkey" },
      'death of moses':              { ref: 'DEU.34.1-DEU.34.12', title: 'The Death of Moses' },

      // Into the Promised Land
      'crossing the jordan':         { ref: 'JOS.3.1-JOS.3.17',  title: 'Crossing the Jordan' },
      'fall of jericho':             { ref: 'JOS.5.13-JOS.6.27', title: 'The Fall of Jericho' },
      'jericho':                     { ref: 'JOS.5.13-JOS.6.27', title: 'The Fall of Jericho' },
      'deborah':                     { ref: 'JDG.4.1-JDG.4.24',  title: 'Deborah' },
      'gideon tests god':            { ref: 'JDG.6.1-JDG.6.40',  title: 'Gideon Tests God' },
      'gideon defeats the midianites': { ref: 'JDG.7.1-JDG.7.25', title: 'Gideon Defeats the Midianites' },
      'gideon':                      { ref: 'JDG.7.1-JDG.7.25',  title: "Gideon's Victory" },
      'samson and delilah':          { ref: 'JDG.16.1-JDG.16.31', title: 'Samson and Delilah' },
      'samson':                      { ref: 'JDG.16.1-JDG.16.31', title: 'Samson and Delilah' },
      'ruth and naomi':              { ref: 'RUT.1.1-RUT.1.22',  title: 'Ruth and Naomi' },
      'naomi and ruth':              { ref: 'RUT.1.1-RUT.1.22',  title: 'Ruth and Naomi' },
      'ruth':                        { ref: 'RUT.1.1-RUT.1.22',  title: 'Ruth and Naomi' },
      'the lord calls samuel':       { ref: '1SA.3.1-1SA.3.21',  title: 'The Lord Calls Samuel' },
      'samuel called by god':        { ref: '1SA.3.1-1SA.3.21',  title: 'Samuel Called by God' },

      // Kings of Israel
      'samuel anoints saul':         { ref: '1SA.9.1-1SA.10.1',  title: 'Samuel Anoints Saul' },
      'samuel anoints david':        { ref: '1SA.16.1-1SA.16.13', title: 'Samuel Anoints David' },
      'david and goliath':           { ref: '1SA.17.1-1SA.17.58', title: 'David and Goliath' },
      'david and bathsheba':         { ref: '2SA.11.1-2SA.11.27', title: 'David and Bathsheba' },
      'nathan rebukes david':        { ref: '2SA.12.1-2SA.12.15', title: 'Nathan Rebukes David' },
      'solomons wisdom':             { ref: '1KI.3.16-1KI.3.28', title: "Solomon's Wisdom" },
      'a wise ruling':               { ref: '1KI.3.16-1KI.3.28', title: 'A Wise Ruling' },
      'solomon builds the temple':   { ref: '1KI.6.1-1KI.6.38', title: 'Solomon Builds the Temple' },
      'queen of sheba':              { ref: '1KI.10.1-1KI.10.13', title: 'The Queen of Sheba' },

      // Elijah and Elisha
      'elijah fed by ravens':        { ref: '1KI.17.1-1KI.17.6', title: 'Elijah Fed by Ravens' },
      'widow of zarephath':          { ref: '1KI.17.7-1KI.17.24', title: 'The Widow of Zarephath' },
      'elijah on mount carmel':      { ref: '1KI.18.16-1KI.18.46', title: 'Elijah on Mount Carmel' },
      'elijah and the fire':         { ref: '1KI.18.16-1KI.18.46', title: 'Elijah and the Fire' },
      'elijah and the prophets of baal': { ref: '1KI.18.16-1KI.18.46', title: 'Elijah and the Prophets of Baal' },
      'prophets of baal':            { ref: '1KI.18.16-1KI.18.46', title: 'Elijah and the Prophets of Baal' },
      'elijah taken up to heaven':   { ref: '2KI.2.1-2KI.2.12', title: 'Elijah Taken Up to Heaven' },
      'naaman healed of leprosy':    { ref: '2KI.5.1-2KI.5.19', title: 'Naaman Healed of Leprosy' },
      'naaman':                      { ref: '2KI.5.1-2KI.5.19', title: 'Naaman Healed of Leprosy' },

      // Prophets and Exile
      'isaiahs commission':          { ref: 'ISA.6.1-ISA.6.8',   title: "Isaiah's Commission" },
      'jonah and the whale':         { ref: 'JON.1.1-JON.4.11', title: 'Jonah and the Whale' },
      'jonah and the great fish':    { ref: 'JON.1.1-JON.4.11', title: 'Jonah and the Great Fish' },
      'jonah':                       { ref: 'JON.1.1-JON.4.11', title: 'Jonah and the Whale' },
      'valley of dry bones':         { ref: 'EZK.37.1-EZK.37.14', title: 'The Valley of Dry Bones' },
      'dry bones':                   { ref: 'EZK.37.1-EZK.37.14', title: 'The Valley of Dry Bones' },
      'nebuchadnezzars dream':       { ref: 'DAN.2.1-DAN.2.49', title: "Nebuchadnezzar's Dream" },
      'fiery furnace':               { ref: 'DAN.3.1-DAN.3.30', title: 'The Fiery Furnace' },
      'shadrach meshach and abednego': { ref: 'DAN.3.1-DAN.3.30', title: 'Shadrach, Meshach and Abednego' },
      'writing on the wall':         { ref: 'DAN.5.1-DAN.5.31', title: 'The Writing on the Wall' },
      'daniel in the lions den':     { ref: 'DAN.6.1-DAN.6.28', title: 'Daniel in the Lions Den' },
      'daniel and the lions':        { ref: 'DAN.6.1-DAN.6.28', title: 'Daniel and the Lions' },
      'daniel':                      { ref: 'DAN.6.1-DAN.6.28', title: 'Daniel in the Lions Den' },
      'esther saves her people':     { ref: 'EST.4.1-EST.5.8',  title: 'Esther Saves Her People' },
      'esther':                      { ref: 'EST.4.1-EST.5.8',  title: 'Esther Saves Her People' },
      'trials of job':               { ref: 'JOB.1.1-JOB.2.13', title: 'The Trials of Job' },
      'job':                         { ref: 'JOB.1.1-JOB.2.13', title: 'The Trials and Blessings of Job' },

      // Birth and Early Life of Jesus
      'birth of jesus foretold':     { ref: 'LUK.1.26-LUK.1.38', title: 'The Birth of Jesus Foretold' },
      'mary and the angel':          { ref: 'LUK.1.26-LUK.1.38', title: 'Mary and the Angel' },
      'annunciation':                { ref: 'LUK.1.26-LUK.1.38', title: 'The Annunciation' },
      'birth of jesus':              { ref: 'LUK.2.1-LUK.2.7',  title: 'The Birth of Jesus' },
      'christmas story':             { ref: 'LUK.2.1-LUK.2.20', title: 'The Christmas Story' },
      'christmas':                   { ref: 'LUK.2.1-LUK.2.20', title: 'The Christmas Story' },
      'nativity':                    { ref: 'LUK.2.1-LUK.2.20', title: 'The Nativity' },
      'shepherds and angels':        { ref: 'LUK.2.8-LUK.2.20', title: 'The Shepherds and the Angels' },
      'visit of the magi':           { ref: 'MAT.2.1-MAT.2.12', title: 'The Visit of the Magi' },
      'wise men':                    { ref: 'MAT.2.1-MAT.2.12', title: 'The Wise Men' },
      'three wise men':              { ref: 'MAT.2.1-MAT.2.12', title: 'The Three Wise Men' },
      'escape to egypt':             { ref: 'MAT.2.13-MAT.2.23', title: 'The Escape to Egypt' },
      'flight to egypt':             { ref: 'MAT.2.13-MAT.2.23', title: 'The Flight to Egypt' },
      'boy jesus at the temple':     { ref: 'LUK.2.41-LUK.2.52', title: 'The Boy Jesus at the Temple' },

      // Ministry of Jesus
      'baptism of jesus':            { ref: 'MAT.3.13-MAT.3.17', title: 'The Baptism of Jesus' },
      'jesus baptism':               { ref: 'MAT.3.13-MAT.3.17', title: 'The Baptism of Jesus' },
      'temptation of jesus':         { ref: 'MAT.4.1-MAT.4.11', title: 'The Temptation of Jesus' },
      'jesus in the wilderness':     { ref: 'MAT.4.1-MAT.4.11', title: 'Jesus in the Wilderness' },
      'calling of the disciples':    { ref: 'MAT.4.18-MAT.4.22', title: 'The Calling of the Disciples' },
      'calling the first disciples': { ref: 'MAT.4.18-MAT.4.22', title: 'Calling the First Disciples' },
      'water into wine':             { ref: 'JHN.2.1-JHN.2.11', title: 'Water Into Wine' },
      'jesus changes water to wine': { ref: 'JHN.2.1-JHN.2.11', title: 'Jesus Changes Water to Wine' },
      'wedding at cana':             { ref: 'JHN.2.1-JHN.2.11', title: 'The Wedding at Cana' },
      'sermon on the mount':         { ref: 'MAT.5.1-MAT.5.48', title: 'The Sermon on the Mount' },
      'beatitudes':                  { ref: 'MAT.5.3-MAT.5.12', title: 'The Beatitudes' },
      'lords prayer':                { ref: 'MAT.6.9-MAT.6.13', title: "The Lord's Prayer" },
      'our father':                  { ref: 'MAT.6.9-MAT.6.13', title: "The Lord's Prayer" },
      'faith of the centurion':      { ref: 'MAT.8.5-MAT.8.13', title: 'The Faith of the Centurion' },
      'jesus calms the storm':       { ref: 'MAT.8.23-MAT.8.27', title: 'Jesus Calms the Storm' },
      'calming the storm':           { ref: 'MAT.8.23-MAT.8.27', title: 'Calming the Storm' },
      'jesus heals a paralytic':     { ref: 'MAT.9.1-MAT.9.8',  title: 'Jesus Heals a Paralytic' },
      'jesus teaches nicodemus':     { ref: 'JHN.3.1-JHN.3.21', title: 'Jesus Teaches Nicodemus' },
      'nicodemus':                   { ref: 'JHN.3.1-JHN.3.21', title: 'Nicodemus' },
      'born again':                  { ref: 'JHN.3.1-JHN.3.21', title: 'You Must Be Born Again' },
      'woman at the well':           { ref: 'JHN.4.4-JHN.4.42', title: 'The Woman at the Well' },
      'samaritan woman':             { ref: 'JHN.4.4-JHN.4.42', title: 'The Samaritan Woman' },
      'feeding the five thousand':   { ref: 'JHN.6.1-JHN.6.15', title: 'Feeding the Five Thousand' },
      'loaves and fishes':           { ref: 'JHN.6.1-JHN.6.15', title: 'The Loaves and Fishes' },
      'five thousand':               { ref: 'JHN.6.1-JHN.6.15', title: 'Feeding the Five Thousand' },
      'jesus walks on water':        { ref: 'MAT.14.22-MAT.14.36', title: 'Jesus Walks on Water' },
      'walking on water':            { ref: 'MAT.14.22-MAT.14.36', title: 'Walking on Water' },
      'transfiguration':             { ref: 'MAT.17.1-MAT.17.13', title: 'The Transfiguration' },
      'good samaritan':              { ref: 'LUK.10.25-LUK.10.37', title: 'The Good Samaritan' },
      'parable of the good samaritan': { ref: 'LUK.10.25-LUK.10.37', title: 'The Parable of the Good Samaritan' },
      'mary and martha':             { ref: 'LUK.10.38-LUK.10.42', title: 'Mary and Martha' },
      'prodigal son':                { ref: 'LUK.15.11-LUK.15.32', title: 'The Prodigal Son' },
      'parable of the prodigal son': { ref: 'LUK.15.11-LUK.15.32', title: 'The Parable of the Prodigal Son' },
      'lost son':                    { ref: 'LUK.15.11-LUK.15.32', title: 'The Lost Son' },
      'parable of the sower':        { ref: 'MAT.13.1-MAT.13.23', title: 'The Parable of the Sower' },
      'sower':                       { ref: 'MAT.13.1-MAT.13.23', title: 'The Parable of the Sower' },
      'jesus heals man born blind':  { ref: 'JHN.9.1-JHN.9.41', title: 'Jesus Heals a Man Born Blind' },
      'raising of lazarus':          { ref: 'JHN.11.1-JHN.11.46', title: 'The Raising of Lazarus' },
      'lazarus':                     { ref: 'JHN.11.1-JHN.11.46', title: 'The Raising of Lazarus' },
      'jesus raises lazarus':        { ref: 'JHN.11.1-JHN.11.46', title: 'Jesus Raises Lazarus' },
      'zacchaeus':                   { ref: 'LUK.19.1-LUK.19.10', title: 'Zacchaeus' },
      'zacchaeus the tax collector': { ref: 'LUK.19.1-LUK.19.10', title: 'Zacchaeus the Tax Collector' },
      'triumphal entry':             { ref: 'MAT.21.1-MAT.21.11', title: 'The Triumphal Entry' },
      'palm sunday':                 { ref: 'MAT.21.1-MAT.21.11', title: 'Palm Sunday' },
      'greatest commandment':        { ref: 'MAT.22.34-MAT.22.40', title: 'The Greatest Commandment' },
      'widows offering':             { ref: 'LUK.21.1-LUK.21.4', title: "The Widow's Offering" },
      'widows mite':                 { ref: 'LUK.21.1-LUK.21.4', title: "The Widow's Mite" },
      'jesus anointed at bethany':   { ref: 'JHN.12.1-JHN.12.8', title: 'Jesus Anointed at Bethany' },

      // Passion and Resurrection
      'last supper':                 { ref: 'LUK.22.7-LUK.22.34', title: 'The Last Supper' },
      'lords supper':                { ref: 'LUK.22.7-LUK.22.34', title: "The Lord's Supper" },
      'gethsemane':                  { ref: 'MAT.26.36-MAT.26.56', title: 'Gethsemane' },
      'garden of gethsemane':        { ref: 'MAT.26.36-MAT.26.56', title: 'The Garden of Gethsemane' },
      'peter disowns jesus':         { ref: 'MAT.26.69-MAT.26.75', title: 'Peter Disowns Jesus' },
      'peter denies jesus':          { ref: 'MAT.26.69-MAT.26.75', title: 'Peter Denies Jesus' },
      'trial of jesus':              { ref: 'MAT.27.1-MAT.27.26', title: 'The Trial of Jesus' },
      'crucifixion':                 { ref: 'MAT.27.31-MAT.27.56', title: 'The Crucifixion' },
      'crucifixion of jesus':        { ref: 'MAT.27.31-MAT.27.56', title: 'The Crucifixion of Jesus' },
      'jesus on the cross':          { ref: 'MAT.27.31-MAT.27.56', title: 'Jesus on the Cross' },
      'burial of jesus':             { ref: 'MAT.27.57-MAT.27.66', title: 'The Burial of Jesus' },
      'resurrection':                { ref: 'LUK.24.1-LUK.24.12', title: 'The Resurrection' },
      'resurrection of jesus':       { ref: 'LUK.24.1-LUK.24.12', title: 'The Resurrection of Jesus' },
      'easter':                      { ref: 'LUK.24.1-LUK.24.12', title: 'Easter - The Resurrection' },
      'empty tomb':                  { ref: 'LUK.24.1-LUK.24.12', title: 'The Empty Tomb' },
      'road to emmaus':              { ref: 'LUK.24.13-LUK.24.35', title: 'The Road to Emmaus' },
      'emmaus':                      { ref: 'LUK.24.13-LUK.24.35', title: 'The Road to Emmaus' },
      'jesus reinstates peter':      { ref: 'JHN.21.1-JHN.21.25', title: 'Jesus Reinstates Peter' },
      'ascension':                   { ref: 'ACT.1.4-ACT.1.11',  title: 'The Ascension' },
      'jesus ascension':             { ref: 'ACT.1.4-ACT.1.11',  title: "Jesus' Ascension" },

      // Early Church
      'pentecost':                   { ref: 'ACT.2.1-ACT.2.47',  title: 'Pentecost' },
      'holy spirit':                 { ref: 'ACT.2.1-ACT.2.47',  title: 'The Coming of the Holy Spirit' },
      'peter heals a crippled beggar': { ref: 'ACT.3.1-ACT.3.10', title: 'Peter Heals a Crippled Beggar' },
      'apostles persecuted':         { ref: 'ACT.5.17-ACT.5.42', title: 'The Apostles Persecuted' },
      'stoning of stephen':          { ref: 'ACT.6.8-ACT.7.60',  title: 'The Stoning of Stephen' },
      'stephen':                     { ref: 'ACT.6.8-ACT.7.60',  title: 'Stephen' },
      'sauls conversion':            { ref: 'ACT.9.1-ACT.9.19',  title: "Saul's Conversion" },
      'conversion of paul':          { ref: 'ACT.9.1-ACT.9.19',  title: "Paul's Conversion" },
      'road to damascus':            { ref: 'ACT.9.1-ACT.9.19',  title: 'The Road to Damascus' },
      'paul conversion':             { ref: 'ACT.9.1-ACT.9.19',  title: "Paul's Conversion" },
      'peters miraculous escape':    { ref: 'ACT.12.1-ACT.12.17', title: "Peter's Miraculous Escape from Prison" },
      'peter escapes prison':        { ref: 'ACT.12.1-ACT.12.17', title: 'Peter Escapes from Prison' },
      'paul and silas in prison':    { ref: 'ACT.16.16-ACT.16.40', title: 'Paul and Silas in Prison' },
      'paul preaches in athens':     { ref: 'ACT.17.16-ACT.17.34', title: 'Paul Preaches in Athens' },
      'shipwreck':                   { ref: 'ACT.27.13-ACT.27.44', title: "Paul's Shipwreck" },
      'pauls shipwreck':             { ref: 'ACT.27.13-ACT.27.44', title: "Paul's Shipwreck" },
      'new jerusalem':               { ref: 'REV.21.1-REV.22.6',  title: 'The New Jerusalem' },
      'second coming':               { ref: 'REV.19.11-REV.19.21', title: 'The Second Coming' },

      // Spanish aliases
      'david y goliat':              { ref: '1SA.17.1-1SA.17.58', title: 'David y Goliat' },
      'el arca de noe':              { ref: 'GEN.6.9-GEN.9.17',  title: 'El Arca de Noé' },
      'noe':                         { ref: 'GEN.6.9-GEN.9.17',  title: 'El Arca de Noé' },
      'el diluvio':                  { ref: 'GEN.6.9-GEN.9.17',  title: 'El Diluvio' },
      'el hijo prodigo':             { ref: 'LUK.15.11-LUK.15.32', title: 'El Hijo Pródigo' },
      'el buen samaritano':          { ref: 'LUK.10.25-LUK.10.37', title: 'El Buen Samaritano' },
      'el nacimiento de jesus':      { ref: 'LUK.2.1-LUK.2.20', title: 'El Nacimiento de Jesús' },
      'la navidad':                  { ref: 'LUK.2.1-LUK.2.20', title: 'La Navidad' },
      'la creacion':                 { ref: 'GEN.1.1-GEN.2.3',  title: 'La Creación' },
      'adan y eva':                  { ref: 'GEN.2.15-GEN.3.24', title: 'Adán y Eva' },
      'jonas y la ballena':          { ref: 'JON.1.1-JON.4.11', title: 'Jonás y la Ballena' },
      'los diez mandamientos':       { ref: 'EXO.20.1-EXO.20.17', title: 'Los Diez Mandamientos' },
      'el padrenuestro':             { ref: 'MAT.6.9-MAT.6.13', title: 'El Padrenuestro' },
      'la ultima cena':              { ref: 'LUK.22.7-LUK.22.34', title: 'La Última Cena' },
      'lazaro':                      { ref: 'JHN.11.1-JHN.11.46', title: 'La Resurrección de Lázaro' },
      'daniel en el foso de los leones': { ref: 'DAN.6.1-DAN.6.28', title: 'Daniel en el Foso de los Leones' },
      'el horno ardiente':           { ref: 'DAN.3.1-DAN.3.30', title: 'El Horno Ardiente' },
      'la alimentacion de los cinco mil': { ref: 'JHN.6.1-JHN.6.15', title: 'La Alimentación de los Cinco Mil' },
      'jesus camina sobre el agua':  { ref: 'MAT.14.22-MAT.14.36', title: 'Jesús Camina Sobre el Agua' },
      'las bienaventuranzas':        { ref: 'MAT.5.3-MAT.5.12', title: 'Las Bienaventuranzas' },
      'la mujer junto al pozo':      { ref: 'JHN.4.4-JHN.4.42', title: 'La Mujer Junto al Pozo' },
      'moises divide el mar rojo':   { ref: 'EXO.13.17-EXO.14.31', title: 'Moisés Divide el Mar Rojo' },
      'la torre de babel':           { ref: 'GEN.11.1-GEN.11.9', title: 'La Torre de Babel' },
      'la resurreccion':             { ref: 'LUK.24.1-LUK.24.12', title: 'La Resurrección' },
      'el bautismo de jesus':        { ref: 'MAT.3.13-MAT.3.17', title: 'El Bautismo de Jesús' },
      'zaqueo':                      { ref: 'LUK.19.1-LUK.19.10', title: 'Zaqueo' },
      'abraham e isaac':             { ref: 'GEN.22.1-GEN.22.19', title: 'Abraham e Isaac' },
      'elias y los profetas de baal': { ref: '1KI.18.16-1KI.18.46', title: 'Elías y los Profetas de Baal' },
      'rut y noemi':                 { ref: 'RUT.1.1-RUT.1.22', title: 'Rut y Noemí' },
      'sanson y dalila':             { ref: 'JDG.16.1-JDG.16.31', title: 'Sansón y Dalila' },
      'pentecostes':                 { ref: 'ACT.2.1-ACT.2.47', title: 'Pentecostés' },
      'la conversion de saulo':      { ref: 'ACT.9.1-ACT.9.19', title: 'La Conversión de Saulo' },
      'la crucifixion':              { ref: 'MAT.27.31-MAT.27.56', title: 'La Crucifixión' },
      'el camino a emaus':           { ref: 'LUK.24.13-LUK.24.35', title: 'El Camino a Emaús' },
      'domingo de ramos':            { ref: 'MAT.21.1-MAT.21.11', title: 'Domingo de Ramos' },
      'getsemani':                   { ref: 'MAT.26.36-MAT.26.56', title: 'Getsemaní' },
      'las bodas de cana':           { ref: 'JHN.2.1-JHN.2.11', title: 'Las Bodas de Caná' },
      'la transfiguracion':          { ref: 'MAT.17.1-MAT.17.13', title: 'La Transfiguración' },
      'el sermon del monte':         { ref: 'MAT.5.1-MAT.5.48', title: 'El Sermón del Monte' },
      'cain y abel':                 { ref: 'GEN.4.1-GEN.4.16', title: 'Caín y Abel' },
      'la caida de jerico':          { ref: 'JOS.5.13-JOS.6.27', title: 'La Caída de Jericó' },
      'el valle de los huesos secos': { ref: 'EZK.37.1-EZK.37.14', title: 'El Valle de los Huesos Secos' },

      // French aliases
      'david et goliath':            { ref: '1SA.17.1-1SA.17.58', title: 'David et Goliath' },
      'l arche de noe':              { ref: 'GEN.6.9-GEN.9.17',  title: "L'Arche de Noé" },
      'le deluge':                   { ref: 'GEN.6.9-GEN.9.17',  title: 'Le Déluge' },
      'le fils prodigue':            { ref: 'LUK.15.11-LUK.15.32', title: 'Le Fils Prodigue' },
      'le bon samaritain':           { ref: 'LUK.10.25-LUK.10.37', title: 'Le Bon Samaritain' },
      'la naissance de jesus':       { ref: 'LUK.2.1-LUK.2.20', title: 'La Naissance de Jésus' },
      'noel':                        { ref: 'LUK.2.1-LUK.2.20', title: 'Noël' },
      'la creation':                 { ref: 'GEN.1.1-GEN.2.3',  title: 'La Création' },
      'adam et eve':                 { ref: 'GEN.2.15-GEN.3.24', title: 'Adam et Ève' },
      'jonas et la baleine':         { ref: 'JON.1.1-JON.4.11', title: 'Jonas et la Baleine' },
      'les dix commandements':       { ref: 'EXO.20.1-EXO.20.17', title: 'Les Dix Commandements' },
      'le notre pere':               { ref: 'MAT.6.9-MAT.6.13', title: 'Le Notre Père' },
      'la cene':                     { ref: 'LUK.22.7-LUK.22.34', title: 'La Cène' },
      'la resurrection de lazare':   { ref: 'JHN.11.1-JHN.11.46', title: 'La Résurrection de Lazare' },
      'daniel dans la fosse aux lions': { ref: 'DAN.6.1-DAN.6.28', title: 'Daniel dans la Fosse aux Lions' },
      'la fournaise ardente':        { ref: 'DAN.3.1-DAN.3.30', title: 'La Fournaise Ardente' },
      'la multiplication des pains': { ref: 'JHN.6.1-JHN.6.15', title: 'La Multiplication des Pains' },
      'jesus marche sur l eau':      { ref: 'MAT.14.22-MAT.14.36', title: 'Jésus Marche sur l\'Eau' },
      'les beatitudes':              { ref: 'MAT.5.3-MAT.5.12', title: 'Les Béatitudes' },
      'la femme samaritaine':        { ref: 'JHN.4.4-JHN.4.42', title: 'La Femme Samaritaine' },
      'moise et la mer rouge':       { ref: 'EXO.13.17-EXO.14.31', title: 'Moïse et la Mer Rouge' },
      'la tour de babel':            { ref: 'GEN.11.1-GEN.11.9', title: 'La Tour de Babel' },
      'la resurrection':             { ref: 'LUK.24.1-LUK.24.12', title: 'La Résurrection' },
      'le bapteme de jesus':         { ref: 'MAT.3.13-MAT.3.17', title: 'Le Baptême de Jésus' },
      'zachee':                      { ref: 'LUK.19.1-LUK.19.10', title: 'Zachée' },
      'abraham et isaac':            { ref: 'GEN.22.1-GEN.22.19', title: 'Abraham et Isaac' },
      'elie et les prophetes de baal': { ref: '1KI.18.16-1KI.18.46', title: 'Élie et les Prophètes de Baal' },
      'ruth et naomi':               { ref: 'RUT.1.1-RUT.1.22', title: 'Ruth et Naomi' },
      'samson et dalila':            { ref: 'JDG.16.1-JDG.16.31', title: 'Samson et Dalila' },
      'la pentecote':                { ref: 'ACT.2.1-ACT.2.47', title: 'La Pentecôte' },
      'la conversion de saul':       { ref: 'ACT.9.1-ACT.9.19', title: 'La Conversion de Saul' },
      'la crucifixion':              { ref: 'MAT.27.31-MAT.27.56', title: 'La Crucifixion' },
      'le chemin d emmaus':          { ref: 'LUK.24.13-LUK.24.35', title: "Le Chemin d'Emmaüs" },
      'le dimanche des rameaux':     { ref: 'MAT.21.1-MAT.21.11', title: 'Le Dimanche des Rameaux' },
      'gethsemane':                  { ref: 'MAT.26.36-MAT.26.56', title: 'Gethsémané' },
      'les noces de cana':           { ref: 'JHN.2.1-JHN.2.11', title: 'Les Noces de Cana' },
      'la transfiguration':          { ref: 'MAT.17.1-MAT.17.13', title: 'La Transfiguration' },
      'le sermon sur la montagne':   { ref: 'MAT.5.1-MAT.5.48', title: 'Le Sermon sur la Montagne' },
      'cain et abel':                { ref: 'GEN.4.1-GEN.4.16', title: 'Caïn et Abel' },
      'la chute de jericho':         { ref: 'JOS.5.13-JOS.6.27', title: 'La Chute de Jéricho' },
      'la vallee des ossements':     { ref: 'EZK.37.1-EZK.37.14', title: 'La Vallée des Ossements' }
    };
  }

  // Strips accents, apostrophes, punctuation — produces a clean ASCII lowercase key
  normalize(str) {
    return str.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[''`]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Smart lookup: direct match → substring match → word-overlap scoring
  findStory(query) {
    const normalized = this.normalize(query);

    if (this.stories[normalized]) return this.stories[normalized];

    const stopWords = new Set(['the', 'a', 'an', 'of', 'in', 'at', 'by', 'to', 'for', 'with', 'and', 'his', 'her', 'its']);
    const queryWords = normalized.split(' ').filter(function(w) {
      return w.length > 1 && !stopWords.has(w);
    });

    if (queryWords.length === 0) return null;

    var bestMatch = null;
    var bestScore = 0;

    var storyKeys = Object.keys(this.stories);
    for (var i = 0; i < storyKeys.length; i++) {
      var key = storyKeys[i];
      var story = this.stories[key];

      // Strong match: one string contains the other
      if (normalized.includes(key) || key.includes(normalized)) {
        return story;
      }

      var keyWords = key.split(' ').filter(function(w) {
        return w.length > 1 && !stopWords.has(w);
      });

      // Count words that match including partial (e.g. "noah" matches "noahs")
      var matchCount = 0;
      for (var q = 0; q < queryWords.length; q++) {
        for (var k = 0; k < keyWords.length; k++) {
          if (keyWords[k].includes(queryWords[q]) || queryWords[q].includes(keyWords[k])) {
            matchCount++;
            break;
          }
        }
      }

      var score = matchCount / queryWords.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = story;
      }
    }

    return bestScore >= 0.6 ? bestMatch : null;
  }

  async getStory(ref, title, version) {
    version = version || this.defaultVersion;
    try {
      const bibleId = this.bibleVersions[version.toUpperCase()] || this.bibleVersions[this.defaultVersion];

      const response = await axios.get(
        this.baseUrl + '/bibles/' + bibleId + '/passages/' + ref,
        {
          headers: { 'api-key': this.apiKey },
          params: {
            'content-type': 'text',
            'include-notes': false,
            'include-titles': false,
            'include-chapter-numbers': false,
            'include-verse-numbers': false
          }
        }
      );

      if (response.data && response.data.data) {
        var text = this.cleanText(response.data.data.content);
        // Truncate very long passages gracefully
        if (text.length > 4500) {
          text = text.substring(0, 4500) + '... For the full passage, please read it in your Bible.';
        }
        return { text: text, reference: title, version: version.toUpperCase() };
      }

      throw new Error('Story not found');
    } catch (error) {
      console.error('Error fetching story:', error.message);
      throw new Error('Unable to retrieve that story. Please try again.');
    }
  }

  getBookCode(book) {
    const code = this.bookCodes[book.toLowerCase()];
    if (!code) throw new Error('Unknown book: ' + book);
    return code;
  }

  validateReference(book, chapter, verse) {
    const safeBook = /^[A-Za-z0-9 ]+$/.test(book);
    const safeChapter = /^\d{1,3}$/.test(String(chapter));
    const safeVerse = verse === undefined || /^\d{1,3}$/.test(String(verse));
    if (!safeBook || !safeChapter || !safeVerse) {
      throw new Error('Invalid reference format');
    }
  }

  async getVerse(book, chapter, verse, version) {
    version = version || this.defaultVersion;
    try {
      this.validateReference(book, chapter, verse);
      const bookCode = this.getBookCode(book);
      const bibleId = this.bibleVersions[version.toUpperCase()] || this.bibleVersions[this.defaultVersion];
      const reference = bookCode + '.' + chapter + '.' + verse;

      const response = await axios.get(
        this.baseUrl + '/bibles/' + bibleId + '/passages/' + reference,
        {
          headers: { 'api-key': this.apiKey },
          params: {
            'content-type': 'text',
            'include-notes': false,
            'include-titles': false,
            'include-chapter-numbers': false,
            'include-verse-numbers': false
          }
        }
      );

      if (response.data && response.data.data) {
        return {
          text: this.cleanText(response.data.data.content),
          reference: response.data.data.reference,
          version: version.toUpperCase()
        };
      }

      throw new Error('Verse not found');
    } catch (error) {
      console.error('Error fetching verse:', error.message);
      throw new Error('Unable to retrieve verse. Please check the reference and try again.');
    }
  }

  async getPassage(book, chapter, startVerse, endVerse, version) {
    version = version || this.defaultVersion;
    try {
      this.validateReference(book, chapter, startVerse);
      this.validateReference(book, chapter, endVerse);
      const bookCode = this.getBookCode(book);
      const bibleId = this.bibleVersions[version.toUpperCase()] || this.bibleVersions[this.defaultVersion];
      const reference = bookCode + '.' + chapter + '.' + startVerse + '-' + bookCode + '.' + chapter + '.' + endVerse;

      const response = await axios.get(
        this.baseUrl + '/bibles/' + bibleId + '/passages/' + reference,
        {
          headers: { 'api-key': this.apiKey },
          params: {
            'content-type': 'text',
            'include-notes': false,
            'include-titles': false,
            'include-chapter-numbers': false,
            'include-verse-numbers': true
          }
        }
      );

      if (response.data && response.data.data) {
        return {
          text: this.cleanText(response.data.data.content),
          reference: response.data.data.reference,
          version: version.toUpperCase()
        };
      }

      throw new Error('Passage not found');
    } catch (error) {
      console.error('Error fetching passage:', error.message);
      throw new Error('Unable to retrieve passage. Please check the reference and try again.');
    }
  }

  async getChapter(book, chapter, version) {
    version = version || this.defaultVersion;
    try {
      this.validateReference(book, chapter);
      const bookCode = this.getBookCode(book);
      const bibleId = this.bibleVersions[version.toUpperCase()] || this.bibleVersions[this.defaultVersion];
      const reference = bookCode + '.' + chapter;

      const response = await axios.get(
        this.baseUrl + '/bibles/' + bibleId + '/passages/' + reference,
        {
          headers: { 'api-key': this.apiKey },
          params: {
            'content-type': 'text',
            'include-notes': false,
            'include-titles': true,
            'include-chapter-numbers': false,
            'include-verse-numbers': true
          }
        }
      );

      if (response.data && response.data.data) {
        return {
          text: this.cleanText(response.data.data.content),
          reference: response.data.data.reference,
          version: version.toUpperCase()
        };
      }

      throw new Error('Chapter not found');
    } catch (error) {
      console.error('Error fetching chapter:', error.message);
      throw new Error('Unable to retrieve chapter. Please check the reference and try again.');
    }
  }

  cleanText(text) {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isValidVersion(version) {
    return Object.hasOwn(this.bibleVersions, version.toUpperCase());
  }

  getAvailableVersions() {
    return Object.keys(this.bibleVersions);
  }
}

module.exports = BibleService;
