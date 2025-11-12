// Функционал страницы турниров
class TournamentsManager {
    constructor() {
        this.tournaments = [];
        this.filteredTournaments = [];
        this.currentFilters = {
            game: '',
            status: '',
            search: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadTournaments();
        this.setupEventListeners();
        this.renderTournaments();
    }

    // Загрузка турниров
    async loadTournaments() {
        try {
            const response = await fetch('/api/tournaments');
            this.tournaments = await response.json();
            this.filteredTournaments = [...this.tournaments];
        } catch (error) {
            console.error('Ошибка загрузки турниров:', error);
            this.showError('Не удалось загрузить турниры');
        }
    }

    // Настройка обработчиков
    setupEventListeners() {
        // Фильтры
        const gameFilter = document.getElementById('gameFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('tournamentSearch');

        if (gameFilter) {
            gameFilter.addEventListener('change', (e) => {
                this.currentFilters.game = e.target.value;
                this.applyFilters();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
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
        this.filteredTournaments = this.tournaments.filter(tournament => {
            const matchesGame = !this.currentFilters.game || tournament.game === this.currentFilters.game;
            const matchesStatus = !this.currentFilters.status || tournament.status === this.currentFilters.status;
            const matchesSearch = !this.currentFilters.search || 
                                tournament.name.toLowerCase().includes(this.currentFilters.search) ||
                                tournament.organizer.toLowerCase().includes(this.currentFilters.search);
            
            return matchesGame && matchesStatus && matchesSearch;
        });

        this.renderTournaments();
    }

    // Рендеринг турниров
    renderTournaments() {
        const container = document.getElementById('tournamentsList');
        
        if (!container) return;

        if (this.filteredTournaments.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>😕 Турниры не найдены</h3>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredTournaments.map(tournament => `
            <div class="tournament-card-advanced" data-game="${tournament.game}" data-status="${tournament.status}">
                <div class="tournament-header">
                    <div class="tournament-info">
                        <div class="tournament-game">${this.getGameName(tournament.game)}</div>
                        <h3 class="tournament-name">${tournament.name}</h3>
                        <div class="tournament-prize">${tournament.prize}</div>
                    </div>
                    <div class="tournament-status ${tournament.status === 'active' ? 'status-active' : 'status-upcoming'}">
                        ${tournament.status === 'active' ? '🔴 Активный' : '🟢 Предстоящий'}
                    </div>
                </div>
                
                <div class="tournament-meta">
                    <div class="tournament-meta-item">
                        📅 ${this.formatDate(tournament.date)}
                    </div>
                    <div class="tournament-meta-item">
                        🏢 ${tournament.organizer}
                    </div>
                    <div class="tournament-meta-item">
                        📍 ${tournament.location}
                    </div>
                    <div class="tournament-meta-item">
                        👥 ${tournament.participants} команд
                    </div>
                </div>

                <div class="tournament-details">
                    <p><strong>Формат:</strong> ${tournament.format}</p>
                    <p><strong>Период:</strong> ${this.formatDate(tournament.date)} - ${this.formatDate(tournament.endDate)}</p>
                </div>

                <div class="tournament-actions">
                    <button class="btn-secondary" onclick="tournamentsManager.viewTournament(${tournament.id})">
                        📊 Подробнее
                    </button>
                    <button class="btn-primary" onclick="tournamentsManager.registerForTournament(${tournament.id})">
                        🎯 Участвовать
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Просмотр турнира
    viewTournament(tournamentId) {
        const tournament = this.tournaments.find(t => t.id === tournamentId);
        if (tournament) {
            this.showTournamentModal(tournament);
        }
    }

    // Регистрация на турнир
    registerForTournament(tournamentId) {
        const tournament = this.tournaments.find(t => t.id === tournamentId);
        if (tournament) {
            if (tournament.status === 'upcoming') {
                this.showNotification(`Регистрация на турнир "${tournament.name}" будет доступна скоро!`, 'info');
            } else {
                this.showNotification('Регистрация на этот турнир уже закрыта', 'warning');
            }
        }
    }

    // Модальное окно турнира
    showTournamentModal(tournament) {
        const modalHTML = `
            <div class="modal" id="tournamentModal" style="display: block;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${tournament.name}</h3>
                        <span class="close" onclick="this.closest('.modal').style.display='none'">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="tournament-modal-info">
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>Игра:</strong> ${this.getGameName(tournament.game)}
                                </div>
                                <div class="info-item">
                                    <strong>Призовой фонд:</strong> ${tournament.prize}
                                </div>
                                <div class="info-item">
                                    <strong>Дата:</strong> ${this.formatDate(tournament.date)} - ${this.formatDate(tournament.endDate)}
                                </div>
                                <div class="info-item">
                                    <strong>Организатор:</strong> ${tournament.organizer}
                                </div>
                                <div class="info-item">
                                    <strong>Место:</strong> ${tournament.location}
                                </div>
                                <div class="info-item">
                                    <strong>Формат:</strong> ${tournament.format}
                                </div>
                                <div class="info-item">
                                    <strong>Участники:</strong> ${tournament.participants} команд
                                </div>
                                <div class="info-item">
                                    <strong>Статус:</strong> 
                                    <span class="tournament-status ${tournament.status === 'active' ? 'status-active' : 'status-upcoming'}">
                                        ${tournament.status === 'active' ? 'Активный' : 'Предстоящий'}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="tournament-actions" style="margin-top: 2rem;">
                                <button class="btn-primary" onclick="tournamentsManager.registerForTournament(${tournament.id})">
                                    🎯 Зарегистрироваться
                                </button>
                                <button class="btn-secondary" onclick="this.closest('.modal').style.display='none'">
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Добавляем стили для модального окна
        const modalStyles = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: var(--darker);
                    margin: 5% auto;
                    padding: 0;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 600px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: modalSlideIn 0.3s ease;
                }
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .modal-header h3 {
                    margin: 0;
                    color: var(--light);
                }
                .close {
                    color: var(--gray);
                    font-size: 2rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                .close:hover {
                    color: var(--light);
                }
                .modal-body {
                    padding: 2rem;
                }
                .info-grid {
                    display: grid;
                    gap: 1rem;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
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

    formatDate(dateString) {
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

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Инициализация
let tournamentsManager;

document.addEventListener('DOMContentLoaded', () => {
    tournamentsManager = new TournamentsManager();
});