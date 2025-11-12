const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Данные
let players = [];
let teams = [];
let matches = [];

// Турниры
let tournaments = [
    {
        id: 1,
        name: "ESL Pro League Season 19",
        game: "cs2",
        prize: "$850,000",
        date: "2024-03-01",
        endDate: "2024-03-15",
        status: "active",
        participants: 24,
        organizer: "ESL",
        location: "Europe",
        format: "Group Stage + Playoffs"
    },
    {
        id: 2,
        name: "The International 2024",
        game: "dota2",
        prize: "$3,000,000",
        date: "2024-08-15",
        endDate: "2024-08-30",
        status: "upcoming",
        participants: 18,
        organizer: "Valve",
        location: "Seattle, USA",
        format: "Main Event"
    },
    {
        id: 3,
        name: "Valorant Champions Tour 2024",
        game: "valorant",
        prize: "$2,200,000",
        date: "2024-12-10",
        endDate: "2024-12-20",
        status: "upcoming",
        participants: 16,
        organizer: "Riot Games",
        location: "Los Angeles, USA",
        format: "Double Elimination"
    },
    {
        id: 4,
        name: "IEM Katowice 2024",
        game: "cs2",
        prize: "$1,000,000",
        date: "2024-02-24",
        endDate: "2024-03-03",
        status: "active",
        participants: 16,
        organizer: "ESL",
        location: "Katowice, Poland",
        format: "Group Stage + Playoffs"
    },
    {
        id: 5,
        name: "League of Legends World Championship 2024",
        game: "lol",
        prize: "$2,500,000",
        date: "2024-10-05",
        endDate: "2024-11-02",
        status: "upcoming",
        participants: 24,
        organizer: "Riot Games",
        location: "Multiple Cities",
        format: "Play-In + Main Event"
    },
    {
        id: 6,
        name: "PGL Major Copenhagen 2024",
        game: "cs2",
        prize: "$1,250,000",
        date: "2024-03-17",
        endDate: "2024-03-31",
        status: "upcoming",
        participants: 24,
        organizer: "PGL",
        location: "Copenhagen, Denmark",
        format: "Challengers + Legends + Champions"
    }
];

