class Arc {
  constructor(from, to) {
    //this.arc = new Konva.Arrow()
    this.duree = from.sommet.duree;
    this.from = from;
    this.to = to;
    this.groupe = new Konva.Group();
    this.arrow = new Konva.Arrow({
      x: 0,
      y: 0,
      pointerLength: 10,
      pointerWidth: 10,
      fill: "black",
      stroke: "black",
      strokeWidth: 4,
      shadowColor: "black",
      shadowBlur: 12,
      shadowOffset: { x: 5, y: 5 },
    });
    this.text = new Konva.Text({
      text: this.duree.toString(),
      fill: "black",
      fontSize: 20,
      fontFamily: "Calibri",
    });
  }

  dessiner() {
    this.colorier();
    this.update();

    this.groupe.add(this.arrow);
    this.groupe.add(this.text);
    console.log("test function dessiner");
    return this.groupe;
  }

  pos(x, y) {
    this.groupe.position({ x: x, y: y });
  }

  update() {
    this.updatePoints();
    this.updateText();
  }

  updatePoints() {
    let deb = this.from.groupe.position();
    let fin = this.to.groupe.position();
    let padding = 10;

    //placements des points relativement à x et y :
    this.arrow.points([
      deb.x + this.from.width + padding,
      deb.y + this.from.height / 2,
      fin.x - 2 * padding,
      fin.y + this.to.height / 2,
    ]);
  }

  colorier() {
    if (this.from.isCritique() && this.to.isCritique()) {
      this.arrow.fill("red");
      this.arrow.stroke("red");
      this.text.fill("red");
    }
  }

  updateText() {
    let x =
      this.from.groupe.position().x +
      (this.to.groupe.position().x - this.from.groupe.position().x) / 2;
    let y =
      this.from.groupe.position().y +
      (this.to.groupe.position().y - this.from.groupe.position().y) / 2;

    this.text.position({ x: x, y: y });
  }
}

class Bloc {

  constructor(width, height, lettre) {
      this.width = width
      this.height = height
      this.lettre = lettre
      this.groupe = new Konva.Group()
      this.creer()
  }

  creer() {

      this.groupe.add(new Konva.Rect({
          width: this.width,
          height: this.height,
          stroke: 'black',
          fill: 'white',
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffset: { x: 5, y: 5 },
      }))

      this.groupe.add(new Konva.Text({
          text: this.lettre,
          align: 'center',
          verticalAlign: 'middle',
          width: this.width,
          height: this.height,
      }))


      return this.groupe
  }

  pos(x, y) {
      this.groupe.position({ x: x, y: y })
  }

}

class Croix {
  constructor(width) {
    this.groupe = new Konva.Group({
      x: width - 120,
      y: 30,
    });

    this.rect = new Konva.Rect({
      x: 0,
      y: 0,

      strokeWidth: 2,
      cornerRadius: 5,
      shadowColor: '#000',
      shadowBlur: 10,
      shadowOffset: { x: 2, y: 2 },
    });

    this.croix = new Konva.Text({
      text: 'X',
      fontSize: 20,
      fontStyle: 'bold',
      width: 25, 
      height: 25, 
      align: 'center',
      verticalAlign: 'middle',
      color: 'red',
    });

    this.groupe.on('click', () => {
      stage.width(0);
      stage.height(0);
    });

    this.groupe.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });

    this.groupe.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });

    this.groupe.add(this.rect);
    this.groupe.add(this.croix);
    return this.groupe;
  }
}

class Noeud {
  constructor(sommet) {
    this.sommet = sommet;
    this.width = 50;
    this.height = 75;
    //this.bloc_lettre = bloc_lettre
    //this.bloc_min = bloc_min
    //this.bloc_max = bloc_max
    this.bloc_lettre = new Bloc(50, 50, this.sommet.lettre);
    this.bloc_min = new Bloc(25, 25, this.sommet.min.toString());
    this.bloc_max = new Bloc(25, 25, this.sommet.max.toString());

    this.groupe = new Konva.Group({
      draggable: true,
    });

    this.antecedents = new Array();
  }

  dessiner() {
    this.bloc_min.pos(0, 0);
    this.bloc_max.pos(25, 0);
    this.bloc_lettre.pos(0, 25);
    this.add(this.bloc_min);
    this.add(this.bloc_max);
    this.add(this.bloc_lettre);

    this.groupe.on("mouseover", () => {
      document.body.style.cursor = "pointer";
    });

    this.groupe.on("mouseout", () => {
      document.body.style.cursor = "default";
    });

    return this.groupe;
  }

  pos(x, y) {
    this.groupe.position({ x: x, y: y });
  }

  add(bloc) {
    this.groupe.add(bloc.groupe);
  }

  ajouterAntecedent(a) {
    this.antecedents.push(a);
  }

  isCritique() {
    return this.sommet.max - this.sommet.min == 0;
  }
}
