# Panel sklepu

Prosty panel administracyjny sklepu oparty o **Express** i **MongoDB**. Umożliwia
zarządzanie produktami, klientami i zamówieniami po zalogowaniu, z podziałem na role.

## Uruchomienie

```bash
npm install
npm start
```

Aplikacja wystartuje na **http://localhost:3000** i połączy się z bazą MongoDB.
Przy pierwszym starcie automatycznie tworzą się dwa konta panelu (patrz niżej).

## Logowanie / konta

Po wejściu na stronę zostaniesz przekierowany na `/login.html`. Dostępne konta:

| Konto     | E-mail               | Hasło         | Rola       |
|-----------|----------------------|---------------|------------|
| Admin     | `admin@sklep.pl`     | `admin123`    | `admin`    |
| Podadmin  | `podadmin@sklep.pl`  | `podadmin123` | `podadmin` |

Konta są tworzone automatycznie przy starcie serwera (jeśli jeszcze nie istnieją).
Hasła są hashowane (bcrypt) i trzymane w kolekcji `admins`.

## Role i uprawnienia

| Funkcja                         | Admin | Podadmin        |
|---------------------------------|:-----:|:---------------:|
| Produkty (dodaj/edytuj/usuń)    | ✅    | ✅              |
| Zamówienia (dodaj/edytuj/usuń)  | ✅    | ✅              |
| Użytkownicy — podgląd           | ✅    | ✅              |
| Użytkownicy — zmiany            | ✅    | ❌ (tylko odczyt)|
| Konta panelu (`/admins.html`)   | ✅    | ❌ (ukryte)     |

Podadmin widzi klientów, ale nie może ich dodawać, edytować ani usuwać.
Zakładka „Konta panelu" jest widoczna i dostępna tylko dla admina — ograniczenie
działa zarówno w interfejsie, jak i na poziomie API (`403` dla podadmina).

## Strony

- `/` — pulpit z licznikami (produkty / użytkownicy / zamówienia)
- `/products.html` — zarządzanie produktami
- `/users.html` — klienci sklepu
- `/orders.html` — zamówienia
- `/admins.html` — konta panelu (tylko admin)
- `/login.html` — logowanie

W prawym górnym rogu nawigacji jest przełącznik motywu **🌙 / ☀️** (jasny / ciemny).
Wybór zapamiętywany jest w przeglądarce (`localStorage`).

## Co zostało dodane

Punktem wyjścia był prosty CRUD bez logowania. Dołożone zostało:

- **Logowanie sesyjne** (`express-session` + `bcryptjs`) i wylogowywanie.
- **Ochrona dostępu** — strony panelu i API wymagają zalogowania; bez sesji
  następuje przekierowanie na logowanie, a API zwraca `401`.
- **Konto admina** seedowane automatycznie przy starcie.
- **Hierarchia ról** — `admin` i `podadmin` z ograniczonymi uprawnieniami do klientów.
- **Podstrona „Konta panelu"** wyświetlająca osoby logujące się do panelu
  (tylko dla admina, bez haseł).
- **Pulpit z licznikami** na stronie głównej.
- **Dark mode** — przełącznik w nawigacji, zapamiętywany motyw.

## Struktura

```
server.js          – konfiguracja serwera, sesje, ochrona tras
db.js              – połączenie z MongoDB i seedowanie kont
routes/
  auth.js          – logowanie / wylogowanie / /me
  admins.js        – lista kont panelu (tylko admin)
  products.js      – CRUD produktów
  users.js         – CRUD klientów (zmiany tylko dla admina)
  orders.js        – CRUD zamówień
public/
  *.html           – strony panelu
  style.css        – style + dark mode
  auth.js          – pasek użytkownika, wylogowanie, ukrywanie elementów admina
  theme.js         – przełącznik jasny / ciemny motyw
```

## Uwaga bezpieczeństwa

Dla uproszczenia dane dostępowe do MongoDB (`db.js`) oraz sekret sesji (`server.js`)
są wpisane na stałe w kodzie. Przy wystawianiu aplikacji publicznie należy przenieść
je do zmiennych środowiskowych.