// Новости
let news = [
    {
        id: 1,
        title: "NAVI выигрывает PGL Major Copenhagen 2024",
        content: "Легендарная команда NAVI одержала победу в крупнейшем турнире по CS2 этого года, обыграв в гранд-финале Team Vitality со счетом 3:1. Это уже третья крупная победа команды в этом сезоне, что подтверждает их доминирование в мировой сцене Counter-Strike 2.",
        excerpt: "Легендарная команда NAVI одержала победу в крупнейшем турнире по CS2 этого года...",
        date: "2024-03-20",
        category: "tournament",
        game: "cs2",
        author: "Киберинформ",
        views: 25420,
        image: "news1",
        tags: ["NAVI", "CS2", "Major", "Победа"]
    },
    {
        id: 2,
        title: "Team Spirit представляет новый состав по Dota 2",
        content: "Чемпионы TI представляют обновленный состав с участием новых игроков из Восточной Европы. Организация объявила о подписании контрактов с двумя перспективными игроками, что должно укрепить их позиции в предстоящем сезоне DPC.",
        excerpt: "Чемпионы TI представляют обновленный состав с участием новых игроков...",
        date: "2024-03-18",
        category: "transfer",
        game: "dota2",
        author: "Dota2News",
        views: 18200,
        image: "news2",
        tags: ["Team Spirit", "Dota 2", "Трансферы"]
    },
    {
        id: 3,
        title: "Valorant Champions Tour 2024: новые правила",
        content: "Riot Games анонсировали изменения в формате VCT 2024, включая новые региональные лиги и увеличение призового фонда. Теперь каждая региональная лига будет иметь свой отдельный путь к чемпионату мира, что сделает соревнования более справедливыми.",
        excerpt: "Riot Games анонсировали изменения в формате VCT 2024...",
        date: "2024-03-15",
        category: "update",
        game: "valorant",
        author: "ValorantEsports",
        views: 15600,
        image: "news3",
        tags: ["Valorant", "VCT", "Riot Games"]
    },
    {
        id: 4,
        title: "Анализ меты: текущее состояние CS2",
        content: "Подробный размотр текущей мета-игры в Counter-Strike 2 после последних обновлений. Аналитики отмечают возросшую важность снайперских винтовок и изменения в экономической системе, которые повлияли на стратегии команд.",
        excerpt: "Подробный размотр текущей мета-игры в Counter-Strike 2...",
        date: "2024-03-12",
        category: "analysis",
        game: "cs2",
        author: "ProAnalyst",
        views: 13200,
        image: "news4",
        tags: ["CS2", "Мета", "Анализ"]
    },
    {
        id: 5,
        title: "Fnatic подписывает нового снупера",
        content: "Европейская организация укрепляет состав по Valorant опытным снупером из Северной Америки. Этот трансфер стал одним из самых громких в межсезонье и может значительно повлиять на баланс сил в европейском регионе.",
        excerpt: "Европейская организация укрепляет состав по Valorant...",
        date: "2024-03-10",
        category: "transfer",
        game: "valorant",
        author: "TransferNews",
        views: 11800,
        image: "news5",
        tags: ["Fnatic", "Valorant", "Трансфер"]
    },
    {
        id: 6,
        title: "The International 2024: даты и место проведения",
        content: "Valve официально анонсировала даты и место проведения главного турнира по Dota 2 этого года. Мероприятие пройдет в новом формате с увеличенным призовым фондом и изменениями в системе квалификации.",
        excerpt: "Valve официально анонсировала даты и место проведения...",
        date: "2024-03-08",
        category: "tournament",
        game: "dota2",
        author: "Dota2World",
        views: 14200,
        image: "news6",
        tags: ["The International", "Dota 2", "Анонс"]
    },
    {
        id: 7,
        title: "Новый сезон киберспорта 2024",
        content: "Открывается регистрация на крупнейшие турниры года. В этом сезоне ожидается рекордный призовой фонд и новые форматы соревнований. Организаторы обещают больше международных LAN-ивентов и улучшенную систему трансляций.",
        excerpt: "Открывается регистрация на крупнейшие турниры года с рекордным призовым фондом...",
        date: "2024-01-15",
        category: "news",
        game: "general",
        author: "Киберинформ",
        views: 15420,
        tags: ["Сезон 2024", "Турниры", "Анонс"]
    },
    {
        id: 8,
        title: "Искусственный интеллект в киберспорте",
        content: "AI начинает активно использоваться для анализа игровых данных и тренировок команд. Новые технологии позволяют анализировать тысячи часов игрового процесса и находить оптимальные стратегии, что меняет подход к подготовке профессиональных команд.",
        excerpt: "AI начинает активно использоваться для анализа игровых данных...",
        date: "2024-01-08",
        category: "tech",
        game: "general",
        author: "TechEsports",
        views: 8920,
        tags: ["ИИ", "Технологии", "Аналитика"]
    }
];

// Топ команды
// В существующий server.js замени массив topTeams на этот:

