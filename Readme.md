### В данный момент ведется разработка!!! Не используйте до выхода версии 1.0.

# Инструменты для декларативного программирования
Назначение данного инструмента облегчить типизацию, создавать схемы, которые можно будет использовать для проверки типов в процессе работы (runtime) JS. Данные инструменты, на данный момент, заточены на работу с Typescript языком, для облегчения типизации данных и написание тестов. 

## Применение: 
В проектах с неконтролируемым развитием API, а так же в сложных API разработчик будет писать простые тесты в 3-4 строчки, а так же использовать проверку в runtime, для своевременного определения не состыковок между ожидаемыми данными и пришедшими с API. 

## Алгоритм использования:

1) Получать данные от API во время тестирования;
2) Создание схемы и типа на основе этих данных с помощью "declaration-tools";
3) За тем поместить тип и схему в проект;
4) Написать тест в 3-4 строчки: получить данные, поместить в функцию проверки заранее сгенерированную схему и данные, ожидать ошибку или отсутствие ошибки, если проверка прошла успешно.
5) Поместить в коде проекта функции проверки после получения данных и условие, чтобы эти проверки работали только в проекте во время разработки или тестирования, или на проектах с тестированием на "production";
6) Дополнительно: Отлавливать ошибки теста схемы на тестовой группе на production когда пользователи используют ваше приложение и отправлять отчеты на API логирования. 

## Дорожная карта до версии 1.0:

1) Функция определения типа - 0;
2) Функция создания схемы - 0;
3) Функция проверки схемы - 0;
4) Функция создания Typescript типа для схемы и данных - 0.
