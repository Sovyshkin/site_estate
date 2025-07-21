# Используем официальный образ Node.js
FROM node:18.0.0 as builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем фронтенд
RUN npm run build

# Второй этап - создаем оптимизированный образ
FROM node:18.0.0

WORKDIR /app

# Копируем только необходимые файлы из первого этапа
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.js .

# Указываем порт
EXPOSE 3000

# Команда для запуска сервера
CMD ["node", "index.js"]