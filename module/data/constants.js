import * as _ from "../external/underscore/underscore-esm-min.js";

export const baseConstants = {
    noCapTitleCase: ["above", "after", "at", "below", "by", "down", "for", "from", "in", "onto", "of", "off", "on", "out", "to", "under", "up", "with", "for", "and", "nor", "but", "or", "yet", "so", "the", "an", "a"]
};
export const scionSystemData = {
    TIERS: {
        mortal: "scion.tier.mortal",
        hero: "scion.tier.hero",
        demigod: "scion.tier.demigod",
        god: "scion.tier.god"
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
            bookPage: 46
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
            bookPage: 58
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
            bookPage: 70
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
            bookPage: 32
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
            bookPage: 82
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
            bookPage: 94
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
            bookPage: 118
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
            bookPage: 130
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
            bookPage: 142
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
            bookPage: 154
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
            bookPage: 38
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
            bookPage: 106
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
            bookPage: 50
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
            bookPage: 80
        }
    },
    GODS: {
        baldr: {
            label: "scion.pantheon.god.baldr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.baldr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "liminal", "lover"],
            purviews: ["beauty", "passion:Love|Peace", "health", "epicStamina", "sun"]
        },
        bragi: {
            label: "scion.pantheon.god.bragi",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.bragi",
            bookRef: "scion.book.motw",
            bookPage: 63,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:Storytelling|Poetry|Song", "epicDexterity", "fortune", "passion:Joy"]
        },
        freya: {
            label: "scion.pantheon.god.freya",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.freya",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["lover", "guardian", "sage"],
            purviews: ["beauty", "epicStamina", "fertility", "fortune", "passion:Love|Lust", "war"]
        },
        freyr: {
            label: "scion.pantheon.god.freyr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.freyr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["lover", "warrior", "leader"],
            purviews: ["beauty", "fertility", "order", "war", "wild"]
        },
        frigg: {
            label: "scion.pantheon.god.frigg",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.frigg",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Falcon", "fortune", "order", "wild"]
        },
        heimdall: {
            label: "scion.pantheon.god.heimdall",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.heimdall",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "hunter"],
            purviews: ["artistry:Horns", "beauty", "epicStamina", "journeys"]
        },
        hel: {
            label: "scion.pantheon.god.hel",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.hel",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "forge", "frost", "health", "passion:Fear|Disgust"]
        },
        loki: {
            label: "scion.pantheon.god.loki",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.loki",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["chaos", "deception", "epicStrength", "fire"]
        },
        njörðr: {
            label: "scion.pantheon.god.njörðr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.njörðr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["fertility", "fire", "journeys", "prosperity", "sky", "water"]
        },
        odin: {
            label: "scion.pantheon.god.odin",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.odin",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "death", "deception", "epicStamina", "fortune", "journeys", "war"]
        },
        sif: {
            label: "scion.pantheon.god.sif",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.sif",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "earth", "fertility", "order"]
        },
        skaði: {
            label: "scion.pantheon.god.skaði",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.skaði",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["hunter", "judge", "warrior"],
            purviews: ["earth", "epicDexterity", "frost", "journeys", "order"]
        },
        thor: {
            label: "scion.pantheon.god.thor",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.thor",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["epicStamina", "epicStrength", "fertility", "sky"]
        },
        tyr: {
            label: "scion.pantheon.god.tyr",
            pantheon: "aesir",
            mantle: "scion.pantheon.mantle.tyr",
            bookRef: "scion.book.hero",
            bookPage: 46,
            callings: ["judge", "leader", "warrior"],
            purviews: ["epicStamina", "order", "passion:Courage", "war"]
        },
        agni: {
            label: "scion.pantheon.god.agni",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.agni",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "journeys", "prosperity", "water"]
        },
        durga: {
            label: "scion.pantheon.god.durga",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.durga",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["deception", "epicStrength", "epicDexterity", "epicStamina", "fertility", "war"]
        },
        ganesha: {
            label: "scion.pantheon.god.ganesha",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.ganesha",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["artistry:Dance|Writing", "beasts:Elephants", "chaos", "fortune", "journeys", "prosperity"]
        },
        indra: {
            label: "scion.pantheon.god.indra",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.indra",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Cattle", "epicStrength", "epicDexterity", "fertility", "order", "sky", "war", "wild"]
        },
        kali: {
            label: "scion.pantheon.god.kali",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.kali",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["epicStrength", "epicDexterity", "epicStamina", "artistry:Dance", "chaos", "darkness", "death", "deception", "fire"]
        },
        karttikeya: {
            label: "scion.pantheon.god.karttikeya",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.karttikeya",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["leader", "sage", "warrior"],
            purviews: ["beauty", "epicStrength", "epicDexterity", "epicStamina", "stars", "war"]
        },
        lakshmi: {
            label: "scion.pantheon.god.lakshmi",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.lakshmi",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "epicStrength", "earth", "fertility", "fortune", "order", "passion:Joy|Love", "prosperity"]
        },
        parvati: {
            label: "scion.pantheon.god.parvati",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.parvati",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["creator", "lover", "trickster"],
            purviews: ["epicStrength", "epicStamina", "artistry:Dance", "beauty", "earth", "fertility", "frost", "passion:Devotion|Love"]
        },
        sarasvati: {
            label: "scion.pantheon.god.sarasvati",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.sarasvati",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:All", "epicStrength", "epicDexterity", "health", "water"]
        },
        shiva: {
            label: "scion.pantheon.god.shiva",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.shiva",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["hunter", "lover", "sage"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "chaos", "death", "deception", "epicStrength", "epicDexterity", "epicStamina", "epicStrength", "fertility", "fire", "Moon", "Sky"]
        },
        surya: {
            label: "scion.pantheon.god.surya",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.surya",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["healer", "leader", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "health", "journeys", "stars", "sun"]
        },
        varuna: {
            label: "scion.pantheon.god.varuna",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.varuna",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "judge", "leader"],
            purviews: ["epicStrength", "darkness", "fertility", "order", "sky", "sun", "water"]
        },
        vishnu: {
            label: "scion.pantheon.god.vishnu",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.vishnu",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:Dance|Wind Instruments", "beauty", "deception", "epicStamina", "epicStrength", "epicDexterity", "order", "passion:Hope"]
        },
        vishvakarman: {
            label: "scion.pantheon.god.vishvakarman",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.vishvakarman",
            bookRef: "scion.book.motw",
            bookPage: 64,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:All", "beasts:Doves", "chaos", "forge", "order", "prosperity"]
        },
        yamaraja: {
            label: "scion.pantheon.god.yamaraja",
            pantheon: "deva",
            mantle: "scion.pantheon.mantle.yamaraja",
            bookRef: "scion.book.hero",
            bookPage: 58,
            callings: ["judge", "leader", "liminal"],
            purviews: ["epicDexterity", "epicStamina", "darkness", "death", "journeys", "order"]
        },
        amaNoUzume: {
            label: "scion.pantheon.god.amaNoUzume",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.amaNoUzume",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Dance|Singing", "deception", "passion:Lust|Mirth"]
        },
        amaterasu: {
            label: "scion.pantheon.god.amaterasu",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.amaterasu",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["judge", "leader", "sage"],
            purviews: ["epicStrength", "fertility", "order", "prosperity", "sun"]
        },
        benzaiten: {
            label: "scion.pantheon.god.benzaiten",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.benzaiten",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "lover", "sage"],
            purviews: ["artistry", "beast:Snake", "beauty", "fertility", "fortune", "stars"]
        },
        bishamon: {
            label: "scion.pantheon.god.bishamon",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.bishamon",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["epicDexterity", "fortune", "prosperity", "war"]
        },
        ebisu: {
            label: "scion.pantheon.god.ebisu",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.ebisu",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["beasts:Fish|Sharks|Whales", "epicStamina", "fortune", "prosperity", "wild"]
        },
        fukurokuju: {
            label: "scion.pantheon.god.fukurokuju",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.fukurokuju",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Deer|Turtle|Crane", "epicStamina", "health", "fortune"]
        },
        hachiman: {
            label: "scion.pantheon.god.hachiman",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.hachiman",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["leader", "sage", "warrior"],
            purviews: ["artistry:All", "beasts:Dove", "order", "prosperity", "war"]
        },
        hotei: {
            label: "scion.pantheon.god.hotei",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.hotei",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["chaos", "fortune", "journeys", "passion:Joy"]
        },
        inari: {
            label: "scion.pantheon.god.inari",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.inari",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "healer", "liminal"],
            purviews: ["beasts:Fox", "fertility", "fortune", "health", "journeys", "prosperity"]
        },
        kisshōten: {
            label: "scion.pantheon.god.kisshōten",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.kisshōten",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "healer", "lover"],
            purviews: ["beauty", "fortune", "health"]
        },
        ōkuninushi: {
            label: "scion.pantheon.god.ōkuninushi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.ōkuninushi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "leader", "liminal"],
            purviews: ["beasts:All", "earth", "darkness", "fortune", "prosperity"]
        },
        omoikane: {
            label: "scion.pantheon.god.omoikane",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.omoikane",
            bookRef: "scion.book.motw",
            bookPage: 65,
            callings: ["judge", "sage", "trickster"],
            purviews: ["artistry:Rhetoric", "deception", "order", "prosperity", "sky"]
        },
        sarutahiko: {
            label: "scion.pantheon.god.sarutahiko",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.sarutahiko",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["lover", "sage", "warrior"],
            purviews: ["beasts:Monkeys", "earth", "journeys"]
        },
        susanoO: {
            label: "scion.pantheon.god.susanoO",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.susanoO",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["artistry:Poetry", "chaos", "death", "epicStrength", "forge", "sky", "water"]
        },
        takemikazuchi: {
            label: "scion.pantheon.god.takemikazuchi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.takemikazuchi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Deer", "epicDexterity", "epicStamina", "epicStrength", "sky:Thunder", "war"]
        },
        tsukiyomi: {
            label: "scion.pantheon.god.tsukiyomi",
            pantheon: "kami",
            mantle: "scion.pantheon.mantle.tsukiyomi",
            bookRef: "scion.book.hero",
            bookPage: 70,
            callings: ["healer", "liminal", "judge"],
            purviews: ["artistry", "darkness", "moon", "order"]
        },
        baronCimetière: {
            label: "scion.pantheon.god.baronCimetière",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronCimetière",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["darkness", "death", "epicStamina", "health"]
        },
        baronLaCroix: {
            label: "scion.pantheon.god.baronLaCroix",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronLaCroix",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["death", "epicStamina", "fortune", "health"]
        },
        baronSamedi: {
            label: "scion.pantheon.god.baronSamedi",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.baronSamedi",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["judge", "lover", "trickster"],
            purviews: ["chaos", "death", "epicStamina", "fertility", "health"]
        },
        damballa: {
            label: "scion.pantheon.god.damballa",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.damballa",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Snakes", "earth", "fertility", "order", "sky", "water"]
        },
        ezili: {
            label: "scion.pantheon.god.ezili",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.ezili",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"]
        },
        kalfu: {
            label: "scion.pantheon.god.kalfu",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.kalfu",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["chaos", "darkness", "fortune", "journeys", "moon"]
        },
        lasyren: {
            label: "scion.pantheon.god.lasyren",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.lasyren",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"]
        },
        ogou: {
            label: "scion.pantheon.god.ogou",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.ogou",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"]
        },
        papaLegba: {
            label: "scion.pantheon.god.papaLegba",
            pantheon: "loa",
            mantle: "scion.pantheon.mantle.papaLegba",
            bookRef: "scion.book.motw",
            bookPage: 32,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"]
        },
        biboonike: {
            label: "scion.pantheon.god.biboonike",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.biboonike",
            bookRef: "scion.book.motw",
            bookPage: 65,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["chaos", "darkness", "frost", "sky", "wild"]
        },
        cheebyAubOozoo: {
            label: "scion.pantheon.god.cheebyAubOozoo",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.cheebyAubOozoo",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "judge", "liminal"],
            purviews: ["artistry:Song|Music", "beasts:Wolf", "darkness", "death", "epicStamina", "order"]
        },
        geezhigoQuae: {
            label: "scion.pantheon.god.geezhigoQuae",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.geezhigoQuae",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "sage"],
            purviews: ["beasts:Crane|Turtle", "moon", "order", "sky", "stars"]
        },
        ioskeha: {
            label: "scion.pantheon.god.ioskeha",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.ioskeha",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["creator", "leader", "warrior"],
            purviews: ["forge", "sun", "sky", "order", "beasts:diurnal mammals and birds|insects|fish", "health", "passion:All light emotions"]
        },
        maudjeeKawiss: {
            label: "scion.pantheon.god.maudjeeKawiss",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.maudjeeKawiss",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["beasts:Bear|Eagle", "epicDexterity", "epicStrength", "war"]
        },
        muzzuKumikQuae: {
            label: "scion.pantheon.god.muzzuKumikQuae",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.muzzuKumikQuae",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:All", "earth", "fertility", "sky", "water", "wild"]
        },
        nana: {
            label: "scion.pantheon.god.nana",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.nana",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["hunter", "trickster", "warrior"],
            purviews: ["beasts:Rabbit", "chaos", "epicDexterity", "fortune", "journeys"]
        },
        pukawiss: {
            label: "scion.pantheon.god.pukawiss",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.pukawiss",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["lover", "sage", "trickster"],
            purviews: ["epicDexterity", "artistry:Dance|Acting|Storytelling", "passion:Mirth", "fortune", "deception"]
        },
        tawiscara: {
            label: "scion.pantheon.god.tawiscara",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.tawiscara",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["chaos", "deception", "darkness", "death", "passion:All dark emotions", "forge", "war"]
        },
        winonah: {
            label: "scion.pantheon.god.winonah",
            pantheon: "manitou",
            mantle: "scion.pantheon.mantle.winonah",
            bookRef: "scion.book.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "lover"],
            purviews: ["epicStamina", "fortune", "health", "passion:All", "prosperity"]
        },
        anubis: {
            label: "scion.pantheon.god.anubis",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.anubis",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beast:Jackal", "darkness", "death", "order"]
        },
        atum: {
            label: "scion.pantheon.god.atum",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.atum",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:Dance|Pottery", "beasts:Ram", "earth", "health", "water"]
        },
        bastet: {
            label: "scion.pantheon.god.bastet",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.bastet",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["artistry:Dance|Music", "beasts:Cats|Lions", "epicDexterity", "fertility", "fortune", "health", "moon", "sun", "war"]
        },
        hathor: {
            label: "scion.pantheon.god.hathor",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.hathor",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "lover", "healer"],
            purviews: ["artistry:Music|Dance", "beasts:Cow", "beauty", "fertility", "fortune", "passion:Love", "sky"]
        },
        horus: {
            label: "scion.pantheon.god.horus",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.horus",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Falcon", "moon", "order", "sky", "sun", "war"]
        },
        isis: {
            label: "scion.pantheon.god.isis",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.isis",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "healer", "trickster"],
            purviews: ["beasts:Kite|Serpent", "death", "deception", "fertility", "fortune", "health", "stars"]
        },
        osiris: {
            label: "scion.pantheon.god.osiris",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.osiris",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Ram|Centipede", "death", "earth", "fertility", "order"]
        },
        ptah: {
            label: "scion.pantheon.god.ptah",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.ptah",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "liminal", "sage"],
            purviews: ["beasts:Bull", "fire", "forge", "prosperity"]
        },
        ra: {
            label: "scion.pantheon.god.ra",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.ra",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Falcon|Scarab|Ram", "death", "epicStamina", "fire", "journeys", "order", "sun"]
        },
        set: {
            label: "scion.pantheon.god.set",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.set",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "trickster"],
            purviews: ["beasts:Salawa|Fish", "chaos", "earth", "epicStrength", "journeys", "sky", "war"]
        },
        sobek: {
            label: "scion.pantheon.god.sobek",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.sobek",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "lover"],
            purviews: ["beasts:Crocodile", "epicStamina", "passion:Lust", "fertility", "water"]
        },
        thoth: {
            label: "scion.pantheon.god.thoth",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.thoth",
            bookRef: "scion.book.hero",
            bookPage: 94,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["beasts:Baboon|Ibis", "deception", "fortune", "health", "moon", "order"]
        },
        upuaut: {
            label: "scion.pantheon.god.upuaut",
            pantheon: "netjer",
            mantle: "scion.pantheon.mantle.upuaut",
            bookRef: "scion.book.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "warrior"],
            purviews: ["beasts:Wolves", "death", "epicDexterity", "epicStamina", "journeys", "war"]
        },
        changE: {
            label: "scion.pantheon.god.changE",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.changE",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["healer", "lover", "trickster"],
            purviews: ["beasts:Rabbits|Toads", "beauty", "epicStamina", "health", "moon"]
        },
        confucius: {
            label: "scion.pantheon.god.confucius",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.confucius",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["judge", "leader", "sage"],
            purviews: ["artistry:All", "order", "passion:Filiality"]
        },
        doumu: {
            label: "scion.pantheon.god.doumu",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.doumu",
            bookRef: "scion.book.motw",
            bookPage: 67,
            callings: ["judge", "leader", "sage"],
            purviews: ["beasts:Boars", "fortune", "order", "prosperity", "stars"]
        },
        erlang: {
            label: "scion.pantheon.god.erlang",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.erlang",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["epicStamina", "epicStrength", "forge", "war", "water"]
        },
        fuxi: {
            label: "scion.pantheon.god.fuxi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.fuxi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "hunter", "sage"],
            purviews: ["artistry:Musical Instruments|Writing", "beasts:All", "fertility", "forge", "fortune", "health", "order", "sun"]
        },
        guanYu: {
            label: "scion.pantheon.god.guanYu",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.guanYu",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["artistry:Historical Fiction", "epicStrength", "epicStamina", "order", "passion:Loyalty", "prosperity", "sky", "war"]
        },
        guanshiyinPusa: {
            label: "scion.pantheon.god.guanshiyinPusa",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.guanshiyinPusa",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "healer", "sage"],
            purviews: ["deception", "epicStamina", "health", "journeys", "passion:Mercy", "water"]
        },
        huangdi: {
            label: "scion.pantheon.god.huangdi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.huangdi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:All", "death", "earth", "forge", "health", "order", "prosperity", "war"]
        },
        laozi: {
            label: "scion.pantheon.god.laozi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.laozi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "chaos", "darkness", "epicStamina", "health", "order", "water"]
        },
        nuwā: {
            label: "scion.pantheon.god.nuwā",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.nuwā",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["creator", "guardian", "healer"],
            purviews: ["earth", "fertility", "forge", "health", "moon", "sky"]
        },
        princeNezha: {
            label: "scion.pantheon.god.princeNezha",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.princeNezha",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["artistry:Animation", "epicStamina", "epicStrength", "health", "war"]
        },
        sunWukong: {
            label: "scion.pantheon.god.sunWukong",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.sunWukong",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["liminal", "trickster", "warrior"],
            purviews: ["artistry:Opera", "beasts:Monkey", "chaos", "deception", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"]
        },
        yandiShennongshi: {
            label: "scion.pantheon.god.yandiShennongshi",
            pantheon: "shen",
            mantle: "scion.pantheon.mantle.yandiShennongshi",
            bookRef: "scion.book.hero",
            bookPage: 118,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Storytelling", "epicStamina", "fertility", "fire", "forge", "health", "prosperity"]
        },
        chalchihuitlicue: {
            label: "scion.pantheon.god.chalchihuitlicue",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chalchihuitlicue",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Aquatic Animal", "fertility", "water"]
        },
        chantico: {
            label: "scion.pantheon.god.chantico",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chantico",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["healer", "liminal", "sage"],
            purviews: ["fire", "forge", "order", "prosperity"]
        },
        chicoAndCenteo: {
            label: "scion.pantheon.god.chicoAndCenteo",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.chicoAndCenteo",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["healer", "guardian", "judge"],
            purviews: ["earth", "fertility", "prosperity"]
        },
        huehuecoyotl: {
            label: "scion.pantheon.god.huehuecoyotl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.huehuecoyotl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["lover", "sage", "trickster"],
            purviews: ["chaos", "epicDexterity", "passion:All"]
        },
        huītzilōpōchtli: {
            label: "scion.pantheon.god.huītzilōpōchtli",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.huītzilōpōchtli",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Eagle|Hummingbird", "death", "epicStrength", "prosperity", "sun", "war"]
        },
        ītzpāpālōtl: {
            label: "scion.pantheon.god.ītzpāpālōtl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.ītzpāpālōtl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["hunter", "lover", "warrior"],
            purviews: ["beasts:All", "darkness", "death", "fertility", "stars", "war"]
        },
        mictecacihuatl: {
            label: "scion.pantheon.god.mictecacihuatl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.mictecacihuatl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "sage"],
            purviews: ["beasts:Bats|Owls|Spiders", "darkness", "death", "passion:All"]
        },
        quetzalcoatl: {
            label: "scion.pantheon.god.quetzalcoatl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.quetzalcoatl",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Writing|Feathers", "beasts:All", "fertility", "journeys", "order", "sky", "stars"]
        },
        tezcatlipoca: {
            label: "scion.pantheon.god.tezcatlipoca",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.tezcatlipoca",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["hunter", "leader", "trickster"],
            purviews: ["beasts:Jaguar|Turkey", "chaos", "darkness", "deception", "earth", "fortune", "war"]
        },
        tlāloc: {
            label: "scion.pantheon.god.tlāloc",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.tlāloc",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["death", "earth", "fertility", "frost", "health", "sky"]
        },
        xīpeTotēc: {
            label: "scion.pantheon.god.xīpeTotēc",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xīpeTotēc",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "healer", "hunter"],
            purviews: ["fertility", "forge", "health", "war"]
        },
        xochipilli: {
            label: "scion.pantheon.god.xochipilli",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xochipilli",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:All", "beauty", "fortune", "passion:All", "prosperity"]
        },
        xochiquetzal: {
            label: "scion.pantheon.god.xochiquetzal",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xochiquetzal",
            bookRef: "scion.book.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "lover"],
            purviews: ["artistry:All", "beauty", "epicDexterity", "fertility", "fortune", "passion:All", "prosperity"]
        },
        xolotl: {
            label: "scion.pantheon.god.xolotl",
            pantheon: "teotl",
            mantle: "scion.pantheon.mantle.xolotl",
            bookRef: "scion.book.motw",
            bookPage: 67,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["beasts:Dogs", "chaos", "darkness", "death", "earth", "journeys"]
        },
        aphrodite: {
            label: "scion.pantheon.god.aphrodite",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.aphrodite",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "fertility", "passion:Desire|Love", "prosperity"]
        },
        apollo: {
            label: "scion.pantheon.god.apollo",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.apollo",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["healer", "judge", "sage"],
            purviews: ["artistry", "epicDexterity", "health", "sun"]
        },
        ares: {
            label: "scion.pantheon.god.ares",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.ares",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "lover", "warrior"],
            purviews: ["chaos", "fertility", "order", "passion:Rage|Valor", "prosperity", "war"]
        },
        artemis: {
            label: "scion.pantheon.god.artemis",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.artemis",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["beasts:All", "epicDexterity", "health", "moon", "wild"]
        },
        athena: {
            label: "scion.pantheon.god.athena",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.athena",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Weaving", "beasts:Owl", "epicDexterity", "order", "war"]
        },
        demeter: {
            label: "scion.pantheon.god.demeter",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.demeter",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "judge"],
            purviews: ["earth", "epicStamina", "fertility", "order"]
        },
        dionysus: {
            label: "scion.pantheon.god.dionysus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.dionysus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["liminal", "lover", "sage"],
            purviews: ["artistry:Theatre", "chaos", "deception", "fertility", "passion:Ecstasy", "wild"]
        },
        epona: {
            label: "scion.pantheon.god.epona",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.epona",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["beasts:Horses", "fertility", "order", "war"]
        },
        hades: {
            label: "scion.pantheon.god.hades",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hades",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["darkness", "death", "earth", "prosperity"]
        },
        hecate: {
            label: "scion.pantheon.god.hecate",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hecate",
            bookRef: "scion.book.motw",
            bookPage: 68,
            callings: ["healer", "liminal", "sage"],
            purviews: ["beasts:Dogs", "darkness", "fortune", "journeys", "moon", "stars", "wild"]
        },
        hephaestus: {
            label: "scion.pantheon.god.hephaestus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hephaestus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["creator", "sage", "trickster"],
            purviews: ["epicStamina", "fire", "forge", "fortune"]
        },
        hera: {
            label: "scion.pantheon.god.hera",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hera",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "fertility", "health", "order", "passion:Fidelity", "prosperity"]
        },
        hermes: {
            label: "scion.pantheon.god.hermes",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hermes",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["death", "deception", "epicDexterity", "journeys", "prosperity"]
        },
        hestia: {
            label: "scion.pantheon.god.hestia",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.hestia",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "judge"],
            purviews: ["fire", "fortune", "order", "prosperity"]
        },
        persephone: {
            label: "scion.pantheon.god.persephone",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.persephone",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["death", "fertility", "health"]
        },
        poseidon: {
            label: "scion.pantheon.god.poseidon",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.poseidon",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beasts:Horse", "epicStrength", "earth", "water"]
        },
        zeus: {
            label: "scion.pantheon.god.zeus",
            pantheon: "theoi",
            mantle: "scion.pantheon.mantle.zeus",
            bookRef: "scion.book.hero",
            bookPage: 142,
            callings: ["leader", "lover", "trickster"],
            purviews: ["deception", "epicStrength", "epicStamina", "fortune", "order", "sky"]
        },
        aengus: {
            label: "scion.pantheon.god.aengus",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.aengus",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beasts:Bird", "beauty", "deception", "moon", "passion:Love"]
        },
        brigid: {
            label: "scion.pantheon.god.brigid",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.brigid",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["healer", "sage", "trickster"],
            purviews: ["artistry:Poetry", "fertility", "fire", "forge", "health"]
        },
        dianCécht: {
            label: "scion.pantheon.god.dianCécht",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.dianCécht",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "healer", "judge"],
            purviews: ["fertility", "health", "water"]
        },
        donn: {
            label: "scion.pantheon.god.donn",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.donn",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["leader", "liminal", "trickster"],
            purviews: ["darkness", "death", "journeys", "sky"]
        },
        ériu: {
            label: "scion.pantheon.god.ériu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.ériu",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "judge", "leader"],
            purviews: ["earth", "fertility", "order", "prosperity"]
        },
        goibniu: {
            label: "scion.pantheon.god.goibniu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.goibniu",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "sage", "warrior"],
            purviews: ["artistry:Brewing", "epicStamina", "forge", "health"]
        },
        lugh: {
            label: "scion.pantheon.god.lugh",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.lugh",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["creator", "leader", "warrior"],
            purviews: ["artistry:All", "epicDexterity", "epicStrength", "forge", "health", "order", "prosperity", "war"]
        },
        macLir: {
            label: "scion.pantheon.god.macLir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.macLir",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "liminal", "trickster"],
            purviews: ["deception", "journeys", "prosperity", "stars", "water"]
        },
        midir: {
            label: "scion.pantheon.god.midir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.midir",
            bookRef: "scion.book.motw",
            bookPage: 68,
            callings: ["deception", "earth", "fortune"],
            purviews: ["passion:Single-Mindedness"]
        },
        nuada: {
            label: "scion.pantheon.god.nuada",
            pantheon: "tuathaDeDanann",
            mantle: false,
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["leader", "sage", "warrior"],
            purviews: ["order", "prosperity", "war"]
        },
        ogma: {
            label: "scion.pantheon.god.ogma",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.ogma",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Oration|Poetry", "epicStrength", "fortune", "wild"]
        },
        theDagda: {
            label: "scion.pantheon.god.theDagda",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.theDagda",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["guardian", "leader", "sage"],
            purviews: ["epicStamina", "epicStrength", "fertility", "forge", "prosperity", "war"]
        },
        morrigan: {
            label: "scion.pantheon.god.morrigan",
            pantheon: "tuathaDeDanann",
            mantle: "scion.pantheon.mantle.morrigan",
            bookRef: "scion.book.hero",
            bookPage: 154,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beasts:Crows|Cattle|Horses", "chaos", "death", "epicDexterity", "fortune", "prosperity", "war"]
        },
        andarta: {
            label: "scion.pantheon.god.andarta",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.andarta",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["epicDexterity", "epicStamina", "fortune", "passion:Bravery", "war"]
        },
        belenos: {
            label: "scion.pantheon.god.belenos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.belenos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["healer", "liminal", "sage"],
            purviews: ["death", "health", "stars", "sun"]
        },
        cernunnos: {
            label: "scion.pantheon.god.cernunnos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.cernunnos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "guardian", "sage"],
            purviews: ["beasts:All Wild Animals", "prosperity", "wild"]
        },
        esos: {
            label: "scion.pantheon.god.esos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.esos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["artistry:Woodcarving", "epicStrength", "forge"]
        },
        gobannos: {
            label: "scion.pantheon.god.gobannos",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.gobannos",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["creator", "lover", "warrior"],
            purviews: ["epicStamina", "forge", "journeys", "prosperity"]
        },
        nantosuelta: {
            label: "scion.pantheon.god.nantosuelta",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.nantosuelta",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Bees|Birds", "fertility", "fire"]
        },
        nehalAndNodens: {
            label: "scion.pantheon.god.nehalAndNodens",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.nehalAndNodens",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "liminal"],
            purviews: ["beasts:Dogs|Marine Life", "fertility:Nehalennia ONLY", "health", "journeys", "prosperity", "water"]
        },
        sulis: {
            label: "scion.pantheon.god.sulis",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.sulis",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "judge"],
            purviews: ["earth", "health", "water"]
        },
        taranis: {
            label: "scion.pantheon.god.taranis",
            pantheon: "nemetondevos",
            mantle: "scion.pantheon.mantle.taranis",
            bookRef: "scion.book.motw",
            bookPage: 38,
            callings: ["judge", "liminal", "warrior"],
            purviews: ["chaos", "epicStrength", "sky"]
        },
        erinle: {
            label: "scion.pantheon.god.erinle",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.erinle",
            bookRef: "scion.book.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "lover"],
            purviews: ["beauty", "epicStamina", "epicStrength", "passion:Love", "prosperity", "water"]
        },
        èshùElègbará: {
            label: "scion.pantheon.god.èshùElègbará",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.èshùElègbará",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"]
        },
        ìbejì: {
            label: "scion.pantheon.god.ìbejì",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.ìbejì",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "judge", "trickster"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "death", "fertility", "fortune", "prosperity"]
        },
        morèmi: {
            label: "scion.pantheon.god.morèmi",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.morèmi",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beauty", "deception", "fertility", "fire", "passion:All"]
        },
        obàtálá: {
            label: "scion.pantheon.god.obàtálá",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.obàtálá",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "judge", "leader"],
            purviews: ["artistry:Sculpture", "health", "order", "sky"]
        },
        odùduwà: {
            label: "scion.pantheon.god.odùduwà",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.odùduwà",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "leader", "warrior"],
            purviews: ["darkness", "earth", "order", "war"]
        },
        ògún: {
            label: "scion.pantheon.god.ògún",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.ògún",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"]
        },
        òrìshàOko: {
            label: "scion.pantheon.god.òrìshàOko",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òrìshàOko",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["hunter", "judge", "sage"],
            purviews: ["beasts:Beasts of Burden|Birds", "fertility", "fortune", "order", "prosperity"]
        },
        òrúnmìlà: {
            label: "scion.pantheon.god.òrúnmìlà",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òrúnmìlà",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "judge", "sage"],
            purviews: ["fortune", "sky", "stars", "wild"]
        },
        òsanyìn: {
            label: "scion.pantheon.god.òsanyìn",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òsanyìn",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:Birds", "epicStamina", "fertility", "fortune", "health", "wild"]
        },
        oshóssí: {
            label: "scion.pantheon.god.oshóssí",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.oshóssí",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["hunter", "liminal", "judge"],
            purviews: ["beasts", "epicDexterity", "prosperity", "wild"]
        },
        òshun: {
            label: "scion.pantheon.god.òshun",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.òshun",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"]
        },
        oyaIyansan: {
            label: "scion.pantheon.god.oyaIyansan",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.oyaIyansan",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["beasts:Bull", "epicDexterity", "epicStrength", "death", "prosperity", "sky", "water"]
        },
        shàngó: {
            label: "scion.pantheon.god.shàngó",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.shàngó",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["leader", "lover", "warrior"],
            purviews: ["artistry:Dance|Drums", "beauty", "epicStrength", "fire", "order", "passion", "prosperity", "sky", "war"]
        },
        sònpònná: {
            label: "scion.pantheon.god.sònpònná",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.sònpònná",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "liminal"],
            purviews: ["death", "earth", "health", "passion:Spite", "wild"]
        },
        yemojaOboto: {
            label: "scion.pantheon.god.yemojaOboto",
            pantheon: "orisha",
            mantle: "scion.pantheon.mantle.yemojaOboto",
            bookRef: "scion.book.hero",
            bookPage: 106,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"]
        },
        anahita: {
            label: "scion.pantheon.god.anahita",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "healer", "warrior"],
            purviews: ["beauty", "health", "water", "war", "wild"]
        },
        ashi: {
            label: "scion.pantheon.god.ashi",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["judge", "sage", "warrior"],
            purviews: ["earth", "fortune", "prosperity", "war"]
        },
        atar: {
            label: "scion.pantheon.god.atar",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.atar",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["artistry:Innovation", "beauty", "fire", "forge", "health", "passion:Devotion"]
        },
        haoma: {
            label: "scion.pantheon.god.haoma",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.haoma",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["beauty", "epicStrength", "fertility", "health"]
        },
        hvareKhshaeta: {
            label: "scion.pantheon.god.hvareKhshaeta",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.hvareKhshaeta",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beauty", "epicDexterity", "epicStamina", "sun"]
        },
        mangha: {
            label: "scion.pantheon.god.mangha",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.mangha",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Bovines", "fertility", "fortune", "moon", "prosperity"]
        },
        mithra: {
            label: "scion.pantheon.god.mithra",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "leader"],
            purviews: ["death", "order", "sun"]
        },
        rashnu: {
            label: "scion.pantheon.god.rashnu",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.rashnu",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "epicStrength", "journeys", "order"]
        },
        sraosha: {
            label: "scion.pantheon.god.sraosha",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.sraosha",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "sage"],
            purviews: ["artistry:Song", "death", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"]
        },
        tishtrya: {
            label: "scion.pantheon.god.tishtrya",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "healer", "warrior"],
            purviews: ["beasts:Horses", "fertility", "health", "sky", "stars", "water"]
        },
        vanant: {
            label: "scion.pantheon.god.vanant",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "judge"],
            purviews: ["epicDexterity", "epicStamina", "epicStrength", "journeys", "stars"]
        },
        vataVayu: {
            label: "scion.pantheon.god.vataVayu",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.vataVayu",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["chaos", "death", "epicDexterity", "sky", "wild"]
        },
        verethragna: {
            label: "scion.pantheon.god.verethragna",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.verethragna",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts", "epicDexterity", "epicStamina", "epicStrength", "fertility", "health", "journeys", "war"]
        },
        zam: {
            label: "scion.pantheon.god.zam",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.zam",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["creator", "guardian", "healer"],
            purviews: ["beauty", "earth", "epicStamina", "wild"]
        },
        zarathustra: {
            label: "scion.pantheon.god.zarathustra",
            pantheon: "yazata",
            mantle: "scion.pantheon.mantle.zarathustra",
            bookRef: "scion.book.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Poetry", "journeys", "order"]
        },
        aeva: {
            label: "scion.pantheon.god.aeva",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.aeva",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:Music", "death", "fertility", "forge", "health", "order", "passion:Dread", "stars"]
        },
        ytar: {
            label: "scion.pantheon.god.ytar",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.ytar",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "trickster", "sage"],
            purviews: ["chaos", "darkness", "deception", "epicStrength", "forge", "journeys", "passion:Joy", "stars"]
        },
        amnis: {
            label: "scion.pantheon.god.amnis",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.amnis",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "leader", "healer"],
            purviews: ["fertility", "forge", "health", "journeys", "order", "prosperity", "water"]
        },
        badaris: {
            label: "scion.pantheon.god.badaris",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.badaris",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Travelogues", "beasts:Marine Life", "epicStamina", "forge", "journeys", "passion:Wanderlust", "water"]
        },
        kuros: {
            label: "scion.pantheon.god.kuros",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.kuros",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beauty", "epicDexterity", "journeys", "order", "passion:Love", "sky", "stars"]
        },
        demosia: {
            label: "scion.pantheon.god.demosia",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.demosia",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "trickster"],
            purviews: ["beasts:Nocturnal Animals", "darkness", "deception", "frost", "moon"]
        },
        hesbon: {
            label: "scion.pantheon.god.hesbon",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.hesbon",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "hunter", "liminal"],
            purviews: ["beasts:Predators", "chaos", "earth", "epicDexterity", "epicStrength", "fertility", "fortune", "passion:Fury", "wild"]
        },
        skaft: {
            label: "scion.pantheon.god.skaft",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.skaft",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:All", "earth", "epicStamina", "fire", "forge", "passion:Curiosity", "prosperity"]
        },
        versak: {
            label: "scion.pantheon.god.versak",
            pantheon: "teros",
            mantle: "scion.pantheon.mantle.versak",
            bookRef: "scion.book.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beauty", "death", "fire", "order", "passion:Pride", "sky", "sun"]
        }
    },
    GENESES: {
        born: "scion.genesis.born",
        created: "scion.genesis.created",
        incarnation: "scion.genesis.incarnation",
        chosen: "scion.genesis.chosen"
    },
    ATTRIBUTES: {
        priorities: {
            primary: {
                label: "scion.game.primary",
                startingDots: 6
            },
            secondary: {
                label: "scion.game.secondary",
                startingDots: 4
            },
            tertiary: {
                label: "scion.game.tertiary",
                startingDots: 2
            }
        },
        arenas: {
            social: ["presence", "manipulation", "composure"],
            mental: ["intellect", "cunning", "resolve"],
            physical: ["might", "dexterity", "stamina"]
        },
        approaches: {
            force: ["presence", "intellect", "might"],
            finesse: ["manipulation", "cunning", "dexterity"],
            resilience: ["composure", "resolve", "stamina"]
        },
        get all() { return [...this.arenas.social, ...this.arenas.mental, ...this.arenas.physical] }
    },
    SKILLS: {
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
        technology: "scion.skill.technology"
    },
    CALLINGS: {
        creator: {
            label: "scion.calling.creator",
            skills: ["academics", "culture", "technology"],
            fateRoles: ["apprentice", "jinx", "rival"]
        },
        guardian: {
            label: "scion.calling.guardian",
            skills: ["athletics", "closeCombat", "empathy"],
            fateRoles: ["canary", "martyr", "nemesis"]
        },
        healer: {
            label: "scion.calling.healer",
            skills: ["empathy", "medicine", "science"],
            fateRoles: ["boonCompanion", "canary", "rival"]
        },
        hunter: {
            label: "scion.calling.hunter",
            skills: ["athletics", "firearms", "survival"],
            fateRoles: ["boonCompanion", "paramour", "rival"]
        },
        judge: {
            label: "scion.calling.judge",
            skills: ["academics", "culture", "persuasion"],
            fateRoles: ["balm", "traitor", "worshipper"]
        },
        leader: {
            label: "scion.calling.leader",
            skills: ["culture", "empathy", "leadership"],
            fateRoles: ["boonCompanion", "traitor", "worshipper"]
        },
        liminal: {
            label: "scion.calling.liminal",
            skills: ["athletics", "pilot", "subterfuge"],
            fateRoles: ["canary", "jinx", "unrequitedParamour"]
        },
        lover: {
            label: "scion.calling.lover",
            skills: ["culture", "empathy", "persuasion"],
            fateRoles: ["balm", "paramour", "unrequitedParamour", "rival"]
        },
        sage: {
            label: "scion.calling.sage",
            skills: ["academics", "occult", "subterfuge"],
            fateRoles: ["apprentice", "jinx", "traitor"]
        },
        trickster: {
            label: "scion.calling.trickster",
            skills: ["culture", "persuasion", "subterfuge"],
            fateRoles: ["boonCompanion", "nemesis", "traitor"]
        },
        warrior: {
            label: "scion.calling.warrior",
            skills: ["athletics", "closeCombat", "firearms"],
            fateRoles: ["balm", "nemesis", "rival"]
        }
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
        worshipper: "scion.faterole.worshipper"
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
            qut: "scion.purview.qut"
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
            wild: "scion.purview.wild"
        }
    }
};
export const handlebarTemplates = {
    chargen: {
        template: () => "systems/scion/templates/actor/chargen/actor-chargen.hbs",
        "step-one": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-one.hbs"},
        "step-two": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-two.hbs"},
        "step-three": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-three.hbs"},
        "step-four": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-four.hbs"},
        "step-five": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-five.hbs"},
        "step-six": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-six.hbs"},
        "step-seven": {template: () => "systems/scion/templates/actor/chargen/actor-chargen-step-seven.hbs"}
    },
    ownedItems: {
        path: {template: () => "systems/scion/templates/actor/ownedItems/path-block.hbs"}
    },
    embeds: {
        pathCondition: {template: () => "systems/scion/templates/item/embeds/path-condition-block.hbs"}
    },
    skillList: {template: () => "systems/scion/templates/item/popouts/skilllist-block.hbs"},
    tooltips: {
        path: {template: () => "systems/scion/templates/item/popouts/path-tooltip-block.hbs"}
    }
};
export const itemCategories = {
    paths: ["path"],
    callings: ["calling"],
    knacks: ["knack"],
    purviews: ["purview"],
    boons: ["boon"],
    birthrights: ["relic", "follower", "creature", "guide", "cult", "covenant"],
    conditions: ["condition"]
};
export const popoutData = {
    path: {leftSpacing: -500, rightSpacing: -500}
};
export const signatureChars = {
    "Rhys Callaghan": {
        actorData: {
            genesis: "born",
            concept: "Lead Singer and All Around Good Lad",
            pantheon: "tuathaDeDanann",
            patron: "aengus",
            divineTitle: "\"Bright Eyes\"",
            attributes: {
                favoredApproach: "resilience",
                list: {
                    presence: {value: 5},
                    manipulation: {value: 2},
                    composure: {value: 4},
                    intellect: {value: 2},
                    cunning: {value: 3},
                    resolve: {value: 4},
                    might: {value: 2},
                    dexterity: {value: 3},
                    stamina: {value: 4}
                },
                priorities: ["social", "mental", "physical"]
            },
            pathPriorities: ["role", "origin", "pantheon"]
        },
        itemCreateData: [
            {
                name: "Origin",
                type: "path",
                data: {
                    type: "origin",
                    title: "Carefree Wanderer with Luck On His Side",
                    skills: ["empathy", "persuasion", "subterfuge"],
                    connections: [],
                    connectionDescription: "Hoboes, Vagrants, Criminals, Transport Networks, Urban Safe Spots",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Interesting Times",
                    type: "pathSuspension",
                    description: "2's on any d10's count as 1's when determining botches.",
                    resolution: "Rhys suffers the effect of a botch.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "origin"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Knife in the Back",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "origin"
                }
            },
            {
                name: "Role",
                type: "path",
                data: {
                    type: "role",
                    title: "No Heaven Frontman",
                    skills: ["athletics", "culture", "persuasion"],
                    connections: [],
                    connectionDescription: "Paparazzi, Media, Celebrities, The Promise (Cult), Exclusive Areas, Wealth",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Tone Deaf",
                    type: "pathSuspension",
                    description: "-2 penalty to all Culture (Music) rolls.",
                    resolution: "Rhys suffers significant consequences from failing a Culture (Music) roll.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "role"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Nickelback 2.0",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "role"
                }
            },
            {
                name: "Pantheon",
                type: "path",
                data: {
                    type: "pantheon",
                    title: "Scion of Aengus, Step-Scion of the Morrigan",
                    skills: ["closeCombat", "culture", "subterfuge"],
                    connections: [],
                    connectionDescription: "Adoring Fans, Obsessed Goths, Accompaniment, Age Is No Obstacle",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Murder of Crows",
                    type: "pathSuspension",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                    resolution: "Rhys follows the command, or makes a major sacrifice to the Morrigan.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "pantheon"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Forced to Choose",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "pantheon"
                }
            }
        ]
    },
    "Horace Farrow": {
        actorData: {
            genesis: "born",
            pantheon: "netjer",
            patron: "horus",
            divineTitle: "\"The Tempered Lawgiver\"",
            attributes: {
                favoredApproach: "finesse",
                list: {
                    presence: {value: 3},
                    manipulation: {value: 3},
                    composure: {value: 2},
                    intellect: {value: 4},
                    cunning: {value: 3},
                    resolve: {value: 3},
                    might: {value: 3},
                    dexterity: {value: 4},
                    stamina: {value: 2}
                },
                priorities: _.shuffle(["social", "mental", "physical"])
            },
            pathPriorities: _.shuffle(["role", "origin", "pantheon"])
        },
        itemCreateData: [
            {
                name: "Origin",
                type: "path",
                data: {
                    type: "origin",
                    title: "Carefree Wanderer with Luck On His Side",
                    skills: [],
                    connections: [],
                    connectionDescription: "Hoboes, Vagrants, Criminals, Transport Networks, Urban Safe Spots",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Interesting Times",
                    type: "pathSuspension",
                    description: "2's on any d10's count as 1's when determining botches.",
                    resolution: "Rhys suffers the effect of a botch.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "origin"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Knife in the Back",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "origin"
                }
            },
            {
                name: "Role",
                type: "path",
                data: {
                    type: "role",
                    title: "No Heaven Frontman",
                    skills: [],
                    connections: [],
                    connectionDescription: "Paparazzi, Media, Celebrities, The Promise (Cult), Exclusive Areas, Wealth",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Tone Deaf",
                    type: "pathSuspension",
                    description: "-2 penalty to all Culture (Music) rolls.",
                    resolution: "Rhys suffers significant consequences from failing a Culture (Music) roll.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "role"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Nickelback 2.0",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "role"
                }
            },
            {
                name: "Pantheon",
                type: "path",
                data: {
                    type: "pantheon",
                    title: "Scion of Aengus, Step-Scion of the Morrigan",
                    skills: [],
                    connections: [],
                    connectionDescription: "Adoring Fans, Obsessed Goths, Accompaniment, Age Is No Obstacle",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Murder of Crows",
                    type: "pathSuspension",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                    resolution: "Rhys follows the command, or makes a major sacrifice to the Morrigan.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "pantheon"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Forced to Choose",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "pantheon"
                }
            }
        ]
    },
    "Brigitte De La Croix": {
        actorData: {
            genesis: "chosen",
            pantheon: "loa",
            patron: "baronSamedi",
            divineTitle: "\"Who Waits With Those In Darkness\"",
            attributes: {
                favoredApproach: "force",
                list: {
                    presence: {value: 4},
                    manipulation: {value: 2},
                    composure: {value: 3},
                    intellect: {value: 3},
                    cunning: {value: 4},
                    resolve: {value: 4},
                    might: {value: 3},
                    dexterity: {value: 2},
                    stamina: {value: 2}
                },
                priorities: _.shuffle(["social", "mental", "physical"])
            },
            pathPriorities: _.shuffle(["role", "origin", "pantheon"])
        },
        itemCreateData: [
            {
                name: "Origin",
                type: "path",
                data: {
                    type: "origin",
                    title: "Carefree Wanderer with Luck On His Side",
                    skills: [],
                    connections: [],
                    connectionDescription: "Hoboes, Vagrants, Criminals, Transport Networks, Urban Safe Spots",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Interesting Times",
                    type: "pathSuspension",
                    description: "2's on any d10's count as 1's when determining botches.",
                    resolution: "Rhys suffers the effect of a botch.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "origin"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Knife in the Back",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "origin"
                }
            },
            {
                name: "Role",
                type: "path",
                data: {
                    type: "role",
                    title: "No Heaven Frontman",
                    skills: [],
                    connections: [],
                    connectionDescription: "Paparazzi, Media, Celebrities, The Promise (Cult), Exclusive Areas, Wealth",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Tone Deaf",
                    type: "pathSuspension",
                    description: "-2 penalty to all Culture (Music) rolls.",
                    resolution: "Rhys suffers significant consequences from failing a Culture (Music) roll.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "role"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Nickelback 2.0",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "role"
                }
            },
            {
                name: "Pantheon",
                type: "path",
                data: {
                    type: "pantheon",
                    title: "Scion of Aengus, Step-Scion of the Morrigan",
                    skills: [],
                    connections: [],
                    connectionDescription: "Adoring Fans, Obsessed Goths, Accompaniment, Age Is No Obstacle",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Murder of Crows",
                    type: "pathSuspension",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                    resolution: "Rhys follows the command, or makes a major sacrifice to the Morrigan.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "pantheon"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Forced to Choose",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "pantheon"
                }
            }
        ]
    },
    "Adonis Rhodes": {
        actorData: {
            genesis: "born",
            pantheon: "theoi",
            patron: "aphrodite",
            divineTitle: "\"Steward of the Heart\"",
            attributes: {
                favoredApproach: "finesse",
                list: {
                    presence: {value: 3},
                    manipulation: {value: 5},
                    composure: {value: 3},
                    intellect: {value: 2},
                    cunning: {value: 4},
                    resolve: {value: 2},
                    might: {value: 2},
                    dexterity: {value: 5},
                    stamina: {value: 2}
                },
                priorities: _.shuffle(["social", "mental", "physical"])
            },
            pathPriorities: _.shuffle(["role", "origin", "pantheon"])
        },
        itemCreateData: [
            {
                name: "Origin",
                type: "path",
                data: {
                    type: "origin",
                    title: "Carefree Wanderer with Luck On His Side",
                    skills: [],
                    connections: [],
                    connectionDescription: "Hoboes, Vagrants, Criminals, Transport Networks, Urban Safe Spots",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Interesting Times",
                    type: "pathSuspension",
                    description: "2's on any d10's count as 1's when determining botches.",
                    resolution: "Rhys suffers the effect of a botch.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "origin"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Knife in the Back",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "origin"
                }
            },
            {
                name: "Role",
                type: "path",
                data: {
                    type: "role",
                    title: "No Heaven Frontman",
                    skills: [],
                    connections: [],
                    connectionDescription: "Paparazzi, Media, Celebrities, The Promise (Cult), Exclusive Areas, Wealth",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Tone Deaf",
                    type: "pathSuspension",
                    description: "-2 penalty to all Culture (Music) rolls.",
                    resolution: "Rhys suffers significant consequences from failing a Culture (Music) roll.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "role"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Nickelback 2.0",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "role"
                }
            },
            {
                name: "Pantheon",
                type: "path",
                data: {
                    type: "pantheon",
                    title: "Scion of Aengus, Step-Scion of the Morrigan",
                    skills: [],
                    connections: [],
                    connectionDescription: "Adoring Fans, Obsessed Goths, Accompaniment, Age Is No Obstacle",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Murder of Crows",
                    type: "pathSuspension",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                    resolution: "Rhys follows the command, or makes a major sacrifice to the Morrigan.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "pantheon"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Forced to Choose",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "pantheon"
                }
            }
        ]
    },
    "Erik Donner": {
        actorData: {
            genesis: "born",
            pantheon: "aesir",
            patron: "thor",
            divineTitle: "\"Guardian of Midgard\"",
            attributes: {
                favoredApproach: "force",
                list: {
                    presence: {value: 4},
                    manipulation: {value: 1},
                    composure: {value: 4},
                    intellect: {value: 3},
                    cunning: {value: 2},
                    resolve: {value: 2},
                    might: {value: 5},
                    dexterity: {value: 2},
                    stamina: {value: 5}
                },
                priorities: _.shuffle(["social", "mental", "physical"])
            },
            pathPriorities: _.shuffle(["role", "origin", "pantheon"])
        },
        itemCreateData: [
            {
                name: "Origin",
                type: "path",
                data: {
                    type: "origin",
                    title: "Carefree Wanderer with Luck On His Side",
                    skills: [],
                    connections: [],
                    connectionDescription: "Hoboes, Vagrants, Criminals, Transport Networks, Urban Safe Spots",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Interesting Times",
                    type: "pathSuspension",
                    description: "2's on any d10's count as 1's when determining botches.",
                    resolution: "Rhys suffers the effect of a botch.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "origin"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Knife in the Back",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "origin"
                }
            },
            {
                name: "Role",
                type: "path",
                data: {
                    type: "role",
                    title: "No Heaven Frontman",
                    skills: [],
                    connections: [],
                    connectionDescription: "Paparazzi, Media, Celebrities, The Promise (Cult), Exclusive Areas, Wealth",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Tone Deaf",
                    type: "pathSuspension",
                    description: "-2 penalty to all Culture (Music) rolls.",
                    resolution: "Rhys suffers significant consequences from failing a Culture (Music) roll.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "role"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Nickelback 2.0",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "role"
                }
            },
            {
                name: "Pantheon",
                type: "path",
                data: {
                    type: "pantheon",
                    title: "Scion of Aengus, Step-Scion of the Morrigan",
                    skills: [],
                    connections: [],
                    connectionDescription: "Adoring Fans, Obsessed Goths, Accompaniment, Age Is No Obstacle",
                    conditions: {
                        pathSuspension: null,
                        pathRevocation: null
                    }
                }
            },
            {
                name: "Suspension",
                type: "condition",
                data: {
                    title: "Murder of Crows",
                    type: "pathSuspension",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.",
                    resolution: "Rhys follows the command, or makes a major sacrifice to the Morrigan.",
                    effects: [],
                    isPersistent: false,
                    linkedItem: "pantheon"
                }
            },
            {
                name: "Revocation",
                type: "condition",
                data: {
                    title: "Forced to Choose",
                    type: "pathRevocation",
                    description: "",
                    resolution: "",
                    effects: [],
                    isPersistent: true,
                    linkedItem: "pantheon"
                }
            }
        ]
    }
};