// Топ команды (20 команд)
let topTeams = [
    {
        id: 1,
        name: "NAVI",
        game: "cs2",
        region: "Europe",
        ranking: 1,
        wins: 45,
        losses: 12,
        earnings: "$2,450,000",
        founded: "2009",
        coach: "B1ad3",
        roster: ["s1mple", "b1t", "electroNic", "Perfecto", "sdy"],
        social: {
            twitter: "navi",
            website: "navi.gg"
        }
    },
    {
        id: 2,
        name: "Team Spirit",
        game: "dota2", 
        region: "CIS",
        ranking: 1,
        wins: 38,
        losses: 8,
        earnings: "$4,200,000",
        founded: "2015",
        coach: "Silent",
        roster: ["Yatoro", "Larl", "Collapse", "Mira", "Miposhka"],
        social: {
            twitter: "teamspirit",
            website: "teamspirit.gg"
        }
    },
    {
        id: 3,
        name: "Fnatic",
        game: "valorant",
        region: "Europe",
        ranking: 1,
        wins: 52,
        losses: 15,
        earnings: "$1,800,000",
        founded: "2004",
        coach: "mini",
        roster: ["Boaster", "Derke", "Alfajer", "Leo", "Chronicle"],
        social: {
            twitter: "fnatic",
            website: "fnatic.com"
        }
    },
    {
        id: 4,
        name: "G2 Esports",
        game: "cs2",
        region: "Europe",
        ranking: 2,
        wins: 42,
        losses: 18,
        earnings: "$1,950,000",
        founded: "2013",
        coach: "Swani",
        roster: ["NiKo", "huNter-", "m0NESY", "HooXi", "jks"],
        social: {
            twitter: "G2esports",
            website: "g2esports.com"
        }
    },
    {
        id: 5,
        name: "Team Liquid",
        game: "lol",
        region: "NA",
        ranking: 1,
        wins: 48,
        losses: 20,
        earnings: "$1,600,000",
        founded: "2000",
        coach: "Spawn",
        roster: ["Impact", "UmTi", "APA", "Yeon", "CoreJJ"],
        social: {
            twitter: "teamliquid",
            website: "teamliquid.com"
        }
    },
    {
        id: 6,
        name: "Virtus.pro",
        game: "dota2",
        region: "CIS",
        ranking: 2,
        wins: 35,
        losses: 12,
        earnings: "$2,100,000",
        founded: "2003",
        coach: "ArsZeeq",
        roster: ["Kiritych", "squad1x", "Noticed", "sayuw", "Fng"],
        social: {
            twitter: "virtuspro",
            website: "virtus.pro"
        }
    },
    {
        id: 7,
        name: "100 Thieves",
        game: "valorant",
        region: "NA",
        ranking: 2,
        wins: 38,
        losses: 22,
        earnings: "$1,200,000",
        founded: "2017",
        coach: "Zikz",
        roster: ["Asuna", "Bang", "Cryocells", "eeiu", "Zander"],
        social: {
            twitter: "100Thieves",
            website: "100thieves.com"
        }
    },
    {
        id: 8,
        name: "T1",
        game: "lol",
        region: "Asia",
        ranking: 2,
        wins: 44,
        losses: 16,
        earnings: "$1,400,000",
        founded: "2004",
        coach: "Roach",
        roster: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
        social: {
            twitter: "T1",
            website: "t1.gg"
        }
    },
    {
        id: 9,
        name: "FaZe Clan",
        game: "cs2",
        region: "Europe",
        ranking: 3,
        wins: 39,
        losses: 21,
        earnings: "$1,750,000",
        founded: "2010",
        coach: "RobbaN",
        roster: ["rain", "broky", "ropz", "karrigan", "Twistzz"],
        social: {
            twitter: "FaZeClan",
            website: "fazeclan.com"
        }
    },
    {
        id: 10,
        name: "Evil Geniuses",
        game: "dota2",
        region: "NA",
        ranking: 3,
        wins: 32,
        losses: 18,
        earnings: "$1,300,000",
        founded: "1999",
        coach: "BuLba",
        roster: ["Wisper", "Chris Luck", "Pakazs", "Matthew", "Panda"],
        social: {
            twitter: "EvilGeniuses",
            website: "evligeniuses.gg"
        }
    },
    {
        id: 11,
        name: "Cloud9",
        game: "cs2",
        region: "NA",
        ranking: 4,
        wins: 36,
        losses: 24,
        earnings: "$1,100,000",
        founded: "2013",
        coach: "groove",
        roster: ["Ax1Le", "sh1ro", "Hobbit", "nafany", "interz"],
        social: {
            twitter: "Cloud9",
            website: "cloud9.gg"
        }
    },
    {
        id: 12,
        name: "DRX",
        game: "valorant",
        region: "Asia",
        ranking: 3,
        wins: 41,
        losses: 19,
        earnings: "$900,000",
        founded: "2012",
        coach: "termi",
        roster: ["Rb", "Zest", "Flashback", "Foxy9", "Mako"],
        social: {
            twitter: "DRX",
            website: "drx.gg"
        }
    },
    {
        id: 13,
        name: "NIP",
        game: "cs2",
        region: "Europe",
        ranking: 5,
        wins: 33,
        losses: 27,
        earnings: "$850,000",
        founded: "2000",
        coach: "djL",
        roster: ["REZ", "Brollan", "headtr1ck", "k0nfig", "Alex"],
        social: {
            twitter: "NIP",
            website: "nip.gl"
        }
    },
    {
        id: 14,
        name: "PSG.LGD",
        game: "dota2",
        region: "Asia",
        ranking: 4,
        wins: 40,
        losses: 15,
        earnings: "$1,600,000",
        founded: "2018",
        coach: "xiao8",
        roster: ["shiro", "NothingToSay", "niu", "planet", "WhyouSm1Le"],
        social: {
            twitter: "PSG_LGD",
            website: "lgdgaming.com"
        }
    },
    {
        id: 15,
        name: "Sentinels",
        game: "valorant",
        region: "NA",
        ranking: 4,
        wins: 35,
        losses: 25,
        earnings: "$800,000",
        founded: "2018",
        coach: "kaplan",
        roster: ["TenZ", "zekken", "Sacy", "pANcada", "johnqt"],
        social: {
            twitter: "Sentinels",
            website: "sentinels.gg"
        }
    },
    {
        id: 16,
        name: "Heroic",
        game: "cs2",
        region: "Europe",
        ranking: 6,
        wins: 37,
        losses: 23,
        earnings: "$750,000",
        founded: "2016",
        coach: "sAw",
        roster: ["stavn", "jabbi", "sjuush", "TeSeS", "cadiaN"],
        social: {
            twitter: "heroicgg",
            website: "heroic.gg"
        }
    },
    {
        id: 17,
        name: "OG",
        game: "dota2",
        region: "Europe",
        ranking: 5,
        wins: 34,
        losses: 21,
        earnings: "$1,100,000",
        founded: "2015",
        coach: "Chu",
        roster: ["Yuragi", "bzm", "ATF", "Taiga", "Misha"],
        social: {
            twitter: "OGesports",
            website: "ogs.gg"
        }
    },
    {
        id: 18,
        name: "Gen.G",
        game: "lol",
        region: "Asia",
        ranking: 3,
        wins: 46,
        losses: 14,
        earnings: "$1,200,000",
        founded: "2018",
        coach: "Score",
        roster: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"],
        social: {
            twitter: "GenG",
            website: "geng.gg"
        }
    },
    {
        id: 19,
        name: "MOUZ",
        game: "cs2",
        region: "Europe",
        ranking: 7,
        wins: 31,
        losses: 29,
        earnings: "$600,000",
        founded: "2002",
        coach: "sycrone",
        roster: ["frozen", "torzsi", "xertioN", "siuhy", "Jimpphat"],
        social: {
            twitter: "mousesports",
            website: "mouz.gg"
        }
    },
    {
        id: 20,
        name: "Team Falcons",
        game: "valorant",
        region: "Middle East",
        ranking: 5,
        wins: 28,
        losses: 32,
        earnings: "$500,000",
        founded: "2020",
        coach: "Bassam",
        roster: ["MnM", "Carcass", "xms", "DAVEY", "shalaby"],
        social: {
            twitter: "Falcons",
            website: "falcons.esports.me"
        }
    }
];

