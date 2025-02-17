<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />
        
        <div class="flex-1 flex overflow-hidden justify-center">
            <div class="flex max-w-[1000px] overflow-auto">
                <ContentRenderer class="markdown-renderer" :value="data" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    // const fooPost = await queryCollection('test').all().then((data) => console.log(data));

    const { data } = await useAsyncData('/', async () => {
        let data = await queryCollection('test').path('/docs/gestion-de-projet/milestone-1/readme').first()

        data.body.value = fixImagesPath(data.body.value);

        console.log(data);

        return data;
    });

    function fixImagesPath(data: Array<any>): Array<any> {
        for(let i = 0; i < data.length; i++) {
            if(data[i] == 'img') {
                data[i + 1].src = "/resources-and-management/docs/gestion de projet/milestone 1/" + data[i + 1].src
            } else if(data[i] instanceof Array) data[i] = fixImagesPath(data[i]);
        }

        return data;
    }

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][0]]);
</script>

<style scoped>

</style>

resources-and-management

<!-- "# Milestone 1
\n
\n## Structure de découpage du projet, PBS : Product Breakdown Structure
\n
\n![PBS](images/pbs.png)
\n
\n## L’organigramme des tâches, WBS : Work Breakdown Structure
\n
\n![WBS](images/wbs.png)
\n
\n## Gestions des risques, AMDEC
\n
\n![AMDEC](images/amdec.png)
\n
\n## Gestion des tâches et du code, Gantt et Kanban (tableau de bord)
\n
\nNous avons décidé d'utiliser les outils intégrés dans GitHub pour gérer notre projet. Nous avons donc utilisé les `issues` pour lister les tâches à réaliser, les `milestones` pour définir les étapes du projet et les projets pour organiser les tâches.
\n
\nTous ces éléments sont accessibles depuis le tableau de bord du projet dans lequel plusieurs vues sont disponibles telles que le tableau `kanban`, le tableau de bord des `issues` et `pull requests` et le Gantt.
\n
\nVue Kanban : [https://github.com/orgs/IOT-Project-EI4/projects/3/views/2](https://github.com/orgs/IOT-Project-EI4/projects/3/views/2)
\n
\n![Kanban](images/kanban.png)
\n
\nVue Gantt : [https://github.com/orgs/IOT-Project-EI4/projects/3/views/1](https://github.com/orgs/IOT-Project-EI4/projects/3/views/1)
\n
\n![Gantt](images/gantt.png)
\n
\n## Communication
\n
\nPour la communication, nous avons mis en place un groupe WhatsApp pour les échanges rapides par messages et nous utiliserons aussi les outils de GitHub pour l'assignation des nouvelles tâches.
\n
\n## Plannification
\n
\nPour l'organisation et les revues en groupes, nous allons utiliser les horaires de cours prévu pour le projet. Nous avons aussi prévu des revues juste avant l'oral de chaque rendu pour s'assurer que tout est prêt.
\n
\n![Plannification des revues de groupe](images/plannification.png)
\n
\nVoici une estimation de la plannification des différentes phases du projet du 29 Janvier au 8 Avril :
\n
\n![Plannification](images/plannification2.png)
\n
\n## Charte d'équipe
\n
\nLa charte d'équipe est disponible ici : [Charte d'équipe](management/charte.md)
\n
\n## Fiches d'auto évaluation
\n
\n[Valentin Le Lievre](management/fiches%20auto%20evaluation/valentin%20le%20lievre.pdf), [Jana Dagher](management/fiches%20auto%20evaluation/jana%20dagher.pdf), [Inessa Kechek](management/fiches%20auto%20evaluation/inessa%20kechek.pdf), [Joakim Lagarde](management/fiches%20auto%20evaluation/joakim%20lagarde.pdf)
\n
\n## Tests de perception
\n
\n[Valentin Le Lievre](management/tests%20de%20perception/valentin%20le%20lievre.xlsx), [Jana Dagher](management/tests%20de%20perception/jana%20dagher.xlsx), [Inessa Kechek](management/tests%20de%20perception/inessa%20kechek.xlsx), [Joakim Lagarde](management/tests%20de%20perception/joakim%20lagarde.xlsx)
\n
\n## Schéma fonctionnel et description des fonctionnalités
\n
\nDescription des fonctionnalités :
\n
\n- captage de la température et de l'humidité du sol en profondeur
\n- captage de la température et de l'humidité du sol en surface
\n- captage da la luminiosté ainsi que son spectre de couleur
\n- captage du taux de CO2 ambiant
\n- captage de la température et de l'humidité de l'air
\n- camera pour prendre des images
\n- communication LoRaWAN pour envoyer les données (sauf images)
\n- communication 5G (ou wifi au besoin) pour envoyer les images
\n- alimentation par batterie et panneau solaire
\n- interface web pour visualiser les données
\n
\n<br />
\n
\n![Schéma bloc des fonctionnalitées](images/bloc%20diagram.png)
\n
\n![Dessin fonctionnel du module](images/module.png)
\n
\n## Cahier des charges
\n
\nLe cahier des charges est disponible ici : [Cahier des charges](cahier%20des%20charges.md)
\n
\n## Liste du matériel nécessaire
\n
\nLa liste du matériel que nous avons sélectionné est disponible ici : [Liste matériel](hardware%20list.md)
\n
\n## Budget prévisionnel
\n
\n### Matériel
\n
\n![Coût Matériel](images/cout-materiel.png)
\n
\n### Main-d'œuvre
\n
\n![Coût de la main-d'œuvre](images/cout-main-doeuvre.png)
\n
\n### Total
\n
\n![Coût Total](images/cout-total.png)
\n
\n## Bibliographie
\n
\nLiens vers les ressources utilisées : [Bibliographie.md](management/bibliographie.md)
\n" -->