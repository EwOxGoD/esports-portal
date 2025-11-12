// Главный файл для главной страницы
class EsportsPortal {
    constructor() {
        this.init();
    }

    init() {
        this.loadStats();
        this.loadFeaturedTournaments();
        this.loadTopTeams();
        this.loadLatestNews();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    // Загрузка статистики
    async loadStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            document.getElementById('totalPlayers').textContent = stats.totalPlayers.toLocaleString();
            document.getElementById('activeTournaments').textContent = stats.activeTournaments;
            document.getElementById('totalPrize').textContent = `$${(stats.totalPrizePool / 1000000).toFixed(1)}M`;
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        }
    }

    // Загрузка featured турниров
    async loadFeaturedTournaments() {
        try {
            const response = await fetch('/api/tournaments');
            const tournaments = await response.json();
            
            const featured = tournaments.slice(0, 3);
            const container = document.getElementById('featuredTournaments');
            
            container.innerHTML = featured.map(tournament => `
                <div class="tournament-card" data-game="${tournament.game}">
                    <div class="tournament-game">${this.getGameName(tournament.game)}</div>
                    <h3 class="tournament-name">${tournament.name}</h3>
                    <div class="tournament-prize">${tournament.prize}</div>
                    <div class="tournament-date">${this.formatDate(tournament.date)}</div>
                    <div class="tournament-status ${tournament.status === 'active' ? 'status-active' : 'status-upcoming'}">
                        ${tournament.status === 'active' ? 'Активный' : 'Предстоящий'}
                    </div>
                    <div class="tournament-meta">
                        <span>👥 ${tournament.participants} команд</span>
                        <span>🏢 ${tournament.organizer}</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Ошибка загрузки турниров:', error);
        }
    }

    // Загрузка топ команд
    async loadTopTeams() {
        try {
            const response = await fetch('/api/teams');
            const teams = await response.json();
            
            const container = document.getElementById('topTeams');
            
            container.innerHTML = teams.map(team => `
                <div class="team-card" data-game="${team.game}">
                    <div class="team-rank">#${team.ranking}</div>
                    <h3 class="team-name">${team.name}</h3>
                    <div class="team-game">${this.getGameName(team.game)}</div>
                    <div class="team-stats">
                        <div class="team-stat">
                            <div class="team-stat-value">${team.wins}</div>
                            <div class="team-stat-label">Побед</div>
                        </div>
                        <div class="team-stat">
                            <div class="team-stat-value">${team.losses}</div>
                            <div class="team-stat-label">Поражений</div>
                        </div>
                        <div class="team-stat">
                            <div class="team-stat-value">${team.earnings}</div>
                            <div class="team-stat-label">Заработок</div>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Ошибка загрузки команд:', error);
        }
    }

    // Загрузка последних новостей
    async loadLatestNews() {
        try {
            const response = await fetch('/api/news');
            const news = await response.json();
            
            const container = document.getElementById('latestNews');
            
            container.innerHTML = news.map(item => `
                <div class="news-card">
                    <div class="news-image">
                        ${this.getNewsEmoji(item.category)}
                    </div>
                    <div class="news-content">
                        <h3 class="news-title">${item.title}</h3>
                        <div class="news-meta">
                            <span>📅 ${this.formatDate(item.date)}</span>
                            <span>👁️ ${item.views.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Быстрая регистрация
        const quickRegisterForm = document.getElementById('quickRegisterForm');
        if (quickRegisterForm) {
            quickRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickRegistration(quickRegisterForm);
            });
        }

        // CSV регистрация
        const csvRegisterBtn = document.getElementById('csvRegisterBtn');
        if (csvRegisterBtn) {
            csvRegisterBtn.addEventListener('click', () => this.handleCSVRegistration());
        }

        // Просмотр зарегистрированных игроков
        const viewPlayersBtn = document.getElementById('viewPlayersBtn');
        if (viewPlayersBtn) {
            viewPlayersBtn.addEventListener('click', () => this.showRegisteredPlayers());
        }

        // Кнопки авторизации
        document.querySelectorAll('.btn-login').forEach(btn => {
            btn.addEventListener('click', () => this.showLoginModal());
        });

        document.querySelectorAll('.btn-register').forEach(btn => {
            btn.addEventListener('click', () => this.showRegisterModal());
        });
    }

    // Обработка быстрой регистрации
    async handleQuickRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('🎉 Регистрация успешна! Добро пожаловать в киберспорт 2025!', 'success');
                form.reset();
                this.loadStats(); // Обновляем статистику
            } else {
                this.showNotification('❌ Ошибка регистрации', 'error');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            this.showNotification('❌ Ошибка соединения', 'error');
        }
    }

    // Обработка CSV регистрации
    handleCSVRegistration() {
        const fileInput = document.getElementById('csvFile');
        if (!fileInput.files.length) {
            this.showNotification('❌ Выберите CSV файл', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const csvData = e.target.result;
                const players = this.parseCSV(csvData);
                
                if (players.length === 0) {
                    this.showNotification('❌ В файле нет данных', 'error');
                    return;
                }

                this.registerPlayersFromCSV(players);
            } catch (error) {
                console.error('Ошибка парсинга CSV:', error);
                this.showNotification('❌ Ошибка чтения CSV файла', 'error');
            }
        };

        reader.readAsText(file);
    }

    // Парсинг CSV файла
    parseCSV(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(header => header.trim());
        
        const players = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
            const player = {};
            
            headers.forEach((header, index) => {
                player[header] = values[index] || '';
            });
            
            // Проверяем обязательные поля
            if (player.nickname && player.game && player.email) {
                players.push(player);
            }
        }
        
        return players;
    }

    // Регистрация игроков из CSV
    async registerPlayersFromCSV(players) {
        let successCount = 0;
        let errorCount = 0;

        for (const player of players) {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(player)
                });

                const result = await response.json();
                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
            }
        }

        this.showNotification(
            `📊 CSV регистрация завершена: ✅ ${successCount} успешно, ❌ ${errorCount} ошибок`,
            successCount > 0 ? 'success' : 'error'
        );

        this.loadStats(); // Обновляем статистику
    }

    // Показать зарегистрированных игроков
    async showRegisteredPlayers() {
        try {
            const response = await fetch('/api/registered-players');
            const players = await response.json();
            
            this.showPlayersModal(players);
        } catch (error) {
            console.error('Ошибка загрузки игроков:', error);
            this.showNotification('❌ Не удалось загрузить список игроков', 'error');
        }
    }

    // Модальное окно с игроками
    showPlayersModal(players) {
        const modalHTML = `
            <div class="modal" id="playersModal">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3>👥 Зарегистрированные игроки (${players.length})</h3>
                        <button class="close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${players.length === 0 ? 
                            '<div class="no-players">😕 Пока никто не зарегистрировался</div>' :
                            this.renderPlayersTable(players)
                        }
                    </div>
                </div>
            </div>
        `;

        // Удаляем существующее модальное окно если есть
        const existingModal = document.getElementById('playersModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('playersModal');
        modal.style.display = 'block';
        
        this.setupModalHandlers(modal);
    }

    // Рендеринг таблицы игроков
    renderPlayersTable(players) {
        return `
            <div class="players-table-container">
                <div class="table-actions">
                    <button class="btn-secondary" onclick="esportsPortal.exportPlayersToCSV()">
                        📊 Экспорт в CSV
                    </button>
                    <button class="btn-secondary" onclick="esportsPortal.downloadCSVTemplate()">
                        📥 Скачать шаблон CSV
                    </button>
                </div>
                <div class="players-table">
                    <div class="table-header">
                        <div class="table-col">Никнейм</div>
                        <div class="table-col">Игра</div>
                        <div class="table-col">Email</div>
                        <div class="table-col">Ранг</div>
                        <div class="table-col">Опыт</div>
                        <div class="table-col">Дата регистрации</div>
                    </div>
                    ${players.map(player => `
                        <div class="table-row">
                            <div class="table-col">
                                <strong>${player.nickname}</strong>
                            </div>
                            <div class="table-col">
                                <span class="game-badge">${this.getGameEmoji(player.game)} ${this.getGameName(player.game)}</span>
                            </div>
                            <div class="table-col">
                                ${player.email}
                            </div>
                            <div class="table-col">
                                ${player.rank || 'Не указан'}
                            </div>
                            <div class="table-col">
                                <span class="experience-badge ${player.experience}">${this.getExperienceName(player.experience)}</span>
                            </div>
                            <div class="table-col">
                                ${player.registerDate}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Экспорт игроков в CSV
    exportPlayersToCSV() {
        fetch('/api/registered-players')
            .then(response => response.json())
            .then(players => {
                if (players.length === 0) {
                    this.showNotification('❌ Нет данных для экспорта', 'error');
                    return;
                }

                const headers = ['Никнейм', 'Игра', 'Email', 'Ранг', 'Опыт', 'Дата регистрации', 'Статус'];
                
                const csvData = [
                    '\uFEFF' + headers.join(','),
                    ...players.map(player => [
                        `"${player.nickname}"`,
                        `"${this.getGameName(player.game)}"`,
                        `"${player.email}"`,
                        `"${player.rank || 'Не указан'}"`,
                        `"${this.getExperienceName(player.experience)}"`,
                        `"${player.registerDate}"`,
                        `"${player.status === 'active' ? 'Активен' : 'Неактивен'}"`
                    ].join(','))
                ].join('\r\n');

                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `registered_players_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.showNotification('📊 Список игроков экспортирован в CSV', 'success');
            })
            .catch(error => {
                console.error('Ошибка экспорта:', error);
                this.showNotification('❌ Ошибка экспорта', 'error');
            });
    }

    // Скачать шаблон CSV
    downloadCSVTemplate() {
        const template = `nickname,game,email,rank,experience
Player1,cs2,player1@email.com,Global Elite,professional
Player2,valorant,player2@email.com,Radiant,intermediate
Player3,dota2,player3@email.com,Immortal,beginner
Player4,lol,player4@email.com,Challenger,professional`;

        const blob = new Blob(['\uFEFF' + template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'players_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('📥 Шаблон CSV скачан', 'success');
    }

    // Показ уведомлений
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Обработчики модального окна
    setupModalHandlers(modal) {
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    // Инициализация анимаций
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.tournament-card, .team-card, .news-card').forEach(card => {
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

    // Вспомогательные методы
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

    getNewsEmoji(category) {
        const emojis = {
            'news': '📢',
            'tech': '🤖',
            'analysis': '📊',
            'tournament': '🏆'
        };
        return emojis[category] || '📰';
    }

    getExperienceName(experience) {
        const experiences = {
            'beginner': 'Новичок',
            'intermediate': 'Опытный',
            'professional': 'Профессионал'
        };
        return experiences[experience] || experience;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Модальные окна
    showLoginModal() {
        this.showNotification('Форма входа будет реализована в следующем обновлении', 'info');
    }

    showRegisterModal() {
        this.showNotification('Расширенная регистрация будет доступна скоро', 'info');
    }
}

// Добавляем CSS для анимаций и стилей
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    /* Стили для таблицы игроков */
    .players-table-container {
        margin-top: 1rem;
    }

    .table-actions {
        margin-bottom: 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .players-table {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .table-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
        color: var(--light);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .table-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background 0.3s ease;
    }

    .table-row:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .table-row:last-child {
        border-bottom: none;
    }

    .table-col {
        display: flex;
        align-items: center;
    }

    .game-badge {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .experience-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .experience-badge.beginner {
        background: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
        border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .experience-badge.intermediate {
        background: rgba(255, 152, 0, 0.2);
        color: #FF9800;
        border: 1px solid rgba(255, 152, 0, 0.3);
    }

    .experience-badge.professional {
        background: rgba(244, 67, 54, 0.2);
        color: #F44336;
        border: 1px solid rgba(244, 67, 54, 0.3);
    }

    .no-players {
        text-align: center;
        padding: 3rem;
        color: var(--gray);
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .table-header,
        .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }
        
        .table-col {
            justify-content: space-between;
            padding: 0.5rem 0;
        }
        
        .table-col::before {
            content: attr(data-label);
            font-weight: 600;
            color: var(--gray);
            margin-right: 1rem;
        }
        
        .table-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.esportsPortal = new EsportsPortal();
});