// Роуты для страниц
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/tournaments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/tournaments.html'));
});

app.get('/teams', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/teams.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/news.html'));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/stats.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/profile.html'));
});

// API Routes
app.get('/api/tournaments', (req, res) => {
    res.json(tournaments);
});

app.get('/api/news', (req, res) => {
    res.json(news);
});

app.get('/api/teams', (req, res) => {
    res.json(topTeams);
});

app.get('/api/players', (req, res) => {
    res.json(players);
});

app.post('/api/register', (req, res) => {
    const { nickname, game, email, rank, experience } = req.body;
    
    const player = {
        id: Date.now(),
        nickname,
        game,
        email,
        rank: rank || '',
        experience: experience || 'beginner',
        registerDate: new Date().toLocaleDateString('ru-RU'),
        status: 'active',
        lastActive: new Date().toISOString()
    };
    
    players.push(player);
    
    res.json({ 
        success: true, 
        message: 'Регистрация успешна! Добро пожаловать в киберспорт!', 
        player 
    });
});

app.post('/api/team-register', (req, res) => {
    const { teamName, game, region, tag, description, roster } = req.body;
    
    const team = {
        id: Date.now(),
        name: teamName,
        game,
        region,
        tag: tag.toUpperCase(),
        description: description || '',
        roster: roster.split(',').map(player => player.trim()),
        registerDate: new Date().toLocaleDateString('ru-RU'),
        status: 'pending',
        wins: 0,
        losses: 0,
        earnings: "$0",
        ranking: topTeams.length + 1
    };
    
    teams.push(team);
    
    res.json({ 
        success: true, 
        message: 'Команда зарегистрирована! Ожидайте проверки модератором.', 
        team 
    });
});

