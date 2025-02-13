import pandas as pd
import matplotlib.pyplot as plt

# Définition des fichiers CSV
fichiers = {
    "Avancement du projet": "avancement-projet.csv",
    "Dépenses vs Budget": "depenses-budget.csv",
    "Transmission des données": "transmission-donnees.csv",
    "Autonomie énergétique": "autonomie-energie.csv"
}

# Création des graphiques
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle("Tableau de bord KPI - Smart Farming IoT", fontsize=14, fontweight="bold")

# 🔹 Graphique 1 : Avancement du projet
df_avancement = pd.read_csv(fichiers["Avancement du projet"])
axes[0, 0].plot(df_avancement["Mois"], df_avancement["Avancement (%)"], marker='o', color='b', linestyle='-')
axes[0, 0].set_title("Avancement du projet (%)")
axes[0, 0].set_ylabel("%")
axes[0, 0].grid(True)

# 🔹 Graphique 2 : Dépenses vs Budget
df_budget = pd.read_csv(fichiers["Dépenses vs Budget"])
axes[0, 1].plot(df_budget["Mois"], df_budget["Dépenses (€)"], marker='s', color='r', label="Dépenses")
axes[0, 1].plot(df_budget["Mois"], df_budget["Budget alloué (€)"], marker='o', color='g', label="Budget")
axes[0, 1].set_title("Dépenses vs Budget")
axes[0, 1].legend()
axes[0, 1].grid(True)

# 🔹 Graphique 3 : Transmission des données
df_transmission = pd.read_csv(fichiers["Transmission des données"])
axes[1, 0].bar(df_transmission["Mois"], df_transmission["Transmission réussie (%)"], color="purple")
axes[1, 0].set_title("Transmission des données (%)")
axes[1, 0].set_ylabel("%")
axes[1, 0].grid(axis='y')

# 🔹 Graphique 4 : Autonomie énergétique
df_energie = pd.read_csv(fichiers["Autonomie énergétique"])
axes[1, 1].plot(df_energie["Mois"], df_energie["Autonomie (%)"], marker='D', color='orange', linestyle='--')
axes[1, 1].axhline(y=100, color='red', linestyle='dashed', label="Seuil 100%")
axes[1, 1].set_title("Autonomie énergétique (%)")
axes[1, 1].legend()
axes[1, 1].grid(True)

# Ajustement de l'affichage
plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.show()
