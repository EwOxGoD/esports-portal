// Функционал страницы новостей с CSV экспортом
class NewsManager {
    constructor() {
        this.news = [];
        this.filteredNews = [];
        this.currentPage = 1;
        this.newsPerPage = 8;
        this.currentFilters = {
            category: '',
            game: '',
            search: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadNews();
        this.setupEventListeners();
        this.renderNews();
    }

    // Загрузка новостей
    async loadNews() {
        try {
            const response = await fetch('/api/news');
            this.news = await response.json();
            this.filteredNews = [...this.news];
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            this.loadDemoNews();
        }
    }

    // Демо-новости (более интересные)
    loadDemoNews() {
        this.news = [
            {
                id: 1,
                title: "NAVI побеждает на IEM Katowice 2024!",
                content: "В эпическом финале против FaZe Clan команда NAVI одержала победу со счетом 3:2. s1mple показал невероятную игру, став MVP турнира. Призовой фонд составил $1,000,000.",
                excerpt: "NAVI выигрывает IEM Katowice 2024 в напряженном финале против FaZe Clan",
                date: "2024-03-20",
                category: "results",
                game: "cs2",
                author: "HLTV.org",
                views: 28750,
                likes: 1240,
                comments: 156,
                image: "navi_win",
                tags: ["NAVI", "IEM", "CS2", "Победа", "s1mple"],
                hot: true
            },
            {
                id: 2,
                title: "Team Spirit подписывает нового керри-игрока",
                content: "После ухода легендарного игрока, Team Spirit объявили о подписании контракта с rising star из Восточной Европы. Контракт рассчитан на 2 года.",
                excerpt: "Team Spirit укрепляет состав новым керри-игроком на 2 года",
                date: "2024-03-19",
                category: "transfer",
                game: "dota2",
                author: "Dota2.ru",
                views: 15600,
                likes: 890,
                comments: 203,
                image: "spirit_transfer",
                tags: ["Team Spirit", "Трансфер", "Dota 2"],
                hot: true
            },
            {
                id: 3,
                title: "VALORANT Champions Tour 2024: новый формат",
                content: "Riot Games полностью меняет формат VCT 2024. Теперь будет 3 международных LAN-турнира и изменена система квалификации. Призовой фонд увеличен до $3,000,000.",
                excerpt: "Riot Games анонсирует новый формат VCT 2024 с увеличенным призовым фондом",
                date: "2024-03-18",
                category: "announcement",
                game: "valorant",
                author: "VCT News",
                views: 21800,
                likes: 1560,
                comments: 342,
                image: "vct_new",
                tags: ["VCT", "Valorant", "Анонс", "Riot Games"],
                hot: false
            },
            {
                id: 4,
                title: "G2 Esports выигрывает BLAST Premier Spring Final",
                content: "G2 доминировали на турнире, не проиграв ни одной карты в плей-офф. NiKo был признан лучшим игроком турнира.",
                excerpt: "G2 Esports побеждает на BLAST Premier Spring Final без поражений в плей-офф",
                date: "2024-03-17",
                category: "results",
                game: "cs2",
                author: "BLAST",
                views: 14200,
                likes: 780,
                comments: 98,
                image: "g2_blast",
                tags: ["G2", "BLAST", "CS2", "NiKo"],
                hot: false
            },
            {
                id: 5,
                title: "Новый патч Dota 2 7.35d: баланс героев",
                content: "Valve выпустила обновление 7.35d с значительными изменениями баланса. Мета-герои получили nerf, а непопулярные - buff.",
                excerpt: "Вышел патч Dota 2 7.35d с изменениями баланса героев",
                date: "2024-03-16",
                category: "announcement",
                game: "dota2",
                author: "Dota 2 Team",
                views: 32500,
                likes: 2100,
                comments: 567,
                image: "dota_patch",
                tags: ["Dota 2", "Патч", "Баланс", "Valve"],
                hot: true
            },
            {
                id: 6,
                title: "T1 выигрывает LCK Spring 2024",
                content: "Faker и компания в драматичной серии против Gen.G завоевали титул чемпионов LCK. Серия продлилась все 5 игр.",
                excerpt: "T1 побеждает Gen.G в гранд-финале LCK Spring 2024",
                date: "2024-03-15",
                category: "results",
                game: "lol",
                author: "LCK Official",
                views: 18900,
                likes: 1340,
                comments: 289,
                image: "t1_lck",
                tags: ["T1", "LCK", "LoL", "Faker"],
                hot: false
            },
            {
                id: 7,
                title: "Sentinels подписывает нового игрока из Европы",
                content: "Американская организация укрепляет состав европейским талантом. Игрок известен своими нестандартными стратегиями.",
                excerpt: "Sentinels подписывает европейского игрока для усиления состава",
                date: "2024-03-14",
                category: "transfer",
                game: "valorant",
                author: "VLR.gg",
                views: 11200,
                likes: 650,
                comments: 178,
                image: "sentinels_sign",
                tags: ["Sentinels", "Трансфер", "Valorant"],
                hot: false
            },
            {
                id: 8,
                title: "ESL Pro League Season 19: расписание и команды",
                content: "Опубликовано полное расписание ESL Pro League Season 19. В турнире примут участие 24 команды со всего мира.",
                excerpt: "Анонсировано расписание и список участников ESL Pro League Season 19",
                date: "2024-03-13",
                category: "tournament",
                game: "cs2",
                author: "ESL",
                views: 16700,
                likes: 920,
                comments: 234,
                image: "esl_proleague",
                tags: ["ESL", "Pro League", "CS2", "Расписание"],
                hot: false
            },
            {
                id: 9,
                title: "Team Liquid меняет трех игроков в составе по Dota 2",
                content: "После неудачного сезона Team Liquid проводит масштабный ребрендинг состава. В команду пришли два европейских и один азиатский игрок.",
                excerpt: "Team Liquid полностью обновляет состав по Dota 2 после неудачного сезона",
                date: "2024-03-12",
                category: "transfer",
                game: "dota2",
                author: "Liquid News",
                views: 14300,
                likes: 810,
                comments: 312,
                image: "liquid_dota",
                tags: ["Team Liquid", "Dota 2", "Трансферы", "Ребрендинг"],
                hot: true
            },
            {
                id: 10,
                title: "Новый чемпион в League of Legends - Smolder",
                content: "Riot Games представила нового чемпиона Smolder - маленького дракона. Герой уже доступен для игры на тестовых серверах.",
                excerpt: "В League of Legends добавлен новый чемпион Smolder - дракон",
                date: "2024-03-11",
                category: "announcement",
                game: "lol",
                author: "Riot Games",
                views: 42800,
                likes: 2980,
                comments: 892,
                image: "smolder_lol",
                tags: ["LoL", "Новый чемпион", "Smolder", "Riot"],
                hot: true
            }
        ];
        this.filteredNews = [...this.news];
    }

    // Настройка обработчиков
    setupEventListeners() {
        const categoryFilter = document.getElementById('newsCategoryFilter');
        const gameFilter = document.getElementById('newsGameFilter');
        const searchInput = document.getElementById('newsSearch');
        const loadMoreBtn = document.getElementById('loadMoreNews');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (gameFilter) {
            gameFilter.addEventListener('change', (e) => {
                this.currentFilters.game = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreNews();
            });
        }
    }

    // Применение фильтров
    applyFilters() {
        this.filteredNews = this.news.filter(newsItem => {
            const matchesCategory = !this.currentFilters.category || newsItem.category === this.currentFilters.category;
            const matchesGame = !this.currentFilters.game || newsItem.game === this.currentFilters.game;
            const matchesSearch = !this.currentFilters.search || 
                                newsItem.title.toLowerCase().includes(this.currentFilters.search) ||
                                newsItem.content.toLowerCase().includes(this.currentFilters.search) ||
                                newsItem.tags.some(tag => tag.toLowerCase().includes(this.currentFilters.search));
            
            return matchesCategory && matchesGame && matchesSearch;
        });

        this.currentPage = 1;
        this.renderNews();
    }

    // Рендеринг всех новостей
    renderNews() {
        this.renderFeaturedNews();
        this.renderHotNews();
        this.renderPopularNews();
        this.renderNewsGrid();
    }

    // Главная новость
    renderFeaturedNews() {
        const container = document.getElementById('featuredNews');
        
        if (!container || this.filteredNews.length === 0) return;

        const featuredNews = this.filteredNews[0];
        
        container.innerHTML = `
            <div class="featured-news-card">
                <div class="featured-news-image" style="background: linear-gradient(135deg, ${this.getGameColor(featuredNews.game)});">
                    <div class="news-badge featured-badge">🔥 Главная новость</div>
                    <div class="news-game-badge">${this.getGameEmoji(featuredNews.game)} ${this.getGameName(featuredNews.game)}</div>
                </div>
                <div class="featured-news-content">
                    <div class="news-meta">
                        <span class="news-category">${this.getCategoryName(featuredNews.category)}</span>
                        <span class="news-date">📅 ${this.formatDate(featuredNews.date)}</span>
                        <span class="news-views">👁️ ${featuredNews.views.toLocaleString()}</span>
                    </div>
                    <h2 class="featured-news-title">${featuredNews.title}</h2>
                    <p class="featured-news-excerpt">${featuredNews.excerpt}</p>
                    <div class="news-stats">
                        <span class="news-stat">❤️ ${featuredNews.likes}</span>
                        <span class="news-stat">💬 ${featuredNews.comments}</span>
                    </div>
                    <div class="news-tags">
                        ${featuredNews.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="news-author">✍️ ${featuredNews.author}</div>
                    <button class="btn-primary" onclick="newsManager.readFullNews(${featuredNews.id})">
                        📖 Читать полностью
                    </button>
                </div>
            </div>
        `;
    }

    // Горячие новости
    renderHotNews() {
        const container = document.getElementById('hotNews');
        
        if (!container) return;

        const hotNews = this.news.filter(item => item.hot).slice(0, 5);
        
        container.innerHTML = hotNews.map(newsItem => `
            <div class="hot-news-item" onclick="newsManager.readFullNews(${newsItem.id})">
                <div class="hot-news-badge">🔥</div>
                <div class="hot-news-content">
                    <div class="hot-news-title">${newsItem.title}</div>
                    <div class="hot-news-meta">
                        <span>${this.getGameEmoji(newsItem.game)}</span>
                        <span>${newsItem.views.toLocaleString()} просмотров</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Популярные новости
    renderPopularNews() {
        const container = document.getElementById('popularNews');
        
        if (!container) return;

        const popularNews = [...this.news]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        
        container.innerHTML = popularNews.map(newsItem => `
            <div class="popular-news-item" onclick="newsManager.readFullNews(${newsItem.id})">
                <div class="popular-news-views">👁️ ${newsItem.views.toLocaleString()}</div>
                <div class="popular-news-content">
                    <div class="popular-news-title">${newsItem.title}</div>
                    <div class="popular-news-date">${this.formatDateShort(newsItem.date)}</div>
                </div>
            </div>
        `).join('');
    }

    // Сетка новостей
    renderNewsGrid() {
        const container = document.getElementById('newsGrid');
        const loadMoreBtn = document.getElementById('loadMoreNews');
        
        if (!container) return;

        const startIndex = 1; // Пропускаем главную новость
        const endIndex = this.currentPage * this.newsPerPage;
        const newsToShow = this.filteredNews.slice(startIndex, endIndex);

        if (newsToShow.length === 0 && this.filteredNews.length <= 1) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>😕 Новости не найдены</h3>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        container.innerHTML = newsToShow.map(newsItem => `
            <div class="news-card" data-category="${newsItem.category}" data-game="${newsItem.game}">
                <div class="news-card-image" style="background: linear-gradient(135deg, ${this.getGameColor(newsItem.game)});">
                    <div class="news-badge">${this.getCategoryName(newsItem.category)}</div>
                    ${newsItem.hot ? '<div class="news-hot-badge">🔥 Горячее</div>' : ''}
                    <div class="news-game-indicator">${this.getGameEmoji(newsItem.game)}</div>
                </div>
                <div class="news-card-content">
                    <div class="news-card-meta">
                        <span class="news-card-date">📅 ${this.formatDate(newsItem.date)}</span>
                        <span class="news-card-views">👁️ ${newsItem.views.toLocaleString()}</span>
                    </div>
                    <h3 class="news-card-title">${newsItem.title}</h3>
                    <p class="news-card-excerpt">${newsItem.excerpt}</p>
                    <div class="news-card-stats">
                        <span class="news-card-stat">❤️ ${newsItem.likes}</span>
                        <span class="news-card-stat">💬 ${newsItem.comments}</span>
                    </div>
                    <div class="news-card-footer">
                        <span class="news-card-author">✍️ ${newsItem.author}</span>
                        <button class="btn-secondary btn-sm" onclick="newsManager.readFullNews(${newsItem.id})">
                            📖 Читать
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Показываем/скрываем кнопку "Загрузить еще"
        if (loadMoreBtn) {
            loadMoreBtn.style.display = endIndex >= this.filteredNews.length ? 'none' : 'block';
        }
    }

    // Загрузка дополнительных новостей
    loadMoreNews() {
        this.currentPage++;
        this.renderNewsGrid();
    }

    // Чтение полной новости
    readFullNews(newsId) {
        const newsItem = this.news.find(item => item.id === newsId);
        if (newsItem) {
            this.showNewsModal(newsItem);
        }
    }

    // Экспорт новостей в CSV
    exportNewsToCSV() {
        if (this.filteredNews.length === 0) {
            this.showNotification('❌ Нет данных для экспорта', 'error');
            return;
        }

        const headers = ['Заголовок', 'Категория', 'Игра', 'Автор', 'Дата', 'Просмотры', 'Лайки', 'Комментарии', 'Теги'];
        
        const csvData = [
            '\uFEFF' + headers.join(','),
            ...this.filteredNews.map(news => [
                `"${news.title.replace(/"/g, '""')}"`,
                `"${this.getCategoryName(news.category)}"`,
                `"${this.getGameName(news.game)}"`,
                `"${news.author}"`,
                `"${this.formatDate(news.date)}"`,
                `"${news.views}"`,
                `"${news.likes}"`,
                `"${news.comments}"`,
                `"${news.tags.join(', ')}"`
            ].join(','))
        ].join('\r\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cybersport_news_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('📊 Новости экспортированы в CSV файл', 'success');
    }

    // Модальное окно новости
    showNewsModal(newsItem) {
        const modalHTML = `
            <div class="modal" id="newsModal" style="display: block;">
                <div class="modal-content modal-news">
                    <div class="modal-header">
                        <h3>${newsItem.title}</h3>
                        <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="news-full-meta">
                            <div class="news-full-category">${this.getCategoryName(newsItem.category)}</div>
                            <div class="news-full-date">📅 ${this.formatDate(newsItem.date)}</div>
                            <div class="news-full-views">👁️ ${newsItem.views.toLocaleString()}</div>
                            <div class="news-full-author">✍️ ${newsItem.author}</div>
                        </div>
                        
                        <div class="news-full-game">
                            <span class="game-badge">${this.getGameEmoji(newsItem.game)} ${this.getGameName(newsItem.game)}</span>
                        </div>
                        
                        <div class="news-full-stats">
                            <div class="stat-item">
                                <span class="stat-icon">❤️</span>
                                <span class="stat-value">${newsItem.likes}</span>
                                <span class="stat-label">Лайков</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-icon">💬</span>
                                <span class="stat-value">${newsItem.comments}</span>
                                <span class="stat-label">Комментариев</span>
                            </div>
                        </div>
                        
                        <div class="news-full-content">
                            <p>${newsItem.content}</p>
                        </div>
                        
                        <div class="news-full-tags">
                            <strong>Теги:</strong>
                            ${newsItem.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                        </div>

                        <div class="news-actions">
                            <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">
                                ❌ Закрыть
                            </button>
                            <button class="btn-primary" onclick="newsManager.exportSingleNewsToCSV(${newsItem.id})">
                                📊 Экспорт этой новости
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Экспорт одной новости в CSV
    exportSingleNewsToCSV(newsId) {
        const newsItem = this.news.find(item => item.id === newsId);
        if (!newsItem) return;

        const headers = ['Заголовок', 'Категория', 'Игра', 'Автор', 'Дата', 'Просмотры', 'Лайки', 'Комментарии', 'Теги', 'Контент'];
        
        const csvData = [
            '\uFEFF' + headers.join(','),
            [
                `"${newsItem.title.replace(/"/g, '""')}"`,
                `"${this.getCategoryName(newsItem.category)}"`,
                `"${this.getGameName(newsItem.game)}"`,
                `"${newsItem.author}"`,
                `"${this.formatDate(newsItem.date)}"`,
                `"${newsItem.views}"`,
                `"${newsItem.likes}"`,
                `"${newsItem.comments}"`,
                `"${newsItem.tags.join(', ')}"`,
                `"${newsItem.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`
            ].join(',')
        ].join('\r\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `news_${newsItem.id}_${newsItem.title.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('📊 Новость экспортирована в CSV', 'success');
    }