app.get('/api/stats', (req, res) => {
    const stats = {
        totalPlayers: players.length,
        totalTeams: teams.length + topTeams.length,
        activeTournaments: tournaments.filter(t => t.status === 'active').length,
        totalPrizePool: tournaments.reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0),
        popularGame: getPopularGame(),
        upcomingTournaments: tournaments.filter(t => t.status === 'upcoming').length,
        totalMatches: 0, // Можно добавить логику подсчета матчей
        averagePlayersPerTeam: players.length / (teams.length + topTeams.length) || 0
    };
    res.json(stats);
});

// Поиск и фильтрация
app.get('/api/tournaments/search', (req, res) => {
    const { q, game, status } = req.query;
    let filteredTournaments = tournaments;

    if (q) {
        filteredTournaments = filteredTournaments.filter(t => 
            t.name.toLowerCase().includes(q.toLowerCase()) ||
            t.organizer.toLowerCase().includes(q.toLowerCase())
        );
    }

    if (game) {
        filteredTournaments = filteredTournaments.filter(t => t.game === game);
    }

    if (status) {
        filteredTournaments = filteredTournaments.filter(t => t.status === status);
    }

    res.json(filteredTournaments);
});

app.get('/api/teams/search', (req, res) => {
    const { q, game, region } = req.query;
    let filteredTeams = [...topTeams, ...teams];

    if (q) {
        filteredTeams = filteredTeams.filter(t => 
            t.name.toLowerCase().includes(q.toLowerCase())
        );
    }

    if (game) {
        filteredTeams = filteredTeams.filter(t => t.game === game);
    }

    if (region) {
        filteredTeams = filteredTeams.filter(t => t.region === region);
    }

    res.json(filteredTeams);
});

app.get('/api/news/search', (req, res) => {
    const { q, category, game } = req.query;
    let filteredNews = news;

    if (q) {
        filteredNews = filteredNews.filter(n => 
            n.title.toLowerCase().includes(q.toLowerCase()) ||
            n.content.toLowerCase().includes(q.toLowerCase()) ||
            n.author.toLowerCase().includes(q.toLowerCase())
        );
    }

    if (category) {
        filteredNews = filteredNews.filter(n => n.category === category);
    }

    if (game) {
        filteredNews = filteredNews.filter(n => n.game === game);
    }

    res.json(filteredNews);
});

