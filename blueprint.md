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
