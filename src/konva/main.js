// ---------------------------------- SCENE ----------------------------- 
// variables globales de la scene
// La scene sera mise à une taille de 0
// lors du dessin, elle prendra la taille de l'écran
// en cas de fermeture; elle n'est pas détruite, on remsa taille à 0
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'container',
  width: 0,
  height: 0,
});

var layer = new Konva.Layer();


// fonction appelée lors du dessin du graphe
// les layers sont effacés de la scene et on redessine les layers
// permet de modifier un graphe, ferùer, redessiner sans recharger la page
function dessiner() {

  let graphe = construire_graphe()

  stage.width(width)
  stage.height(height)

  stage.destroyChildren()
  // ajout d'un bouton de fermeture
  layer.add(new Croix(width))

  // Création des noeuds et calcul de leur positionnement dans le canva
  // Positionnement est calculé comme suit : à équidistance des uns des autres
  // il faut avoir : la taille du contenant et le nombres d'éléments à placer dedans
  // puis l'ordre est respecté selon les numéros de colonne pour les x
  // selon le numéro de la ligne pour les y.
  let noeuds = new Array()
  for (let colonne of graphe.keys()) {
    for (let ligne = 0; ligne < graphe.get(colonne).length; ligne++) {

      let noeud = new Noeud(graphe.get(colonne)[ligne])
      let x = positionner(colonne, width, graphe.size)
      let y = positionner(ligne, height, graphe.get(colonne).length)
      noeud.pos(x, y)
      layer.add(noeud.dessiner())
      noeuds.push(noeud)

    }

  }

  /* ----------------------------------------------------------------------------------- */
  // Pour faire les arcs, il faut connaitre les antécédents d'un noeud :
  // Ajout de chaque antécédent pour un noeud :
  // un noeud contient son sommet et son sommet contient ses antécédents
  // Il faut alors chercher les antécédents et s'il y en a, rechercher le noeud à ajouter
  // dans la liste des noeuds
  // parcourir les noeuds
  noeuds.forEach(noeud => {
    // pour chaque sommet antécédent d'un noeud, on doit retrouver le noeud pour avoir sa position 
    noeud.sommet.pred.forEach(antecedent => {
      // compare la réf de l'antécédent avec la ref d'un sommet dans un noeud, si elles sont égales alors le noeud est bien un antécédent
      noeuds.forEach(n => {
        if (n.sommet == antecedent) noeud.ajouterAntecedent(n)
      })
    })
  })


  // A ce stade, chaque noeud connait ses noeuds antécédents,
  // un arc est un objet ayant un noeud de départ et un noeud d'arrivée
  // on peut créer les arcs facilement
  let arcs = new Array()
  //////////////////////
  noeuds.forEach(noeud => {
    noeud.antecedents.forEach(antecedent => {
      let arc = new Arc(antecedent, noeud)
      layer.add(arc.dessiner())
      arcs.push(arc)
    })
  })

  // Si le graphe devient un peu complexe, les arcs peuvent se chevaucher :
  // Ajout d'un écouteur d'évènemements pour déplacer les noeuds à la souris :
  // update des positions des arcs, algo pas optimal car toutes les positions des arcs sont modifiées,
  // même les arcs non impactés
  noeuds.forEach(noeud => {
    noeud.groupe.on('dragmove', updateArcs)
  })

  function updateArcs() {
    arcs.forEach(arc => {
      arc.update()
    })
  
  }
  
  // dessin de la couche principale
  stage.add(layer)

}


/* ----------- insertion des noeuds, calcul des positions pour les dessiner ---------- */
// fonction util
function positionner(position, contenant, nbreAplacer) {
  return ((position + 1) * (contenant / (nbreAplacer + 1)))
}



