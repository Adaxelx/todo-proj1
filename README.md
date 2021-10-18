# Todo list - testowanie oprogramowania projekt 1.

## Co jest potrzebne do odpalenia projektu:

1. Node.js - https://nodejs.org/en/
2. Mongodb - https://docs.mongodb.com/manual/installation/
3. Docker - jeżeli https://www.docker.com/
4. Mongodb compass (opcjonalne) - przydatne do sprawdzania jak wyglada baza danych https://www.mongodb.com/products/compass
5. Postman (opcjonalne) - aplikacja do wysyłania requestów bez gui https://www.postman.com/

## Jak odpalić aplikacje (lokalnie)

1. Po instalacji potrzebnych narzędzi (node i mongodb szczególnie) wchodzimy w folder **todo** i odpalamy z konsoli **npm install**
2. Po zainstalowaniu odpalamy **npm start** lub **npm run start-dev**. To drugie jest lepsze do developmentu bo nie musimy po każdej zmianie odpalać aplikacji od nowa.

## Jak odpalić aplikacje (docker)

1. Uruchamiamy Dockera
2. W głównym folderze odpalamy **docker-compose up -d**
3. Aplikacja powinna działać na porcie 6868 a baza danych 7017
4. Aby ponownie zbudować aplikacje uruchamiamy **docker-compose down** i **docker-compose build**

## Struktura folderów (krótki opis)

1. bin - pliki konfiguracyjne wygenerowane przez express generator
2. config - pliki konfiguracyjne (w naszym przypadku plik konfiguracyjny do bazy danych)
3. controllers - logika endpointów (w naszym przypadku naszej todo listy)
4. helpers - różne funkcje wspomagające (w naszym przypadku funkcje wspomagające testy)
5. lib - funckje/klasy typowo biblioteczne (w naszym przypadku MemoryDBServer - obiekt z funkcjami biblioteki mongodb-memory-server)
6. models - modele bazy danych mongodb (u nas Todo)
7. routes - obsługa endpointów
8. testConfig - konfiguracja testów
9. node_modules - zbiór bibliotek

## Przydatne linki

1. Z tego korzystałem do startu projektu (no prawie bo zacząłem od express-generatora https://expressjs.com/en/starter/generator.html) - https://www.bezkoder.com/docker-compose-nodejs-mongodb/
2. Konfiguracja testów integracyjnych/end-to-end - https://dev.to/dyarleniber/parallel-tests-in-node-js-with-jest-and-mongodb-without-mocking-4jj2
3. Konfiguracja testów integracyjnych/end-to-end (dodatkowe, bardziej to 1) - https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6
