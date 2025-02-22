# Liste des données à inclure dans la bas de données

## Données Globales de la serre

- Diamètre de la serre
- Localisation de la serre, coordonnées gps
- Température moyenne dans la serre
- Humidité moyenne
- Luminosité moyenne

## Données par capteur

- id
- type
- statut

## Photo

- nom
- id
- date
- heure

## Mesure

- id mesure
- date
- valeur
- unite

## unite/grandeur

- humidité ext
- humidité basse profondeur
- humidité profondeur
- temperature ext
- temperature basse profondeur
- temperature profondeur

## La carotte

- id
- charge de la batterie
- statut de connexion
- etat du système

## Device

id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
mac_adr VARCHAR(255) NOT NULL,

## diagramme

[Diagramme Excalidraw](https://excalidraw.com/#json=-SP7ESy_ZjPYgTvdbngr4,mQdFdOpaE416_2AZIF2D5Q)
