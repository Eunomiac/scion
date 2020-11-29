export const baseConstants = {
    noCapTitleCase: ["above", "after", "at", "below", "by", "down", "for", "from", "in", "onto", "of", "off", "on", "out", "to", "under", "up", "with", "for", "and", "nor", "but", "or", "yet", "so", "the", "an", "a"]
};
export const scionSystemData = {
    TIERS: {
        mortal: "scion.tiers.mortal",
        hero: "scion.tiers.hero",
        demigod: "scion.tiers.demigod",
        god: "scion.tiers.god"
    },
    PANTHEONS: {
        aesir: {
            label: "scion.pantheons.aesir",
            description: "scion.pantheonDescriptions.aesir",
            assetSkills: ["closeCombat", "occult"],
            pantheonPurview: "wyrd",
            virtues: ["fatalism", "audacity"],
            scentTheDivine: "scion.scentTheDivine.aesir",
            religion: "scion.religions.aesir",
            members: ["baldr", "bragi", "freya", "freyr", "frigg", "heimdall", "hel", "loki", "njörðr", "odin", "sif", "skaði", "thor", "tyr"],
            bookRef: "scion.books.hero",
            bookPage: 46
        },
        deva: {
            label: "scion.pantheons.deva",
            description: "scion.pantheonDescriptions.deva",
            assetSkills: ["athletics", "survival"],
            pantheonPurview: "yoga",
            virtues: ["conscience", "duty"],
            scentTheDivine: "scion.scentTheDivine.deva",
            religion: "scion.religions.deva",
            members: ["agni", "durga", "ganesha", "indra", "kali", "karttikeya", "lakshmi", "parvati", "sarasvati", "shiva", "surya", "varuna", "vishnu", "vishvakarman", "yamaraja"],
            bookRef: "scion.books.hero",
            bookPage: 58
        },
        kami: {
            label: "scion.pantheons.kami",
            description: "scion.pantheonDescriptions.kami",
            assetSkills: ["culture", "persuasion"],
            pantheonPurview: "yaoyorozuNoKamigami",
            virtues: ["sincerety", "rightAction"],
            scentTheDivine: "scion.scentTheDivine.kami",
            religion: "scion.religions.kami",
            members: ["amaNoUzume", "amaterasu", "benzaiten", "bishamon", "ebisu", "fukurokuju", "hachiman", "hotei", "inari", "kisshōten", "ōkuninushi", "omoikane", "sarutahiko", "susanoO", "takemikazuchi", "tsukiyomi"],
            bookRef: "scion.books.hero",
            bookPage: 70
        },
        loa: {
            label: "scion.pantheons.loa",
            description: "scion.pantheonDescriptions.loa",
            assetSkills: ["medicine", "subterfuge"],
            pantheonPurview: "cheval",
            virtues: ["tradition", "innovation"],
            scentTheDivine: "scion.scentTheDivine.loa",
            religion: "scion.religions.loa",
            members: ["baronCimetière", "baronLaCroix", "baronSamedi", "damballa", "ezili", "kalfu", "lasyren", "ogou", "papaLegba"],
            bookRef: "scion.books.hero",
            bookPage: 32
        },
        manitou: {
            label: "scion.pantheons.manitou",
            description: "scion.pantheonDescriptions.manitou",
            assetSkills: ["medicine", "occult"],
            pantheonPurview: "dodaem",
            virtues: ["pride", "dream"],
            scentTheDivine: "scion.scentTheDivine.manitou",
            religion: "scion.religions.manitou",
            members: ["biboonike", "cheebyAubOozoo", "geezhigoQuae", "ioskeha", "maudjeeKawiss", "muzzuKumikQuae", "nana", "pukawiss", "tawiscara", "winonah"],
            bookRef: "scion.books.hero",
            bookPage: 82
        },
        netjer: {
            label: "scion.pantheons.netjer",
            description: "scion.pantheonDescriptions.netjer",
            assetSkills: ["academics", "occult"],
            pantheonPurview: "heku",
            virtues: ["balance", "justice"],
            scentTheDivine: "scion.scentTheDivine.netjer",
            religion: "scion.religions.netjer",
            members: ["anubis", "atum", "bastet", "hathor", "horus", "isis", "osiris", "ptah", "ra", "set", "sobek", "thoth", "upuaut"],
            bookRef: "scion.books.hero",
            bookPage: 94
        },
        shen: {
            label: "scion.pantheons.shen",
            description: "scion.pantheonDescriptions.shen",
            assetSkills: ["academics", "leadership"],
            pantheonPurview: "tianming",
            virtues: ["yin", "yang"],
            scentTheDivine: "scion.scentTheDivine.shen",
            religion: "scion.religions.shen",
            members: ["changE", "confucius", "doumu", "erlang", "fuxi", "guanYu", "guanshiyinPusa", "huangdi", "laozi", "nuwā", "princeNezha", "sunWukong", "yandiShennongshi"],
            bookRef: "scion.books.hero",
            bookPage: 118
        },
        teotl: {
            label: "scion.pantheons.teotl",
            description: "scion.pantheonDescriptions.teotl",
            assetSkills: ["culture", "empathy"],
            pantheonPurview: "nextlahualli",
            virtues: ["hunger", "sacrifice"],
            scentTheDivine: "scion.scentTheDivine.teotl",
            religion: "scion.religions.teotl",
            members: ["chalchihuitlicue", "chantico", "chicoAndCenteo", "huehuecoyotl", "huītzilōpōchtli", "ītzpāpālōtl", "mictecacihuatl", "quetzalcoatl", "tezcatlipoca", "tlāloc", "xīpeTotēc", "xochipilli", "xochiquetzal", "xolotl"],
            bookRef: "scion.books.hero",
            bookPage: 130
        },
        theoi: {
            label: "scion.pantheons.theoi",
            description: "scion.pantheonDescriptions.theoi",
            assetSkills: ["empathy", "persuasion"],
            pantheonPurview: "metamorphosis",
            virtues: ["egotism", "kinship"],
            scentTheDivine: "scion.scentTheDivine.theoi",
            religion: "scion.religions.theoi",
            members: ["aphrodite", "apollo", "ares", "artemis", "athena", "demeter", "dionysus", "epona", "hades", "hecate", "hephaestus", "hera", "hermes", "hestia", "persephone", "poseidon", "zeus"],
            bookRef: "scion.books.hero",
            bookPage: 142
        },
        tuathaDeDanann: {
            label: "scion.pantheons.tuathaDeDanann",
            description: "scion.pantheonDescriptions.tuathaDeDanann",
            assetSkills: ["closeCombat", "culture"],
            pantheonPurview: "geasa",
            virtues: ["honor", "prowess"],
            scentTheDivine: "scion.scentTheDivine.tuathaDeDanann",
            religion: "scion.religions.tuathaDeDanann",
            members: ["aengus", "brigid", "dianCécht", "donn", "ériu", "goibniu", "lugh", "macLir", "midir", "nuada", "ogma", "theDagda", "morrigan"],
            bookRef: "scion.books.hero",
            bookPage: 154
        },
        nemetondevos: {
            label: "scion.pantheons.nemetondevos",
            description: "scion.pantheonDescriptions.nemetondevos",
            assetSkills: ["closeCombat", "survival"],
            pantheonPurview: "nemeton",
            virtues: ["memory", "purgation"],
            scentTheDivine: "scion.scentTheDivine.nemetondevos",
            religion: "scion.religions.nemetondevos",
            members: ["andarta", "belenos", "cernunnos", "esos", "gobannos", "nantosuelta", "nehalAndNodens", "sulis", "taranis"],
            bookRef: "scion.books.motw",
            bookPage: 38
        },
        orisha: {
            label: "scion.pantheons.orisha",
            description: "scion.pantheonDescriptions.orisha",
            assetSkills: ["medicine", "subterfuge"],
            pantheonPurview: "cheval",
            virtues: ["tradition", "innovation"],
            scentTheDivine: "scion.scentTheDivine.orisha",
            religion: "scion.religions.orisha",
            members: ["erinle", "èshùElègbará", "ìbejì", "morèmi", "obàtálá", "odùduwà", "ògún", "òrìshàOko", "òrúnmìlà", "òsanyìn", "oshóssí", "òshun", "oyaIyansan", "shàngó", "sònpònná", "yemojaOboto"],
            bookRef: "scion.books.hero",
            bookPage: 106
        },
        yazata: {
            label: "scion.pantheons.yazata",
            description: "scion.pantheonDescriptions.yazata",
            assetSkills: ["integrity", "leadership"],
            pantheonPurview: "asha",
            virtues: ["honesty", "freeWill"],
            scentTheDivine: "scion.scentTheDivine.yazata",
            religion: "scion.religions.yazata",
            members: ["anahita", "ashi", "atar", "haoma", "hvareKhshaeta", "mangha", "mithra", "rashnu", "sraosha", "tishtrya", "vanant", "vataVayu", "verethragna", "zam", "zarathustra"],
            bookRef: "scion.books.motw",
            bookPage: 50
        },
        teros: {
            label: "scion.pantheons.teros",
            description: "scion.pantheonDescriptions.teros",
            assetSkills: ["science", "technology"],
            pantheonPurview: "demiurgy",
            virtues: ["nostalgia", "vision"],
            scentTheDivine: "scion.scentTheDivine.teros",
            religion: "scion.religions.teros",
            members: ["aeva", "ytar", "amnis", "badaris", "kuros", "demosia", "hesbon", "skaft", "versak"],
            bookRef: "scion.books.motw",
            bookPage: 80
        }
    },
    GODS: {
        baldr: {
            label: "scion.gods.baldr",
            pantheon: "aesir",
            mantle: "scion.mantles.baldr",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["guardian", "liminal", "lover"],
            purviews: ["beauty", "passion:Love|Peace", "health", "epicStamina", "sun"]
        },
        bragi: {
            label: "scion.gods.bragi",
            pantheon: "aesir",
            mantle: "scion.mantles.bragi",
            bookRef: "scion.books.motw",
            bookPage: 63,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:Storytelling|Poetry|Song", "epicDexterity", "fortune", "passion:Joy"]
        },
        freya: {
            label: "scion.gods.freya",
            pantheon: "aesir",
            mantle: "scion.mantles.freya",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["lover", "guardian", "sage"],
            purviews: ["beauty", "epicStamina", "fertility", "fortune", "passion:Love|Lust", "war"]
        },
        freyr: {
            label: "scion.gods.freyr",
            pantheon: "aesir",
            mantle: "scion.mantles.freyr",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["lover", "warrior", "leader"],
            purviews: ["beauty", "fertility", "order", "war", "wild"]
        },
        frigg: {
            label: "scion.gods.frigg",
            pantheon: "aesir",
            mantle: "scion.mantles.frigg",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Falcon", "fortune", "order", "wild"]
        },
        heimdall: {
            label: "scion.gods.heimdall",
            pantheon: "aesir",
            mantle: "scion.mantles.heimdall",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "hunter"],
            purviews: ["artistry:Horns", "beauty", "epicStamina", "journeys"]
        },
        hel: {
            label: "scion.gods.hel",
            pantheon: "aesir",
            mantle: "scion.mantles.hel",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "forge", "frost", "health", "passion:Fear|Disgust"]
        },
        loki: {
            label: "scion.gods.loki",
            pantheon: "aesir",
            mantle: "scion.mantles.loki",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["chaos", "deception", "epicStrength", "fire"]
        },
        njörðr: {
            label: "scion.gods.njörðr",
            pantheon: "aesir",
            mantle: "scion.mantles.njörðr",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["fertility", "fire", "journeys", "prosperity", "sky", "water"]
        },
        odin: {
            label: "scion.gods.odin",
            pantheon: "aesir",
            mantle: "scion.mantles.odin",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "death", "deception", "epicStamina", "fortune", "journeys", "war"]
        },
        sif: {
            label: "scion.gods.sif",
            pantheon: "aesir",
            mantle: "scion.mantles.sif",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "earth", "fertility", "order"]
        },
        skaði: {
            label: "scion.gods.skaði",
            pantheon: "aesir",
            mantle: "scion.mantles.skaði",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["hunter", "judge", "warrior"],
            purviews: ["earth", "epicDexterity", "frost", "journeys", "order"]
        },
        thor: {
            label: "scion.gods.thor",
            pantheon: "aesir",
            mantle: "scion.mantles.thor",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["epicStamina", "epicStrength", "fertility", "sky"]
        },
        tyr: {
            label: "scion.gods.tyr",
            pantheon: "aesir",
            mantle: "scion.mantles.tyr",
            bookRef: "scion.books.hero",
            bookPage: 46,
            callings: ["judge", "leader", "warrior"],
            purviews: ["epicStamina", "order", "passion:Courage", "war"]
        },
        agni: {
            label: "scion.gods.agni",
            pantheon: "deva",
            mantle: "scion.mantles.agni",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "journeys", "prosperity", "water"]
        },
        durga: {
            label: "scion.gods.durga",
            pantheon: "deva",
            mantle: "scion.mantles.durga",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["deception", "epicStrength", "epicDexterity", "epicStamina", "fertility", "war"]
        },
        ganesha: {
            label: "scion.gods.ganesha",
            pantheon: "deva",
            mantle: "scion.mantles.ganesha",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["artistry:Dance|Writing", "beasts:Elephants", "chaos", "fortune", "journeys", "prosperity"]
        },
        indra: {
            label: "scion.gods.indra",
            pantheon: "deva",
            mantle: "scion.mantles.indra",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Cattle", "epicStrength", "epicDexterity", "fertility", "order", "sky", "war", "wild"]
        },
        kali: {
            label: "scion.gods.kali",
            pantheon: "deva",
            mantle: "scion.mantles.kali",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["epicStrength", "epicDexterity", "epicStamina", "artistry:Dance", "chaos", "darkness", "death", "deception", "fire"]
        },
        karttikeya: {
            label: "scion.gods.karttikeya",
            pantheon: "deva",
            mantle: "scion.mantles.karttikeya",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["leader", "sage", "warrior"],
            purviews: ["beauty", "epicStrength", "epicDexterity", "epicStamina", "stars", "war"]
        },
        lakshmi: {
            label: "scion.gods.lakshmi",
            pantheon: "deva",
            mantle: "scion.mantles.lakshmi",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "epicStrength", "earth", "fertility", "fortune", "order", "passion:Joy|Love", "prosperity"]
        },
        parvati: {
            label: "scion.gods.parvati",
            pantheon: "deva",
            mantle: "scion.mantles.parvati",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["creator", "lover", "trickster"],
            purviews: ["epicStrength", "epicStamina", "artistry:Dance", "beauty", "earth", "fertility", "frost", "passion:Devotion|Love"]
        },
        sarasvati: {
            label: "scion.gods.sarasvati",
            pantheon: "deva",
            mantle: "scion.mantles.sarasvati",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:All", "epicStrength", "epicDexterity", "health", "water"]
        },
        shiva: {
            label: "scion.gods.shiva",
            pantheon: "deva",
            mantle: "scion.mantles.shiva",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["hunter", "lover", "sage"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "chaos", "death", "deception", "epicStrength", "epicDexterity", "epicStamina", "epicStrength", "fertility", "fire", "Moon", "Sky"]
        },
        surya: {
            label: "scion.gods.surya",
            pantheon: "deva",
            mantle: "scion.mantles.surya",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["healer", "leader", "sage"],
            purviews: ["epicStrength", "epicDexterity", "fire", "health", "journeys", "stars", "sun"]
        },
        varuna: {
            label: "scion.gods.varuna",
            pantheon: "deva",
            mantle: "scion.mantles.varuna",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "judge", "leader"],
            purviews: ["epicStrength", "darkness", "fertility", "order", "sky", "sun", "water"]
        },
        vishnu: {
            label: "scion.gods.vishnu",
            pantheon: "deva",
            mantle: "scion.mantles.vishnu",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:Dance|Wind Instruments", "beauty", "deception", "epicStamina", "epicStrength", "epicDexterity", "order", "passion:Hope"]
        },
        vishvakarman: {
            label: "scion.gods.vishvakarman",
            pantheon: "deva",
            mantle: "scion.mantles.vishvakarman",
            bookRef: "scion.books.motw",
            bookPage: 64,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:All", "beasts:Doves", "chaos", "forge", "order", "prosperity"]
        },
        yamaraja: {
            label: "scion.gods.yamaraja",
            pantheon: "deva",
            mantle: "scion.mantles.yamaraja",
            bookRef: "scion.books.hero",
            bookPage: 58,
            callings: ["judge", "leader", "liminal"],
            purviews: ["epicDexterity", "epicStamina", "darkness", "death", "journeys", "order"]
        },
        amaNoUzume: {
            label: "scion.gods.amaNoUzume",
            pantheon: "kami",
            mantle: "scion.mantles.amaNoUzume",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Dance|Singing", "deception", "passion:Lust|Mirth"]
        },
        amaterasu: {
            label: "scion.gods.amaterasu",
            pantheon: "kami",
            mantle: "scion.mantles.amaterasu",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["judge", "leader", "sage"],
            purviews: ["epicStrength", "fertility", "order", "prosperity", "sun"]
        },
        benzaiten: {
            label: "scion.gods.benzaiten",
            pantheon: "kami",
            mantle: "scion.mantles.benzaiten",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["creator", "lover", "sage"],
            purviews: ["artistry", "beast:Snake", "beauty", "fertility", "fortune", "stars"]
        },
        bishamon: {
            label: "scion.gods.bishamon",
            pantheon: "kami",
            mantle: "scion.mantles.bishamon",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["epicDexterity", "fortune", "prosperity", "war"]
        },
        ebisu: {
            label: "scion.gods.ebisu",
            pantheon: "kami",
            mantle: "scion.mantles.ebisu",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["beasts:Fish|Sharks|Whales", "epicStamina", "fortune", "prosperity", "wild"]
        },
        fukurokuju: {
            label: "scion.gods.fukurokuju",
            pantheon: "kami",
            mantle: "scion.mantles.fukurokuju",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Deer|Turtle|Crane", "epicStamina", "health", "fortune"]
        },
        hachiman: {
            label: "scion.gods.hachiman",
            pantheon: "kami",
            mantle: "scion.mantles.hachiman",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["leader", "sage", "warrior"],
            purviews: ["artistry:All", "beasts:Dove", "order", "prosperity", "war"]
        },
        hotei: {
            label: "scion.gods.hotei",
            pantheon: "kami",
            mantle: "scion.mantles.hotei",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["chaos", "fortune", "journeys", "passion:Joy"]
        },
        inari: {
            label: "scion.gods.inari",
            pantheon: "kami",
            mantle: "scion.mantles.inari",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["creator", "healer", "liminal"],
            purviews: ["beasts:Fox", "fertility", "fortune", "health", "journeys", "prosperity"]
        },
        kisshōten: {
            label: "scion.gods.kisshōten",
            pantheon: "kami",
            mantle: "scion.mantles.kisshōten",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["guardian", "healer", "lover"],
            purviews: ["beauty", "fortune", "health"]
        },
        ōkuninushi: {
            label: "scion.gods.ōkuninushi",
            pantheon: "kami",
            mantle: "scion.mantles.ōkuninushi",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["creator", "leader", "liminal"],
            purviews: ["beasts:All", "earth", "darkness", "fortune", "prosperity"]
        },
        omoikane: {
            label: "scion.gods.omoikane",
            pantheon: "kami",
            mantle: "scion.mantles.omoikane",
            bookRef: "scion.books.motw",
            bookPage: 65,
            callings: ["judge", "sage", "trickster"],
            purviews: ["artistry:Rhetoric", "deception", "order", "prosperity", "sky"]
        },
        sarutahiko: {
            label: "scion.gods.sarutahiko",
            pantheon: "kami",
            mantle: "scion.mantles.sarutahiko",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["lover", "sage", "warrior"],
            purviews: ["beasts:Monkeys", "earth", "journeys"]
        },
        susanoO: {
            label: "scion.gods.susanoO",
            pantheon: "kami",
            mantle: "scion.mantles.susanoO",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["artistry:Poetry", "chaos", "death", "epicStrength", "forge", "sky", "water"]
        },
        takemikazuchi: {
            label: "scion.gods.takemikazuchi",
            pantheon: "kami",
            mantle: "scion.mantles.takemikazuchi",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Deer", "epicDexterity", "epicStamina", "epicStrength", "sky:Thunder", "war"]
        },
        tsukiyomi: {
            label: "scion.gods.tsukiyomi",
            pantheon: "kami",
            mantle: "scion.mantles.tsukiyomi",
            bookRef: "scion.books.hero",
            bookPage: 70,
            callings: ["healer", "liminal", "judge"],
            purviews: ["artistry", "darkness", "moon", "order"]
        },
        baronCimetière: {
            label: "scion.gods.baronCimetière",
            pantheon: "loa",
            mantle: "scion.mantles.baronCimetière",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["darkness", "death", "epicStamina", "health"]
        },
        baronLaCroix: {
            label: "scion.gods.baronLaCroix",
            pantheon: "loa",
            mantle: "scion.mantles.baronLaCroix",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["judge", "guardian", "sage"],
            purviews: ["death", "epicStamina", "fortune", "health"]
        },
        baronSamedi: {
            label: "scion.gods.baronSamedi",
            pantheon: "loa",
            mantle: "scion.mantles.baronSamedi",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["judge", "lover", "trickster"],
            purviews: ["chaos", "death", "epicStamina", "fertility", "health"]
        },
        damballa: {
            label: "scion.gods.damballa",
            pantheon: "loa",
            mantle: "scion.mantles.damballa",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Snakes", "earth", "fertility", "order", "sky", "water"]
        },
        ezili: {
            label: "scion.gods.ezili",
            pantheon: "loa",
            mantle: "scion.mantles.ezili",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"]
        },
        kalfu: {
            label: "scion.gods.kalfu",
            pantheon: "loa",
            mantle: "scion.mantles.kalfu",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["chaos", "darkness", "fortune", "journeys", "moon"]
        },
        lasyren: {
            label: "scion.gods.lasyren",
            pantheon: "loa",
            mantle: "scion.mantles.lasyren",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"]
        },
        ogou: {
            label: "scion.gods.ogou",
            pantheon: "loa",
            mantle: "scion.mantles.ogou",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"]
        },
        papaLegba: {
            label: "scion.gods.papaLegba",
            pantheon: "loa",
            mantle: "scion.mantles.papaLegba",
            bookRef: "scion.books.motw",
            bookPage: 32,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"]
        },
        biboonike: {
            label: "scion.gods.biboonike",
            pantheon: "manitou",
            mantle: "scion.mantles.biboonike",
            bookRef: "scion.books.motw",
            bookPage: 65,
            callings: ["hunter", "liminal", "trickster"],
            purviews: ["chaos", "darkness", "frost", "sky", "wild"]
        },
        cheebyAubOozoo: {
            label: "scion.gods.cheebyAubOozoo",
            pantheon: "manitou",
            mantle: "scion.mantles.cheebyAubOozoo",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["hunter", "judge", "liminal"],
            purviews: ["artistry:Song|Music", "beasts:Wolf", "darkness", "death", "epicStamina", "order"]
        },
        geezhigoQuae: {
            label: "scion.gods.geezhigoQuae",
            pantheon: "manitou",
            mantle: "scion.mantles.geezhigoQuae",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "sage"],
            purviews: ["beasts:Crane|Turtle", "moon", "order", "sky", "stars"]
        },
        ioskeha: {
            label: "scion.gods.ioskeha",
            pantheon: "manitou",
            mantle: "scion.mantles.ioskeha",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["creator", "leader", "warrior"],
            purviews: ["forge", "sun", "sky", "order", "beasts:diurnal mammals and birds|insects|fish", "health", "passion:All light emotions"]
        },
        maudjeeKawiss: {
            label: "scion.gods.maudjeeKawiss",
            pantheon: "manitou",
            mantle: "scion.mantles.maudjeeKawiss",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["beasts:Bear|Eagle", "epicDexterity", "epicStrength", "war"]
        },
        muzzuKumikQuae: {
            label: "scion.gods.muzzuKumikQuae",
            pantheon: "manitou",
            mantle: "scion.mantles.muzzuKumikQuae",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:All", "earth", "fertility", "sky", "water", "wild"]
        },
        nana: {
            label: "scion.gods.nana",
            pantheon: "manitou",
            mantle: "scion.mantles.nana",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["hunter", "trickster", "warrior"],
            purviews: ["beasts:Rabbit", "chaos", "epicDexterity", "fortune", "journeys"]
        },
        pukawiss: {
            label: "scion.gods.pukawiss",
            pantheon: "manitou",
            mantle: "scion.mantles.pukawiss",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["lover", "sage", "trickster"],
            purviews: ["epicDexterity", "artistry:Dance|Acting|Storytelling", "passion:Mirth", "fortune", "deception"]
        },
        tawiscara: {
            label: "scion.gods.tawiscara",
            pantheon: "manitou",
            mantle: "scion.mantles.tawiscara",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["creator", "trickster", "warrior"],
            purviews: ["chaos", "deception", "darkness", "death", "passion:All dark emotions", "forge", "war"]
        },
        winonah: {
            label: "scion.gods.winonah",
            pantheon: "manitou",
            mantle: "scion.mantles.winonah",
            bookRef: "scion.books.hero",
            bookPage: 82,
            callings: ["guardian", "healer", "lover"],
            purviews: ["epicStamina", "fortune", "health", "passion:All", "prosperity"]
        },
        anubis: {
            label: "scion.gods.anubis",
            pantheon: "netjer",
            mantle: "scion.mantles.anubis",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beast:Jackal", "darkness", "death", "order"]
        },
        atum: {
            label: "scion.gods.atum",
            pantheon: "netjer",
            mantle: "scion.mantles.atum",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["creator", "healer", "sage"],
            purviews: ["artistry:Dance|Pottery", "beasts:Ram", "earth", "health", "water"]
        },
        bastet: {
            label: "scion.gods.bastet",
            pantheon: "netjer",
            mantle: "scion.mantles.bastet",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["artistry:Dance|Music", "beasts:Cats|Lions", "epicDexterity", "fertility", "fortune", "health", "moon", "sun", "war"]
        },
        hathor: {
            label: "scion.gods.hathor",
            pantheon: "netjer",
            mantle: "scion.mantles.hathor",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["creator", "lover", "healer"],
            purviews: ["artistry:Music|Dance", "beasts:Cow", "beauty", "fertility", "fortune", "passion:Love", "sky"]
        },
        horus: {
            label: "scion.gods.horus",
            pantheon: "netjer",
            mantle: "scion.mantles.horus",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Falcon", "moon", "order", "sky", "sun", "war"]
        },
        isis: {
            label: "scion.gods.isis",
            pantheon: "netjer",
            mantle: "scion.mantles.isis",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "healer", "trickster"],
            purviews: ["beasts:Kite|Serpent", "death", "deception", "fertility", "fortune", "health", "stars"]
        },
        osiris: {
            label: "scion.gods.osiris",
            pantheon: "netjer",
            mantle: "scion.mantles.osiris",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Ram|Centipede", "death", "earth", "fertility", "order"]
        },
        ptah: {
            label: "scion.gods.ptah",
            pantheon: "netjer",
            mantle: "scion.mantles.ptah",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["creator", "liminal", "sage"],
            purviews: ["beasts:Bull", "fire", "forge", "prosperity"]
        },
        ra: {
            label: "scion.gods.ra",
            pantheon: "netjer",
            mantle: "scion.mantles.ra",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["creator", "judge", "leader"],
            purviews: ["beasts:Falcon|Scarab|Ram", "death", "epicStamina", "fire", "journeys", "order", "sun"]
        },
        set: {
            label: "scion.gods.set",
            pantheon: "netjer",
            mantle: "scion.mantles.set",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "leader", "trickster"],
            purviews: ["beasts:Salawa|Fish", "chaos", "earth", "epicStrength", "journeys", "sky", "war"]
        },
        sobek: {
            label: "scion.gods.sobek",
            pantheon: "netjer",
            mantle: "scion.mantles.sobek",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "hunter", "lover"],
            purviews: ["beasts:Crocodile", "epicStamina", "passion:Lust", "fertility", "water"]
        },
        thoth: {
            label: "scion.gods.thoth",
            pantheon: "netjer",
            mantle: "scion.mantles.thoth",
            bookRef: "scion.books.hero",
            bookPage: 94,
            callings: ["guardian", "liminal", "sage"],
            purviews: ["beasts:Baboon|Ibis", "deception", "fortune", "health", "moon", "order"]
        },
        upuaut: {
            label: "scion.gods.upuaut",
            pantheon: "netjer",
            mantle: "scion.mantles.upuaut",
            bookRef: "scion.books.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "warrior"],
            purviews: ["beasts:Wolves", "death", "epicDexterity", "epicStamina", "journeys", "war"]
        },
        changE: {
            label: "scion.gods.changE",
            pantheon: "shen",
            mantle: "scion.mantles.changE",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["healer", "lover", "trickster"],
            purviews: ["beasts:Rabbits|Toads", "beauty", "epicStamina", "health", "moon"]
        },
        confucius: {
            label: "scion.gods.confucius",
            pantheon: "shen",
            mantle: "scion.mantles.confucius",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["judge", "leader", "sage"],
            purviews: ["artistry:All", "order", "passion:Filiality"]
        },
        doumu: {
            label: "scion.gods.doumu",
            pantheon: "shen",
            mantle: "scion.mantles.doumu",
            bookRef: "scion.books.motw",
            bookPage: 67,
            callings: ["judge", "leader", "sage"],
            purviews: ["beasts:Boars", "fortune", "order", "prosperity", "stars"]
        },
        erlang: {
            label: "scion.gods.erlang",
            pantheon: "shen",
            mantle: "scion.mantles.erlang",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["guardian", "hunter", "warrior"],
            purviews: ["epicStamina", "epicStrength", "forge", "war", "water"]
        },
        fuxi: {
            label: "scion.gods.fuxi",
            pantheon: "shen",
            mantle: "scion.mantles.fuxi",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["creator", "hunter", "sage"],
            purviews: ["artistry:Musical Instruments|Writing", "beasts:All", "fertility", "forge", "fortune", "health", "order", "sun"]
        },
        guanYu: {
            label: "scion.gods.guanYu",
            pantheon: "shen",
            mantle: "scion.mantles.guanYu",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["artistry:Historical Fiction", "epicStrength", "epicStamina", "order", "passion:Loyalty", "prosperity", "sky", "war"]
        },
        guanshiyinPusa: {
            label: "scion.gods.guanshiyinPusa",
            pantheon: "shen",
            mantle: "scion.mantles.guanshiyinPusa",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["guardian", "healer", "sage"],
            purviews: ["deception", "epicStamina", "health", "journeys", "passion:Mercy", "water"]
        },
        huangdi: {
            label: "scion.gods.huangdi",
            pantheon: "shen",
            mantle: "scion.mantles.huangdi",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:All", "death", "earth", "forge", "health", "order", "prosperity", "war"]
        },
        laozi: {
            label: "scion.gods.laozi",
            pantheon: "shen",
            mantle: "scion.mantles.laozi",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["leader", "sage", "trickster"],
            purviews: ["artistry:Poetry", "chaos", "darkness", "epicStamina", "health", "order", "water"]
        },
        nuwā: {
            label: "scion.gods.nuwā",
            pantheon: "shen",
            mantle: "scion.mantles.nuwā",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["creator", "guardian", "healer"],
            purviews: ["earth", "fertility", "forge", "health", "moon", "sky"]
        },
        princeNezha: {
            label: "scion.gods.princeNezha",
            pantheon: "shen",
            mantle: "scion.mantles.princeNezha",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["artistry:Animation", "epicStamina", "epicStrength", "health", "war"]
        },
        sunWukong: {
            label: "scion.gods.sunWukong",
            pantheon: "shen",
            mantle: "scion.mantles.sunWukong",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["liminal", "trickster", "warrior"],
            purviews: ["artistry:Opera", "beasts:Monkey", "chaos", "deception", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"]
        },
        yandiShennongshi: {
            label: "scion.gods.yandiShennongshi",
            pantheon: "shen",
            mantle: "scion.mantles.yandiShennongshi",
            bookRef: "scion.books.hero",
            bookPage: 118,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Storytelling", "epicStamina", "fertility", "fire", "forge", "health", "prosperity"]
        },
        chalchihuitlicue: {
            label: "scion.gods.chalchihuitlicue",
            pantheon: "teotl",
            mantle: "scion.mantles.chalchihuitlicue",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Aquatic Animal", "fertility", "water"]
        },
        chantico: {
            label: "scion.gods.chantico",
            pantheon: "teotl",
            mantle: "scion.mantles.chantico",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["healer", "liminal", "sage"],
            purviews: ["fire", "forge", "order", "prosperity"]
        },
        chicoAndCenteo: {
            label: "scion.gods.chicoAndCenteo",
            pantheon: "teotl",
            mantle: "scion.mantles.chicoAndCenteo",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["healer", "guardian", "judge"],
            purviews: ["earth", "fertility", "prosperity"]
        },
        huehuecoyotl: {
            label: "scion.gods.huehuecoyotl",
            pantheon: "teotl",
            mantle: "scion.mantles.huehuecoyotl",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["lover", "sage", "trickster"],
            purviews: ["chaos", "epicDexterity", "passion:All"]
        },
        huītzilōpōchtli: {
            label: "scion.gods.huītzilōpōchtli",
            pantheon: "teotl",
            mantle: "scion.mantles.huītzilōpōchtli",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts:Eagle|Hummingbird", "death", "epicStrength", "prosperity", "sun", "war"]
        },
        ītzpāpālōtl: {
            label: "scion.gods.ītzpāpālōtl",
            pantheon: "teotl",
            mantle: "scion.mantles.ītzpāpālōtl",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["hunter", "lover", "warrior"],
            purviews: ["beasts:All", "darkness", "death", "fertility", "stars", "war"]
        },
        mictecacihuatl: {
            label: "scion.gods.mictecacihuatl",
            pantheon: "teotl",
            mantle: "scion.mantles.mictecacihuatl",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["guardian", "leader", "sage"],
            purviews: ["beasts:Bats|Owls|Spiders", "darkness", "death", "passion:All"]
        },
        quetzalcoatl: {
            label: "scion.gods.quetzalcoatl",
            pantheon: "teotl",
            mantle: "scion.mantles.quetzalcoatl",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Writing|Feathers", "beasts:All", "fertility", "journeys", "order", "sky", "stars"]
        },
        tezcatlipoca: {
            label: "scion.gods.tezcatlipoca",
            pantheon: "teotl",
            mantle: "scion.mantles.tezcatlipoca",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["hunter", "leader", "trickster"],
            purviews: ["beasts:Jaguar|Turkey", "chaos", "darkness", "deception", "earth", "fortune", "war"]
        },
        tlāloc: {
            label: "scion.gods.tlāloc",
            pantheon: "teotl",
            mantle: "scion.mantles.tlāloc",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["death", "earth", "fertility", "frost", "health", "sky"]
        },
        xīpeTotēc: {
            label: "scion.gods.xīpeTotēc",
            pantheon: "teotl",
            mantle: "scion.mantles.xīpeTotēc",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["creator", "healer", "hunter"],
            purviews: ["fertility", "forge", "health", "war"]
        },
        xochipilli: {
            label: "scion.gods.xochipilli",
            pantheon: "teotl",
            mantle: "scion.mantles.xochipilli",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["artistry:All", "beauty", "fortune", "passion:All", "prosperity"]
        },
        xochiquetzal: {
            label: "scion.gods.xochiquetzal",
            pantheon: "teotl",
            mantle: "scion.mantles.xochiquetzal",
            bookRef: "scion.books.hero",
            bookPage: 130,
            callings: ["creator", "guardian", "lover"],
            purviews: ["artistry:All", "beauty", "epicDexterity", "fertility", "fortune", "passion:All", "prosperity"]
        },
        xolotl: {
            label: "scion.gods.xolotl",
            pantheon: "teotl",
            mantle: "scion.mantles.xolotl",
            bookRef: "scion.books.motw",
            bookPage: 67,
            callings: ["creator", "hunter", "liminal"],
            purviews: ["beasts:Dogs", "chaos", "darkness", "death", "earth", "journeys"]
        },
        aphrodite: {
            label: "scion.gods.aphrodite",
            pantheon: "theoi",
            mantle: "scion.mantles.aphrodite",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "lover"],
            purviews: ["beauty", "fertility", "passion:Desire|Love", "prosperity"]
        },
        apollo: {
            label: "scion.gods.apollo",
            pantheon: "theoi",
            mantle: "scion.mantles.apollo",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["healer", "judge", "sage"],
            purviews: ["artistry", "epicDexterity", "health", "sun"]
        },
        ares: {
            label: "scion.gods.ares",
            pantheon: "theoi",
            mantle: "scion.mantles.ares",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "lover", "warrior"],
            purviews: ["chaos", "fertility", "order", "passion:Rage|Valor", "prosperity", "war"]
        },
        artemis: {
            label: "scion.gods.artemis",
            pantheon: "theoi",
            mantle: "scion.mantles.artemis",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "hunter"],
            purviews: ["beasts:All", "epicDexterity", "health", "moon", "wild"]
        },
        athena: {
            label: "scion.gods.athena",
            pantheon: "theoi",
            mantle: "scion.mantles.athena",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Weaving", "beasts:Owl", "epicDexterity", "order", "war"]
        },
        demeter: {
            label: "scion.gods.demeter",
            pantheon: "theoi",
            mantle: "scion.mantles.demeter",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["creator", "guardian", "judge"],
            purviews: ["earth", "epicStamina", "fertility", "order"]
        },
        dionysus: {
            label: "scion.gods.dionysus",
            pantheon: "theoi",
            mantle: "scion.mantles.dionysus",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["liminal", "lover", "sage"],
            purviews: ["artistry:Theatre", "chaos", "deception", "fertility", "passion:Ecstasy", "wild"]
        },
        epona: {
            label: "scion.gods.epona",
            pantheon: "theoi",
            mantle: "scion.mantles.epona",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "trickster", "warrior"],
            purviews: ["beasts:Horses", "fertility", "order", "war"]
        },
        hades: {
            label: "scion.gods.hades",
            pantheon: "theoi",
            mantle: "scion.mantles.hades",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["darkness", "death", "earth", "prosperity"]
        },
        hecate: {
            label: "scion.gods.hecate",
            pantheon: "theoi",
            mantle: "scion.mantles.hecate",
            bookRef: "scion.books.motw",
            bookPage: 68,
            callings: ["healer", "liminal", "sage"],
            purviews: ["beasts:Dogs", "darkness", "fortune", "journeys", "moon", "stars", "wild"]
        },
        hephaestus: {
            label: "scion.gods.hephaestus",
            pantheon: "theoi",
            mantle: "scion.mantles.hephaestus",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["creator", "sage", "trickster"],
            purviews: ["epicStamina", "fire", "forge", "fortune"]
        },
        hera: {
            label: "scion.gods.hera",
            pantheon: "theoi",
            mantle: "scion.mantles.hera",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["judge", "leader", "lover"],
            purviews: ["beauty", "fertility", "health", "order", "passion:Fidelity", "prosperity"]
        },
        hermes: {
            label: "scion.gods.hermes",
            pantheon: "theoi",
            mantle: "scion.mantles.hermes",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["liminal", "sage", "trickster"],
            purviews: ["death", "deception", "epicDexterity", "journeys", "prosperity"]
        },
        hestia: {
            label: "scion.gods.hestia",
            pantheon: "theoi",
            mantle: "scion.mantles.hestia",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "healer", "judge"],
            purviews: ["fire", "fortune", "order", "prosperity"]
        },
        persephone: {
            label: "scion.gods.persephone",
            pantheon: "theoi",
            mantle: "scion.mantles.persephone",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["judge", "leader", "liminal"],
            purviews: ["death", "fertility", "health"]
        },
        poseidon: {
            label: "scion.gods.poseidon",
            pantheon: "theoi",
            mantle: "scion.mantles.poseidon",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beasts:Horse", "epicStrength", "earth", "water"]
        },
        zeus: {
            label: "scion.gods.zeus",
            pantheon: "theoi",
            mantle: "scion.mantles.zeus",
            bookRef: "scion.books.hero",
            bookPage: 142,
            callings: ["leader", "lover", "trickster"],
            purviews: ["deception", "epicStrength", "epicStamina", "fortune", "order", "sky"]
        },
        aengus: {
            label: "scion.gods.aengus",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.aengus",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beasts:Bird", "beauty", "deception", "moon", "passion:Love"]
        },
        brigid: {
            label: "scion.gods.brigid",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.brigid",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["healer", "sage", "trickster"],
            purviews: ["artistry:Poetry", "fertility", "fire", "forge", "health"]
        },
        dianCécht: {
            label: "scion.gods.dianCécht",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.dianCécht",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["creator", "healer", "judge"],
            purviews: ["fertility", "health", "water"]
        },
        donn: {
            label: "scion.gods.donn",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.donn",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["leader", "liminal", "trickster"],
            purviews: ["darkness", "death", "journeys", "sky"]
        },
        ériu: {
            label: "scion.gods.ériu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.ériu",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["guardian", "judge", "leader"],
            purviews: ["earth", "fertility", "order", "prosperity"]
        },
        goibniu: {
            label: "scion.gods.goibniu",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.goibniu",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["creator", "sage", "warrior"],
            purviews: ["artistry:Brewing", "epicStamina", "forge", "health"]
        },
        lugh: {
            label: "scion.gods.lugh",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.lugh",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["creator", "leader", "warrior"],
            purviews: ["artistry:All", "epicDexterity", "epicStrength", "forge", "health", "order", "prosperity", "war"]
        },
        macLir: {
            label: "scion.gods.macLir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.macLir",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["guardian", "liminal", "trickster"],
            purviews: ["deception", "journeys", "prosperity", "stars", "water"]
        },
        midir: {
            label: "scion.gods.midir",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.midir",
            bookRef: "scion.books.motw",
            bookPage: 68,
            callings: ["deception", "earth", "fortune"],
            purviews: ["passion:Single-Mindedness"]
        },
        nuada: {
            label: "scion.gods.nuada",
            pantheon: "tuathaDeDanann",
            mantle: false,
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["leader", "sage", "warrior"],
            purviews: ["order", "prosperity", "war"]
        },
        ogma: {
            label: "scion.gods.ogma",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.ogma",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["guardian", "sage", "warrior"],
            purviews: ["artistry:Oration|Poetry", "epicStrength", "fortune", "wild"]
        },
        theDagda: {
            label: "scion.gods.theDagda",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.theDagda",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["guardian", "leader", "sage"],
            purviews: ["epicStamina", "epicStrength", "fertility", "forge", "prosperity", "war"]
        },
        morrigan: {
            label: "scion.gods.morrigan",
            pantheon: "tuathaDeDanann",
            mantle: "scion.mantles.morrigan",
            bookRef: "scion.books.hero",
            bookPage: 154,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beasts:Crows|Cattle|Horses", "chaos", "death", "epicDexterity", "fortune", "prosperity", "war"]
        },
        andarta: {
            label: "scion.gods.andarta",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.andarta",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["hunter", "leader", "warrior"],
            purviews: ["epicDexterity", "epicStamina", "fortune", "passion:Bravery", "war"]
        },
        belenos: {
            label: "scion.gods.belenos",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.belenos",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["healer", "liminal", "sage"],
            purviews: ["death", "health", "stars", "sun"]
        },
        cernunnos: {
            label: "scion.gods.cernunnos",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.cernunnos",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["creator", "guardian", "sage"],
            purviews: ["beasts:All Wild Animals", "prosperity", "wild"]
        },
        esos: {
            label: "scion.gods.esos",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.esos",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["artistry:Woodcarving", "epicStrength", "forge"]
        },
        gobannos: {
            label: "scion.gods.gobannos",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.gobannos",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["creator", "lover", "warrior"],
            purviews: ["epicStamina", "forge", "journeys", "prosperity"]
        },
        nantosuelta: {
            label: "scion.gods.nantosuelta",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.nantosuelta",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["guardian", "lover", "sage"],
            purviews: ["beasts:Bees|Birds", "fertility", "fire"]
        },
        nehalAndNodens: {
            label: "scion.gods.nehalAndNodens",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.nehalAndNodens",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "liminal"],
            purviews: ["beasts:Dogs|Marine Life", "fertility:Nehalennia ONLY", "health", "journeys", "prosperity", "water"]
        },
        sulis: {
            label: "scion.gods.sulis",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.sulis",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["guardian", "healer", "judge"],
            purviews: ["earth", "health", "water"]
        },
        taranis: {
            label: "scion.gods.taranis",
            pantheon: "nemetondevos",
            mantle: "scion.mantles.taranis",
            bookRef: "scion.books.motw",
            bookPage: 38,
            callings: ["judge", "liminal", "warrior"],
            purviews: ["chaos", "epicStrength", "sky"]
        },
        erinle: {
            label: "scion.gods.erinle",
            pantheon: "orisha",
            mantle: "scion.mantles.erinle",
            bookRef: "scion.books.motw",
            bookPage: 66,
            callings: ["hunter", "liminal", "lover"],
            purviews: ["beauty", "epicStamina", "epicStrength", "passion:Love", "prosperity", "water"]
        },
        èshùElègbará: {
            label: "scion.gods.èshùElègbará",
            pantheon: "orisha",
            mantle: "scion.mantles.èshùElègbará",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["liminal", "lover", "trickster"],
            purviews: ["artistry:Storytelling", "chaos", "deception", "epicDexterity", "fortune", "journeys"]
        },
        ìbejì: {
            label: "scion.gods.ìbejì",
            pantheon: "orisha",
            mantle: "scion.mantles.ìbejì",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["healer", "judge", "trickster"],
            purviews: ["artistry:Dance", "beasts:Monkeys", "death", "fertility", "fortune", "prosperity"]
        },
        morèmi: {
            label: "scion.gods.morèmi",
            pantheon: "orisha",
            mantle: "scion.mantles.morèmi",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["guardian", "lover", "trickster"],
            purviews: ["beauty", "deception", "fertility", "fire", "passion:All"]
        },
        obàtálá: {
            label: "scion.gods.obàtálá",
            pantheon: "orisha",
            mantle: "scion.mantles.obàtálá",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["creator", "judge", "leader"],
            purviews: ["artistry:Sculpture", "health", "order", "sky"]
        },
        odùduwà: {
            label: "scion.gods.odùduwà",
            pantheon: "orisha",
            mantle: "scion.mantles.odùduwà",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["creator", "leader", "warrior"],
            purviews: ["darkness", "earth", "order", "war"]
        },
        ògún: {
            label: "scion.gods.ògún",
            pantheon: "orisha",
            mantle: "scion.mantles.ògún",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["creator", "hunter", "warrior"],
            purviews: ["earth", "epicStrength", "epicStamina", "forge", "passion:Fear", "war"]
        },
        òrìshàOko: {
            label: "scion.gods.òrìshàOko",
            pantheon: "orisha",
            mantle: "scion.mantles.òrìshàOko",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["hunter", "judge", "sage"],
            purviews: ["beasts:Beasts of Burden|Birds", "fertility", "fortune", "order", "prosperity"]
        },
        òrúnmìlà: {
            label: "scion.gods.òrúnmìlà",
            pantheon: "orisha",
            mantle: "scion.mantles.òrúnmìlà",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["healer", "judge", "sage"],
            purviews: ["fortune", "sky", "stars", "wild"]
        },
        òsanyìn: {
            label: "scion.gods.òsanyìn",
            pantheon: "orisha",
            mantle: "scion.mantles.òsanyìn",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "sage"],
            purviews: ["beasts:Birds", "epicStamina", "fertility", "fortune", "health", "wild"]
        },
        oshóssí: {
            label: "scion.gods.oshóssí",
            pantheon: "orisha",
            mantle: "scion.mantles.oshóssí",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["hunter", "liminal", "judge"],
            purviews: ["beasts", "epicDexterity", "prosperity", "wild"]
        },
        òshun: {
            label: "scion.gods.òshun",
            pantheon: "orisha",
            mantle: "scion.mantles.òshun",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["healer", "lover", "sage"],
            purviews: ["beasts:Bees", "beauty", "fertility", "fortune", "frost", "health", "passion:Love", "prosperity", "water"]
        },
        oyaIyansan: {
            label: "scion.gods.oyaIyansan",
            pantheon: "orisha",
            mantle: "scion.mantles.oyaIyansan",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["guardian", "liminal", "warrior"],
            purviews: ["beasts:Bull", "epicDexterity", "epicStrength", "death", "prosperity", "sky", "water"]
        },
        shàngó: {
            label: "scion.gods.shàngó",
            pantheon: "orisha",
            mantle: "scion.mantles.shàngó",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["leader", "lover", "warrior"],
            purviews: ["artistry:Dance|Drums", "beauty", "epicStrength", "fire", "order", "passion", "prosperity", "sky", "war"]
        },
        sònpònná: {
            label: "scion.gods.sònpònná",
            pantheon: "orisha",
            mantle: "scion.mantles.sònpònná",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["healer", "hunter", "liminal"],
            purviews: ["death", "earth", "health", "passion:Spite", "wild"]
        },
        yemojaOboto: {
            label: "scion.gods.yemojaOboto",
            pantheon: "orisha",
            mantle: "scion.mantles.yemojaOboto",
            bookRef: "scion.books.hero",
            bookPage: 106,
            callings: ["creator", "guardian", "leader"],
            purviews: ["beasts:Cetaceans", "epicStrength", "epicStamina", "fertility", "frost", "journeys", "water"]
        },
        anahita: {
            label: "scion.gods.anahita",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["creator", "healer", "warrior"],
            purviews: ["beauty", "health", "water", "war", "wild"]
        },
        ashi: {
            label: "scion.gods.ashi",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["judge", "sage", "warrior"],
            purviews: ["earth", "fortune", "prosperity", "war"]
        },
        atar: {
            label: "scion.gods.atar",
            pantheon: "yazata",
            mantle: "scion.mantles.atar",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["artistry:Innovation", "beauty", "fire", "forge", "health", "passion:Devotion"]
        },
        haoma: {
            label: "scion.gods.haoma",
            pantheon: "yazata",
            mantle: "scion.mantles.haoma",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["beauty", "epicStrength", "fertility", "health"]
        },
        hvareKhshaeta: {
            label: "scion.gods.hvareKhshaeta",
            pantheon: "yazata",
            mantle: "scion.mantles.hvareKhshaeta",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "leader"],
            purviews: ["beauty", "epicDexterity", "epicStamina", "sun"]
        },
        mangha: {
            label: "scion.gods.mangha",
            pantheon: "yazata",
            mantle: "scion.mantles.mangha",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["creator", "leader", "sage"],
            purviews: ["beasts:Bovines", "fertility", "fortune", "moon", "prosperity"]
        },
        mithra: {
            label: "scion.gods.mithra",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "leader"],
            purviews: ["death", "order", "sun"]
        },
        rashnu: {
            label: "scion.gods.rashnu",
            pantheon: "yazata",
            mantle: "scion.mantles.rashnu",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["death", "epicStrength", "journeys", "order"]
        },
        sraosha: {
            label: "scion.gods.sraosha",
            pantheon: "yazata",
            mantle: "scion.mantles.sraosha",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "judge", "sage"],
            purviews: ["artistry:Song", "death", "epicDexterity", "epicStamina", "epicStrength", "journeys", "war"]
        },
        tishtrya: {
            label: "scion.gods.tishtrya",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "healer", "warrior"],
            purviews: ["beasts:Horses", "fertility", "health", "sky", "stars", "water"]
        },
        vanant: {
            label: "scion.gods.vanant",
            pantheon: "yazata",
            mantle: false,
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "hunter", "judge"],
            purviews: ["epicDexterity", "epicStamina", "epicStrength", "journeys", "stars"]
        },
        vataVayu: {
            label: "scion.gods.vataVayu",
            pantheon: "yazata",
            mantle: "scion.mantles.vataVayu",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["creator", "liminal", "trickster"],
            purviews: ["chaos", "death", "epicDexterity", "sky", "wild"]
        },
        verethragna: {
            label: "scion.gods.verethragna",
            pantheon: "yazata",
            mantle: "scion.mantles.verethragna",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["guardian", "leader", "warrior"],
            purviews: ["beasts", "epicDexterity", "epicStamina", "epicStrength", "fertility", "health", "journeys", "war"]
        },
        zam: {
            label: "scion.gods.zam",
            pantheon: "yazata",
            mantle: "scion.mantles.zam",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["creator", "guardian", "healer"],
            purviews: ["beauty", "earth", "epicStamina", "wild"]
        },
        zarathustra: {
            label: "scion.gods.zarathustra",
            pantheon: "yazata",
            mantle: "scion.mantles.zarathustra",
            bookRef: "scion.books.motw",
            bookPage: 50,
            callings: ["healer", "leader", "sage"],
            purviews: ["artistry:Poetry", "journeys", "order"]
        },
        aeva: {
            label: "scion.gods.aeva",
            pantheon: "teros",
            mantle: "scion.mantles.aeva",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "liminal"],
            purviews: ["artistry:Music", "death", "fertility", "forge", "health", "order", "passion:Dread", "stars"]
        },
        ytar: {
            label: "scion.gods.ytar",
            pantheon: "teros",
            mantle: "scion.mantles.ytar",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["creator", "trickster", "sage"],
            purviews: ["chaos", "darkness", "deception", "epicStrength", "forge", "journeys", "passion:Joy", "stars"]
        },
        amnis: {
            label: "scion.gods.amnis",
            pantheon: "teros",
            mantle: "scion.mantles.amnis",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["creator", "leader", "healer"],
            purviews: ["fertility", "forge", "health", "journeys", "order", "prosperity", "water"]
        },
        badaris: {
            label: "scion.gods.badaris",
            pantheon: "teros",
            mantle: "scion.mantles.badaris",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["creator", "liminal", "sage"],
            purviews: ["artistry:Travelogues", "beasts:Marine Life", "epicStamina", "forge", "journeys", "passion:Wanderlust", "water"]
        },
        kuros: {
            label: "scion.gods.kuros",
            pantheon: "teros",
            mantle: "scion.mantles.kuros",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["liminal", "lover", "sage"],
            purviews: ["beauty", "epicDexterity", "journeys", "order", "passion:Love", "sky", "stars"]
        },
        demosia: {
            label: "scion.gods.demosia",
            pantheon: "teros",
            mantle: "scion.mantles.demosia",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "trickster"],
            purviews: ["beasts:Nocturnal Animals", "darkness", "deception", "frost", "moon"]
        },
        hesbon: {
            label: "scion.gods.hesbon",
            pantheon: "teros",
            mantle: "scion.mantles.hesbon",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["guardian", "hunter", "liminal"],
            purviews: ["beasts:Predators", "chaos", "earth", "epicDexterity", "epicStrength", "fertility", "fortune", "passion:Fury", "wild"]
        },
        skaft: {
            label: "scion.gods.skaft",
            pantheon: "teros",
            mantle: "scion.mantles.skaft",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["creator", "guardian", "sage"],
            purviews: ["artistry:All", "earth", "epicStamina", "fire", "forge", "passion:Curiosity", "prosperity"]
        },
        versak: {
            label: "scion.gods.versak",
            pantheon: "teros",
            mantle: "scion.mantles.versak",
            bookRef: "scion.books.motw",
            bookPage: 80,
            callings: ["guardian", "judge", "liminal"],
            purviews: ["beauty", "death", "fire", "order", "passion:Pride", "sky", "sun"]
        }
    },
    GENESES: {
        born: "scion.geneses.born",
        created: "scion.geneses.created",
        incarnation: "scion.geneses.incarnation",
        chosen: "scion.geneses.chosen"
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
        academics: "scion.skills.academics",
        athletics: "scion.skills.athletics",
        closeCombat: "scion.skills.closeCombat",
        culture: "scion.skills.culture",
        empathy: "scion.skills.empathy",
        firearms: "scion.skills.firearms",
        integrity: "scion.skills.integrity",
        leadership: "scion.skills.leadership",
        medicine: "scion.skills.medicine",
        occult: "scion.skills.occult",
        persuasion: "scion.skills.persuasion",
        pilot: "scion.skills.pilot",
        science: "scion.skills.science",
        subterfuge: "scion.skills.subterfuge",
        survival: "scion.skills.survival",
        technology: "scion.skills.technology"
    },
    CALLINGS: {
        creator: {
            label: "scion.callings.creator",
            skills: ["academics", "culture", "technology"],
            fateRoles: ["apprentice", "jinx", "rival"]
        },
        guardian: {
            label: "scion.callings.guardian",
            skills: ["athletics", "closeCombat", "empathy"],
            fateRoles: ["canary", "martyr", "nemesis"]
        },
        healer: {
            label: "scion.callings.healer",
            skills: ["empathy", "medicine", "science"],
            fateRoles: ["boonCompanion", "canary", "rival"]
        },
        hunter: {
            label: "scion.callings.hunter",
            skills: ["athletics", "firearms", "survival"],
            fateRoles: ["boonCompanion", "paramour", "rival"]
        },
        judge: {
            label: "scion.callings.judge",
            skills: ["academics", "culture", "persuasion"],
            fateRoles: ["balm", "traitor", "worshipper"]
        },
        leader: {
            label: "scion.callings.leader",
            skills: ["culture", "empathy", "leadership"],
            fateRoles: ["boonCompanion", "traitor", "worshipper"]
        },
        liminal: {
            label: "scion.callings.liminal",
            skills: ["athletics", "pilot", "subterfuge"],
            fateRoles: ["canary", "jinx", "unrequitedParamour"]
        },
        lover: {
            label: "scion.callings.lover",
            skills: ["culture", "empathy", "persuasion"],
            fateRoles: ["balm", "paramour", "unrequitedParamour", "rival"]
        },
        sage: {
            label: "scion.callings.sage",
            skills: ["academics", "occult", "subterfuge"],
            fateRoles: ["apprentice", "jinx", "traitor"]
        },
        trickster: {
            label: "scion.callings.trickster",
            skills: ["culture", "persuasion", "subterfuge"],
            fateRoles: ["boonCompanion", "nemesis", "traitor"]
        },
        warrior: {
            label: "scion.callings.warrior",
            skills: ["athletics", "closeCombat", "firearms"],
            fateRoles: ["balm", "nemesis", "rival"]
        }
    },
    FATEROLES: {
        apprentice: "scion.fateroles.apprentice",
        balm: "scion.fateroles.balm",
        boonCompanion: "scion.fateroles.boonCompanion",
        canary: "scion.fateroles.canary",
        jinx: "scion.fateroles.jinx",
        martyr: "scion.fateroles.martyr",
        nemesis: "scion.fateroles.nemesis",
        paramour: "scion.fateroles.paramour",
        rival: "scion.fateroles.rival",
        traitor: "scion.fateroles.traitor",
        unrequitedParamour: "scion.fateroles.unrequitedParamour",
        worshipper: "scion.fateroles.worshipper"
    },
    PURVIEWS: {
        pantheon: {
            wyrd: "scion.purviews.wyrd",
            yoga: "scion.purviews.yoga",
            yaoyorozuNoKamigami: "scion.purviews.yaoyorozuNoKamigami",
            dodaem: "scion.purviews.dodaem",
            heku: "scion.purviews.heku",
            tianming: "scion.purviews.tianming",
            nextlahualli: "scion.purviews.nextlahualli",
            metamorphosis: "scion.purviews.metamorphosis",
            geasa: "scion.purviews.geasa",
            nemeton: "scion.purviews.nemeton",
            cheval: "scion.purviews.cheval",
            asha: "scion.purviews.asha",
            dvoeverie: "scion.purviews.dvoeverie",
            qut: "scion.purviews.qut"
        },
        general: {
            artistry: "scion.purviews.artistry",
            beasts: "scion.purviews.beasts",
            beauty: "scion.purviews.beauty",
            chaos: "scion.purviews.chaos",
            darkness: "scion.purviews.darkness",
            death: "scion.purviews.death",
            deception: "scion.purviews.deception",
            earth: "scion.purviews.earth",
            epicDexterity: "scion.purviews.epicDexterity",
            epicStamina: "scion.purviews.epicStamina",
            epicStrength: "scion.purviews.epicStrength",
            fertility: "scion.purviews.fertility",
            fire: "scion.purviews.fire",
            forge: "scion.purviews.forge",
            fortune: "scion.purviews.fortune",
            frost: "scion.purviews.frost",
            health: "scion.purviews.health",
            journeys: "scion.purviews.journeys",
            moon: "scion.purviews.moon",
            order: "scion.purviews.order",
            passion: "scion.purviews.passion",
            prosperity: "scion.purviews.prosperity",
            sky: "scion.purviews.sky",
            stars: "scion.purviews.stars",
            sun: "scion.purviews.sun",
            war: "scion.purviews.war",
            water: "scion.purviews.water",
            wild: "scion.purviews.wild"
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
    }
};
export const itemCategories = {
    paths: ["path"],
    callings: ["calling"],
    knacks: ["knack"],
    purviews: ["purview"],
    boons: ["boon"],
    birthrights: ["relic", "follower", "creature", "guide", "cult", "covenant"]
};
export const signatureChars = {
    "Rhys Callaghan": {
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
            priorities: {
                primary: "social",
                secondary: "mental",
                tertiary: "physical"
            }
        },
        skills: {
            list: {
                athletics: {value: 4, specialty: "Acrobatics"},
                culture: {value: 5, specialty: "Music"},
                closeCombat: {value: 1},
                empathy: {value: 3, specialty: "Motives/Desires"},
                subterfuge: {value: 3, specialty: "Insistence"},
                leadership: {value: 1},
                persuasion: {value: 5, specialty: "Individuals"},
                survival: {value: 1},
                integrity: {value: 1}
            }
        },
        pathData: {
            origin: {
                title: "Carefree Wanderer with Luck on His Side",
                skills: ["empathy", "persuasion", "subterfuge"],
                condition: {
                    title: "Interesting Times",
                    description: "2's on any d10s count as 1’s when determining botches.  Resolved when Rhys suffers the effect of a botch."
                }
            },
            role: {
                title: "No Heaven Frontman",
                skills: ["athletics", "culture", "persuasion"],
                condition: {
                    title: "Tone Deaf",
                    description: "-2 penalty to all Culture (Music) rolls.  Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                }
            },
            pantheon: {
                title: "Scion of Aengus, Step-Scion of the Morrigan",
                skills: ["closeCombat", "culture", "subterfuge"],
                condition: {
                    title: "Murder of Crows",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.  Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                }
            }
        }
    },
    "Horace Farrow": {
        genesis: "born",
        pantheon: "netjer",
        patron: "horus",
        divineTitle: "\"The Tempered Lawgiver\"",
        attributes: {
            favoredApproach: "finesse",
            list: {
                presence: {value: 3},
                manipulation: {value: 2},
                composure: {value: 2},
                intellect: {value: 4},
                cunning: {value: 3},
                resolve: {value: 3},
                might: {value: 3},
                dexterity: {value: 4},
                stamina: {value: 2}
            },
            priorities: {
                primary: "mental",
                secondary: "physical",
                tertiary: "social"
            }
        },
        skills: {
            list: {
                academics: {value: 2},
                athletics: {value: 2},
                closeCombat: {value: 4, specialty: "Street Fighting"},
                firearms: {value: 4, specialty: "Heavy Pistols"},
                integrity: {value: 3, specialty: "Meditations"},
                leadership: {value: 4, specialty: "Leading the Team"},
                occult: {value: 1},
                subterfuge: {value: 1},
                survival: {value: 2}
            }
        },
        pathData: {
            origin: {
                title: "Carefree Wanderer with Luck on His Side",
                skills: ["empathy", "persuasion", "subterfuge"],
                condition: {
                    title: "Interesting Times",
                    description: "2's on any d10s count as 1’s when determining botches.  Resolved when Rhys suffers the effect of a botch."
                }
            },
            role: {
                title: "No Heaven Frontman",
                skills: ["athletics", "culture", "persuasion"],
                condition: {
                    title: "Tone Deaf",
                    description: "-2 penalty to all Culture (Music) rolls.  Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                }
            },
            pantheon: {
                title: "Scion of Aengus, Step-Scion of the Morrigan",
                skills: ["closeCombat", "culture", "subterfuge"],
                condition: {
                    title: "Murder of Crows",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.  Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                }
            }
        }
    },
    "Brigitte De La Croix": {
        genesis: "chosen",
        pantheon: "loa",
        patron: "baronSamedi",
        divineTitle: "\"Who Waits With Those In Darkness\"",
        attributes: {
            favoredApproach: "finesse",
            list: {
                presence: {value: 4},
                manipulation: {value: 2},
                composure: {value: 3},
                intellect: {value: 3},
                cunning: {value: 4},
                resolve: {value: 4},
                might: {value: 2},
                dexterity: {value: 3},
                stamina: {value: 2}
            },
            priorities: {
                primary: "mental",
                secondary: "social",
                tertiary: "physical"
            }
        },
        skills: {
            list: {
                academics: {value: 2},
                athletics: {value: 2},
                culture: {value: 3, specialty: "Death and Mourning"},
                integrity: {value: 3, specialty: "Defending Tradition"},
                leadership: {value: 2},
                medicine: {value: 2},
                occult: {value: 5, specialty: "Ghosts"},
                persuasion: {value: 2},
                science: {value: 2},
                subterfuge: {value: 1}
            }
        },
        pathData: {
            origin: {
                title: "Carefree Wanderer with Luck on His Side",
                skills: ["empathy", "persuasion", "subterfuge"],
                condition: {
                    title: "Interesting Times",
                    description: "2's on any d10s count as 1’s when determining botches.  Resolved when Rhys suffers the effect of a botch."
                }
            },
            role: {
                title: "No Heaven Frontman",
                skills: ["athletics", "culture", "persuasion"],
                condition: {
                    title: "Tone Deaf",
                    description: "-2 penalty to all Culture (Music) rolls.  Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                }
            },
            pantheon: {
                title: "Scion of Aengus, Step-Scion of the Morrigan",
                skills: ["closeCombat", "culture", "subterfuge"],
                condition: {
                    title: "Murder of Crows",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.  Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                }
            }
        }
    },
    "Adonis Rhodes": {
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
            priorities: {
                primary: "social",
                secondary: "physical",
                tertiary: "mental"
            }
        },
        skills: {
            list: {
                athletics: {value: 2},
                culture: {value: 2},
                empathy: {value: 5, specialty: "Getting to Know You"},
                firearms: {value: 3, specialty: "Small Arms"},
                persuasion: {value: 5, specialty: "Getting My Way"},
                pilot: {value: 2},
                subterfuge: {value: 2},
                survival: {value: 2}
            }
        },
        pathData: {
            origin: {
                title: "Carefree Wanderer with Luck on His Side",
                skills: ["empathy", "persuasion", "subterfuge"],
                condition: {
                    title: "Interesting Times",
                    description: "2's on any d10s count as 1’s when determining botches.  Resolved when Rhys suffers the effect of a botch."
                }
            },
            role: {
                title: "No Heaven Frontman",
                skills: ["athletics", "culture", "persuasion"],
                condition: {
                    title: "Tone Deaf",
                    description: "-2 penalty to all Culture (Music) rolls.  Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                }
            },
            pantheon: {
                title: "Scion of Aengus, Step-Scion of the Morrigan",
                skills: ["closeCombat", "culture", "subterfuge"],
                condition: {
                    title: "Murder of Crows",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.  Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                }
            }
        }
    },
    "Erik Donner": {
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
            priorities: {
                primary: "physical",
                secondary: "social",
                tertiary: "mental"
            }
        },
        skills: {
            list: {
                athletics: {value: 4, specialty: "Feats of Strength"},
                closeCombat: {value: 4, specialty: "Bareknuckle Boxing"},
                firearms: {value: 4, specialty: "Pistols"},
                integrity: {value: 2},
                leadership: {value: 2},
                occult: {value: 1},
                pilot: {value: 4, specialty: "Cars"},
                survival: {value: 3, specialty: "Camping"}
            }
        },
        pathData: {
            origin: {
                title: "Carefree Wanderer with Luck on His Side",
                skills: ["empathy", "persuasion", "subterfuge"],
                condition: {
                    title: "Interesting Times",
                    description: "2's on any d10s count as 1’s when determining botches.  Resolved when Rhys suffers the effect of a botch."
                }
            },
            role: {
                title: "No Heaven Frontman",
                skills: ["athletics", "culture", "persuasion"],
                condition: {
                    title: "Tone Deaf",
                    description: "-2 penalty to all Culture (Music) rolls.  Resolved when Rhys suffers significant consequences from failing a Culture (Music) roll."
                }
            },
            pantheon: {
                title: "Scion of Aengus, Step-Scion of the Morrigan",
                skills: ["closeCombat", "culture", "subterfuge"],
                condition: {
                    title: "Murder of Crows",
                    description: "Ominous crows invoke Rhys’ geas to give him a command on behalf of the Morrigan.  Resolved when Rhys follows the command, or makes a major sacrifice to the Morrigan."
                }
            }
        }
    }
};
