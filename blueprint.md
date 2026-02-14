# Przegląd

Ta aplikacja to prosty interfejs użytkownika z menu nawigacyjnym po lewej stronie. Umożliwia przełączanie się między różnymi modułami, z których każdy jest reprezentowany jako osobny komponent w aplikacji.

# Plan implementacji

1.  **Zainstaluj `react-router-dom`**: Niezbędny do obsługi routingu po stronie klienta.
2.  **Zrestrukturyzuj projekt**:
    *   Utwórz folder `src/components` na komponenty współdzielone (np. pasek boczny).
    *   Utwórz folder `src/pages` na poszczególne moduły/strony.
    *   W `src/pages` utwórz foldery dla każdego modułu: `Home`, `Dashboard`, `Settings`. Każdy z nich będzie zawierał plik `index.jsx` z komponentem zastępczym.
3.  **Utwórz komponent paska bocznego (`Sidebar`)**:
    *   Będzie zawierał linki do nawigacji między modułami.
4.  **Zaktualizuj `App.jsx`**:
    *   Skonfiguruj główny układ aplikacji z paskiem bocznym i obszarem na treść.
    *   Zdefiniuj trasy dla każdego modułu za pomocą `react-router-dom`.
5.  **Dodaj podstawowe style**:
    *   Dodaj style, aby aplikacja wyglądała przejrzyście i nowocześnie.

# Plan przebudowy modułu "Zjadanie"

## Cel

Przebudowa modułu "Zjadanie", aby stał się wciągającą i grywalną grą w stylu Pac-Mana dla dzieci w wieku 5-10 lat.

## Kroki implementacji

1.  **Stworzenie planszy do gry**:
    *   Zaprojektowanie i implementacja komponentu `GameBoard.jsx`, który będzie renderował planszę gry z siatką, ścianami i korytarzami.
2.  **Stworzenie postaci gracza**:
    *   Zaprojektowanie i implementacja komponentu `Player.jsx`, który będzie reprezentował postać gracza (Pac-Mana).
    *   Implementacja mechaniki poruszania się postacią po planszy za pomocą strzałek na klawiaturze.
3.  **Dodanie "jedzenia" i punktacji**:
    *   Zaprojektowanie i implementacja komponentu `Food.jsx`, który będzie reprezentował kropki do zbierania.
    *   Implementacja mechaniki zbierania "jedzenia" przez gracza.
    *   Dodanie systemu punktacji - każdy zjedzony element dodaje punkty.
4.  **Dodanie "duszków" (przeciwników)**:
    *   Zaprojektowanie i implementacja komponentu `Ghost.jsx`, który będzie reprezentował przeciwników.
    *   Implementacja podstawowej sztucznej inteligencji dla "duszków", aby poruszały się po planszy.
5.  **Dodanie animacji i efektów wizualnych**:
    *   Dodanie animacji poruszania się postaci, "duszków" oraz zbierania "jedzenia".
    *   Zaprojektowanie przyjaznego dla dzieci interfejsu z żywymi kolorami i angażującymi elementami wizualnymi.
6.  **Implementacja logiki gry**:
    *   Dodanie warunków wygranej (zebranie wszystkich kropek) i przegranej (kolizja z "duszkiem").
    *   Dodanie ekranu startowego i ekranu końca gry z wynikami.
7.  **Refaktoryzacja i czyszczenie kodu**:
    *   Podział kodu na mniejsze, reużywalne komponenty.
    *   Zapewnienie zgodności ze standardami i najlepszymi praktykami Reacta.