    // Вспомогательные методы
    getCategoryName(category) {
        const categories = {
            'tournament': '🏆 Турниры',
            'transfer': '🔄 Трансферы',
            'results': '📊 Результаты',
            'announcement': '📢 Анонсы'
        };
        return categories[category] || '📰 Новости';
    }

    getGameName(gameKey) {
        const games = {
            'cs2': 'Counter-Strike 2',
            'valorant': 'Valorant',
            'dota2': 'Dota 2',
            'lol': 'League of Legends'
        };
        return games[gameKey] || gameKey;
    }

    getGameEmoji(gameKey) {
        const emojis = {
            'cs2': '🔫',
            'valorant': '💥',
            'dota2': '⚔️',
            'lol': '⚡'
        };
        return emojis[gameKey] || '🎮';
    }

    getGameColor(gameKey) {
        const colors = {
            'cs2': '#667eea, #764ba2',
            'valorant': '#ff4655, #0f1923',
            'dota2': '#00ff88, #0077ff',
            'lol': '#00a8ff, #9c88ff'
        };
        return colors[gameKey] || '#667eea, #764ba2';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    showNotification(message, type = 'info') {
        if (window.esportsPortal && window.esportsPortal.showNotification) {
            window.esportsPortal.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Добавляем стили для улучшенной страницы новостей
const newsStyles = `
    <style>
        .news-container {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .news-main {
            grid-column: 1;
        }
        
        .news-sidebar {
            grid-column: 2;
        }
        
        .sidebar-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 1.5rem;
        }
        
        .sidebar-section h3 {
            margin-bottom: 1rem;
            color: var(--light);
            font-size: 1.1rem;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 0.5rem;
        }
        
        .hot-news-list,
        .popular-news-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .hot-news-item,
        .popular-news-item {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .hot-news-item:hover,
        .popular-news-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--primary);
            transform: translateX(5px);
        }
        
        .hot-news-badge {
            background: #ff6b6b;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .hot-news-content,
        .popular-news-content {
            flex: 1;
        }
        
        .hot-news-title,
        .popular-news-title {
            font-size: 0.9rem;
            color: var(--light);
            margin-bottom: 0.25rem;
            line-height: 1.3;
        }
        
        .hot-news-meta,
        .popular-news-date {
            font-size: 0.8rem;
            color: var(--gray);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .popular-news-views {
            background: var(--primary);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 10px;
            font-size: 0.7rem;
            font-weight: 600;
        }
        
        .featured-news-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 0;
        }
        
        .featured-news-image {
            position: relative;
            min-height: 350px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
        
        .news-game-badge {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .featured-news-content {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .featured-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }
        
        .featured-news-title {
            font-size: 2rem;
            margin: 1.5rem 0;
            color: var(--light);
            line-height: 1.2;
        }
        
        .featured-news-excerpt {
            color: var(--gray);
            line-height: 1.6;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }
        
        .news-stats {
            display: flex;
            gap: 1.5rem;
            margin: 1rem 0;
        }
        
        .news-stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .news-meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            font-size: 0.9rem;
            color: var(--gray);
        }
        
        .news-category {
            background: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-weight: 600;
        }
        
        .news-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin: 1.5rem 0;
        }
        
        .news-tag {
            background: rgba(255, 255, 255, 0.1);
            color: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }
        
        .news-tag:hover {
            background: var(--primary);
            transform: translateY(-2px);
        }
        
        .news-author {
            color: var(--gray);
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }
        
        .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .news-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .news-card:hover {
            transform: translateY(-8px);
            border-color: var(--primary);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .news-card-image {
            height: 200px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
        }
        
        .news-hot-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
        }
        
        .news-game-indicator {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
        }
        
        .news-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .news-card-content {
            padding: 1.5rem;
        }
        
        .news-card-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: var(--gray);
            margin-bottom: 1rem;
        }
        
        .news-card-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: var(--light);
            line-height: 1.3;
        }
        
        .news-card-excerpt {
            color: var(--gray);
            line-height: 1.5;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }
        
        .news-card-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .news-card-stat {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
        }
        
        .news-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .news-card-author {
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .btn-sm {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }
        
        .load-more-container {
            text-align: center;
            margin-top: 2rem;
        }
        
        .modal-news {
            max-width: 800px;
        }
        
        .news-full-meta {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }
        
        .news-full-category {
            background: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-weight: 600;
        }
        
        .news-full-date,
        .news-full-views,
        .news-full-author {
            display: flex;
            align-items: center;
            color: var(--gray);
        }
        
        .news-full-game {
            margin-bottom: 1.5rem;
        }
        
        .game-badge {
            background: rgba(255, 255, 255, 0.1);
            color: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-weight: 600;
        }
        
        .news-full-stats {
            display: flex;
            gap: 2rem;
            margin: 1.5rem 0;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .stat-icon {
            font-size: 1.2rem;
        }
        
        .stat-value {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--accent);
        }
        
        .stat-label {
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .news-full-content {
            line-height: 1.8;
            color: var(--light);
            font-size: 1.1rem;
        }
        
        .news-full-content p {
            margin-bottom: 1.5rem;
        }
        
        .news-full-tags {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
        }
        
        .news-full-tags strong {
            color: var(--light);
        }
        
        .news-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .news-container {
                grid-template-columns: 1fr;
            }
            
            .news-sidebar {
                grid-column: 1;
            }
            
            .featured-news-card {
                grid-template-columns: 1fr;
            }
            
            .featured-news-image {
                min-height: 200px;
            }
            
            .featured-news-title {
                font-size: 1.5rem;
            }
            
            .news-grid {
                grid-template-columns: 1fr;
            }
            
            .news-full-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .news-full-stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .news-actions {
                flex-direction: column;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', newsStyles);

// Инициализация
let newsManager;

document.addEventListener('DOMContentLoaded', () => {
    newsManager = new NewsManager();
});