# TerraNobis Mobile

## Problème
L’agriculture africaine fait face à de nombreux défis : manque d’accès à l’expertise agronomique, difficulté à diagnostiquer les sols, manque de recommandations personnalisées, et faible accès à l’innovation numérique pour les petits producteurs.

## Solution
TerraNobis propose une application mobile intelligente qui :
- Permet un diagnostic agricole interactif (formulaire, photo, audio)
- Utilise l’IA Gemini de Google pour fournir des conseils personnalisés, des analyses de sol, et des recommandations de cultures
- Offre une interface conversationnelle audio et multimodale (texte, voix, image)
- Intègre la caméra et le micro pour enrichir l’analyse (photo du sol, question vocale)
- Propose un tableau de bord, un profil utilisateur, et un historique des analyses

## Enjeux
- **Améliorer la productivité agricole** grâce à des conseils adaptés au contexte africain
- **Réduire la fracture numérique** en rendant l’IA accessible aux agriculteurs
- **Favoriser l’agriculture durable** par des recommandations pratiques et localisées
- **Collecter des données terrain** pour améliorer les modèles et l’accompagnement

## Collecte de données
L’application collecte, avec le consentement de l’utilisateur :
- Les photos prises lors du diagnostic (analyse de sol, culture, etc.)
- Les enregistrements audio pour la transcription et l’analyse IA
- Les réponses aux formulaires (localisation, type de sol, superficie, etc.)
- Les interactions avec l’IA (questions/réponses)

Toutes les données sont utilisées uniquement pour fournir un service personnalisé, améliorer la qualité des recommandations, et peuvent être anonymisées pour la recherche agronomique. Aucune donnée n’est partagée à des tiers sans consentement explicite.

---

**Technos principales :**
- React Native (Expo)
- Expo Camera, Expo AV, Expo Image Picker
- API Google Gemini (multimodal)
- Google Speech-to-Text (transcription audio)
- React Navigation, React Native Paper

**Auteur :** TerraNobis Team 