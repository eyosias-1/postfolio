/**
 * @file i18n.js
 * @description Internationalization Engine supporting English, Amharic (አማርኛ), and Afaan Oromoo.
 * Implements Section 4 of the Master Specification with zero external dependencies.
 */

'use strict';

const TRANSLATIONS = {
    en: {
        site_title: "Staff Systems Architect & Applied Computer Scientist",
        nav_about: "Identity",
        nav_algorithms: "Algorithms Lab",
        nav_math: "Discrete Math",
        nav_systems: "Systems Architecture",
        nav_projects: "Projects",
        nav_terminal: "CLI Terminal",
        nav_contact: "Contact",

        hero_badge: "Staff Software Engineer • Applied Computer Scientist",
        hero_title_1: "Architecting Resilient Systems",
        hero_title_2: "Rooted in Formal Mathematics & Algorithmic Rigor.",
        hero_desc: "Specializing in core data structures, graph theory, discrete mathematics, distributed consensus, and low-latency systems. Committed to zero-fluff, production-grade code with formal O(n) space-time guarantees.",
        hero_btn_lab: "Launch Algorithms Lab",
        hero_btn_cli: "Open Systems Terminal",
        hero_btn_contact: "Direct Communication",

        stat_1_val: "O(1)",
        stat_1_lbl: "Lock-Free LRU Retrieval",
        stat_2_val: "< 50µs",
        stat_2_lbl: "Ring Buffer Pipeline P99",
        stat_3_val: "100%",
        stat_3_lbl: "Formal State Verification",
        stat_4_val: "Zero",
        stat_4_lbl: "Allocations on Hot Paths",

        algo_tab_title: "Interactive Algorithmic Laboratory",
        algo_tab_desc: "Explore verified algorithmic routines with real-time state visualization and Big-O runtime profiling.",
        algo_bst_title: "Binary Search Tree (BST) & Invariants",
        algo_bst_desc: "Dynamic balanced search space with recursive insert, delete, search, and in-order traversals.",
        algo_dijkstra_title: "Graph Theory: Dijkstra & Topological Sort",
        algo_dijkstra_desc: "Shortest path discovery with Min-Heap priority queues and Kahn's DAG cycle detection.",
        algo_cache_title: "Systems: O(1) LRU Cache & Eviction",
        algo_cache_desc: "Doubly Linked List + Hash Map layout with atomic sentinel pointers and hit/miss profiling.",
        algo_ring_title: "Low-Level: Circular Ring Buffer",
        algo_ring_desc: "Bounded zero-copy memory ring buffer with atomic cursor wrapping.",

        math_tab_title: "Applied Mathematics & Discrete Logic",
        math_tab_desc: "Computational engine for combinatorics, topological invariants, and propositional truth tables.",
        math_comb_title: "Combinatorics & Probability Engine",
        math_comb_desc: "High-precision calculations for factorials, permutations P(n,r), combinations C(n,r), and binomial distributions.",
        math_logic_title: "Propositional Logic Truth Table Synthesizer",
        math_logic_desc: "Parses propositional statements, verifies tautologies, contradictions, and models all 2^n assignments.",
        math_graph_title: "Topological Invariants & Euler Planarity",
        math_graph_desc: "Verification of Euler's polyhedral formula V - E + F = 2 and the Handshaking Lemma.",

        sys_tab_title: "Systems Architecture & Design Patterns",
        sys_tab_desc: "Architectural blueprints for distributed consensus, high-throughput stream processing, and memory safety.",
        sys_raft_title: "Distributed Consensus Engine (Raft)",
        sys_raft_desc: "State machine replication with leader election, log compaction, and guaranteed safety invariants.",
        sys_bus_title: "Zero-Copy Asynchronous Event Broker",
        sys_bus_desc: "High-throughput messaging achieving > 1.2M messages/sec with non-blocking memory buffers.",

        proj_tab_title: "Selected Technical Projects",
        proj_tab_desc: "Production deployments demonstrating systems optimization and mathematical modeling.",
        proj_1_title: "AetherKV: Distributed Consensus Key-Value Store",
        proj_1_desc: "Built with partitioned Raft consensus, SSTable LSM-trees, and sub-millisecond tail latencies.",
        proj_2_title: "ChronosEngine: SIMD-Accelerated Vector Index",
        proj_2_desc: "HNSW high-dimensional vector search engine with quantized Euclidean distance optimization.",
        proj_3_title: "GraphQ: Automated Theorem & Invariant Checker",
        proj_3_desc: "Formal graph verification CLI testing planarity, chromatic numbers, and Hamiltonian cycles.",

        cli_title: "Staff Systems Interactive Terminal",
        cli_hint: "Type 'help' to inspect system commands, 'whoami' for background, or 'lang [en|am|om]' to switch dialects.",

        contact_title: "Direct Engineering Communication",
        contact_desc: "Available for staff-level architecture advisory, algorithm optimization, and discrete mathematical research.",
        contact_email_lbl: "Cryptographic / Electronic Mail",
        contact_github_lbl: "Source Code Repositories",
        contact_location: "Addis Ababa, ET / Global Remote",
        btn_copy_email: "Copy Address"
    },

    am: {
        site_title: "ሲኒየር የሲስተም አርክቴክት እና ተግባራዊ የኮምፒውተር ሳይንቲስት",
        nav_about: "መገለጫ",
        nav_algorithms: "የአልጎሪዝም ላብራቶሪ",
        nav_math: "ዲስክሪት ሂሳብ",
        nav_systems: "የሲስተም አርክቴክቸር",
        nav_projects: "ፕሮጀክቶች",
        nav_terminal: "የትዕዛዝ መስመር (CLI)",
        nav_contact: "ግንኙነት",

        hero_badge: "ስታፍ ሶፍትዌር ኢንጂነር • ተግባራዊ የኮምፒውተር ሳይንቲስት",
        hero_title_1: "ጠንካራ እና አስተማማኝ ሲስተሞች ግንባታ",
        hero_title_2: "በሂሳባዊ ጥብቅነት እና አልጎሪዝም ብቃት ላይ የተመሰረተ።",
        hero_desc: "በዳታ ስትራክቸሮች፣ ግራፍ ቲዎሪ፣ ዲስክሪት ሂሳብ፣ የተሰራጩ ሲስተሞች እና ከፍተኛ ፍጥነት ዝቅተኛ-ደረጃ ኮድ ላይ ያተኮረ። ፍፁም ትክክለኛ፣ ዝግጁ እና Big-O ዋስትና ያለው ኮድ።",
        hero_btn_lab: "አልጎሪዝም ላብ ክፈት",
        hero_btn_cli: "ሲስተም ተርሚናል ክፈት",
        hero_btn_contact: "ቀጥታ ይገናኙ",

        stat_1_val: "O(1)",
        stat_1_lbl: "የመሸጎጫ (LRU) ፈጣን ፍለጋ",
        stat_2_val: "< 50µs",
        stat_2_lbl: "የሪንግ ባፈር የፍጥነት መዘግየት",
        stat_3_val: "100%",
        stat_3_lbl: "መደበኛ የሂሳብ ማረጋገጫ",
        stat_4_val: "ዜሮ",
        stat_4_lbl: "በዋናው መስመር ላይ ተጨማሪ ሜሞሪ ማባከን የለም",

        algo_tab_title: "ተግባራዊ የአልጎሪዝም ላብራቶሪ",
        algo_tab_desc: "ትክክለኛነታቸው የተረጋገጡ አልጎሪዝሞችን በቀጥታ እንቅስቃሴ እና Big-O ፍጥነት ይመልከቱ።",
        algo_bst_title: "ባይነሪ ሰርች ትሪ (BST) እና መዋቅሮች",
        algo_bst_desc: "የፍለጋ ዛፍ በአዲስ ማስገባት፣ ማጥፋት፣ መፈለግ እና በቅደም ተከተል ማሰስ።",
        algo_dijkstra_title: "ግራፍ ቲዎሪ: ዳይክስትራ እና ቶፖሎጂካል ድልድል",
        algo_dijkstra_desc: "አጭሩን መንገድ በMin-Heap ቅድሚያ መስጫ እና የቀለበት መኖር ማጣሪያ።",
        algo_cache_title: "ሲስተምስ: O(1) LRU መሸጎጫ አስተዳደር",
        algo_cache_desc: "ድርብ የተገናኘ ዝርዝር እና ሃሽ ማፕ አጠቃቀም ጋር ፈጣን ማውጣት እና ማስገባት።",
        algo_ring_title: "ዝቅተኛ-ደረጃ: ክብ ቋት (Circular Ring Buffer)",
        algo_ring_desc: "ወሰን ያለው የሜሞሪ ባፈር ያለ ትርፍ ቅጂ በትክክለኛ አሰራር።",

        math_tab_title: "ተግባራዊ ሂሳብ እና ዲስክሪት ሎጂክ",
        math_tab_desc: "የኮምቢናቶሪክስ፣ የቶፖሎጂካል ህጎች እና የሎጂክ እውነት ሠንጠረዥ ስሌት ማሽን።",
        math_comb_title: "ኮምቢናቶሪክስ እና ፕሮባቢሊቲ ሞተር",
        math_comb_desc: "ፋክቶሪያል፣ ፐርሙቴሽን P(n,r)፣ ኮምቢኔሽን C(n,r) እና ባይኖሚያል ስሌት።",
        math_logic_title: "የፕሮፖዚሽናል ሎጂክ እውነት ሠንጠረዥ አውጪ",
        math_logic_desc: "የሎጂክ አረፍተ-ነገሮችን በመተንተን ሁልጊዜ እውነት (Tautology) ወይም ውሸት መሆኑን ያረጋግጣል።",
        math_graph_title: "የቶፖሎጂ እና የኦይለር ፕላናር ህግ",
        math_graph_desc: "የኦይለር ፎርሙላ V - E + F = 2 እና የሃንድሼኪንግ ሌማ ማረጋገጫ።",

        sys_tab_title: "የሲስተም አርክቴክቸር እና ንድፍ",
        sys_tab_desc: "የተከፋፈሉ ሲስተሞች ስምምነት እና ፈጣን የዳታ ዝውውር አርክቴክቸር።",
        sys_raft_title: "የተሰራጨ ስምምነት ሞተር (Raft)",
        sys_raft_desc: "የመሪ ምርጫ፣ የመዝገብ ቁጥጥር እና አስተማማኝ የደህንነት ዋስትና።",
        sys_bus_title: "ዜሮ-ኮፒ ፈጣን የክስተት መላኪያ",
        sys_bus_desc: "በሰከንድ ከ1.2 ሚሊዮን በላይ መልዕክቶችን የሚያስተላልፍ ፈጣን መዋቅር።",

        proj_tab_title: "የተመረጡ ቴክኒካል ፕሮጀክቶች",
        proj_tab_desc: "የሲስተም ማሻሻያ እና የሂሳብ ሞዴሊንግ ያካተቱ የምርጥ ስራዎች ስብስብ።",
        proj_1_title: "AetherKV: የተሰራጨ የቁልፍ-እሴት ማከማቻ",
        proj_1_desc: "በRaft ስምምነት እና በLSM-trees የተገነባ እጅግ ፈጣን ዳታቤዝ።",
        proj_2_title: "ChronosEngine: በSIMD የተፋጠነ የቬክተር ፍለጋ",
        proj_2_desc: "በHNSW አልጎሪዝም የተገነባ ከፍተኛ ልኬት ያለው የቬክተር ዳታቤዝ ኢንዴክስ።",
        proj_3_title: "GraphQ: አውቶሜትድ የግራፍ ቲዎረም አረጋጋጭ",
        proj_3_desc: "የግራፍ ፕላናሪቲ፣ ክሮማቲክ ቁጥር እና ዑደቶችን የሚፈትሽ መተግበሪያ።",

        cli_title: "የስታፍ ሲስተምስ የትዕዛዝ ተርሚናል",
        cli_hint: "ትዕዛዞችን ለማየት 'help'፣ ስለ ማንነት 'whoami'፣ ወይም ቋንቋ ለመቀየር 'lang [en|am|om]' ይተይቡ።",

        contact_title: "ቀጥታ የኢንጂነሪንግ ግንኙነት",
        contact_desc: "ለከፍተኛ ሲስተም አርክቴክቸር፣ ለአልጎሪዝም ማሻሻያ እና ለሂሳባዊ ጥናት ክፍት ነው።",
        contact_email_lbl: "ኢሜይል አድራሻ",
        contact_github_lbl: "የኮድ ማከማቻ (GitHub)",
        contact_location: "አዲስ አበባ፣ ኢትዮጵያ / አለም አቀፍ ሪሞት",
        btn_copy_email: "አድራሻ ቅዳ"
    },

    om: {
        site_title: "Injinera Olaanaa Sirnaa fi Saayintistii Kompiitaraa Qabatamaa",
        nav_about: "Waa'ee",
        nav_algorithms: "Kuusaa Algoorizimii",
        nav_math: "Herrega Diskiiriitii",
        nav_systems: "Arkiteekchara Sirnaa",
        nav_projects: "Piroojektota",
        nav_terminal: "Tarree Ajajaa (CLI)",
        nav_contact: "Qunnamtii",

        hero_badge: "Injinera Sooftiweerii Olaanaa • Saayintistii Kompiitaraa",
        hero_title_1: "Sirnoota Ciccoo fi Amansiisoo Ijaaruu",
        hero_title_2: "Herrega Qulqulluu fi Cimina Algoorizimiitiin Kan Dhaabbate.",
        hero_desc: "Caasaalee deetaa, tiyoorii giraafii, herrega diskiiriitii, sirnoota faca'an fi koodii sadarkaa gadii ariifataa irratti kan xiyyeeffate. Koodii qulqulluu fi wabii Big-O qabu.",
        hero_btn_lab: "Kuusaa Algoorizimii Bani",
        hero_btn_cli: "Terminaala Sirnaa Bani",
        hero_btn_contact: "Kallattiin Qunnamaa",

        stat_1_val: "O(1)",
        stat_1_lbl: "Barbaacha LRU Saffisaa",
        stat_2_val: "< 50µs",
        stat_2_lbl: "Turfannaa Baafara Riiŋgii",
        stat_3_val: "100%",
        stat_3_lbl: "Mirkaneessa Herregaa Qulqulluu",
        stat_4_val: "Zero",
        stat_4_lbl: "Qisaasama Meemorii Hin Qabu",

        algo_tab_title: "Kuusaa Algoorizimii Qabatamaa",
        algo_tab_desc: "Algoorizimoota mirkanaa'an sochii qabatamaa fi saffisa Big-O waliin qoradhaa.",
        algo_bst_title: "Muka Barbaacha Baayinarii (BST)",
        algo_bst_desc: "Muka barbaacha haaromsuu, galchuu, haquu fi tartiibaan deemuudhaaf.",
        algo_dijkstra_title: "Tiyoorii Giraafii: Dijkstra fi Tartiiba Tooppooloojii",
        algo_dijkstra_desc: "Karaa gabaabaa fi sakatta'iinsa marsaa DAG Min-Heap fayyadamuun.",
        algo_cache_title: "Sirna: To'annoo Kaashii O(1) LRU",
        algo_cache_desc: "Tarree wal-qabate dachaa fi kaartaa haash fayyadamuun kuusaa saffisaa.",
        algo_ring_title: "Sadarkaa Gadii: Baafara Geengoo (Circular Ring Buffer)",
        algo_ring_desc: "Baafara meemorii daanga'aa garagalcha dabalataa hin qabne.",

        math_tab_title: "Herrega Qabatamaa fi Loojikii Diskiiriitii",
        math_tab_desc: "Mootora shallaggii kombinaatiriiksii, seerota topooloojii fi gabatee dhugaa loojikii.",
        math_comb_title: "Mootora Kombinaatiriiksii fi Carraa",
        math_comb_desc: "Faaktooriyaalii, permuteeshinii P(n,r), kombineeshinii C(n,r) fi baayinoomiyaalii.",
        math_logic_title: "Gabatee Dhugaa Loojikii Uumaa",
        math_logic_desc: "Himoota loojikii qaaccessuun Tautology ykn Contradiction ta'uu mirkaneessa.",
        math_graph_title: "Seera Topooloojii fi Pilaanaarii Euler",
        math_graph_desc: "Mirkaneessa foormulaa Euler V - E + F = 2 fi seera Handshaking Lemma.",

        sys_tab_title: "Arkiteekchara Sirnaa fi Dizaayinii",
        sys_tab_desc: "Waliigaltee sirnoota faca'anii fi daddabarsa deetaa saffisa olaanaa.",
        sys_raft_title: "Mootora Waliigaltee Faca'aa (Raft)",
        sys_raft_desc: "Filannoo geggeessaa, to'annoo galmee fi wabii nageenyaa sirnaa.",
        sys_bus_title: "Ergaa Saffisaa Garagalcha Qulqulluu Hin Qabne",
        sys_bus_desc: "Sekonditti ergaa miiliyoona 1.2 ol dabarsuuf kan dandeessisu.",

        proj_tab_title: "Piroojektota Filataman",
        proj_tab_desc: "Hojiiwwan fooyyeeffannaa sirnaa fi moodeela herregaa agarsiisan.",
        proj_1_title: "AetherKV: Kuusaa Faca'aa Jecha-Gatii",
        proj_1_desc: "Waliigaltee Raft fi LSM-trees fayyadamuun daataabeesii saffisaa ijaarame.",
        proj_2_title: "ChronosEngine: Barbaacha Veektarii SIMD'n Ariifate",
        proj_2_desc: "Algoorizimii HNSW'n kan hojjetame kuusaa veektarii bal'aa.",
        proj_3_title: "GraphQ: Mirkaneessaa Tiyooreemii Giraafii Ofumaa",
        proj_3_desc: "Pilaanaaritii giraafii, lakkoofsa kiroomaatikii fi marsaalee qorata.",

        cli_title: "Terminaala Ajajaa Sirna Injinariingii",
        cli_hint: "Ajajawwan baruuf 'help', waa'ee kiyyaaf 'whoami', ykn afaan jijjiiruuf 'lang [en|am|om]' barreessaa.",

        contact_title: "Qunnamtii Kallattii Injinariingii",
        contact_desc: "Gorsa arkiteekchara sadarkaa olaanaa, fooyyeeffannaa algoorizimii fi qorannoo herregaatiif banaadha.",
        contact_email_lbl: "Teessoo Imeeyilii",
        contact_github_lbl: "Bakka Koodii (GitHub)",
        contact_location: "Finfinnee (Addis Ababa), Itoophiyaa / Addunyaa Mara (Remote)",
        btn_copy_email: "Teessoo Garagalchi"
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('portfolio_lang') || 'en';
        if (!TRANSLATIONS[this.currentLang]) {
            this.currentLang = 'en';
        }
    }

    setLanguage(lang) {
        if (!TRANSLATIONS[lang]) {
            console.warn(`Language '${lang}' not supported. Defaulting to 'en'.`);
            return false;
        }
        this.currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        this.applyLanguage();
        return true;
    }

    t(key) {
        return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS['en'][key] || key;
    }

    applyLanguage() {
        document.documentElement.lang = this.currentLang;
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Update active class on language toggle buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Global instance
const i18n = new I18nManager();
