// Функционал для страницы статистики
class StatsManager {
    constructor() {
        this.statsData = {};
        this.init();
    }

    async init() {
        await this.loadStats();
        this.renderStats();
        this.setupCharts();
    }

    // Загрузка статистики
    async loadStats() {
        try {
            const response = await fetch('/api/stats');
            this.statsData = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        }
    }

    // Рендеринг статистики
    renderStats() {
        const container = document.getElementById('statsContainer');
        
        if (!container) return;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card-large">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <div class="stat-number">${this.statsData.totalPlayers || 0}</div>
                        <div class="stat-label">Всего игроков</div>
                    </div>
                </div>
                
                <div class="stat-card-large">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-content">
                        <div class="stat-number">${this.statsData.activeTournaments || 0}</div>
                        <div class="stat-label">Активных турниров</div>
                    </div>
                </div>
                
                <div class="stat-card-large">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <div class="stat-number">$${(this.statsData.totalPrizePool / 1000000 || 0).toFixed(1)}M</div>
                        <div class="stat-label">Общий призовой фонд</div>
                    </div>
                </div>
                
                <div class="stat-card-large">
                    <div class="stat-icon">🎮</div>
                    <div class="stat-content">
                        <div class="stat-number">${this.getGameName(this.statsData.popularGame) || 'CS2'}</div>
                        <div class="stat-label">Самая популярная игра</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-container">
                <div class="chart-card">
                    <h3>Распределение по играм</h3>
                    <div class="chart-placeholder">
                        <p>График распределения игроков по играм</p>
                        <div class="mock-chart">
                            <div class="chart-bar" style="height: 80%; background: #667eea;" title="CS2: 40%"></div>
                            <div class="chart-bar" style="height: 60%; background: #764ba2;" title="Valorant: 30%"></div>
                            <div class="chart-bar" style="height: 40%; background: #00ff88;" title="Dota 2: 20%"></div>
                            <div class="chart-bar" style="height: 20%; background: #ffc107;" title="LoL: 10%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-card">
                    <h3>Активность по месяцам</h3>
                    <div class="chart-placeholder">
                        <p>График активности регистраций</p>
                        <div class="mock-line-chart">
                            <div class="line-point" style="left: 10%; bottom: 20%"></div>
                            <div class="line-point" style="left: 30%; bottom: 40%"></div>
                            <div class="line-point" style="left: 50%; bottom: 70%"></div>
                            <div class="line-point" style="left: 70%; bottom: 50%"></div>
                            <div class="line-point" style="left: 90%; bottom: 80%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Настройка графиков (заглушка)
    setupCharts() {
        // В реальном приложении здесь будет код для Chart.js или другой библиотеки
        console.log('Charts would be initialized here with real data');
    }

    // Вспомогательные методы
    getGameName(gameKey) {
        const games = {
            'cs2': 'CS2',
            'valorant': 'Valorant',
            'dota2': 'Dota 2',
            'lol': 'LoL'
        };
        return games[gameKey] || gameKey;
    }
}

// Добавляем стили для статистики
const statsStyles = `
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .stat-card-large {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: all 0.3s ease;
        }
        
        .stat-card-large:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
        }
        
        .stat-icon {
            font-size: 3rem;
        }
        
        .stat-content {
            flex: 1;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .charts-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
        }
        
        .chart-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .chart-card h3 {
            margin-bottom: 1.5rem;
            color: var(--light);
            text-align: center;
        }
        
        .chart-placeholder {
            text-align: center;
            color: var(--gray);
            padding: 2rem;
        }
        
        .mock-chart {
            display: flex;
            align-items: end;
            justify-content: space-around;
            height: 200px;
            margin-top: 1rem;
            gap: 1rem;
        }
        
        .chart-bar {
            width: 40px;
            border-radius: 5px 5px 0 0;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .chart-bar:hover {
            transform: scale(1.1);
        }
        
        .chart-bar::after {
            content: attr(title);
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .chart-bar:hover::after {
            opacity: 1;
        }
        
        .mock-line-chart {
            position: relative;
            height: 200px;
            border-left: 2px solid var(--gray);
            border-bottom: 2px solid var(--gray);
            margin-top: 1rem;
        }
        
        .line-point {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            transform: translate(-50%, 50%);
        }
        
        .line-point::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            opacity: 0.3;
            transform: translate(-50%, -50%);
        }
        
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .charts-container {
                grid-template-columns: 1fr;
            }
            
            .stat-card-large {
                padding: 1.5rem;
            }
            
            .stat-icon {
                font-size: 2.5rem;
            }
            
            .stat-number {
                font-size: 2rem;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', statsStyles);

// Инициализация статистики
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('statsContainer')) {
        new StatsManager();
    }
});