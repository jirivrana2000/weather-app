# Weather App

Jednoduchá SPA aplikace pro zobrazení předpovědi počasí na následujících 5 dní.

Aplikace umožňuje vyhledat město pomocí autocomplete, zobrazit předpověď počasí z OpenWeather API a volitelně použít aktuální polohu zařízení.

## Funkce

* vyhledávání města pomocí autocomplete
* lokální seznam měst uložený v `city.list.json`
* předpověď počasí na následujících 5 dní
* zobrazení teploty, času a popisu počasí
* graf vývoje teploty pro jednotlivé dny
* barevné rozlišení teploty v grafu
* možnost použít aktuální polohu zařízení
* automatické formátování data a času podle jazyka prohlížeče
* responzivní zobrazení
* loading a error stavy

## Použité technologie

* **React** – tvorba uživatelského rozhraní
* **TypeScript** – typová kontrola a definice datových modelů
* **Vite** – development server a build nástroj
* **SASS / CSS Modules** – stylování komponent
* **Chart.js** – graf teploty
* **react-chartjs-2** – React integrace Chart.js
* **Web Worker** – vyhledávání v seznamu měst mimo hlavní UI thread
* **OpenWeather API** – data předpovědi počasí

## Spuštění projektu

### Požadavky

Pro spuštění projektu je potřeba mít nainstalovaný:

* Node.js
* npm

### Instalace

npm install

### API klíč

Aplikace používá OpenWeather API.

V kořenovém adresáři vytvoř soubor `.env`:

VITE_OPENWEATHER_API_KEY=your_api_key

Pro získání API klíče je potřeba účet u služby OpenWeather.

Soubor `.env` není součástí Git repozitáře. V projektu je k dispozici `.env.example` jako ukázka požadované konfigurace.

### Vývojový server

npm run dev

Aplikace bude následně dostupná na:

http://localhost:5173

## Podporovaný prohlížeč

Aplikace podporuje poslední verzi:

* Google Chrome

## Vnitřní struktura

Projekt je rozdělen do několika logických celků:

src/
├── components/
│   ├── CitySearch/
│   │   ├── CitySearch.tsx
│   │   └── CitySearch.module.scss
│   │
│   └── Forecast/
│       ├── Forecast.tsx
│       ├── Forecast.module.scss
│       ├── TemperatureChart.tsx
│       └── TemperatureChart.module.scss
│
├── models/
│   ├── city.ts
│   ├── location.ts
│   └── weather.ts
│
├── services/
│   └── weatherService.ts
│
├── utils/
│   ├── forecastUtils.ts
│   ├── formatUtils.ts
│   └── temperatureUtils.ts
│
├── workers/
│   └── citySearch.worker.ts
│
├── App.tsx
├── index.css
└── main.tsx

### `components`

Obsahuje React komponenty odpovědné za uživatelské rozhraní.

#### `CitySearch`

Komponenta zajišťuje:

* zadávání názvu města
* zobrazení výsledků hledání
* výběr místa
* spuštění získání aktuální polohy

#### `Forecast`

Zobrazuje předpověď počasí rozdělenou podle jednotlivých dnů.

Každý den obsahuje jednotlivé časové body předpovědi a informace o teplotě a počasí.

#### `TemperatureChart`

Zobrazuje vývoj teploty během jednotlivých dnů pomocí Chart.js.

### `models`

Obsahuje TypeScriptové datové modely používané v aplikaci.

* `city.ts` – struktura města z lokálního seznamu
* `location.ts` – vybraná geografická poloha
* `weather.ts` – struktura dat předpovědi z OpenWeather API

### `services`

Obsahuje komunikaci s externími službami.

`weatherService.ts` zajišťuje načtení předpovědi z OpenWeather API podle zeměpisné šířky a délky.

### `utils`

Obsahuje čisté pomocné funkce používané napříč aplikací.

* `forecastUtils.ts` – transformace dat předpovědi, například rozdělení jednotlivých záznamů podle dnů
* `formatUtils.ts` – formátování data a času podle jazyka prohlížeče
* `temperatureUtils.ts` – výpočet barvy podle aktuální teploty pro barevné rozlišení grafu

Pomocné funkce jsou oddělené od React komponent, takže komponenty se mohou soustředit především na vykreslování uživatelského rozhraní.

### `workers`

Obsahuje Web Worker pro vyhledávání měst.

Seznam měst je uložen v `public/city.list.json`. Protože se jedná o rozsáhlý soubor, samotné filtrování probíhá ve Web Workeru mimo hlavní JavaScriptové vlákno zodpovědné za uživatelské rozhraní.

Vyhledávání je zároveň debounceováno, aby se filtrování nespouštělo při každém stisku klávesy.

## Princip fungování

Výběr města probíhá následujícím způsobem:

CitySearch
    │
    ▼
vybrané město
    │
    ▼
zeměpisná šířka a délka
    │
    ▼
weatherService
    │
    ▼
OpenWeather API
    │
    ▼
WeatherForecast[]
    │
    ▼
rozdělení podle dnů
    │
    ▼
Forecast + TemperatureChart

Aktuální poloha zařízení používá stejný mechanismus. Geolocation API poskytne souřadnice a ty jsou následně předány `weatherService`.

## Lokalizace data a času

Datum a čas nejsou pevně nastaveny na konkrétní formát.

Aplikace používá jazyk prohlížeče: Intl.DateTimeFormat(navigator.language)

Díky tomu se datum a čas zobrazí podle regionálního nastavení uživatele.

## Architektura

Aplikace je vytvořena funkcionálním přístupem.

React komponenty jsou funkcionální a transformační logika je oddělena od UI. Data získaná z API nejsou přímo měněna; transformace probíhají pomocí čistých funkcí.

Vedlejší efekty, například komunikace s API, jsou izolovány v odpovídajících částech aplikace.

## API

Pro předpověď počasí je použito:

**OpenWeather – 5 Day / 3 Hour Forecast API**

Autocomplete měst využívá lokální soubor:

public/city.list.json

## Vývoj

Projekt byl vyvíjen postupně po jednotlivých funkčních částech. Git historie zachycuje jednotlivé kroky vývoje, například:


feat: add city autocomplete
feat: add weather forecast and separate components
perf: optimize city search with worker and debounce
feat: add current location forecast
feat: add temperature forecast chart
refactor: move helper functions to utils
docs: update README


Každá část byla přidávána samostatně tak, aby bylo možné průběžně ověřovat funkčnost aplikace.
