import * as _ from "../external/underscore/underscore-esm-min.js";
import {Clone, Flip, KeyMapObj, Loc, LOG, LoremIpsum, Merge, Rand, RandomWord, Sleep, SCase} from "./utils.js";

// #region TEST CODE FOR VSC "Run Code" EXTENSION
/*
 *  const Rand = (n1, n2) => Math.round(Math.random() * (n2 - n1)) + n1;
 *  const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies
 *  nibh sed massa euismod lacinia. Aliquam nec est ac nunc ultricies scelerisque porta vulputate odio.
 *  Integer gravida mattis odio, semper volutpat tellus. Ut elit leo, auctor eget fermentum hendrerit,
 *  aliquet ac nunc. Suspendisse porta turpis vitae mi posuere molestie. Cras lectus lacus, vulputate a
 *  vestibulum in, mattis vel mi. Mauris quis semper mauris. Praesent blandit nec diam eget tincidunt. Nunc
 *  aliquet consequat massa ac lacinia. Ut posuere velit sagittis, vehicula nisl eget, fringilla nibh. Duis
 *  volutpat mattis libero, a porttitor sapien viverra ut. Phasellus vulputate imperdiet ligula, eget
 *  eleifend metus tempor nec. Nam eget sapien risus. Praesent id suscipit elit. Sed pellentesque ligula
 *  diam, non aliquet magna feugiat vitae. Pellentesque ut tortor id erat placerat dignissim. Pellentesque
 *  ut dui vel leo laoreet sodales nec ac tellus. In hac habitasse platea dictumst. Proin sed ex sed augue
 *  sollicitudin interdum. Sed id lacus porttitor nisi vestibulum tincidunt. Nulla facilisi. Vestibulum
 *  feugiat finibus magna in pretium. Proin consectetur lectus nisi, non commodo lectus tempor et. Cras
 *  viverra, mi in consequat aliquet, justo mauris fringilla tellus, at accumsan magna metus in eros. Sed
 *  vehicula, diam ut sagittis semper, purus massa mattis dolor, in posuere.`;
 *  const LoremIpsum = (numWords = 200) => {
 *      const loremIpsumWords = loremIpsumText.replace(/\n/gu, "").split(/ /u);
 *      while (loremIpsumWords.length < numWords)
 *          loremIpsumWords.push(...loremIpsumWords);
 *      loremIpsumWords.length = numWords;
 *      loremIpsumWords[loremIpsumWords.length - 1] = `${loremIpsumWords[loremIpsumWords.length - 1].replace(/[^a-zA-Z]$/u, "")}.`;
 *      return loremIpsumWords.join(" ");
 *  };
 *  const _ = {
 *      sample: (arr) => arr[Rand(0, arr.length - 1)],
 *      shuffle: (arr) => {
 *          let origArr = [...arr];
 *          const newArr = [];
 *          while (origArr.length) {
 *              for (let i = Rand(0, arr.length - 1); i < origArr.length; i++)
 *                  origArr.unshift(origArr.pop());
 *              newArr.push(origArr.pop());
 *          }
 *      }
 *  }
 */
