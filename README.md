# Weather Dashboard

Современное веб-приложение для отслеживания погоды с красивым интерфейсом и точными прогнозами.

![Weather Dashboard](https://img.shields.io/badge/Version-1.0.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![API](https://img.shields.io/badge/API-Open--Meteo-green)

##  Особенности

-  **Текущая погода** 
-  **Почасовой прогноз** 
-  **Адаптивный дизайн**
-  **Поиск по городам** 
-  **Автоматическое определение**
-  **Быстрая загрузка**

##  Демо

[Посмотреть живую демонстрацию](#) 
https://littleraccoonn.github.io/WebFinal/


##  Установка и запуск

### Предварительные требования

- Веб-браузер с поддержкой JavaScript
- Доступ в интернет
- Локальный веб-сервер (рекомендуется)

### Способ 1: Простое открытие в браузере

1. Скачайте или клонируйте репозиторий:
```bash
git clone https://github.com/your-username/weather-dashboard.git
```

2. Откройте файл `index.html` в браузере:
```bash
cd weather-dashboard
open index.html
```

### Способ 2: Запуск через локальный сервер (рекомендуется)

1. **Установите Live Server** (если используете VS Code):
   - Установите расширение "Live Server"
   - Правой кнопкой на `index.html` → "Open with Live Server"

2. **Или используйте Python**:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. **Или используйте Node.js**:
```bash
npx http-server
```

4. Откройте в браузере: `http://localhost:8000`

### Способ 3: Деплой на GitHub Pages

1. Создайте репозиторий на GitHub
2. Загрузите файлы проекта
3. В настройках репозитория перейдите в раздел "Pages"
4. Выберите ветку `main` и папку `/ (root)`
5. Сохраните - сайт будет доступен по адресу: `https://your-username.github.io/weather-dashboard`

##  Структура проекта

```
weather-dashboard/
├── index.html                 # Главный HTML файл
├── style.css                  # Стили проекта
├── script.js                  # Основная логика
├── photo/                     # Папка с фоновыми изображениями
│   ├── Гроза.Webp
│   ├── Ливневый дождь.jpg
│   ├── Легкий снег.jpg
│   ├── ясно, погода.jpg
│   ├── Переменная облачность.jpg
│   ├── Туман.jpg
│   └── Сильный снег.jpg
└──  README.md                  # Этот файл

```

##  Используемые технологии

### Frontend
- **HTML5** - семантическая разметка
- **CSS3** - стили, анимации, Grid/Flexbox
- **JavaScript ES6+** - интерактивность и работа с API

### API
- **Open-Meteo Geocoding API** - преобразование городов в координаты
- **Open-Meteo Weather API** - получение погодных данных

### Инструменты
- **Fetch API** - HTTP запросы
- **CSS Grid & Flexbox** - layout
- **Font Icons** - векторные иконки

##  API документация

### Geocoding API
```javascript
// Получение координат по названию города
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

### Weather API
```javascript
// Получение погодных данных
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min
```

##  Функции

### Основные функции
-  **Поиск погоды** по названию города
-  **Текущая погода** с детализацией
-  **по часовой прогноз**
-  **Авто-обновление** данных
-  **Адаптивные фоны** в зависимости от погоды
-  **Локализация** дат и времени

### Элементы интерфейса
- **Главный экран**: Температура, город, дата, иконка погоды
- **Панель деталей**: Влажность, ветер, облачность, min/max температура
- **Прогноз**: По дням и часам

##  Использование

1. **Откройте приложение** в браузере
2. **Введите название города** в поле поиска
3. **Нажмите Enter** 
4. **Наслаждайтесь актуальной погодой**!

Примеры городов для тестирования:
- `Bishkek` (Бишкек)
- `London` (Лондон)
- `New York` (Нью-Йорк)
- `Tokyo` (Токио)

##  Разработка

### Добавление новых функций
1. Форкните репозиторий
2. Создайте ветку для новой функции:
```bash
git checkout -b feature/new-weather-alerts
```

3. Внесите изменения и сделайте коммит:
```bash
git commit -m "Add: new weather alert system"
```

4. Запушьте изменения:
```bash
git push origin feature/new-weather-alerts
```

5. Создайте Pull Request

### Локальная разработка
```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/weather-dashboard.git

# 2. Перейдите в папку проекта
cd weather-dashboard

# 3. Запустите локальный сервер
python -m http.server 8000

# 4. Откройте http://localhost:8000
```

##  Возможности для расширения

- [ ] Добавить уведомления о погоде
- [ ] Реализовать карту с погодой
- [ ] Добавить историю поиска
- [ ] Реализовать PWA версию
- [ ] Добавить поддержку темной темы
- [ ] Интегрировать больше погодных API


