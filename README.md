# Global Sun Group - Cabinet

### Личный Кабинет

Установка, запуск и деплой кабинета.

1. Из рут директории `cabinet` запускаем команду `npm i` (установка необходимых пакетов)
2. `npm run start` - Запуск локального сервера для разработки
3. `npm run build:clear` - Сборка минифицированного проекта для деплоя. Проект для деплоя будет находится в папке `build`.
Нужно скопировать все файлы и перенести в папку темы wordpress `\wp-content\themes\global-sun-group\cabinet\`
4. **Важно** Для работы кабинета нужно настроить локальные переменные в localStorage
https://prnt.sc/x4c91w , https://prnt.sc/x4cca6
5. **Важно** Настройка подключения в файле `cabinet\src\config\config.js`, server - wordpress server, apiServer - api server