// #endregion
const SCION = {
    TIERS: {
        mortal: "scion.tier.mortal",
        hero: "scion.tier.hero",
        demigod: "scion.tier.demigod",
        god: "scion.tier.god",
    },
    PANTHEONS: {
        aesir: {
            label: "scion.pantheon.name.aesir",
            description: "scion.pantheon.description.aesir",
            assetSkills: ["closeCombat", "occult"],
            pantheonPurview: "wyrd",
            virtues: ["fatalism", "audacity"],
            scentTheDivine: "scion.pantheon.scentTheDivine.aesir",
            religion: "scion.pantheon.religion.aesir",
            members: ["baldr", "bragi", "freya", "freyr", "frigg", "heimdall", "hel", "loki", "njörðr", "odin", "sif", "skaði", "thor", "tyr"],
            bookRef: "scion.book.hero",
            bookPage: 46,
        },
        deva: {
            label: "scion.pantheon.name.deva",
            description: "scion.pantheon.description.deva",
            assetSkills: ["athletics", "survival"],
            pantheonPurview: "yoga",
            virtues: ["conscience", "duty"],
            scentTheDivine: "scion.pantheon.scentTheDivine.deva",
            religion: "scion.pantheon.religion.deva",
            members: ["agni", "durga", "ganesha", "indra", "kali", "karttikeya", "lakshmi", "parvati", "sarasvati", "shiva", "surya", "varuna", "vishnu", "vishvakarman", "yamaraja"],
            bookRef: "scion.book.hero",
            bookPage: 58,
        },
        kami: {
            label: "scion.pantheon.name.kami",
            description: "scion.pantheon.description.kami",
            assetSkills: ["culture", "persuasion"],
            pantheonPurview: "yaoyorozuNoKamigami",
            virtues: ["sincerety", "rightAction"],
            scentTheDivine: "scion.pantheon.scentTheDivine.kami",
            religion: "scion.pantheon.religion.kami",
            members: ["amaNoUzume", "amaterasu", "benzaiten", "bishamon", "ebisu", "fukurokuju", "hachiman", "hotei", "inari", "kisshōten", "ōkuninushi", "omoikane", "sarutahiko", "susanoO", "takemikazuchi", "tsukiyomi"],
            bookRef: "scion.book.hero",
            bookPage: 70,
        },
        loa: {
            label: "scion.pantheon.name.loa",
            description: "scion.pantheon.description.loa",
            assetSkills: ["medicine", "subterfuge"],
            pantheonPurview: "cheval",
            virtues: ["tradition", "innovation"],
            scentTheDivine: "scion.pantheon.scentTheDivine.loa",
            religion: "scion.pantheon.religion.loa",
            members: ["baronCimetière", "baronLaCroix", "baronSamedi", "damballa", "ezili", "kalfu", "lasyren", "ogou", "papaLegba"],
            bookRef: "scion.book.hero",
            bookPage: 32,
        },
        manitou: {
            label: "scion.pantheon.name.manitou",
            description: "scion.pantheon.description.manitou",
            assetSkills: ["medicine", "occult"],
            pantheonPurview: "dodaem",
            virtues: ["pride", "dream"],
            scentTheDivine: "scion.pantheon.scentTheDivine.manitou",
            religion: "scion.pantheon.religion.manitou",
            members: ["biboonike", "cheebyAubOozoo", "geezhigoQuae", "ioskeha", "maudjeeKawiss", "muzzuKumikQuae", "nana", "pukawiss", "tawiscara", "winonah"],
            bookRef: "scion.book.hero",
            bookPage: 82,
        },
        netjer: {
            label: "scion.pantheon.name.netjer",
            description: "scion.pantheon.description.netjer",
            assetSkills: ["academics", "occult"],
            pantheonPurview: "heku",
            virtues: ["balance", "justice"],
            scentTheDivine: "scion.pantheon.scentTheDivine.netjer",
            religion: "scion.pantheon.religion.netjer",
            members: ["anubis", "atum", "bastet", "hathor", "horus", "isis", "osiris", "ptah", "ra", "set", "sobek", "thoth", "upuaut"],
            bookRef: "scion.book.hero",
            bookPage: 94,
        },
        shen: {
            label: "scion.pantheon.name.shen",
            description: "scion.pantheon.description.shen",
            assetSkills: ["academics", "leadership"],
            pantheonPurview: "tianming",
            virtues: ["yin", "yang"],
            scentTheDivine: "scion.pantheon.scentTheDivine.shen",
            religion: "scion.pantheon.religion.shen",
            members: ["changE", "confucius", "doumu", "erlang", "fuxi", "guanYu", "guanshiyinPusa", "huangdi", "laozi", "nuwā", "princeNezha", "sunWukong", "yandiShennongshi"],
            bookRef: "scion.book.hero",
            bookPage: 118,
        },
        teotl: {
            label: "scion.pantheon.name.teotl",
            description: "scion.pantheon.description.teotl",
            assetSkills: ["culture", "empathy"],
            pantheonPurview: "nextlahualli",
            virtues: ["hunger", "sacrifice"],
            scentTheDivine: "scion.pantheon.scentTheDivine.teotl",
            religion: "scion.pantheon.religion.teotl",
            members: ["chalchihuitlicue", "chantico", "chicoAndCenteo", "huehuecoyotl", "huītzilōpōchtli", "ītzpāpālōtl", "mictecacihuatl", "quetzalcoatl", "tezcatlipoca", "tlāloc", "xīpeTotēc", "xochipilli", "xochiquetzal", "xolotl"],
            bookRef: "scion.book.hero",
            bookPage: 130,
        },
        theoi: {
            label: "scion.pantheon.name.theoi",
            description: "scion.pantheon.description.theoi",
            assetSkills: ["empathy", "persuasion"],
            pantheonPurview: "metamorphosis",
            virtues: ["egotism", "kinship"],
            scentTheDivine: "scion.pantheon.scentTheDivine.theoi",
            religion: "scion.pantheon.religion.theoi",
            members: ["aphrodite", "apollo", "ares", "artemis", "athena", "demeter", "dionysus", "epona", "hades", "hecate", "hephaestus", "hera", "hermes", "hestia", "persephone", "poseidon", "zeus"],
            bookRef: "scion.book.hero",
            bookPage: 142,
        },
        tuathaDeDanann: {
            label: "scion.pantheon.name.tuathaDeDanann",
            description: "scion.pantheon.description.tuathaDeDanann",
            assetSkills: ["closeCombat", "culture"],
            pantheonPurview: "geasa",
            virtues: ["honor", "prowess"],
            scentTheDivine: "scion.pantheon.scentTheDivine.tuathaDeDanann",
            religion: "scion.pantheon.religion.tuathaDeDanann",
            members: ["aengus", "brigid", "dianCécht", "donn", "ériu", "goibniu", "lugh", "macLir", "midir", "nuada", "ogma", "theDagda", "morrigan"],
            bookRef: "scion.book.hero",
            bookPage: 154,
        },
        nemetondevos: {
            label: "scion.pantheon.name.nemetondevos",
            description: "scion.pantheon.description.nemetondevos",
            assetSkills: ["closeCombat", "survival"],
            pantheonPurview: "nemeton",
            virtues: ["memory", "purgation"],
            scentTheDivine: "scion.pantheon.scentTheDivine.nemetondevos",
            religion: "scion.pantheon.religion.nemetondevos",
            members: ["andarta", "belenos", "cernunnos", "esos", "gobannos", "nantosuelta", "nehalAndNodens", "sulis", "taranis"],
            bookRef: "scion.book.motw",
            bookPage: 38,
        },
        orisha: {
            label: "scion.pantheon.name.orisha",
            description: "scion.pantheon.description.orisha",
            assetSkills: ["medicine", "subterfuge"],
            pantheonPurview: "cheval",
            virtues: ["tradition", "innovation"],
            scentTheDivine: "scion.pantheon.scentTheDivine.orisha",
            religion: "scion.pantheon.religion.orisha",
            members: ["erinle", "èshùElègbará", "ìbejì", "morèmi", "obàtálá", "odùduwà", "ògún", "òrìshàOko", "òrúnmìlà", "òsanyìn", "oshóssí", "òshun", "oyaIyansan", "shàngó", "sònpònná", "yemojaOboto"],
            bookRef: "scion.book.hero",
            bookPage: 106,
        },
        yazata: {
            label: "scion.pantheon.name.yazata",
            description: "scion.pantheon.description.yazata",
            assetSkills: ["integrity", "leadership"],
            pantheonPurview: "asha",
            virtues: ["honesty", "freeWill"],
            scentTheDivine: "scion.pantheon.scentTheDivine.yazata",
            religion: "scion.pantheon.religion.yazata",
            members: ["anahita", "ashi", "atar", "haoma", "hvareKhshaeta", "mangha", "mithra", "rashnu", "sraosha", "tishtrya", "vanant", "vataVayu", "verethragna", "zam", "zarathustra"],
            bookRef: "scion.book.motw",
            bookPage: 50,
        },
        teros: {
            label: "scion.pantheon.name.teros",
            description: "scion.pantheon.description.teros",
            assetSkills: ["science", "technology"],
            pantheonPurview: "demiurgy",
            virtues: ["nostalgia", "vision"],
            scentTheDivine: "scion.pantheon.scentTheDivine.teros",
            religion: "scion.pantheon.religion.teros",
            members: ["aeva", "ytar", "amnis", "badaris", "kuros", "demosia", "hesbon", "skaft", "versak"],
            bookRef: "scion.book.motw",
            bookPage: 80,
        },
    },
    GODS: {
        /* eslint-disable sort-keys */
        baldr: {
            label: "scion.pantheon.god.baldr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.baldr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "liminal", "lover"],
            purviews: ["beauty", "passion:Love|Peace", "health", "epicStamina", "sun"],
        },
        bragi: {
            label: "scion.pantheon.god.bragi",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.bragi",
            bookRef: "scion.book.motw",
            bookPage: 63,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:Storytelling|Poetry|Song", "epicDexterity", "fortune", "passion:Joy"],
        },
        freya: {
            label: "scion.pantheon.god.freya",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.freya",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["lover", "guardian", "sage"],
            purviews: ["beauty", "epicStamina", "fertility", "fortune", "passion:Love|Lust", "war"],
        },
        freyr: {
            label: "scion.pantheon.god.freyr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.freyr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["lover", "warrior", "leader"],
            purviews: ["beauty", "fertility", "order", "war", "wild"],
        },
        frigg: {
            label: "scion.pantheon.god.frigg",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.frigg",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Falcon", "fortune", "order", "wild"],
        },
        heimdall: {
            label: "scion.pantheon.god.heimdall",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.heimdall",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "hunter"],
            purviews: ["artistry:Horns", "beauty", "epicStamina", "journeys"],
        },
        hel: {
            label: "scion.pantheon.god.hel",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.hel",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "forge", "frost", "health", "passion:Fear|Disgust"],
        },
        loki: {
            label: "scion.pantheon.god.loki",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.loki",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["chaos", "deception", "epicStrength", "fire"],
        },
        njörðr: {
            label: "scion.pantheon.god.njörðr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.njörðr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["fertility", "fire", "journeys", "prosperity", "sky", "water"],
        },
        odin: {
            label: "scion.pantheon.god.odin",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.odin",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "death", "deception", "epicStamina", "fortune", "journeys", "war"],
        },
        sif: {
            label: "scion.pantheon.god.sif",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.sif",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "earth", "fertility", "order"],
        },
        skaði: {
            label: "scion.pantheon.god.skaði",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.skaði",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["hunter", "judge", "warrior"],
            purviews: ["earth", "epicDexterity", "frost", "journeys", "order"],
        },
        thor: {
            label: "scion.pantheon.god.thor",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.thor",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["epicStamina", "epicStrength", "fertility", "sky"],
        },
        tyr: {
            label: "scion.pantheon.god.tyr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.tyr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["judge", "leader", "warrior"],
            purviews: ["epicStamina", "order", "passion:Courage", "war"],
        },
        agni: {
            label: "scion.pantheon.god.agni",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.agni",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "journeys", "prosperity", "water"],
        },
        durga: {
            label: "scion.pantheon.god.durga",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.durga",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["deception", "epicStrength", "epicDexterity", "epicStamina", "fertility", "war"],
        },
        ganesha: {
            label: "scion.pantheon.god.ganesha",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.ganesha",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["artistry:Dance|Writing", "beasts:Elephants", "chaos", "fortune", "journeys", "prosperity"],
        },
        indra: {
            label: "scion.pantheon.god.indra",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.indra",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Cattle", "epicStrength", "epicDexterity", "fertility", "order", "sky", "war", "wild"],
        },
        kali: {
            label: "scion.pantheon.god.kali",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.kali",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["epicStrength", "epicDexterity", "epicStamina", "artistry:Dance", "chaos", "darkness", "death", "deception", "fire"],
        },
        karttikeya: {
            label: "scion.pantheon.god.karttikeya",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.karttikeya",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["leader", "sage", "warrior"],
            purviews: ["beauty", "epicStrength", "epicDexterity", "epicStamina", "stars", "war"],
        },
        lakshmi: {
            label: "scion.pantheon.god.lakshmi",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.lakshmi",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "epicStrength", "earth", "fertility", "fortune", "order", "passion:Joy|Love", "prosperity"],
        },
        parvati: {
            label: "scion.pantheon.god.parvati",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.parvati",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["creator", "lover", "trickster"],
            purviews: ["epicStrength", "epicStamina", "artistry:Dance", "beauty", "earth", "fertility", "frost", "passion:Devotion|Love"],
        },
        sarasvati: {
            label: "scion.pantheon.god.sarasvati",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.sarasvati",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:All", "epicStrength", "epicDexterity", "health", "water"],
        },
        shiva: {
            label: "scion.pantheon.god.shiva",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.shiva",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["hunter", "lover", "sage"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "chaos", "death", "deception", "epicStrength", "epicDexterity", "epicStamina", "epicStrength", "fertility", "fire", "Moon", "Sky"],
        },
        surya: {
            label: "scion.pantheon.god.surya",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.surya",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["healer", "leader", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "health", "journeys", "stars", "sun"],
        },
        varuna: {
            label: "scion.pantheon.god.varuna",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.varuna",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "judge", "leader"],
            purviews: ["epicStrength", "darkness", "fertility", "order", "sky", "sun", "water"],
        },
        vishnu: {
            label: "scion.pantheon.god.vishnu",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.vishnu",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:Dance|Wind Instruments", "beauty", "deception", "epicStamina", "epicStrength", "epicDexterity", "order", "passion:Hope"],
        },
        vishvakarman: {
            label: "scion.pantheon.god.vishvakarman",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.vishvakarman",
            bookRef: "scion.book.motw",
            bookPage: 64,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:All", "beasts:Doves", "chaos", "forge", "order", "prosperity"],
        },
        yamaraja: {
            label: "scion.pantheon.god.yamaraja",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.yamaraja",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["judge", "leader", "liminal"],
            purviews: ["epicDexterity", "epicStamina", "darkness", "death", "journeys", "order"],
        },
        amaNoUzume: {
            label: "scion.pantheon.god.amaNoUzume",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.amaNoUzume",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Dance|Singing", "deception", "passion:Lust|Mirth"],
        },
        amaterasu: {
            label: "scion.pantheon.god.amaterasu",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.amaterasu",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["judge", "leader", "sage"],
            purviews: ["epicStrength", "fertility", "order", "prosperity", "sun"],
        },
        benzaiten: {
            label: "scion.pantheon.god.benzaiten",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.benzaiten",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "lover", "sage"],
            purviews: ["artistry", "beast:Snake", "beauty", "fertility", "fortune", "stars"],
        },
        bishamon: {
            label: "scion.pantheon.god.bishamon",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.bishamon",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["epicDexterity", "fortune", "prosperity", "war"],
        },
        ebisu: {
            label: "scion.pantheon.god.ebisu",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.ebisu",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["beasts:Fish|Sharks|Whales", "epicStamina", "fortune", "prosperity", "wild"],
        },
        fukurokuju: {
            label: "scion.pantheon.god.fukurokuju",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.fukurokuju",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Deer|Turtle|Crane", "epicStamina", "health", "fortune"],
        },
        hachiman: {
            label: "scion.pantheon.god.hachiman",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.hachiman",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["leader", "sage", "warrior"],
            purviews: ["artistry:All", "beasts:Dove", "order", "prosperity", "war"],
        },
        hotei: {
            label: "scion.pantheon.god.hotei",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.hotei",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["chaos", "fortune", "journeys", "passion:Joy"],
        },
        inari: {
            label: "scion.pantheon.god.inari",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.inari",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "healer", "liminal"],
            purviews: ["beasts:Fox", "fertility", "fortune", "health", "journeys", "prosperity"],
        },
        kisshōten: {
            label: "scion.pantheon.god.kisshōten",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.kisshōten",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "healer", "lover"],
            purviews: ["beauty", "fortune", "health"],
        },
        ōkuninushi: {
            label: "scion.pantheon.god.ōkuninushi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.ōkuninushi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "leader", "liminal"],
            purviews: ["beasts:All", "earth", "darkness", "fortune", "prosperity"],
        },
        omoikane: {
            label: "scion.pantheon.god.omoikane",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.omoikane",
            bookRef: "scion.book.motw",
            bookPage: 65,
            callings: ["judge", "sage", "trickster"],
            purviews: ["artistry:Rhetoric", "deception", "order", "prosperity", "sky"],
        },
        sarutahiko: {
            label: "scion.pantheon.god.sarutahiko",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.sarutahiko",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["lover", "sage", "warrior"],
            purviews: ["beasts:Monkeys", "earth", "journeys"],
        },
        susanoO: {
            label: "scion.pantheon.god.susanoO",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.susanoO",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["artistry:Poetry", "chaos", "death", "epicStrength", "forge", "sky", "water"],
        },
        takemikazuchi: {
            label: "scion.pantheon.god.takemikazuchi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.takemikazuchi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Deer", "epicDexterity", "epicStamina", "epicStrength", "sky:Thunder", "war"],
        },
        tsukiyomi: {
            label: "scion.pantheon.god.tsukiyomi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.tsukiyomi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["healer", "liminal", "judge"],
            purviews: ["artistry", "darkness", "moon", "order"],
        },
        baronCimetière: {
            label: "scion.pantheon.god.baronCimetière",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronCimetière",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["darkness", "death", "epicStamina", "health"],
        },
        baronLaCroix: {
            label: "scion.pantheon.god.baronLaCroix",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronLaCroix",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["death", "epicStamina", "fortune", "health"],
        },
        baronSamedi: {
            label: "scion.pantheon.god.baronSamedi",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronSamedi",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "lover", "trickster"],
            purviews: ["chaos", "death", "epicStamina", "fertility", "health"],
        },
        damballa: {
            label: "scion.pantheon.god.damballa",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.damballa",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Snakes", "earth", "fertility", "order", "sky", "water"],
        },
        ezili: {
            label: "scion.pantheon.god.ezili",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.ezili",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"],
        },
        kalfu: {
            label: "scion.pantheon.god.kalfu",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.kalfu",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["chaos", "darkness", "fortune", "journeys", "moon"],
        },
        lasyren: {
            label: "scion.pantheon.god.lasyren",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.lasyren",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"],
        },
        ogou: {
            label: "scion.pantheon.god.ogou",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.ogou",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"],
        },
        papaLegba: {
            label: "scion.pantheon.god.papaLegba",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.papaLegba",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"],
        },
        biboonike: {
            label: "scion.pantheon.god.biboonike",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.biboonike",
            bookRef: "scion.book.motw",
            bookPage: 65,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["chaos", "darkness", "frost", "sky", "wild"],
        },
        cheebyAubOozoo: {
            label: "scion.pantheon.god.cheebyAubOozoo",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.cheebyAubOozoo",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "judge", "liminal"],
            purviews: ["artistry:Song|Music", "beasts:Wolf", "darkness", "death", "epicStamina", "order"],
        },
        geezhigoQuae: {
            label: "scion.pantheon.god.geezhigoQuae",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.geezhigoQuae",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "sage"],
            purviews: ["beasts:Crane|Turtle", "moon", "order", "sky", "stars"],
        },
        ioskeha: {
            label: "scion.pantheon.god.ioskeha",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.ioskeha",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["creator", "leader", "warrior"],
            purviews: ["forge", "sun", "sky", "order", "beasts:diurnal mammals and birds|insects|fish", "health", "passion:All light emotions"],
        },
        maudjeeKawiss: {
            label: "scion.pantheon.god.maudjeeKawiss",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.maudjeeKawiss",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["beasts:Bear|Eagle", "epicDexterity", "epicStrength", "war"],
        },
        muzzuKumikQuae: {
            label: "scion.pantheon.god.muzzuKumikQuae",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.muzzuKumikQuae",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:All", "earth", "fertility", "sky", "water", "wild"],
        },
        nana: {
            label: "scion.pantheon.god.nana",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.nana",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "trickster", "warrior"],
            purviews: ["beasts:Rabbit", "chaos", "epicDexterity", "fortune", "journeys"],
        },
        pukawiss: {
            label: "scion.pantheon.god.pukawiss",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.pukawiss",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["lover", "sage", "trickster"],
            purviews: ["epicDexterity", "artistry:Dance|Acting|Storytelling", "passion:Mirth", "fortune", "deception"],
        },
        tawiscara: {
            label: "scion.pantheon.god.tawiscara",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.tawiscara",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["chaos", "deception", "darkness", "death", "passion:All dark emotions", "forge", "war"],
        },
        winonah: {
            label: "scion.pantheon.god.winonah",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.winonah",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "lover"],
            purviews: ["epicStamina", "fortune", "health", "passion:All", "prosperity"],
        },
        anubis: {
            label: "scion.pantheon.god.anubis",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.anubis",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beast:Jackal", "darkness", "death", "order"],
        },
        atum: {
            label: "scion.pantheon.god.atum",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.atum",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:Dance|Pottery", "beasts:Ram", "earth", "health", "water"],
        },
        bastet: {
            label: "scion.pantheon.god.bastet",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.bastet",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["artistry:Dance|Music", "beasts:Cats|Lions", "epicDexterity", "fertility", "fortune", "health", "moon", "sun", "war"],
        },
        hathor: {
            label: "scion.pantheon.god.hathor",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.hathor",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "lover", "healer"],
            purviews: ["artistry:Music|Dance", "beasts:Cow", "beauty", "fertility", "fortune", "passion:Love", "sky"],
        },
        horus: {
            label: "scion.pantheon.god.horus",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.horus",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Falcon", "moon", "order", "sky", "sun", "war"],
        },
        isis: {
            label: "scion.pantheon.god.isis",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.isis",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "healer", "trickster"],
            purviews: ["beasts:Kite|Serpent", "death", "deception", "fertility", "fortune", "health", "stars"],
        },
        osiris: {
            label: "scion.pantheon.god.osiris",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.osiris",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Ram|Centipede", "death", "earth", "fertility", "order"],
        },
        ptah: {
            label: "scion.pantheon.god.ptah",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.ptah",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "liminal", "sage"],
            purviews: ["beasts:Bull", "fire", "forge", "prosperity"],
        },
        ra: {
            label: "scion.pantheon.god.ra",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.ra",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Falcon|Scarab|Ram", "death", "epicStamina", "fire", "journeys", "order", "sun"],
        },
        set: {
            label: "scion.pantheon.god.set",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.set",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "trickster"],
            purviews: ["beasts:Salawa|Fish", "chaos", "earth", "epicStrength", "journeys", "sky", "war"],
        },
        sobek: {
            label: "scion.pantheon.god.sobek",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.sobek",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "lover"],
            purviews: ["beasts:Crocodile", "epicStamina", "passion:Lust", "fertility", "water"],
        },
        thoth: {
            label: "scion.pantheon.god.thoth",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.thoth",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["beasts:Baboon|Ibis", "deception", "fortune", "health", "moon", "order"],
        },
        upuaut: {
            label: "scion.pantheon.god.upuaut",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.upuaut",
            bookRef: "scion.book.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "warrior"],
            purviews: ["beasts:Wolves", "death", "epicDexterity", "epicStamina", "journeys", "war"],
        },
        changE: {
            label: "scion.pantheon.god.changE",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.changE",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["healer", "lover", "trickster"],
            purviews: ["beasts:Rabbits|Toads", "beauty", "epicStamina", "health", "moon"],
        },
        confucius: {
            label: "scion.pantheon.god.confucius",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.confucius",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["judge", "leader", "sage"],
            purviews: ["artistry:All", "order", "passion:Filiality"],
        },
        doumu: {
            label: "scion.pantheon.god.doumu",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.doumu",
            bookRef: "scion.book.motw",
            bookPage: 67,
            callings: ["judge", "leader", "sage"],
            purviews: ["beasts:Boars", "fortune", "order", "prosperity", "stars"],
        },
        erlang: {
            label: "scion.pantheon.god.erlang",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.erlang",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["epicStamina", "epicStrength", "forge", "war", "water"],
        },
        fuxi: {
            label: "scion.pantheon.god.fuxi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.fuxi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "hunter", "sage"],
            purviews: ["artistry:Musical Instruments|Writing", "beasts:All", "fertility", "forge", "fortune", "health", "order", "sun"],
        },
        guanYu: {
            label: "scion.pantheon.god.guanYu",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.guanYu",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["artistry:Historical Fiction", "epicStrength", "epicStamina", "order", "passion:Loyalty", "prosperity", "sky", "war"],
        },
        guanshiyinPusa: {
            label: "scion.pantheon.god.guanshiyinPusa",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.guanshiyinPusa",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "healer", "sage"],
            purviews: ["deception", "epicStamina", "health", "journeys", "passion:Mercy", "water"],
        },
        huangdi: {
            label: "scion.pantheon.god.huangdi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.huangdi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:All", "death", "earth", "forge", "health", "order", "prosperity", "war"],
        },
        laozi: {
            label: "scion.pantheon.god.laozi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.laozi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "chaos", "darkness", "epicStamina", "health", "order", "water"],
        },
        nuwā: {
            label: "scion.pantheon.god.nuwā",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.nuwā",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "guardian", "healer"],
            purviews: ["earth", "fertility", "forge", "health", "moon", "sky"],
        },
        princeNezha: {
            label: "scion.pantheon.god.princeNezha",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.princeNezha",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["artistry:Animation", "epicStamina", "epicStrength", "health", "war"],
        },
        sunWukong: {
            label: "scion.pantheon.god.sunWukong",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.sunWukong",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["liminal", "trickster", "warrior"],
            purviews: ["artistry:Opera", "beasts:Monkey", "chaos", "deception", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"],
        },
        yandiShennongshi: {
            label: "scion.pantheon.god.yandiShennongshi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.yandiShennongshi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Storytelling", "epicStamina", "fertility", "fire", "forge", "health", "prosperity"],
        },
        chalchihuitlicue: {
            label: "scion.pantheon.god.chalchihuitlicue",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chalchihuitlicue",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Aquatic Animal", "fertility", "water"],
        },
        chantico: {
            label: "scion.pantheon.god.chantico",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chantico",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["healer", "liminal", "sage"],
            purviews: ["fire", "forge", "order", "prosperity"],
        },
        chicoAndCenteo: {
            label: "scion.pantheon.god.chicoAndCenteo",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chicoAndCenteo",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["healer", "guardian", "judge"],
            purviews: ["earth", "fertility", "prosperity"],
        },
        huehuecoyotl: {
            label: "scion.pantheon.god.huehuecoyotl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.huehuecoyotl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["lover", "sage", "trickster"],
            purviews: ["chaos", "epicDexterity", "passion:All"],
        },
        huītzilōpōchtli: {
            label: "scion.pantheon.god.huītzilōpōchtli",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.huītzilōpōchtli",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Eagle|Hummingbird", "death", "epicStrength", "prosperity", "sun", "war"],
        },
        ītzpāpālōtl: {
            label: "scion.pantheon.god.ītzpāpālōtl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.ītzpāpālōtl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["hunter", "lover", "warrior"],
            purviews: ["beasts:All", "darkness", "death", "fertility", "stars", "war"],
        },
        mictecacihuatl: {
            label: "scion.pantheon.god.mictecacihuatl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.mictecacihuatl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "sage"],
            purviews: ["beasts:Bats|Owls|Spiders", "darkness", "death", "passion:All"],
        },
        quetzalcoatl: {
            label: "scion.pantheon.god.quetzalcoatl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.quetzalcoatl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Writing|Feathers", "beasts:All", "fertility", "journeys", "order", "sky", "stars"],
        },
        tezcatlipoca: {
            label: "scion.pantheon.god.tezcatlipoca",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.tezcatlipoca",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["hunter", "leader", "trickster"],
            purviews: ["beasts:Jaguar|Turkey", "chaos", "darkness", "deception", "earth", "fortune", "war"],
        },
        tlāloc: {
            label: "scion.pantheon.god.tlāloc",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.tlāloc",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["death", "earth", "fertility", "frost", "health", "sky"],
        },
        xīpeTotēc: {
            label: "scion.pantheon.god.xīpeTotēc",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xīpeTotēc",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "healer", "hunter"],
            purviews: ["fertility", "forge", "health", "war"],
        },
        xochipilli: {
            label: "scion.pantheon.god.xochipilli",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xochipilli",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:All", "beauty", "fortune", "passion:All", "prosperity"],
        },
        xochiquetzal: {
            label: "scion.pantheon.god.xochiquetzal",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xochiquetzal",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "lover"],
            purviews: ["artistry:All", "beauty", "epicDexterity", "fertility", "fortune", "passion:All", "prosperity"],
        },
        xolotl: {
            label: "scion.pantheon.god.xolotl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xolotl",
            bookRef: "scion.book.motw",
            bookPage: 67,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["beasts:Dogs", "chaos", "darkness", "death", "earth", "journeys"],
        },
        aphrodite: {
            label: "scion.pantheon.god.aphrodite",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.aphrodite",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "fertility", "passion:Desire|Love", "prosperity"],
        },
        apollo: {
            label: "scion.pantheon.god.apollo",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.apollo",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["healer", "judge", "sage"],
            purviews: ["artistry", "epicDexterity", "health", "sun"],
        },
        ares: {
            label: "scion.pantheon.god.ares",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.ares",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "lover", "warrior"],
            purviews: ["chaos", "fertility", "order", "passion:Rage|Valor", "prosperity", "war"],
        },
        artemis: {
            label: "scion.pantheon.god.artemis",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.artemis",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["beasts:All", "epicDexterity", "health", "moon", "wild"],
        },
        athena: {
            label: "scion.pantheon.god.athena",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.athena",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Weaving", "beasts:Owl", "epicDexterity", "order", "war"],
        },
        demeter: {
            label: "scion.pantheon.god.demeter",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.demeter",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "judge"],
            purviews: ["earth", "epicStamina", "fertility", "order"],
        },
        dionysus: {
            label: "scion.pantheon.god.dionysus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.dionysus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["liminal", "lover", "sage"],
            purviews: ["artistry:Theatre", "chaos", "deception", "fertility", "passion:Ecstasy", "wild"],
        },
        epona: {
            label: "scion.pantheon.god.epona",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.epona",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["beasts:Horses", "fertility", "order", "war"],
        },
        hades: {
            label: "scion.pantheon.god.hades",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hades",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["darkness", "death", "earth", "prosperity"],
        },
        hecate: {
            label: "scion.pantheon.god.hecate",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hecate",
            bookRef: "scion.book.motw",
            bookPage: 68,
            callings: ["healer", "liminal", "sage"],
            purviews: ["beasts:Dogs", "darkness", "fortune", "journeys", "moon", "stars", "wild"],
        },
        hephaestus: {
            label: "scion.pantheon.god.hephaestus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hephaestus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "sage", "trickster"],
            purviews: ["epicStamina", "fire", "forge", "fortune"],
        },
        hera: {
            label: "scion.pantheon.god.hera",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hera",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "fertility", "health", "order", "passion:Fidelity", "prosperity"],
        },
        hermes: {
            label: "scion.pantheon.god.hermes",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hermes",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["death", "deception", "epicDexterity", "journeys", "prosperity"],
        },
        hestia: {
            label: "scion.pantheon.god.hestia",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hestia",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "judge"],
            purviews: ["fire", "fortune", "order", "prosperity"],
        },
        persephone: {
            label: "scion.pantheon.god.persephone",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.persephone",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["death", "fertility", "health"],
        },
        poseidon: {
            label: "scion.pantheon.god.poseidon",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.poseidon",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beasts:Horse", "epicStrength", "earth", "water"],
        },
        zeus: {
            label: "scion.pantheon.god.zeus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.zeus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["leader", "lover", "trickster"],
            purviews: ["deception", "epicStrength", "epicStamina", "fortune", "order", "sky"],
        },
        aengus: {
            label: "scion.pantheon.god.aengus",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.aengus",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beasts:Bird", "beauty", "deception", "moon", "passion:Love"],
        },
        brigid: {
            label: "scion.pantheon.god.brigid",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.brigid",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["healer", "sage", "trickster"],
            purviews: ["artistry:Poetry", "fertility", "fire", "forge", "health"],
        },
        dianCécht: {
            label: "scion.pantheon.god.dianCécht",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.dianCécht",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "healer", "judge"],
            purviews: ["fertility", "health", "water"],
        },
        donn: {
            label: "scion.pantheon.god.donn",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.donn",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["leader", "liminal", "trickster"],
            purviews: ["darkness", "death", "journeys", "sky"],
        },
        ériu: {
            label: "scion.pantheon.god.ériu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.ériu",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "judge", "leader"],
            purviews: ["earth", "fertility", "order", "prosperity"],
        },
        goibniu: {
            label: "scion.pantheon.god.goibniu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.goibniu",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "sage", "warrior"],
            purviews: ["artistry:Brewing", "epicStamina", "forge", "health"],
        },
        lugh: {
            label: "scion.pantheon.god.lugh",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.lugh",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "leader", "warrior"],
            purviews: ["artistry:All", "epicDexterity", "epicStrength", "forge", "health", "order", "prosperity", "war"],
        },
        macLir: {
            label: "scion.pantheon.god.macLir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.macLir",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "liminal", "trickster"],
            purviews: ["deception", "journeys", "prosperity", "stars", "water"],
        },
        midir: {
            label: "scion.pantheon.god.midir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.midir",
            bookRef: "scion.book.motw",
            bookPage: 68,
            callings: ["deception", "earth", "fortune"],
            purviews: ["passion:Single-Mindedness"],
        },
        nuada: {
            label: "scion.pantheon.god.nuada",
            pantheon: "tuathaDeDanann",
            mantle: false,
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["leader", "sage", "warrior"],
            purviews: ["order", "prosperity", "war"],
        },
        ogma: {
            label: "scion.pantheon.god.ogma",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.ogma",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Oration|Poetry", "epicStrength", "fortune", "wild"],
        },
        theDagda: {
            label: "scion.pantheon.god.theDagda",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.theDagda",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "leader", "sage"],
            purviews: ["epicStamina", "epicStrength", "fertility", "forge", "prosperity", "war"],
        },
        morrigan: {
            label: "scion.pantheon.god.morrigan",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.morrigan",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beasts:Crows|Cattle|Horses", "chaos", "death", "epicDexterity", "fortune", "prosperity", "war"],
        },
        andarta: {
            label: "scion.pantheon.god.andarta",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.andarta",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["epicDexterity", "epicStamina", "fortune", "passion:Bravery", "war"],
        },
        belenos: {
            label: "scion.pantheon.god.belenos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.belenos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["healer", "liminal", "sage"],
            purviews: ["death", "health", "stars", "sun"],
        },
        cernunnos: {
            label: "scion.pantheon.god.cernunnos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.cernunnos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "guardian", "sage"],
            purviews: ["beasts:All Wild Animals", "prosperity", "wild"],
        },
        esos: {
            label: "scion.pantheon.god.esos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.esos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["artistry:Woodcarving", "epicStrength", "forge"],
        },
        gobannos: {
            label: "scion.pantheon.god.gobannos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.gobannos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "lover", "warrior"],
            purviews: ["epicStamina", "forge", "journeys", "prosperity"],
        },
        nantosuelta: {
            label: "scion.pantheon.god.nantosuelta",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.nantosuelta",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Bees|Birds", "fertility", "fire"],
        },
        nehalAndNodens: {
            label: "scion.pantheon.god.nehalAndNodens",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.nehalAndNodens",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "liminal"],
            purviews: ["beasts:Dogs|Marine Life", "fertility:Nehalennia ONLY", "health", "journeys", "prosperity", "water"],
        },
        sulis: {
            label: "scion.pantheon.god.sulis",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.sulis",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "judge"],
            purviews: ["earth", "health", "water"],
        },
        taranis: {
            label: "scion.pantheon.god.taranis",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.taranis",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["judge", "liminal", "warrior"],
            purviews: ["chaos", "epicStrength", "sky"],
        },
        erinle: {
            label: "scion.pantheon.god.erinle",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.erinle",
            bookRef: "scion.book.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "lover"],
            purviews: ["beauty", "epicStamina", "epicStrength", "passion:Love", "prosperity", "water"],
        },
        èshùElègbará: {
            label: "scion.pantheon.god.èshùElègbará",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.èshùElègbará",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"],
        },
        ìbejì: {
            label: "scion.pantheon.god.ìbejì",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.ìbejì",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "judge", "trickster"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "death", "fertility", "fortune", "prosperity"],
        },
        morèmi: {
            label: "scion.pantheon.god.morèmi",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.morèmi",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beauty", "deception", "fertility", "fire", "passion:All"],
        },
        obàtálá: {
            label: "scion.pantheon.god.obàtálá",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.obàtálá",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "judge", "leader"],
            purviews: ["artistry:Sculpture", "health", "order", "sky"],
        },
        odùduwà: {
            label: "scion.pantheon.god.odùduwà",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.odùduwà",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "leader", "warrior"],
            purviews: ["darkness", "earth", "order", "war"],
        },
        ògún: {
            label: "scion.pantheon.god.ògún",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.ògún",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"],
        },
        òrìshàOko: {
            label: "scion.pantheon.god.òrìshàOko",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òrìshàOko",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["hunter", "judge", "sage"],
            purviews: ["beasts:Beasts of Burden|Birds", "fertility", "fortune", "order", "prosperity"],
        },
        òrúnmìlà: {
            label: "scion.pantheon.god.òrúnmìlà",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òrúnmìlà",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "judge", "sage"],
            purviews: ["fortune", "sky", "stars", "wild"],
        },
        òsanyìn: {
            label: "scion.pantheon.god.òsanyìn",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òsanyìn",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:Birds", "epicStamina", "fertility", "fortune", "health", "wild"],
        },
        oshóssí: {
            label: "scion.pantheon.god.oshóssí",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.oshóssí",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["hunter", "liminal", "judge"],
            purviews: ["beasts", "epicDexterity", "prosperity", "wild"],
        },
        òshun: {
            label: "scion.pantheon.god.òshun",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òshun",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"],
        },
        oyaIyansan: {
            label: "scion.pantheon.god.oyaIyansan",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.oyaIyansan",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["beasts:Bull", "epicDexterity", "epicStrength", "death", "prosperity", "sky", "water"],
        },
        shàngó: {
            label: "scion.pantheon.god.shàngó",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.shàngó",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["leader", "lover", "warrior"],
            purviews: ["artistry:Dance|Drums", "beauty", "epicStrength", "fire", "order", "passion", "prosperity", "sky", "war"],
        },
        sònpònná: {
            label: "scion.pantheon.god.sònpònná",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.sònpònná",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "liminal"],
            purviews: ["death", "earth", "health", "passion:Spite", "wild"],
        },
        yemojaOboto: {
            label: "scion.pantheon.god.yemojaOboto",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.yemojaOboto",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"],
        },
        anahita: {
            label: "scion.pantheon.god.anahita",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "healer", "warrior"],
            purviews: ["beauty", "health", "water", "war", "wild"],
        },
        ashi: {
            label: "scion.pantheon.god.ashi",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["judge", "sage", "warrior"],
            purviews: ["earth", "fortune", "prosperity", "war"],
        },
        atar: {
            label: "scion.pantheon.god.atar",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.atar",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["artistry:Innovation", "beauty", "fire", "forge", "health", "passion:Devotion"],
        },
        haoma: {
            label: "scion.pantheon.god.haoma",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.haoma",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["beauty", "epicStrength", "fertility", "health"],
        },
        hvareKhshaeta: {
            label: "scion.pantheon.god.hvareKhshaeta",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.hvareKhshaeta",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beauty", "epicDexterity", "epicStamina", "sun"],
        },
        mangha: {
            label: "scion.pantheon.god.mangha",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.mangha",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Bovines", "fertility", "fortune", "moon", "prosperity"],
        },
        mithra: {
            label: "scion.pantheon.god.mithra",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "leader"],
            purviews: ["death", "order", "sun"],
        },
        rashnu: {
            label: "scion.pantheon.god.rashnu",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.rashnu",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "epicStrength", "journeys", "order"],
        },
        sraosha: {
            label: "scion.pantheon.god.sraosha",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.sraosha",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "sage"],
            purviews: ["artistry:Song", "death", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"],
        },
        tishtrya: {
            label: "scion.pantheon.god.tishtrya",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "healer", "warrior"],
            purviews: ["beasts:Horses", "fertility", "health", "sky", "stars", "water"],
        },
        vanant: {
            label: "scion.pantheon.god.vanant",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "judge"],
            purviews: ["epicDexterity", "epicStamina", "epicStrength", "journeys", "stars"],
        },
        vataVayu: {
            label: "scion.pantheon.god.vataVayu",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.vataVayu",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["chaos", "death", "epicDexterity", "sky", "wild"],
        },
        verethragna: {
            label: "scion.pantheon.god.verethragna",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.verethragna",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts", "epicDexterity", "epicStamina", "epicStrength", "fertility", "health", "journeys", "war"],
        },
        zam: {
            label: "scion.pantheon.god.zam",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.zam",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "guardian", "healer"],
            purviews: ["beauty", "earth", "epicStamina", "wild"],
        },
        zarathustra: {
            label: "scion.pantheon.god.zarathustra",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.zarathustra",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Poetry", "journeys", "order"],
        },
        aeva: {
            label: "scion.pantheon.god.aeva",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.aeva",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:Music", "death", "fertility", "forge", "health", "order", "passion:Dread", "stars"],
        },
        ytar: {
            label: "scion.pantheon.god.ytar",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.ytar",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "trickster", "sage"],
            purviews: ["chaos", "darkness", "deception", "epicStrength", "forge", "journeys", "passion:Joy", "stars"],
        },
        amnis: {
            label: "scion.pantheon.god.amnis",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.amnis",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "leader", "healer"],
            purviews: ["fertility", "forge", "health", "journeys", "order", "prosperity", "water"],
        },
        badaris: {
            label: "scion.pantheon.god.badaris",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.badaris",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Travelogues", "beasts:Marine Life", "epicStamina", "forge", "journeys", "passion:Wanderlust", "water"],
        },
        kuros: {
            label: "scion.pantheon.god.kuros",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.kuros",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beauty", "epicDexterity", "journeys", "order", "passion:Love", "sky", "stars"],
        },
        demosia: {
            label: "scion.pantheon.god.demosia",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.demosia",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "trickster"],
            purviews: ["beasts:Nocturnal Animals", "darkness", "deception", "frost", "moon"],
        },
        hesbon: {
            label: "scion.pantheon.god.hesbon",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.hesbon",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "hunter", "liminal"],
            purviews: ["beasts:Predators", "chaos", "earth", "epicDexterity", "epicStrength", "fertility", "fortune", "passion:Fury", "wild"],
        },
        skaft: {
            label: "scion.pantheon.god.skaft",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.skaft",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:All", "earth", "epicStamina", "fire", "forge", "passion:Curiosity", "prosperity"],
        },
        versak: {
            label: "scion.pantheon.god.versak",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.versak",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beauty", "death", "fire", "order", "passion:Pride", "sky", "sun"],
        },
        /* eslint-enable sort-keys */
    },
    GENESES: {
        born: "scion.genesis.born",
        created: "scion.genesis.created",
        incarnation: "scion.genesis.incarnation",
        chosen: "scion.genesis.chosen",
    },
    PATHS: {
        list: ["origin", "role", "pantheon"]
    },
    ATTRIBUTES: {
        min: 1,
        max: 5,
        priorities: {
            primary: {
                label: "scion.game.primary",
                startingDots: 6,
            },
            secondary: {
                label: "scion.game.secondary",
                startingDots: 4,
            },
            tertiary: {
                label: "scion.game.tertiary",
                startingDots: 2,
            },
        },
        arenas: {
            social: ["presence", "manipulation", "composure"],
            mental: ["intellect", "cunning", "resolve"],
            physical: ["might", "dexterity", "stamina"],
        },
        approaches: {
            force: ["presence", "intellect", "might"],
            finesse: ["manipulation", "cunning", "dexterity"],
            resilience: ["composure", "resolve", "stamina"],
        },
        list: {
            presence: "scion.attribute.presence",
            manipulation: "scion.attribute.manipulation",
            composure: "scion.attribute.composure",
            intellect: "scion.attribute.intellect",
            cunning: "scion.attribute.cunning",
            resolve: "scion.attribute.resolve",
            might: "scion.attribute.might",
            dexterity: "scion.attribute.dexterity",
            stamina: "scion.attribute.stamina",
        },
    },
    SKILLS: {
        min: 0,
        max: 5,
        list: {
            academics: "scion.skill.academics",
            athletics: "scion.skill.athletics",
            closeCombat: "scion.skill.closeCombat",
            culture: "scion.skill.culture",
            empathy: "scion.skill.empathy",
            firearms: "scion.skill.firearms",
            integrity: "scion.skill.integrity",
            leadership: "scion.skill.leadership",
            medicine: "scion.skill.medicine",
            occult: "scion.skill.occult",
            persuasion: "scion.skill.persuasion",
            pilot: "scion.skill.pilot",
            science: "scion.skill.science",
            subterfuge: "scion.skill.subterfuge",
            survival: "scion.skill.survival",
            technology: "scion.skill.technology",
        },
    },
    CALLINGS: {
        min: 1,
        max: 5,
        list: {
            creator: {
                skills: [ "academics", "culture", "technology", ],
                fateRoles: [ "apprentice", "jinx", "rival", ],
                knacks: {
                    heroic: [
                        "flawlesslyPlatonicIdeal",
                        "innateToolkit",
                        "perfectRendition",
                        "reverseEngineer",
                        "theUnlimitedQuartermaster",
                        "weGoAllNight",
                        "wirelessInterface",
                    ] ,
                    immortal: [
                        "afternoonOfFortnights",
                        "liftedFromDust",
                        "raiseThePillarsOfTheEarth",
                        "touchOfTheMuses",
                    ],
                },
            },
            guardian: {
                skills: [ "athletics", "closeCombat", "empathy", ],
                fateRoles: [ "canary", "martyr", "nemesis", ],
                knacks: {
                    heroic: [
                        "aFortress",
                        "aPurpose",
                        "aSentinel",
                        "aTalisman",
                        "aVigil",
                        "aWarning",
                    ] ,
                    immortal: [
                        "byYourSide",
                        "eternalGuardian",
                        "livingPillar",
                        "theyCannotBeTouched",
                    ],
                },
            },
            healer: {
                skills: [ "empathy", "medicine", "science", ],
                fateRoles: [ "boonCompanion", "canary", "rival", ],
                knacks: {
                    heroic: [
                        "combatMedic",
                        "damageConversion",
                        "doctorsKit",
                        "immunizationBooster",
                        "instantDiagnosis",
                        "surgeonWithTheHandsOfGod",
                        "theBareMinimum",
                    ] ,
                    immortal: [
                        "breathOfLife",
                        "internalRefinery",
                        "panacea",
                        "reconstruction",
                    ],
                },
            },
            hunter: {
                skills: [ "athletics", "firearms", "survival", ],
                fateRoles: [ "boonCompanion", "paramour", "rival", ],
                knacks: {
                    heroic: [
                        "apexPredator",
                        "eyesInTheBlinds",
                        "internalCompass",
                        "keeneyedPredator",
                        "mostDangerousPrey",
                        "silenceInTheWoods",
                        "worryingHound",
                    ] ,
                    immortal: [
                        "alwaysThere",
                        "perfectCamouflage",
                        "relentless",
                        "sendThePack",
                    ],
                },
            },
            judge: {
                skills: [ "academics", "culture", "persuasion", ],
                fateRoles: [ "balm", "traitor", "worshipper", ],
                knacks: {
                    heroic: [
                        "eyeForAnEye",
                        "indisputableAnalysis",
                        "lieDetector",
                        "objection",
                        "onTheCase",
                        "quickStudy",
                        "theTruthArises",
                    ] ,
                    immortal: [
                        "boundByOath",
                        "iAmTheLaw",
                        "terrorOfTheGuilty",
                        "thePainOfDishonesty",
                    ],
                },
            },
            leader: {
                skills: [ "culture", "empathy", "leadership", ],
                fateRoles: [ "boonCompanion", "traitor", "worshipper", ],
                knacks: {
                    heroic: [
                        "captainOfIndustry",
                        "cloakOfDread",
                        "goodListener",
                        "grandEntrance",
                        "inspirationalAura",
                        "lighthouseOfSociety",
                        "perfectPoise",
                    ] ,
                    immortal: [
                        "invulnerableMaster",
                        "masterfulEfficiency",
                        "notTodayFriends",
                    ],
                },
            },
            liminal: {
                skills: [ "athletics", "pilot", "subterfuge", ],
                fateRoles: [ "canary", "jinx", "unrequitedParamour", ],
                knacks: {
                    heroic: [
                        "beyondMemory",
                        "completePrivacy",
                        "experiencedTraveler",
                        "flatlander",
                        "neitherTheMinuteNorTheHour",
                        "unerringDelivery",
                        "unobtrusiveVisitor",
                    ] ,
                    immortal: [
                        "enforcingTheBoundary",
                        "pierceTheVeil",
                        "stepSideways",
                        "theLongRoadToAnywhere",
                    ],
                },
            },
            lover: {
                skills: [ "culture", "empathy", "persuasion", ],
                fateRoles: [ "balm", "paramour", "unrequitedParamour", "rival", ],
                knacks: {
                    heroic: [
                        "fluidAppeal",
                        "iAmAFire",
                        "loversIntuition",
                        "notAFighter",
                        "onYourSide",
                        "perfectPartner",
                        "soothingPresence",
                    ] ,
                    immortal: [
                        "centerOfAttention",
                        "forYouIWill",
                        "heartsAflame",
                        "loversOath",
                    ],
                },
            },
            sage: {
                skills: [ "academics", "occult", "subterfuge", ],
                fateRoles: [ "apprentice", "jinx", "traitor", ],
                knacks: {
                    heroic: [
                        "blockadeOfReason",
                        "masterOfTheWorld",
                        "officeHours",
                        "omniglotTranslation",
                        "palaceOfMemory",
                        "presenceOfMagic",
                        "speedReading",
                    ] ,
                    immortal: [
                        "cipher",
                        "eternalGenius",
                        "immortalMastermind",
                        "overworldKnowledge",
                    ],
                },
            },
            trickster: {
                skills: [ "culture", "persuasion", "subterfuge", ],
                fateRoles: [ "boonCompanion", "nemesis", "traitor", ],
                knacks: {
                    heroic: [
                        "blatherAndSkite",
                        "inSheepsClothing",
                        "lightFingered",
                        "rumorMiller",
                        "smokeAndMirrors",
                        "takesOneToKnowOne",
                        "wasntMe",
                    ] ,
                    immortal: [
                        "doppelganger", "oneMansTrash", "surprise", "wovenFromLies",
                    ],
                },
            },
            warrior: {
                skills: [ "athletics", "closeCombat", "firearms", ],
                fateRoles: [ "balm", "nemesis", "rival", ],
                knacks: {
                    heroic: [
                        "closeTheGap",
                        "deathByTeacup",
                        "enhancedImpact",
                        "masterOfWeapons",
                        "tempered",
                        "theBiggestThreat",
                        "trickShot",
                        "trimarkisia",
                    ] ,
                    immortal: [
                        "armyOfOne",
                        "hurlToTheMoon",
                        "perfectDefense",
                        "theyreEverywhere",
                    ],
                },
            },
        },
        listTitan: {            
            adversary: {
                skills: [ "culture", "persuasion", "subterfuge", ],
                fateRoles: [ "jinx", "nemesis", "traitor", ],
                knacks: {
                    heroic: [
                        "allThoseLovelyEnemies",
                        "cantKillTheRooster",
                        "familiarWounds",
                        "letsContainMultitudes",
                        "nothingIsInevitable",
                        "suddenButInevitable",
                        "trueFriendship",
                    ] ,
                    immortal: [
                        "atYourSideInYourWay",
                        "contraMundum",
                        "enemiesForever",
                        "evilAppearing",
                        "fromHellsHeart",
                        "nothingIsForbidden",
                        "oppositionWithoutLimit",
                        "satisfactionOrTheKnife",
                    ],
                },
            },          
            destroyer: {
                skills: [ "athletics", "closeCombat", "science", ],
                fateRoles: [ "canary", "nemesis", "rival", ],
                knacks: {
                    heroic: [] ,
                    immortal: [],
                },
            },          
            monster: {
                skills: [ "athletics", "medicine", "survival", ],
                fateRoles: [ "nemesis", "rival", "traitor", ],
                knacks: {
                    heroic: [] ,
                    immortal: [],
                },
            },          
            primeval: {
                skills: [ "academics", "occult", "survival", ],
                fateRoles: [ "balm", "nemesis", "worshipper", ],
                knacks: {
                    heroic: [] ,
                    immortal: [],
                },
            },          
            tyrant: {
                skills: [ "empathy", "leadership", "persuasion", ],
                fateRoles: [ "apprentice", "rival", "worshipper", ],
                knacks: {
                    heroic: [] ,
                    immortal: [],
                },
            },
        },
    },
    KNACKS: {
        actorDefault: {
            "name": "",
            "assignment": false,
        },
        list: {
            aFortress: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: ["getOutOfHere", "secondWind", "myTurn"],
            },
            aPurpose: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            aSentinel: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            aTalisman: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            aVigil: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            aWarning: {
                calling: "guardian",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            afternoonOfFortnights: {
                calling: "creator",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            alwaysThere: {
                calling: "hunter",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            apexPredator: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            armyOfOne: {
                calling: "warrior",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            auraOfGreatness: {
                calling: "any",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            beyondMemory: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            blatherAndSkite: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            blockadeOfReason: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            bornToBeKings: {
                calling: "any",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            boundByOath: {
                calling: "judge",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            breathOfLife: {
                calling: "healer",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            byYourSide: {
                calling: "guardian",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            captainOfIndustry: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            centerOfAttention: {
                calling: "lover",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            cipher: {
                calling: "sage",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            cloakOfDread: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            closeTheGap: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: ["charge", "inescapable", "surefooted"],
            },
            combatMedic: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            completePrivacy: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            damageConversion: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            deathByTeacup: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            doctorsKit: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: ["icePack", "swiftBandaging", "emergencyOperation"],
            },
            doppelganger: {
                calling: "trickster",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            enforcingTheBoundary: {
                calling: "liminal",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            enhancedImpact: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            eternalGenius: {
                calling: "sage",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            eternalGuardian: {
                calling: "guardian",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            experiencedTraveler: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            eyeForAnEye: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            eyesInTheBlinds: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            flatlander: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: ["glimpseTheOtherSide", "stutterTime", "bendSpace"],
            },
            flawlesslyPlatonicIdeal: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            fluidAppeal: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            forYouIWill: {
                calling: "lover",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            goodListener: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            grandEntrance: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            heartsAflame: {
                calling: "lover",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            hurlToTheMoon: {
                calling: "warrior",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            iAmAFire: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            iAmTheLaw: {
                calling: "judge",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            immortalMastermind: {
                calling: "sage",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            immunizationBooster: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            inSheepsClothing: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            indisputableAnalysis: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            innateToolkit: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            inspirationalAura: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            instantDiagnosis: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            internalCompass: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            internalRefinery: {
                calling: "healer",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            invulnerableMaster: {
                calling: "leader",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            keeneyedPredator: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            lieDetector: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            liftedFromDust: {
                calling: "creator",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            lightFingered: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            lighthouseOfSociety: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            livingPillar: {
                calling: "guardian",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            loversIntuition: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            loversOath: {
                calling: "lover",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            masterOfTheWorld: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            masterOfWeapons: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            masterfulEfficiency: {
                calling: "leader",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            mostDangerousPrey: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: ["stalk", "snare"],
            },
            neitherTheMinuteNorTheHour: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            notAFighter: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            notTodayFriends: {
                calling: "leader",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            objection: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: ["terrify"],
            },
            officeHours: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            omniglotTranslation: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            onTheCase: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            onYourSide: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            oneMansTrash: {
                calling: "trickster",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            overworldKnowledge: {
                calling: "sage",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            palaceOfMemory: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            panacea: {
                calling: "healer",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            perfectCamouflage: {
                calling: "hunter",
                tier: "immortal",
                effect: {},
                stunts: ["vanish"],
            },
            perfectDefense: {
                calling: "warrior",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            perfectPartner: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            perfectPoise: {
                calling: "leader",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            perfectRendition: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            pierceTheVeil: {
                calling: "liminal",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            presenceOfMagic: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            quickStudy: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            raiseThePillarsOfTheEarth: {
                calling: "creator",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            reconstruction: {
                calling: "healer",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            relentless: {
                calling: "hunter",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            reverseEngineer: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            rumorMiller: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            scentTheDivine: {
                calling: "any",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            sendThePack: {
                calling: "hunter",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            silenceInTheWoods: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            smokeAndMirrors: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            somebodysWatchingMe: {
                calling: "any",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            soothingPresence: {
                calling: "lover",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            speedReading: {
                calling: "sage",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            stepSideways: {
                calling: "liminal",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            surgeonWithTheHandsOfGod: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            surprise: {
                calling: "trickster",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            takesOneToKnowOne: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            tempered: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            terrorOfTheGuilty: {
                calling: "judge",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            theBareMinimum: {
                calling: "healer",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            theBiggestThreat: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            theLongRoadToAnywhere: {
                calling: "liminal",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            thePainOfDishonesty: {
                calling: "judge",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            theTruthArises: {
                calling: "judge",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            theUnlimitedQuartermaster: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            theyCannotBeTouched: {
                calling: "guardian",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            theyreEverywhere: {
                calling: "warrior",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            touchOfTheMuses: {
                calling: "creator",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
            trickShot: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            trimarkisia: {
                calling: "warrior",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            unerringDelivery: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            unobtrusiveVisitor: {
                calling: "liminal",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            wasntMe: {
                calling: "trickster",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            weGoAllNight: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            wirelessInterface: {
                calling: "creator",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            worryingHound: {
                calling: "hunter",
                tier: "heroic",
                effect: {},
                stunts: [],
            },
            wovenFromLies: {
                calling: "trickster",
                tier: "immortal",
                effect: {},
                stunts: [],
            },
        },
    },
    STUNTS: {
        bendSpace: {
            source: "KNACKS.flatlander",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        charge: {
            source: "KNACKS.closeTheGap",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        emergencyOperation: {
            source: "KNACKS.doctorsKit",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        getOutOfHere: {
            source: "KNACKS.aFortress",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        glimpseTheOtherSide: {
            source: "KNACKS.flatlander",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        icePack: {
            source: "KNACKS.doctorsKit",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        inescapable: {
            source: "KNACKS.closeTheGap",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        myTurn: {
            source: "KNACKS.aFortress",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        secondWind: {
            source: "KNACKS.aFortress",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        snare: {
            source: "KNACKS.mostDangerousPrey",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        stalk: {
            source: "KNACKS.mostDangerousPrey",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        stutterTime: {
            source: "KNACKS.flatlander",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        sureFooted: {
            source: "KNACKS.closeTheGap",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        swiftBandaging: {
            source: "KNACKS.doctorsKit",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        terrify: {
            source: "KNACKS.objection",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
        vanish: {
            source: "KNACKS.perfectCamouflage",
            cost: {},
            effect: {},
            applyTags: [],
            excludeTags: [],
        },
    },
    FATEROLES: {
        apprentice: "scion.faterole.apprentice",
        balm: "scion.faterole.balm",
        boonCompanion: "scion.faterole.boonCompanion",
        canary: "scion.faterole.canary",
        jinx: "scion.faterole.jinx",
        martyr: "scion.faterole.martyr",
        nemesis: "scion.faterole.nemesis",
        paramour: "scion.faterole.paramour",
        rival: "scion.faterole.rival",
        traitor: "scion.faterole.traitor",
        unrequitedParamour: "scion.faterole.unrequitedParamour",
        worshipper: "scion.faterole.worshipper",
    },
    PURVIEWS: {
        pantheon: {
            wyrd: "scion.purview.wyrd",
            yoga: "scion.purview.yoga",
            yaoyorozuNoKamigami: "scion.purview.yaoyorozuNoKamigami",
            dodaem: "scion.purview.dodaem",
            heku: "scion.purview.heku",
            tianming: "scion.purview.tianming",
            nextlahualli: "scion.purview.nextlahualli",
            metamorphosis: "scion.purview.metamorphosis",
            geasa: "scion.purview.geasa",
            nemeton: "scion.purview.nemeton",
            cheval: "scion.purview.cheval",
            asha: "scion.purview.asha",
            dvoeverie: "scion.purview.dvoeverie",
            qut: "scion.purview.qut",
        },
        general: {
            artistry: "scion.purview.artistry",
            beasts: "scion.purview.beasts",
            beauty: "scion.purview.beauty",
            chaos: "scion.purview.chaos",
            darkness: "scion.purview.darkness",
            death: "scion.purview.death",
            deception: "scion.purview.deception",
            earth: "scion.purview.earth",
            epicDexterity: "scion.purview.epicDexterity",
            epicStamina: "scion.purview.epicStamina",
            epicStrength: "scion.purview.epicStrength",
            fertility: "scion.purview.fertility",
            fire: "scion.purview.fire",
            forge: "scion.purview.forge",
            fortune: "scion.purview.fortune",
            frost: "scion.purview.frost",
            health: "scion.purview.health",
            journeys: "scion.purview.journeys",
            moon: "scion.purview.moon",
            order: "scion.purview.order",
            passion: "scion.purview.passion",
            prosperity: "scion.purview.prosperity",
            sky: "scion.purview.sky",
            stars: "scion.purview.stars",
            sun: "scion.purview.sun",
            war: "scion.purview.war",
            water: "scion.purview.water",
            wild: "scion.purview.wild",
        },
    },
};
const handlebarTemplates = {
    chargen: {
        template: () => "systems/scion/templates/actor/chargen/actor-chargen.hbs",
        "step-one": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-one.hbs"},
        "step-two": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-two.hbs"},
        "step-three": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-three.hbs"},
        "step-four": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-four.hbs"},
        "step-five": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-five.hbs"},
        "step-six": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-six.hbs"},
        "step-seven": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-seven.hbs"},
    },
    partials: {
        path: {template: () => "systems/scion/templates/actor/partials/path-block.hbs"},
        calling: {template: () => "systems/scion/templates/actor/partials/calling-block.hbs"},
        pathCondition: {template: () => "systems/scion/templates/item/partials/path-condition-block.hbs"},
    },
    popouts: {
        skillList: {template: () => "systems/scion/templates/popouts/skilllist-popout.hbs"},
        callingsList: {template: () => "systems/scion/templates/popouts/callingslist-popout.hbs"},
        knacksList: {template: () => "systems/scion/templates/popouts/knackslist-popout.hbs"},
        creatureTagsList: {template: () => "systems/scion/templates/popouts/creaturetagslist-popout.hbs"},
        qualitiesList: {template: () => "systems/scion/templates/popouts/qualitieslist-popout.hbs"},
        flairsList: {template: () => "systems/scion/templates/popouts/flairslist-popout.hbs"},
    },
    tooltips: {template: () => "systems/scion/templates/tooltips/tooltip-contents.hbs"},
};
const itemCategories = {
    callings: ["calling"],
    paths: ["path"],
    knacks: ["knack"],
    purviews: ["purview"],
    boons: ["boon"],
    birthrights: ["relic", "follower", "creature", "guide", "cult", "covenant"],
    conditions: ["condition"],
    getCategory(ref) { return ref in this ? ref : _.findKey(this, (types) => types.includes(ref)) }
};
const popoutData = {
    path: {leftSpacing: -500, rightSpacing: -500},
};
const randomNames = {
    first: ["Aaden", "Aaliyah", "Aarav", "Abagail", "Abbigail", "Abby", "Abdiel", "Abdullah", "Abigail", "Abigayle", "Abram", "Abril", "Ace", "Ada", "Adam", "Adan", "Addison", "Addisyn", "Addyson", "Adelaide", "Adison", "Adonis", "Adrian", "Adriana", "Adrianna", "Adriel", "Aedan", "Ahmad", "Aidan", "Aidyn", "Aimee", "Ainsley", "Akira", "Alaina", "Alani", "Alanna", "Alannah", "Alayna", "Albert", "Alberto", "Aleah", "Alena", "Alessandro", "Alex", "Alexa", "Alexandra", "Alexandria", "Alexis", "Alfred", "Alfredo", "Ali", "Alia", "Alisa", "Alisha", "Alison", "Alissa", "Alisson", "Alivia", "Aliyah", "Aliza", "Allen", "Allie", "Allison", "Allisson", "Ally", "Allyson", "Alondra", "Alonso", "Alvin", "Alyson", "Alyvia", "Amanda", "Amara", "Amare", "Amari", "Amaris", "Amber", "Amelie", "Amina", "Amiya", "Amy", "Amya", "Anabel", "Anabelle", "Anastasia", "Anaya", "Anderson", "Andre", "Andrew", "Angel", "Angela", "Angelica", "Angelina", "Angeline", "Angelique", "Angelo", "Anika", "Aniya", "Ann", "Annabel", "Annabella", "Annabelle", "Annalise", "Anne", "Annie", "Annika", "Ansley", "Anton", "Antonio", "Antwan", "Anya", "April", "Araceli", "Ariana", "Arianna", "Ariel", "Ariella", "Arielle", "Arjun", "Armando", "Armani", "Arnav", "Aron", "Arturo", "Aryan", "Ashanti", "Asher", "Ashlee", "Ashly", "Ashlyn", "Ashton", "Asia", "Aspen", "Athena", "Aubree", "Audrey", "August", "Augustus", "Aurora", "Austin", "Autumn", "Ava", "Averi", "Averie", "Avery", "Ayaan", "Aydin", "Azul", "Bailee", "Bailey", "Barbara", "Baron", "Baylee", "Beau", "Beckett", "Belen", "Belinda", "Bella", "Ben", "Benjamin", "Bentley", "Bernard", "Bianca", "Billy", "Blaine", "Blaze", "Bo", "Bobby", "Boston", "Bradley", "Brady", "Braeden", "Braedon", "Braelyn", "Branden", "Braxton", "Brayan", "Brayden", "Braydon", "Braylen", "Braylon", "Brendan", "Brenden", "Brendon", "Brennan", "Brennen", "Brent", "Brett", "Bria", "Brian", "Briana", "Brice", "Bridger", "Bridget", "Brielle", "Brittany", "Brock", "Broderick", "Brooklynn", "Brooks", "Bruce", "Bruno", "Bryan", "Bryant", "Bryce", "Brycen", "Brynlee", "Bryson", "Byron", "Caden", "Cael", "Caiden", "Caitlin", "Cale", "Caleb", "Cali", "Callie", "Callum", "Calvin", "Cameron", "Camila", "Camille", "Campbell", "Camren", "Camron", "Camryn", "Cannon", "Cara", "Carina", "Carissa", "Carlee", "Carleigh", "Carley", "Carlie", "Carlos", "Carmen", "Caroline", "Carolyn", "Carson", "Carter", "Casey", "Cash", "Cassandra", "Cassie", "Cassius", "Catalina", "Cecelia", "Cecilia", "Cedric", "Celia", "Cesar", "Chace", "Chad", "Chaim", "Chana", "Chance", "Chandler", "Chanel", "Charlee", "Charles", "Charlize", "Chase", "Chaya", "Chaz", "Cherish", "Cheyanne", "Christian", "Christina", "Christine", "Christopher", "Ciara", "Cierra", "Clara", "Clarence", "Clarissa", "Clark", "Claudia", "Clay", "Clayton", "Clinton", "Cloe", "Colin", "Collin", "Colten", "Colton", "Conner", "Conor", "Conrad", "Cooper", "Cora", "Corey", "Corinne", "Cornelius", "Cortez", "Courtney", "Cristal", "Cristina", "Cristofer", "Cristopher", "Cruz", "Crystal", "Cullen", "Curtis", "Cynthia", "Cyrus", "Daisy", "Dakota", "Dale", "Dalia", "Dallas", "Dalton", "Damari", "Damarion", "Damaris", "Damian", "Damon", "Dane", "Dangelo", "Dania", "Danica", "Daniel", "Daniella", "Danielle", "Danna", "Dante", "Darian", "Darien", "Dario", "Darion", "Darius", "Darrell", "Dashawn", "Davian", "Davin", "Davion", "Davon", "Dawson", "Dax", "Dayana", "Dayanara", "Deacon", "Dean", "Deandre", "Deanna", "Declan", "Delaney", "Demarion", "Demetrius", "Denise", "Denisse", "Dennis", "Denzel", "Derick", "Destiney", "Destiny", "Devin", "Devon", "Devyn", "Diana", "Diego", "Dillan", "Dillon", "Dixie", "Dominic", "Dominik", "Dominique", "Donavan", "Donna", "Donovan", "Donte", "Douglas", "Drake", "Dulce", "Dylan", "Ean", "Eddie", "Eden", "Edgar", "Edith", "Eduardo", "Efrain", "Eileen", "Elaina", "Elaine", "Eleanor", "Elena", "Elianna", "Eliezer", "Elijah", "Elisabeth", "Elise", "Eliza", "Elizabeth", "Ella", "Elle", "Ellen", "Ellis", "Elvis", "Elyse", "Emanuel", "Emelia", "Emerson", "Emery", "Emilia", "Emiliano", "Emilie", "Emilio", "Emma", "Emmalee", "Emmett", "Emmy", "Enrique", "Erick", "Erik", "Erika", "Erin", "Essence", "Esteban", "Esther", "Estrella", "Ethen", "Eva", "Evelin", "Evelyn", "Everett", "Evie", "Ezekiel", "Ezequiel", "Fabian", "Faith", "Fernando", "Finley", "Finn", "Finnegan", "Fiona", "Fletcher", "Francesca", "Francis", "Francisco", "Franco", "Frank", "Frankie", "Franklin", "Frida", "Gabriel", "Gabriela", "Gabriella", "Gabrielle", "Gael", "Gauge", "Gaven", "Gavin", "Gemma", "George", "Georgia", "Geovanni", "Gerald", "Gerardo", "German", "Gia", "Giada", "Giana", "Giancarlo", "Gianna", "Gideon", "Gilbert", "Gina", "Giovani", "Giovanna", "Giovanni", "Giselle", "Gisselle", "Glenn", "Gloria", "Gordon", "Grace", "Gracelyn", "Grady", "Gregory", "Greta", "Gretchen", "Guadalupe", "Guillermo", "Gunnar", "Gustavo", "Hadassah", "Hailey", "Hailie", "Haleigh", "Haley", "Halle", "Hamza", "Hana", "Hannah", "Harley", "Harmony", "Harold", "Harper", "Harrison", "Harry", "Hassan", "Haven", "Hayden", "Hayley", "Heath", "Heather", "Hector", "Heidi", "Helen", "Henry", "Hezekiah", "Hillary", "Holden", "Hope", "Howard", "Hugh", "Humberto", "Hunter", "Ibrahim", "Ignacio", "Iliana", "Imani", "Immanuel", "India", "Ireland", "Irene", "Iris", "Irvin", "Isabela", "Isabell", "Isabelle", "Isaiah", "Isiah", "Isis", "Ismael", "Itzel", "Ivan", "Ivy", "Iyana", "Izabella", "Izabelle", "Izaiah", "Izayah", "Jabari", "Jace", "Jacey", "Jackson", "Jacoby", "Jacqueline", "Jacquelyn", "Jada", "Jade", "Jadiel", "Jadon", "Jadyn", "Jaeden", "Jagger", "Jaida", "Jaiden", "Jaidyn", "Jaime", "Jair", "Jakayla", "Jake", "Jakob", "Jakobe", "Jalen", "Jaliyah", "Jamal", "Jamar", "Jamarcus", "Jamari", "Jamarion", "James", "Jameson", "Jamie", "Jamir", "Jamison", "Jamya", "Jane", "Janelle", "Janet", "Janiya", "Jaquan", "Jaqueline", "Jarrett", "Jasiah", "Jaslene", "Jaslyn", "Jason", "Javier", "Jax", "Jaxon", "Jaxson", "Jayce", "Jaydan", "Jayden", "Jaydon", "Jayla", "Jaylah", "Jaylen", "Jaylene", "Jaylin", "Jaylynn", "Jayvion", "Jayvon", "Jazlene", "Jazlyn", "Jazmin", "Jazmine", "Jeffery", "Jeffrey", "Jenna", "Jenny", "Jensen", "Jeremiah", "Jeremy", "Jerimiah", "Jessica", "Jessie", "Jesus", "Jett", "Jewel", "Jimena", "Joanna", "Joaquin", "Joe", "Joey", "Johan", "Johanna", "John", "Johnathan", "Johnny", "Jolie", "Jon", "Jonah", "Jonas", "Jonathan", "Jonathon", "Jordan", "Jorden", "Jordin", "Jordon", "Jordyn", "Jorge", "Joselyn", "Josephine", "Josh", "Joshua", "Josie", "Josue", "Jovani", "Jovanny", "Jovany", "Judah", "Judith", "Julian", "Julianna", "Julien", "Juliet", "Julio", "Julius", "June", "Junior", "Justice", "Justin", "Justine", "Kade", "Kadence", "Kaeden", "Kael", "Kaelyn", "Kaia", "Kaila", "Kaitlin", "Kaitlynn", "Kaiya", "Kaleb", "Kaleigh", "Kali", "Kaliyah", "Kallie", "Kamari", "Kamden", "Kameron", "Kamora", "Kamren", "Kamron", "Kareem", "Karen", "Karla", "Karlee", "Karley", "Karli", "Karly", "Karsyn", "Kasey", "Kash", "Kassandra", "Kassidy", "Katherine", "Kathleen", "Kathy", "Katie", "Kayden", "Kayla", "Kaylah", "Kaylee", "Kayleigh", "Kaylen", "Kayley", "Kaylie", "Kaylin", "Kaylyn", "Keagan", "Keely", "Keenan", "Keira", "Keith", "Kellen", "Kelsey", "Kelsie", "Kelvin", "Kendal", "Kendall", "Kendrick", "Kenna", "Kennedi", "Kenneth", "Kenzie", "Keshawn", "Keyon", "Khalil", "Khloe", "Kian", "Kiana", "Kiera", "Kieran", "Kierra", "Kiley", "Kimberly", "Kimora", "King", "Kingston", "Kinsley", "Kirsten", "Kobe", "Kody", "Koen", "Kolby", "Kole", "Kolten", "Konner", "Krista", "Kristen", "Kristian", "Kristin", "Kristina", "Kristopher", "Krystal", "Kyan", "Kylee", "Kylie", "Kyson", "Laci", "Lainey", "Lance", "Landen", "Landyn", "Lane", "Larissa", "Larry", "Lawrence", "Laylah", "Lea", "Leah", "Leanna", "Leila", "Leilani", "Leland", "Leon", "Leonardo", "Leonidas", "Leroy", "Leslie", "Leticia", "Levi", "Lewis", "Libby", "Liberty", "Lila", "Lilah", "Lilia", "Lilian", "Liliana", "Lillian", "Lilliana", "Lily", "Lilyana", "Lina", "Linda", "Livia", "Lizbeth", "Lizeth", "Logan", "London", "Londyn", "Lorelai", "Lorenzo", "Lucian", "Luciano", "Lucy", "Luna", "Lydia", "Lyla", "Lyric", "Macey", "Macie", "Mackenzie", "Macy", "Madalyn", "Madalynn", "Maddison", "Maddox", "Madeleine", "Madeline", "Madelyn", "Madilyn", "Madison", "Madyson", "Maeve", "Magdalena", "Maggie", "Maia", "Makaila", "Makayla", "Makhi", "Malakai", "Malcolm", "Malia", "Malik", "Maliyah", "Mallory", "Manuel", "Mara", "Marc", "Marcel", "Marcelo", "Marcos", "Marcus", "Mareli", "Margaret", "Maria", "Mariah", "Mariam", "Maribel", "Marilyn", "Marin", "Marina", "Mario", "Marisa", "Marisol", "Maritza", "Mariyah", "Marlee", "Marley", "Marlie", "Marques", "Marshall", "Martha", "Marvin", "Maryjane", "Mason", "Mateo", "Mathew", "Mathias", "Matias", "Matilda", "Matteo", "Matthew", "Matthias", "Mauricio", "Maverick", "Max", "Maximillian", "Maximus", "Maxwell", "Mayra", "Mckayla", "Mckenna", "Mckenzie", "Meghan", "Mekhi", "Melissa", "Melody", "Melvin", "Memphis", "Mercedes", "Messiah", "Mia", "Miah", "Micah", "Michael", "Michaela", "Micheal", "Miguel", "Mikaela", "Mike", "Mila", "Milagros", "Miles", "Miley", "Milo", "Mina", "Miracle", "Mireya", "Miriam", "Misael", "Mohamed", "Moises", "Mollie", "Molly", "Monique", "Morgan", "Moses", "Moshe", "Mya", "Myah", "Mylee", "Myles", "Nadia", "Naima", "Nancy", "Naomi", "Nash", "Nasir", "Natalia", "Natalie", "Nataly", "Natasha", "Nathalia", "Nathaly", "Nathan", "Nathaniel", "Nathen", "Nehemiah", "Neil", "Nelson", "Nevaeh", "Neveah", "Nicholas", "Nick", "Nickolas", "Nico", "Nicolas", "Nicole", "Nigel", "Niko", "Nikolai", "Nina", "Noah", "Noe", "Noelle", "Nolan", "Nyasia", "Octavio", "Olive", "Omar", "Omari", "Oswaldo", "Pablo", "Paige", "Paisley", "Paityn", "Paloma", "Pamela", "Paris", "Parker", "Patrick", "Paula", "Paulina", "Payton", "Peter", "Peyton", "Philip", "Phoenix", "Pierre", "Piper", "Porter", "Pranav", "Presley", "Prince", "Priscilla", "Quincy", "Quinn", "Quinten", "Quintin", "Quinton", "Raegan", "Raiden", "Ralph", "Ramiro", "Ramon", "Randall", "Raul", "Raven", "Ray", "Rayna", "Rayne", "Reagan", "Rebekah", "Reece", "Reed", "Regan", "Regina", "Reilly", "Reina", "Remington", "Rene", "Renee", "Rex", "Rey", "Reynaldo", "Ricardo", "Richard", "Rigoberto", "Rihanna", "Riley", "Rishi", "River", "Robert", "Roderick", "Rodrigo", "Rogelio", "Roger", "Romeo", "Ronald", "Ronan", "Ronin", "Ronnie", "Rory", "Roselyn", "Rosemary", "Rowan", "Roy", "Royce", "Rubi", "Ruby", "Rudy", "Russell", "Ruth", "Ryan", "Ryann", "Ryker", "Rylee", "Ryleigh", "Rylie", "Saige", "Salvador", "Sam", "Samantha", "Samir", "Sammy", "Samuel", "Saniyah", "Santiago", "Sara", "Sarahi", "Sarai", "Sariah", "Saul", "Savanna", "Savannah", "Savion", "Sawyer", "Scarlet", "Sebastian", "Selena", "Selina", "Semaj", "Serena", "Seth", "Shamar", "Shania", "Shaniya", "Shannon", "Shaun", "Shayla", "Shaylee", "Shayna", "Shelby", "Sheldon", "Sherlyn", "Shiloh", "Shirley", "Shyann", "Shyanne", "Sidney", "Siena", "Sierra", "Simeon", "Sincere", "Skyla", "Skylar", "Skyler", "Slade", "Sloane", "Sofia", "Solomon", "Sonia", "Sophia", "Sophie", "Spencer", "Stanley", "Stella", "Stephanie", "Stephany", "Stephen", "Sterling", "Steven", "Sullivan", "Summer", "Susan", "Sydnee", "Sylvia", "Tabitha", "Talia", "Taliyah", "Tamara", "Tania", "Taniya", "Taniyah", "Tanya", "Tate", "Tatiana", "Taylor", "Teagan", "Teresa", "Terrance", "Tess", "Tessa", "Thaddeus", "Theodore", "Tiana", "Tianna", "Tiffany", "Timothy", "Tobias", "Toby", "Todd", "Tomas", "Tommy", "Tony", "Tori", "Trace", "Travis", "Trent", "Trevin", "Trevon", "Trevor", "Tripp", "Tristan", "Tristen", "Tristian", "Tristin", "Troy", "Tucker", "Ty", "Tyrell", "Tyrese", "Tyrone", "Tyshawn", "Ulises", "Uriel", "Urijah", "Valentina", "Valeria", "Valerie", "Van", "Vance", "Veronica", "Vicente", "Victor", "Victoria", "Violet", "Virginia", "Vivian", "Viviana", "Walker", "Walter", "Warren", "Waylon", "Wayne", "Will", "William", "Willie", "Winston", "Wyatt", "Xzavier", "Yadiel", "Yael", "Yahir", "Yamilet", "Yaretzi", "Yazmin", "Yuliana", "Yurem", "Zachariah", "Zachery", "Zack", "Zackery", "Zaid", "Zain", "Zaire", "Zander", "Zaria", "Zariah", "Zavier", "Zayden", "Zoe", "Zoey", "Zoie"],
    init: ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z."],
    last: ["Abbott", "Acevedo", "Adams", "Adkins", "Aguilar", "Aguirre", "Ali", "Allen", "Allison", "Alvarado", "Alvarez", "Andersen", "Anderson", "Andrade", "Andrews", "Anthony", "Archer", "Arias", "Armstrong", "Arnold", "Arroyo", "Atkins", "Atkinson", "Austin", "Avery", "Avila", "Ayers", "Baird", "Baker", "Baldwin", "Ball", "Ballard", "Banks", "Barajas", "Barber", "Barker", "Barnes", "Barnett", "Barr", "Barrera", "Barrett", "Barry", "Bartlett", "Barton", "Bass", "Bates", "Bauer", "Baxter", "Bean", "Beasley", "Beck", "Becker", "Bell", "Beltran", "Bender", "Benitez", "Benson", "Bentley", "Benton", "Berg", "Berger", "Bernard", "Best", "Bird", "Bishop", "Black", "Blackburn", "Blackwell", "Blair", "Blake", "Blanchard", "Blankenship", "Bolton", "Bond", "Bonilla", "Booker", "Boone", "Booth", "Bowen", "Bowers", "Bowman", "Boyd", "Boyer", "Boyle", "Bradford", "Bradshaw", "Brady", "Branch", "Bray", "Brennan", "Brewer", "Bridges", "Briggs", "Bright", "Brock", "Brooks", "Brown", "Bryan", "Bryant", "Buchanan", "Buck", "Buckley", "Bullock", "Burch", "Burgess", "Burnett", "Burns", "Burton", "Bush", "Butler", "Byrd", "Cabrera", "Cain", "Calderon", "Callahan", "Camacho", "Campbell", "Campos", "Cantrell", "Cardenas", "Carey", "Carney", "Carpenter", "Carr", "Carrillo", "Carroll", "Carson", "Carter", "Case", "Casey", "Castaneda", "Castillo", "Castro", "Cervantes", "Chambers", "Chan", "Chandler", "Chang", "Chapman", "Chase", "Chavez", "Chen", "Cherry", "Choi", "Christian", "Chung", "Church", "Cisneros", "Clark", "Clarke", "Clay", "Clayton", "Clements", "Cline", "Cobb", "Cochran", "Coffey", "Cohen", "Cole", "Coleman", "Collins", "Colon", "Combs", "Compton", "Conley", "Conner", "Conrad", "Contreras", "Conway", "Cook", "Cooke", "Cooley", "Cooper", "Copeland", "Cordova", "Cortez", "Costa", "Cowan", "Cox", "Crane", "Crosby", "Cross", "Cruz", "Cummings", "Cunningham", "Curtis", "Dalton", "Daniel", "Daniels", "Daugherty", "Davenport", "David", "Davidson", "Davies", "Davila", "Davis", "Dawson", "Day", "Dean", "Decker", "Delacruz", "Deleon", "Delgado", "Dennis", "Diaz", "Dickson", "Dillon", "Dixon", "Dodson", "Dominguez", "Donaldson", "Donovan", "Dougherty", "Downs", "Doyle", "Drake", "Duarte", "Dudley", "Duke", "Duncan", "Dunlap", "Dunn", "Duran", "Durham", "Dyer", "Eaton", "Edwards", "Elliott", "Ellis", "Ellison", "English", "Erickson", "Escobar", "Esparza", "Espinoza", "Estrada", "Evans", "Everett", "Farley", "Farmer", "Farrell", "Faulkner", "Ferguson", "Fernandez", "Ferrell", "Fields", "Figueroa", "Finley", "Fischer", "Fisher", "Fitzgerald", "Fitzpatrick", "Fletcher", "Flores", "Flowers", "Floyd", "Flynn", "Foley", "Forbes", "Ford", "Foster", "Fowler", "Fox", "Francis", "Franco", "Franklin", "Frazier", "Frederick", "Freeman", "French", "Frey", "Friedman", "Fritz", "Frost", "Fry", "Frye", "Fuentes", "Fuller", "Gaines", "Gallagher", "Gallegos", "Galloway", "Galvan", "Gamble", "Gardner", "Garner", "Garrett", "Garrison", "Garza", "Gentry", "George", "Gibbs", "Gibson", "Gilbert", "Giles", "Gill", "Gillespie", "Gilmore", "Glass", "Glenn", "Glover", "Gomez", "Gonzales", "Gonzalez", "Good", "Goodman", "Goodwin", "Gould", "Grant", "Graves", "Greene", "Greer", "Gregory", "Griffin", "Griffith", "Grimes", "Gross", "Guerrero", "Gutierrez", "Haas", "Hahn", "Hale", "Haley", "Hall", "Hamilton", "Hampton", "Hancock", "Haney", "Hanna", "Hansen", "Hanson", "Harding", "Hardy", "Harmon", "Harper", "Harrell", "Harrington", "Harris", "Harrison", "Hart", "Hartman", "Hatfield", "Hawkins", "Hayden", "Haynes", "Hays", "Heath", "Hebert", "Henderson", "Hendrix", "Henry", "Hensley", "Henson", "Herman", "Herrera", "Herring", "Hess", "Hester", "Hickman", "Hicks", "Higgins", "Hill", "Hines", "Hinton", "Ho", "Hodge", "Hodges", "Hoffman", "Hogan", "Holden", "Holder", "Holland", "Holloway", "Holmes", "Holt", "Hood", "Hooper", "Hoover", "Horne", "House", "Houston", "Howard", "Howe", "Howell", "Hubbard", "Hudson", "Huerta", "Huff", "Hull", "Hunter", "Hurst", "Ibarra", "Ingram", "Irwin", "Jackson", "Jacobs", "Jacobson", "James", "Jarvis", "Jefferson", "Jenkins", "Jensen", "Jimenez", "Johns", "Johnson", "Jones", "Jordan", "Joseph", "Joyce", "Juarez", "Kaiser", "Kane", "Kaufman", "Keith", "Keller", "Kelley", "Kelly", "Kennedy", "Key", "Khan", "Kim", "King", "Kirby", "Kirk", "Kline", "Knapp", "Knight", "Koch", "Kramer", "Krueger", "Lam", "Lamb", "Lambert", "Landry", "Lane", "Lang", "Lara", "Larsen", "Larson", "Lawrence", "Le", "Leach", "Leblanc", "Leon", "Leonard", "Lester", "Levy", "Lewis", "Li", "Lin", "Lindsey", "Little", "Livingston", "Lloyd", "Logan", "Long", "Lopez", "Love", "Lowe", "Lowery", "Lozano", "Lucas", "Luna", "Lutz", "Lynch", "Lyons", "Macdonald", "Macias", "Mack", "Madden", "Maddox", "Mahoney", "Maldonado", "Malone", "Mann", "Manning", "Marks", "Marsh", "Martin", "Martinez", "Massey", "Mata", "Mathews", "Mathis", "Maxwell", "May", "Mayer", "Maynard", "Mayo", "Mays", "Mcbride", "Mccall", "Mccarthy", "Mcclain", "Mcclure", "Mcconnell", "Mccormick", "Mccoy", "Mccullough", "Mcdaniel", "Mcdonald", "Mcdowell", "Mcfarland", "Mcgee", "Mcgrath", "Mcguire", "Mcintosh", "Mcintyre", "Mckay", "Mckee", "Mckinney", "Mcknight", "Mclaughlin", "Mclean", "Mcmillan", "Mcneil", "Mcpherson", "Meadows", "Medina", "Mejia", "Melton", "Mendez", "Mendoza", "Mercado", "Mercer", "Merritt", "Meyer", "Meyers", "Meza", "Michael", "Middleton", "Miles", "Miller", "Mills", "Miranda", "Mitchell", "Molina", "Monroe", "Montes", "Montgomery", "Montoya", "Moody", "Moon", "Mooney", "Moore", "Mora", "Morales", "Moran", "Morgan", "Morrison", "Morrow", "Morse", "Morton", "Moses", "Mosley", "Moss", "Moyer", "Mueller", "Mullen", "Munoz", "Murillo", "Murphy", "Murray", "Nash", "Navarro", "Neal", "Nelson", "Newman", "Newton", "Nguyen", "Nichols", "Nicholson", "Nixon", "Noble", "Nolan", "Norman", "Norris", "Norton", "Novak", "Nunez", "Obrien", "Ochoa", "Oconnell", "Oconnor", "Odonnell", "Oliver", "Olsen", "Olson", "Oneal", "Oneill", "Orozco", "Orr", "Ortega", "Ortiz", "Osborn", "Owen", "Owens", "Pace", "Pacheco", "Padilla", "Page", "Palmer", "Park", "Parker", "Parks", "Parrish", "Parsons", "Patel", "Patrick", "Patterson", "Patton", "Payne", "Pearson", "Peck", "Pena", "Pennington", "Perez", "Perkins", "Perry", "Petersen", "Peterson", "Pham", "Phelps", "Phillips", "Pierce", "Pitts", "Pollard", "Ponce", "Poole", "Pope", "Porter", "Potter", "Potts", "Powers", "Pratt", "Preston", "Price", "Prince", "Proctor", "Pugh", "Ramirez", "Ramos", "Ramsey", "Randall", "Randolph", "Rangel", "Rasmussen", "Ray", "Raymond", "Reed", "Reese", "Reeves", "Reilly", "Reyes", "Reynolds", "Rhodes", "Rice", "Rich", "Richard", "Richards", "Richardson", "Richmond", "Riddle", "Riggs", "Riley", "Rios", "Ritter", "Rivas", "Rivera", "Rivers", "Roach", "Robbins", "Roberson", "Roberts", "Robertson", "Robinson", "Robles", "Rocha", "Rodgers", "Rodriguez", "Rogers", "Rojas", "Rollins", "Roman", "Romero", "Rosales", "Rosario", "Rose", "Ross", "Roth", "Rowland", "Roy", "Rubio", "Rush", "Russell", "Russo", "Ryan", "Salas", "Salazar", "Salinas", "Sampson", "Sanchez", "Sanders", "Sandoval", "Sanford", "Santana", "Santiago", "Saunders", "Savage", "Sawyer", "Schaefer", "Schmidt", "Schmitt", "Schneider", "Schwartz", "Scott", "Sellers", "Serrano", "Sexton", "Shaffer", "Shannon", "Sharp", "Shaw", "Shea", "Shepard", "Shepherd", "Sheppard", "Sherman", "Shields", "Short", "Silva", "Simmons", "Simon", "Simpson", "Sims", "Singh", "Singleton", "Skinner", "Sloan", "Small", "Smith", "Snyder", "Solis", "Solomon", "Sosa", "Soto", "Sparks", "Spence", "Stafford", "Stanley", "Stanton", "Stein", "Stephens", "Stephenson", "Stevens", "Stevenson", "Stewart", "Stone", "Stout", "Strickland", "Stuart", "Suarez", "Sullivan", "Summers", "Sutton", "Swanson", "Sweeney", "Tanner", "Tapia", "Tate", "Taylor", "Terrell", "Terry", "Thompson", "Thornton", "Todd", "Torres", "Townsend", "Tran", "Travis", "Trevino", "Trujillo", "Tucker", "Turner", "Tyler", "Valdez", "Valenzuela", "Vance", "Vargas", "Vaughn", "Vazquez", "Vega", "Velasquez", "Velazquez", "Velez", "Villa", "Villanueva", "Villarreal", "Villegas", "Vincent", "Wade", "Wagner", "Walker", "Wall", "Waller", "Walter", "Walton", "Wang", "Ward", "Ware", "Warner", "Warren", "Washington", "Waters", "Watkins", "Watson", "Weaver", "Webb", "Weber", "Webster", "Weeks", "Weiss", "Wells", "Werner", "West", "Wheeler", "Whitaker", "White", "Whitehead", "Whitney", "Wiggins", "Wilcox", "Wiley", "Wilkerson", "Wilkins", "Wilkinson", "Williams", "Wilson", "Winters", "Wise", "Wolf", "Wolfe", "Wong", "Wood", "Woodard", "Woodward", "Wright", "Wu", "Wyatt", "Yang", "Yates", "Yoder", "York", "Young", "Zamora", "Zavala", "Zhang", "Zimmerman", "Zuniga"],
    get name() {
        const nameParts = [];
        nameParts.push(_.sample(this.first));
        if (Math.random() * 10 >= 9)
            {nameParts.push(_.sample(this.init));}
        if (Math.random() * 30 >= 29)
            {nameParts.push(`${_.sample(this.last)}-${_.sample(this.last)}`);}
        else
            {nameParts.push(_.sample(this.last));}
        return nameParts.join(" ");
    }
};


const initializeActorData = (isAddingBonusDots = false, customData = {}) => {
    let pantheon, pathPriorities;
    return Merge({
        genesis: _.sample(Object.keys(SCION.GENESES)),
        concept: "I am a test character!",
        pantheon: (pantheon = _.sample(Object.keys(SCION.PANTHEONS))),
        patron: _.sample(SCION.PANTHEONS[pantheon].members),
        divineTitle: `Test Char #${game.actors.entries.length + 1}`,
        pathPriorities: (pathPriorities = _.shuffle(SCION.PATHS.list)),
        skills: {
            assignableDots: {xp: isAddingBonusDots ? Rand(5, 20) : 0, other: 5},
            assignableSpecs: 0,
            list: {
                academics: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                athletics: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                closeCombat: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                culture: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                empathy: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                firearms: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                integrity: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                leadership: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                medicine: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                occult: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                persuasion: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                pilot: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                science: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                subterfuge: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                survival: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
                technology: {assigned: 0, modifiers: [], specialties: {assigned: 0, list: {}}},
            }
        },
        attributes: {
            priorities: _.shuffle(Object.keys(SCION.ATTRIBUTES.arenas)),
            favoredApproach: _.sample(Object.keys(SCION.ATTRIBUTES.approaches)),
            assignableGeneralDots: {xp: isAddingBonusDots ? Rand(1, 10) : 0, other: 1},
            assignableArenaDots: {"primary": 6, "secondary": 4, "tertiary": 2},
            list: {
                presence: {assigned: 0, modifiers: []},
                manipulation: {assigned: 0, modifiers: []},
                composure: {assigned: 0, modifiers: []},
                intellect: {assigned: 0, modifiers: []},
                cunning: {assigned: 0, modifiers: []},
                resolve: {assigned: 0, modifiers: []},
                might: {assigned: 0, modifiers: []},
                dexterity: {assigned: 0, modifiers: []},
                stamina: {assigned: 0, modifiers: []},
            }
        },
        callings: {
            assignableGeneralDots: {xp: 0, other: 2}
        },
        knacks: {
            assignableExtraKnacks: {xp: 0, other: 0}
        },
        tempCreateData: {
            pathUpdates: KeyMapObj(pathPriorities, (i, path) => path, (path) => ({
                data: {
                    title: `Test ${SCase(path)} Path Title`,
                    type: path,
                    skills: [],
                    connectionDescription: LoremIpsum(Rand(10, 200))
                }
            }))
        }
    }, customData);
};

const setAssignableSkillDots = (actorData, bonusDots = {xp: 0, other: 0}) => {
    actorData.skills.assignableDots.xp += bonusDots.xp || 0;
    actorData.skills.assignableDots.other += bonusDots.other || 0;
}
const setAssignableAttributeDots = (actorData, bonusDots = {xp: 0, other: 0, primary: 0, secondary: 0, tertiary: 0}) => {
    actorData.attributes.assignableGeneralDots.xp += bonusDots.xp || 0;
    actorData.attributes.assignableGeneralDots.other += bonusDots.other || 0;
    actorData.attributes.assignableArenaDots.primary += bonusDots.primary || 0;
    actorData.attributes.assignableArenaDots.secondary += bonusDots.secondary || 0;
    actorData.attributes.assignableArenaDots.tertiary += bonusDots.tertiary || 0;
}
const getAssignableSkillDots = (actorData) => Object.values(actorData.skills.assignableDots).reduce((tot, val) => tot + val, 0);
const getAssignableAttributeDots = (actorData, category = "general") => ({
    general: Object.values(actorData.attributes.assignableGeneralDots).reduce((tot, val) => tot + val, 0),
    primary: actorData.attributes.assignableArenaDots.primary,
    secondary: actorData.attributes.assignableArenaDots.secondary,
    tertiary: actorData.attributes.assignableArenaDots.tertiary
}[category]);
const getSkillVals = (actorData) => {
    // Initialize with "assigned" skill dots:
    const skillVals = KeyMapObj(SCION.SKILLS.list, false, (v, k) => actorData.skills.list[k].assigned || 0);
    // Add base value to path skills depending on priority (should maybe include a check for value <= 5)
    Object.entries(actorData.tempCreateData.pathUpdates ?? {}).forEach(([pathType, pathData]) => {
                                                const pathSkillsVal = Flip(actorData.pathPriorities).findIndex((pathName) => pathName === pathType) + 1;
                                                pathData.data.skills.forEach((skill) => {skillVals[skill] += pathSkillsVal});
                                            });
    return skillVals;
};
const getAttrVals = (actorData) => KeyMapObj(SCION.ATTRIBUTES.list, (v, attr) => 1 
                                                                 + actorData.attributes.list[attr].assigned 
                                                                 + SCION.ATTRIBUTES.approaches[actorData.attributes.favoredApproach].includes(attr)
                                                                    ? 2
                                                                    : 0
);


const testChars = {    
    sigChars: {
        "Rhys Callaghan": {
            actorData: {
                genesis: "born",
                concept: "Lead Singer and All Around Good Lad",
                pantheon: "tuathaDeDanann",
                patron: "aengus",
                divineTitle: "Bright Eyes",
                pathPriorities: ["role", "pantheon", "origin"],
                attributes: {
                    priorities: ["social", "mental", "physical"],
                    favoredApproach: "resilience"
                },
                tempCreateData: {
                    pathUpdates: {
                        origin: {
                            data: {
                                title: "Carefree Wanderer With Luck On His Side",
                                skills: ["empathy", "persuasion", "subterfuge"],
                                connectionDescription: LoremIpsum(Rand(10, 200))
                            }
                        },
                        role: {
                            data: {
                                title: "No Heaven Frontman",
                                skills: ["athletics", "culture", "persuasion"],
                                connectionDescription: LoremIpsum(Rand(10, 200))
                            }
                        },
                        pantheon: {
                            data: {
                                title: "Scion of Aengus, Step-Scion of the Morrigan",
                                skills: ["closeCombat", "culture", "subterfuge"],
                                connectionDescription: LoremIpsum(Rand(10, 200))
                            }
                        }                        
                    },
                    pathConditionUpdates: {
                        origin: {
                            suspension: {
                                data: {
                                    title: "Interesting Times",
                                    description: "2's on any d10s count as 1's when determining botches.",
                                    resolution: "Resolved when Rhys suffers the effect of a botch."
                                }
                            },
                            revocation: {
                                data: {
                                    title: "Karmic Betrayal"
                                }
                            }
                        },
                        role: {
                            suspension: {
                                data: {
                                    title: "Tone Deaf",
                                    description: "-2 penalty to all Culture (Music) rolls.",
                                    resolution: "Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                                }
                            },
                            revocation: {
                                data: {
                                    title: "Nickelback 2.0"
                                }
                            }
                        },
                        pantheon: {
                            suspension: {
                                data: {
                                    title: "Murder of Crows",
                                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                                    resolution: "Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                                }
                            },
                            revocation: {
                                data: {
                                    title: "Enemies For Life"
                                }
                            }
                        }
                    }
                }
            }
        },
        "Horace Farrow": {
            actorData: {
                genesis: "born",
                pantheon: "netjer",
                patron: "horus",
                divineTitle: "The Tempered Lawgiver"
            }
        },
        "Brigitte De La Croix": {
            actorData: {
                genesis: "chosen",
                pantheon: "loa",
                patron: "baronSamedi",
                divineTitle: "Who Waits With Those In Darkness"
            }
        },
        "Adonis Rhodes": {
            actorData: {
                genesis: "born",
                pantheon: "theoi",
                patron: "aphrodite",
                divineTitle: "Steward of the Heart"
            }
        },
        "Erik Donner": {
            actorData: {
                genesis: "born",
                pantheon: "aesir",
                patron: "thor",
                divineTitle: "Guardian of Midgard"
            }
        }
    }
};








const randomizePaths = (actorData) => {
    const pathSkills = {
        origin: [],
        role: [],
        pantheon: SCION.PANTHEONS[actorData.pantheon].assetSkills,
    };
    actorData.tempCreateData = Merge({
        pathUpdates: {
            origin: {data: {}},
            role: {data: {}},
            pantheon: {data: {}}
        }
    }, actorData.tempCreateData ?? {});
    Object.entries(actorData.tempCreateData.pathUpdates).forEach(([path, pathData]) => {
        pathSkills[path] = pathData.data.skills ?? [];
    });
    pathSkills.pantheon = _.uniq([...SCION.PANTHEONS[actorData.pantheon].assetSkills, ...actorData.tempCreateData.pathUpdates.pantheon.data.skills]).slice(0, 3);
    
    // Cycle through path skills, selecting valid path skill for each.
    SCION.PATHS.list.forEach((pathType) => {
        const baseVal = Flip(actorData.pathPriorities).findIndex((path) => path === pathType) + 1;
        const skillsToAdd = 3 - pathSkills[pathType].length;
        for (let i = 0; i < skillsToAdd; i++) {
            const availableSkills = Object.keys(SCION.SKILLS.list).filter((skill) => Object.values(pathSkills)
                                                                  .flat()
                                                                  .filter((pathSkill) => pathSkill === skill)
                                                                  .length < 2 
                                                                && !pathSkills[pathType].includes(skill));
            pathSkills[pathType].push(_.sample(availableSkills));
        }
        actorData.tempCreateData.pathUpdates[pathType].data.skills = pathSkills[pathType];
    });
    LOG({actorData: Clone(actorData)}, "Path Randomization", actorData.name, {style: "l3"});
}
const randomizeSkills = (actorData) => {
    // Pre-assign 75% of assignable Skill Dots (to a max skill value of 5), leaving the remaining quarter to test dot assigning
    const assignableSkillDots = getAssignableSkillDots(actorData);
    let preassignedSkillDots = Math.ceil(0.75 * assignableSkillDots),
        availableSkills = Object.keys(_.pick(getSkillVals(actorData), (val) => val < 5));
    while (preassignedSkillDots && availableSkills.length) {
        const randomSkill = _.sample(availableSkills);
        actorData.skills.list[randomSkill].assigned++;
        preassignedSkillDots--;
        availableSkills = Object.keys(_.pick(getSkillVals(actorData), (val) => val < 5));
    }
    return actorData;
}
const randomizeSpecialties = (actorData) => {
    const specSkills = Object.keys(_.pick(getSkillVals(actorData), (val) => val >= 3));
    specSkills.forEach((skill) => {
        actorData.skills.list[skill].specialties.list[0] = RandomWord();
    });
}

const randomizeAttributes = (actorData) => {  
    // Assign one-half of available arena dots according to Attribute priority settings:
    Object.keys(SCION.ATTRIBUTES.priorities).forEach((priority, i) => {
        const thisArena = actorData.attributes.priorities[i];
        let preassignedArenaDots = Math.ceil(0.5 * getAssignableAttributeDots(actorData, priority)),
            availableAttrs = SCION.ATTRIBUTES.arenas[thisArena].filter((attr) => getAttrVals(actorData)[attr] < 5);
        while (preassignedArenaDots && availableAttrs.length) {
            actorData.attributes.list[_.sample(availableAttrs)].assigned++;
            preassignedArenaDots--;
            availableAttrs = SCION.ATTRIBUTES.arenas[thisArena].filter((attr) => getAttrVals(actorData)[attr] < 5);
        }
    });

    // Assign one-half of available general dots:
    let assignableGeneralAttrDots = Math.ceil(0.5 * getAssignableAttributeDots(actorData)),
        availableAttrs = Object.keys(_.pick(getAttrVals(actorData), (val) => val < 5));
    while (assignableGeneralAttrDots && availableAttrs.length) {
        actorData.attributes.list[_.sample(availableAttrs)].assigned++;
        assignableGeneralAttrDots--;
        availableAttrs = Object.keys(_.pick(getAttrVals(actorData), (val) => val < 5));
    }
}


const getCallings = (actorData) => actorData.testItemCreateData.filter((itemData) => itemData.type === "calling");
/* const getActiveKnacks = (actorData) => {
    const activeKnacks = getCallings(actorData).reduce((knacks, calling) => knacks.push(...calling.))
}; */
const getAllKnacks = (actorData) => {};
const randomizeCallings = (actorData) => {
    
    // Select callings, create item creation data for calling items.
    const callingChoices = _.shuffle(_.uniq([
        _.sample(SCION.GODS[actorData.patron].callings),
        ..._.sample(Object.keys(SCION.CALLINGS.list), 4)
    ]).slice(0,3));
    actorData.testItemCreateData.push(...callingChoices.map((calling) => ({
        type: "calling",
        title: Loc(`scion.calling.${calling}.name`),
        value: 1
    })));

    // Assign calling dots.
    let preassignedCallingDots = Object.values(actorData.callings.assignableGeneralDots).reduce((tot, val) => tot + val, 0),
        availableCallings = getCallings(actorData).filter((calling) => calling.value < 5);
    while (preassignedCallingDots && availableCallings.length) {
        const thisCalling = _.sample(availableCallings);
        thisCalling.value++;
        preassignedCallingDots--;
        availableCallings = getCallings(actorData).filter((calling) => calling.value < 5);
    }
}

const randomizeKnacks = (actorData) => {
    const chosenKnacks = [];
    for (const calling of getCallings(actorData)) {
        let callingPointsLeft = calling.value;
        while (callingPointsLeft) {
            const availableKnacks = Object.keys(SCION.KNACKS.list).filter((knackName) => {
                const knack = SCION.KNACKS.list[knackName];
                return !chosenKnacks.some((knackData) => knackData.name === knackName)
                    && ["any", calling].includes(knack.calling)
                    && (callingPointsLeft >= 2 || knack.tier === "heroic");
            }).map((knackName) => ({name: knackName, assignment: calling, ...SCION.KNACKS.list[knackName]}));
            chosenKnacks.unshift(_.sample(availableKnacks));
            callingPointsLeft -= SCION.KNACKS.list[chosenKnacks[0].name].tier === "immortal" ? 2 : 1;
        }
    }
}

const randomizeCallingKeywords = (actorData) => {
    // callings[randomCalling].keywordsUsed = [_.sample(callings[randomCalling].keywordsChosen)];
}

const updatePaths = async (actor, updateData) => {
    const [updateDataSet, fullUpdateData] = [{}, []];
    Object.entries(updateData.pathUpdates ?? {}).forEach(([path, pathData]) => {
        const pathItem = actor.paths.find((item) => item.$subtype === path);
        if (pathItem) {
            fullUpdateData.push({...pathData, _id: pathItem.$id});
        }
    });
    Object.entries(updateData.pathConditionUpdates ?? {}).forEach(([path, conditionUpdates]) => {
        const pathItem = actor.paths.find((item) => item.$subtype === path);
        if (pathItem) {
            const pathSubItems = pathItem.$items;
            Object.entries(conditionUpdates).forEach(([condition, conditionData]) => {
                const conditionItem = Array.from(pathItem.$items).find(([id, item]) => item.$subtype.endsWith(SCase(condition)))[1];
                if (conditionItem) {
                    fullUpdateData.push({...conditionData, _id: conditionItem.$id});
                }
            });
        }
    });
    LOG({fullUpdateData}, `Updating ${fullUpdateData.length} Sub Items`, actor.name, {groupStyle: "l1"});
    await actor.updateEmbeddedEntity("OwnedItem", fullUpdateData);
    return actor;
}

testChars.createTestChar = async (name) => {
    const customActorData = {};
    if (name) {
        game.actors.entries.find((actor) => actor.name === name)?.delete();
        Object.assign(customActorData, testChars.sigChars[name]?.actorData ?? {});
    } else {
        name = randomNames.name;
    }

    // #region Data Manipulation: Before Actor Creation

    // Initialize Actor Data
    const actorData = initializeActorData(true, customActorData, name);

    // Initialize Assignable Dots
    setAssignableSkillDots(actorData);
    setAssignableAttributeDots(actorData);

    // Determine Path Skills
    randomizePaths(actorData);

    // Randomly Assign Available Skill Dots & Specialties
    randomizeSkills(actorData);
    randomizeSpecialties(actorData);

    // Assign Available Attribute Dots
    randomizeAttributes(actorData);

    // #endregion

    const postCreateData = Clone(actorData.tempCreateData);
    delete actorData.tempCreateData;
    const actorInst = await Actor.create({
        name,
        type: "major",
        data: actorData,
    });
    
    await Sleep(5000);

    // #region Actor Manipulation: After Actor Creation

    // Update Path Skills & Conditions
    await updatePaths(actorInst, postCreateData);

    // Randomly Select Callings, Assign Dots, Select Keywords
    // randomizeCallings(actorData);
    // randomizeKnacks(actorData);
    // randomizeCallingKeywords(actorData);

    // #endregion

    return actorInst;
};
testChars.createSigChars = async (...names) => {
    if (names.length === 0) {
        names = Object.keys(testChars.sigChars);
    }
    const updatePromises = [];
    for (const name of names) {
        LOG({name}, `Creating Actor '${name}'...`, "createTestChar()", {groupStyle: "data"});
        updatePromises.push(testChars.createTestChar(name));
    }
    for (let i = 0; i < 5; i++) {
        LOG("Creating Test Character", null, "createTestChar()", {groupStyle: "data"});
        updatePromises.push(testChars.createTestChar());        
    }
    return Promise.all(updatePromises);
};
testChars.createTestChars = async (numChars = 10) => {
    await testChars.deleteAllChars();
    const names = Object.keys(testChars.sigChars);
    numChars -= names.length;
    for (const name of names) {
        LOG({name}, `Creating Actor '${name}'...`, "createTestChar()", {groupStyle: "data"});
        await testChars.createTestChar(name);
    }
    for (let i = 0; i < numChars; i++) {
        LOG("Creating Test Character", null, "createTestChar()", {groupStyle: "data"});
        await testChars.createTestChar();
    }
}
testChars.deleteAllChars = async () => game.actors.entries.forEach(async (actor) => actor.delete());

export {SCION, handlebarTemplates, itemCategories, popoutData, testChars};
