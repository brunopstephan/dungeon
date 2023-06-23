//classes
//player class
class Player {
    constructor({ position }, width, height, currentGun, dmg, life) {
        this.position = position;
        this.dmg = dmg;
        this.life = life;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.currentGun = currentGun;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.fillStyle = "black";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        if (this.position.x + this.velocity.x > 0 && this.position.x + this.velocity.x < WIDTH - this.width && this.position.y + this.velocity.y > 0 && this.position.y + this.velocity.y < HEIGHT - this.height) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    hit() {
        for (let i = 0; i < enemyBullets.length; i++) {
            if (enemyBullets[i].position.y < this.position.y + this.height && enemyBullets[i].position.y + enemyBullets[i].height > this.position.y &&
                enemyBullets[i].position.x < this.position.x + this.width && enemyBullets[i].position.x + enemyBullets[i].width > this.position.x) {
                this.life -= enemyBullets[i].dmg;
                enemyBullets.splice(i, 1);
                console.log("hitou || vida = " + this.life);
                if (this.life <= 0) {
                    restart();
                }
            }
        }
    }
}

class Enemy {
    constructor({ position }, name, width, height, dmg, life, shootType, dx, dy, id) {
        this.name = name;
        this.position = position;
        this.dmg = dmg;
        this.life = life;
        this.dx = dx;
        this.dy = dy;
        this.shootType = shootType;
        const direction = {
            x: Math.random() - 0.5 >= 0 ? -dx : dx,
            y: Math.random() - 0.5 >= 0 ? -dy : dy,
        };

        this.velocity = {
            x: direction.x,
            y: direction.y,
        };
        this.width = width;
        this.height = height;
        this.id = id;
        this.initLife = life;
        this.rate = 0;
        this.gunDelta = 0;
        this.rateIncrease = 0;
        this.initialShot = 0;
    }

    draw() {
        var lifeDecrease = 0;
        c.fillStyle = "rgba(0, 0, 0, 0.2)";
        c.fillRect(this.position.x, this.position.y - 20, this.width, 10);
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        lifeDecrease += (this.life * this.width) / this.initLife;
        c.fillRect(this.position.x, this.position.y - 20, lifeDecrease, 10);
    }

    update() {
        this.draw();
    
        if (this.position.x + this.velocity.x <= 0 || this.position.x + this.width + this.velocity.x >= WIDTH) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.position.y + this.velocity.y <= 0 || this.position.y + this.height + this.velocity.y >= HEIGHT) {
            this.velocity.y = -this.velocity.y;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
    }

    shoot() {
        this.gunDelta = getDelta(6, this.position.x, player.position.x + (player.width / 2), this.position.y, player.position.y + (player.height / 2));
        if(this.shootType == "pistol"){
            this.rate = 75;
            if(this.initialShot < 1){
                shoot(this.dmg, this.position.x, this.position.y, bwidth, bheight, -this.gunDelta.dx, -this.gunDelta.dy, enemyBullets);
                this.initialShot++;
            }
            this.rateIncrease++;
            if (this.rateIncrease == this.rate) {
                shoot(this.dmg, this.position.x, this.position.y, bwidth, bheight, -this.gunDelta.dx, -this.gunDelta.dy, enemyBullets);
                this.rateIncrease = 0;
    
            }
        }

        if(this.shootType == "automatic"){
            this.rate = 23;
            if(this.initialShot < 1){
                shoot(this.dmg, this.position.x, this.position.y, bwidth, bheight, -this.gunDelta.dx, -this.gunDelta.dy, enemyBullets);
                this.initialShot++;
            }
            this.rateIncrease++;
            if (this.rateIncrease == this.rate) {
                shoot(this.dmg, this.position.x, this.position.y, bwidth, bheight, -this.gunDelta.dx, -this.gunDelta.dy, enemyBullets);
                this.rateIncrease = 0;
                this.rateIncrease = 0;
            }
        }
    }

    hit() {
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].position.y < this.position.y + this.height && bullets[i].position.y + bullets[i].height > this.position.y &&
                bullets[i].position.x < this.position.x + this.width && bullets[i].position.x + bullets[i].width > this.position.x) {
                this.life -= bullets[i].dmg;
                bullets.splice(i, 1);
                if (this.life <= 0) {
                    enemiesSpawned.splice(this.id, 1);
                    enemyid--;
                    for (let i = 0; i < enemiesSpawned.length; i++) {
                        if (enemiesSpawned[i].id > this.id) {
                            enemiesSpawned[i].id--;
                        }
                    }
                }
            }
        }
    }
}

//bullet Class
class Bullet {
    constructor({ position }, dmg, width, height, dx, dy) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.dmg = dmg;
    }

    draw() {
        c.beginPath();
        c.fillStyle = "black";
        c.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI);
        c.fill();
    }

    update() {
        this.draw();
        this.velocity.x = this.dx;
        this.velocity.y = this.dy;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//gate class
class Gate {
    constructor({ position }, width, height) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.pass = false;
    }

    draw() {
        c.fillStyle = color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    passed() {
        this.draw();
        if (canPass) {
            if (player.position.x + player.width > this.position.x && player.position.x < this.position.x + this.width &&
                player.position.y + player.height > this.position.y && player.position.y < this.position.y + this.height) {
                this.pass = true;
            }
        }
    }
}

//Item Class
class Item {
    constructor({ position }, width, height, data) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.data = data;
    }

    draw() {
        c.fillStyle = this.data["color"];
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    catch() {
        if (player.position.x + player.width > this.position.x && player.position.x < this.position.x + this.width &&
            player.position.y + player.height > this.position.y && player.position.y < this.position.y + this.height) {

            canGenerateItem = false;

            if (this.data["type"] == "food") {
                player.life += this.data["hpGain"];
                if (player.life > playerHp) {
                    player.life = playerHp;
                }
                console.log("Você pegou um(a): " + this.data["name"] + " e regenerou " + this.data["hpGain"] + " de vida!");
                console.log("Vida atual: " + player.life);
            }

            if (this.data["type"] == "gun") {
                player.currentGun = this.data["model"];
                guns.splice(this.data["id"], 1);
                for (let i = 0; i < guns.length; i++) {
                    if (guns[i].id > this.data["id"]) {
                        guns[i].id--;
                    }
                }
                console.log("Você pegou um(a): " + this.data["name"] + "!");
            }

            generatedItems = [];
        }
    }
}

