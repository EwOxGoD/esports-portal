// Функционал страницы команд с модальными окнами
class TeamsManager {
    constructor() {
        this.teams = [];
        this.filteredTeams = [];
        this.currentFilters = {
            game: '',
            region: '',
            search: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadTeams();
        this.setupEventListeners();
        this.renderTeams();
        this.renderLeaderboard();
    }

    // Загрузка команд
    async loadTeams() {
        try {
            const response = await fetch('/api/teams');
            this.teams = await response.json();
            this.filteredTeams = [...this.teams];
        } catch (error) {
            console.error('Ошибка загрузки команд:', error);
            this.showError('Не удалось загрузить команды');
        }
    }

    // Настройка обработчиков
    setupEventListeners() {
        const gameFilter = document.getElementById('teamGameFilter');
        const regionFilter = document.getElementById('regionFilter');
        const searchInput = document.getElementById('teamSearch');

        if (gameFilter) {
            gameFilter.addEventListener('change', (e) => {
                this.currentFilters.game = e.target.value;
                this.applyFilters();
            });
        }

        if (regionFilter) {
            regionFilter.addEventListener('change', (e) => {
                this.currentFilters.region = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    // Применение фильтров
    applyFilters() {
        this.filteredTeams = this.teams.filter(team => {
            const matchesGame = !this.currentFilters.game || team.game === this.currentFilters.game;
            const matchesRegion = !this.currentFilters.region || team.region === this.currentFilters.region;
            const matchesSearch = !this.currentFilters.search || 
                                team.name.toLowerCase().includes(this.currentFilters.search);
            
            return matchesGame && matchesRegion && matchesSearch;
        });

        this.renderTeams();
    }

    // Рендеринг команд
    renderTeams() {
        const container = document.getElementById('teamsRanking');
        
        if (!container) return;

        if (this.filteredTeams.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>😕 Команды не найдены</h3>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredTeams.map(team => `
            <div class="team-ranking-item" data-game="${team.game}" data-region="${team.region}" onclick="teamsManager.showTeamModal(${team.id})">
                <div class="team-rank">#${team.ranking}</div>
                <div class="team-info">
                    <div class="team-avatar" style="background: ${this.getTeamColor(team.name)};">${team.name.substring(0, 2).toUpperCase()}</div>
                    <div class="team-details">
                        <h3>${team.name}</h3>
                        <div class="team-game">${this.getGameName(team.game)} • ${team.region}</div>
                        <div class="team-coach">👨‍💼 Тренер: ${team.coach || 'Не указан'}</div>
                    </div>
                </div>
                <div class="team-stats-extended">
                    <div class="team-stat-extended">
                        <div class="team-stat-value">${team.wins}</div>
                        <div class="team-stat-label">Побед</div>
                    </div>
                    <div class="team-stat-extended">
                        <div class="team-stat-value">${team.losses}</div>
                        <div class="team-stat-label">Поражений</div>
                    </div>
                    <div class="team-stat-extended">
                        <div class="team-stat-value">${this.calculateWinRate(team.wins, team.losses)}%</div>
                        <div class="team-stat-label">Win Rate</div>
                    </div>
                </div>
                <div class="team-rating">
                    <div class="rating-value">${team.earnings}</div>
                    <div class="rating-change ${Math.random() > 0.5 ? 'positive' : 'negative'}">
                        ${Math.random() > 0.5 ? '↗' : '↘'} ${Math.floor(Math.random() * 5) + 1}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Рендеринг лидерборда
    renderLeaderboard() {
        const container = document.getElementById('teamsLeaderboard');
        
        if (!container) return;

        const topTeams = this.teams.slice(0, 10);
        
        container.innerHTML = `
            <div class="leaderboard-header">
                <div class="leaderboard-column">Ранг</div>
                <div class="leaderboard-column">Команда</div>
                <div class="leaderboard-column">Игра</div>
                <div class="leaderboard-column">Регион</div>
                <div class="leaderboard-column">Рейтинг</div>
                <div class="leaderboard-column">Изменение</div>
            </div>
            ${topTeams.map((team, index) => `
                <div class="leaderboard-item ${index < 3 ? 'leaderboard-top' : ''}" onclick="teamsManager.showTeamModal(${team.id})">
                    <div class="leaderboard-rank">
                        ${index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                    </div>
                    <div class="leaderboard-team">
                        <div class="team-avatar-small" style="background: ${this.getTeamColor(team.name)};">${team.name.substring(0, 2).toUpperCase()}</div>
                        <span>${team.name}</span>
                    </div>
                    <div class="leaderboard-game">${this.getGameName(team.game)}</div>
                    <div class="leaderboard-region">${team.region}</div>
                    <div class="leaderboard-rating">${this.calculateRating(team.wins, team.losses)}</div>
                    <div class="leaderboard-change ${Math.random() > 0.5 ? 'positive' : 'negative'}">
                        ${Math.random() > 0.5 ? '↗' : '↘'} ${Math.floor(Math.random() * 10) + 1}
                    </div>
                </div>
            `).join('')}
        `;
    }

    // Показать модальное окно команды
    showTeamModal(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (team) {
            this.renderTeamModal(team);
        }
    }

    // Рендеринг модального окна команды
    renderTeamModal(team) {
        const modalHTML = `
            <div class="modal" id="teamModal" style="display: block;">
                <div class="modal-content modal-team">
                    <div class="modal-header">
                        <h3>${team.name}</h3>
                        <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="team-modal-header">
                            <div class="team-modal-avatar" style="background: ${this.getTeamColor(team.name)};">
                                ${team.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div class="team-modal-info">
                                <div class="team-modal-rank">🏆 Ранг: #${team.ranking}</div>
                                <div class="team-modal-game">🎮 ${this.getGameName(team.game)}</div>
                                <div class="team-modal-region">🌍 ${team.region}</div>
                                <div class="team-modal-founded">📅 Основана: ${team.founded}</div>
                            </div>
                        </div>

                        <div class="team-stats-grid">
                            <div class="team-stat-card">
                                <div class="stat-card-icon">✅</div>
                                <div class="stat-card-value">${team.wins}</div>
                                <div class="stat-card-label">Побед</div>
                            </div>
                            <div class="team-stat-card">
                                <div class="stat-card-icon">❌</div>
                                <div class="stat-card-value">${team.losses}</div>
                                <div class="stat-card-label">Поражений</div>
                            </div>
                            <div class="team-stat-card">
                                <div class="stat-card-icon">📈</div>
                                <div class="stat-card-value">${this.calculateWinRate(team.wins, team.losses)}%</div>
                                <div class="stat-card-label">Win Rate</div>
                            </div>
                            <div class="team-stat-card">
                                <div class="stat-card-icon">💰</div>
                                <div class="stat-card-value">${team.earnings}</div>
                                <div class="stat-card-label">Заработок</div>
                            </div>
                        </div>

                        <div class="team-roster-section">
                            <h4>👥 Состав команды</h4>
                            <div class="team-roster">
                                ${team.roster ? team.roster.map(player => `
                                    <div class="roster-player">
                                        <div class="player-avatar">${player.substring(0, 1).toUpperCase()}</div>
                                        <div class="player-name">${player}</div>
                                        <div class="player-role">${this.getPlayerRole(player, team.game)}</div>
                                    </div>
                                `).join('') : '<p>Состав не указан</p>'}
                            </div>
                        </div>

                        <div class="team-staff-section">
                            <h4>👨‍💼 Тренерский штаб</h4>
                            <div class="team-staff">
                                <div class="staff-member">
                                    <div class="staff-role">Главный тренер</div>
                                    <div class="staff-name">${team.coach || 'Не указан'}</div>
                                </div>
                            </div>
                        </div>

                        ${team.social ? `
                        <div class="team-social-section">
                            <h4>🔗 Социальные сети</h4>
                            <div class="team-social-links">
                                ${team.social.twitter ? `
                                    <a href="https://twitter.com/${team.social.twitter}" class="social-link twitter" target="_blank">
                                        𝕏 Twitter
                                    </a>
                                ` : ''}
                                ${team.social.website ? `
                                    <a href="https://${team.social.website}" class="social-link website" target="_blank">
                                        🌐 Сайт
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}

                        <div class="team-modal-actions">
                            <button class="btn-secondary" onclick="teamsManager.exportTeamToCSV(${team.id})">
                                📊 Экспорт в CSV
                            </button>
                            <button class="btn-primary" onclick="teamsManager.followTeam(${team.id})">
                                ❤️ Подписаться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Экспорт команды в CSV
    exportTeamToCSV(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        const headers = ['Название', 'Ранг', 'Игра', 'Регион', 'Основана', 'Тренер', 'Побед', 'Поражений', 'Win Rate', 'Заработок', 'Состав'];
        
        const csvData = [
            '\uFEFF' + headers.join(','),
            [
                `"${team.name}"`,
                `"${team.ranking}"`,
                `"${this.getGameName(team.game)}"`,
                `"${team.region}"`,
                `"${team.founded}"`,
                `"${team.coach || 'Не указан'}"`,
                `"${team.wins}"`,
                `"${team.losses}"`,
                `"${this.calculateWinRate(team.wins, team.losses)}%"`,
                `"${team.earnings}"`,
                `"${team.roster ? team.roster.join(', ') : ''}"`
            ].join(',')
        ].join('\r\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `team_${team.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification(`📊 Данные команды ${team.name} экспортированы в CSV`, 'success');
    }

    // Подписаться на команду
    followTeam(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (team) {
            this.showNotification(`❤️ Вы подписались на команду ${team.name}!`, 'success');
        }
    }

    // Вспомогательные методы
    calculateWinRate(wins, losses) {
        const total = wins + losses;
        return total > 0 ? Math.round((wins / total) * 100) : 0;
    }

    calculateRating(wins, losses) {
        return Math.round((wins / (wins + losses)) * 1000) + 500;
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

    getTeamColor(teamName) {
        // Генерируем цвет на основе названия команды
        const colors = [
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)',
            'linear-gradient(135deg, #a8edea, #fed6e3)',
            'linear-gradient(135deg, #5ee7df, #b490ca)',
            'linear-gradient(135deg, #d299c2, #fef9d7)'
        ];
        const index = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    }

    getPlayerRole(playerName, game) {
        // Простая логика определения роли (в реальном приложении это бы бралось из данных)
        const roles = {
            'cs2': ['Снайпер', 'Рифлер', 'Поддержка', 'Капитан', 'Люркер'],
            'valorant': ['Дуэлянт', 'Контроллер', 'Стратег', 'Страж', 'Инициатор'],
            'dota2': ['Керри', 'Мидлейнер', 'Офлейнер', 'Хард саппорт', 'Софт саппорт'],
            'lol': ['Топ', 'Джунглер', 'Мид', 'ADC', 'Саппорт']
        };
        
        const gameRoles = roles[game] || ['Игрок'];
        const index = playerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gameRoles.length;
        return gameRoles[index];
    }

    showNotification(message, type = 'info') {
        if (window.esportsPortal && window.esportsPortal.showNotification) {
            window.esportsPortal.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Добавляем стили для модальных окон команд
const teamsStyles = `
    <style>
        .team-ranking-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .team-ranking-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            transform: translateX(10px);
        }
        
        .leaderboard-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .leaderboard-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
        }
        
        .modal-team {
            max-width: 700px;
        }
        
        .team-modal-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
        }
        
        .team-modal-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .team-modal-info {
            flex: 1;
        }
        
        .team-modal-rank {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }
        
        .team-modal-game,
        .team-modal-region,
        .team-modal-founded {
            color: var(--gray);
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
        }
        
        .team-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .team-stat-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .team-stat-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
        }
        
        .stat-card-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .stat-card-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.25rem;
        }
        
        .stat-card-label {
            color: var(--gray);
            font-size: 0.8rem;
        }
        
        .team-roster-section,
        .team-staff-section,
        .team-social-section {
            margin-bottom: 2rem;
        }
        
        .team-roster-section h4,
        .team-staff-section h4,
        .team-social-section h4 {
            margin-bottom: 1rem;
            color: var(--light);
            border-bottom: 2px solid var(--primary);
            padding-bottom: 0.5rem;
        }
        
        .team-roster {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .roster-player {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .roster-player:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateX(5px);
        }
        
        .player-avatar {
            width: 40px;
            height: 40px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: white;
        }
        
        .player-name {
            flex: 1;
            font-weight: 600;
            color: var(--light);
        }
        
        .player-role {
            font-size: 0.8rem;
            color: var(--gray);
            background: rgba(255, 255, 255, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 8px;
        }
        
        .team-staff {
            display: flex;
            gap: 1rem;
        }
        
        .staff-member {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .staff-role {
            font-size: 0.8rem;
            color: var(--gray);
            margin-bottom: 0.5rem;
        }
        
        .staff-name {
            font-weight: 600;
            color: var(--light);
        }
        
        .team-social-links {
            display: flex;
            gap: 1rem;
        }
        
        .social-link {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--light);
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .social-link:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        
        .social-link.twitter {
            border-color: #1DA1F2;
        }
        
        .social-link.website {
            border-color: var(--primary);
        }
        
        .team-modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .team-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .team-modal-header {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
            
            .team-roster {
                grid-template-columns: 1fr;
            }
            
            .team-social-links {
                flex-direction: column;
            }
            
            .team-modal-actions {
                flex-direction: column;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', teamsStyles);

// Инициализация
let teamsManager;

document.addEventListener('DOMContentLoaded', () => {
    teamsManager = new TeamsManager();
});