// Получение конкретных данных
app.get('/api/tournaments/:id', (req, res) => {
    const tournament = tournaments.find(t => t.id === parseInt(req.params.id));
    if (tournament) {
        res.json(tournament);
    } else {
        res.status(404).json({ error: 'Турнир не найден' });
    }
});

app.get('/api/news/:id', (req, res) => {
    const newsItem = news.find(n => n.id === parseInt(req.params.id));
    if (newsItem) {
        // Увеличиваем счетчик просмотров
        newsItem.views += 1;
        res.json(newsItem);
    } else {
        res.status(404).json({ error: 'Новость не найдена' });
    }
});

app.get('/api/teams/:id', (req, res) => {
    const team = [...topTeams, ...teams].find(t => t.id === parseInt(req.params.id));
    if (team) {
        res.json(team);
    } else {
        res.status(404).json({ error: 'Команда не найдена' });
    }
});

// Статистика по играм
app.get('/api/stats/games', (req, res) => {
    const gameStats = {
        cs2: {
            players: players.filter(p => p.game === 'cs2').length,
            teams: [...topTeams, ...teams].filter(t => t.game === 'cs2').length,
            tournaments: tournaments.filter(t => t.game === 'cs2').length,
            prizePool: tournaments.filter(t => t.game === 'cs2').reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0)
        },
        valorant: {
            players: players.filter(p => p.game === 'valorant').length,
            teams: [...topTeams, ...teams].filter(t => t.game === 'valorant').length,
            tournaments: tournaments.filter(t => t.game === 'valorant').length,
            prizePool: tournaments.filter(t => t.game === 'valorant').reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0)
        },
        dota2: {
            players: players.filter(p => p.game === 'dota2').length,
            teams: [...topTeams, ...teams].filter(t => t.game === 'dota2').length,
            tournaments: tournaments.filter(t => t.game === 'dota2').length,
            prizePool: tournaments.filter(t => t.game === 'dota2').reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0)
        },
        lol: {
            players: players.filter(p => p.game === 'lol').length,
            teams: [...topTeams, ...teams].filter(t => t.game === 'lol').length,
            tournaments: tournaments.filter(t => t.game === 'lol').length,
            prizePool: tournaments.filter(t => t.game === 'lol').reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0)
        }
    };
    
    res.json(gameStats);
});
// Добавь этот маршрут в раздел API Routes
app.get('/api/registered-players', (req, res) => {
    res.json(players);
})

// Вспомогательные функции
function getPopularGame() {
    if (players.length === 0) return 'cs2';
    
    const gameCounts = {};
    players.forEach(player => {
        gameCounts[player.game] = (gameCounts[player.game] || 0) + 1;
    });
    
    return Object.keys(gameCounts).reduce((a, b) => 
        gameCounts[a] > gameCounts[b] ? a : b, 'cs2'
    );
}

// Middleware для логирования
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🎮 Киберспорт портал запущен: http://localhost:${PORT}`);
    console.log(`📊 Статистика:`);
    console.log(`   👥 Игроков: ${players.length}`);
    console.log(`   🏆 Команд: ${topTeams.length + teams.length}`);
    console.log(`   🏅 Турниров: ${tournaments.length}`);
    console.log(`   📰 Новостей: ${news.length}`);
    console.log(`   💰 Общий призовой фонд: $${tournaments.reduce((sum, t) => sum + parseInt(t.prize.replace(/[$,]/g, '')), 0).toLocaleString()}`);
    console.log(`\n🚀 Готов к работе!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Остановка сервера...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Остановка сервера...');
    process.exit(0);
});
