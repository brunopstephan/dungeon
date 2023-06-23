const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const bwidth = 16;
const bheight = 16;
const ewidth = 32;
const eheight = 32;
const pwidth = 64;
const pheight = 64;
const bossWidth = 128;
const bossHeight = 128;
const playerHp = 3;
const globalDamage = .5;

//items
const gunList = [
    {
        "id": 0,
        "name": "Metranca",
        "model": "automaticrifle",
        "type": "gun",
        "color": "brown",
    },
    {
        "id": 1,
        "name": "Tralala",
        "type": "gun",
        "model": "burstrifle",
        "color": "green",
    }
];

const foodList = [
    {
        "id": 0,
        "name": "Rato Frito",
        "type": "food",
        "hpGain": globalDamage,
        "color": "yellow"
    },
    {
        "id": 1,
        "name": "Frangolhão Monstro",
        "type": "food",
        "hpGain": 3,
        "color": "orange"
    }
];

const enemieList = [
    //stage 1
    {
        "stage": 1,
        "name": "Big Dididi",
        "life": 20,
        "dmg": globalDamage,
        "speed": 1,
        "shootType": "pistol",
        "width": ewidth,
        "height": eheight,

    },
    {
        "stage": 1,
        "name": "Scarabadu",
        "life": 10,
        "dmg": globalDamage,
        "speed": 5,
        "shootType": "pistol",
        "width": ewidth,
        "height": eheight,
    },

    //stage 2
    {
        "stage": 2,
        "name": "Lwin",
        "life": 40,
        "dmg": globalDamage,
        "speed": 1,
        "shootType": "pistol",
        "width": ewidth,
        "height": eheight,
    },
    {
        "stage": 2,
        "name": "Skripkabum",
        "life": 20,
        "dmg": globalDamage,
        "speed": 7,
        "shootType": "pistol",
        "width": ewidth,
        "height": eheight,
    },
];

var foods = [];
var guns = [];
var enemies = [];

for (let i = 0; i < foodList.length; i++) {
    foods.push({
        "id": foodList[i].id,
        "name": foodList[i].name,
        "type": foodList[i].type,
        "hpGain": foodList[i].hpGain,
        "color": foodList[i].color
    })
}

for (let i = 0; i < enemieList.length; i++) {
    enemies.push({
        "stage": enemieList[i].stage,
        "name": enemieList[i].name,
        "life": enemieList[i].life,
        "dmg": enemieList[i].dmg,
        "speed": enemieList[i].speed,
        "shootType": enemieList[i].shootType,
        "width": enemieList[i].width,
        "height": enemieList[i].height,
    })
}

for (let i = 0; i < gunList.length; i++) {
    guns.push({
        "id": gunList[i].id,
        "name": gunList[i].name,
        "type": gunList[i].type,
        "model": gunList[i].model,
        "color": gunList[i].color,
    })
}

var items = [guns, foods];

//enemy variables
var enemyCanSpawn = true;
var maxEnemies = 1;
var enemyid = 0;
var enemiesNum = 0;;
var enemyX;
var enemyY;
var stages = [];

//game variables
var chamber = 0;

var canPass = false;
var bullets = [];
var enemyBullets = [];
var enemiesSpawned = [];
var inventory = [];
var generatedItems = [];
var canGenerateItem = true;

//mouse variables
var mouseX;
var mouseY;

//automatic gun variable
var burst = false;
var automatic = false;
var rateIncrease = 0;
var burstIncrease = 0;
var rate;

//boss
var bossKilled = 0;

const player = new Player({
    position: {
        x: WIDTH / 2,
        y: HEIGHT / 2
    }
}, pwidth, pheight, "pistol", 10, playerHp);

const gateLeft = new Gate({
    position: {
        x: 0,
        y: HEIGHT / 2 - 50
    }
}, 10, 100);

const gateRight = new Gate({
    position: {
        x: WIDTH - 10,
        y: HEIGHT / 2 - 50
    }
}, 10, 100);

const gateTop = new Gate({
    position: {
        x: WIDTH / 2 - 50,
        y: 0
    }
}, 100, 10);

const gateBottom = new Gate({
    position: {
        x: WIDTH / 2 - 50,
        y: HEIGHT - 10
    }
}, 100, 10);

//functions
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function drawLine(canvas, fromX, fromY, toX, toY, color) {
    canvas.strokeStyle = color;
    canvas.beginPath();
    canvas.moveTo(fromX, fromY);
    canvas.lineTo(toX, toY);
    canvas.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getDelta(speed, pointXA, pointXB, pointYA, pointYB) {

    vx = pointXA - pointXB;
    vy = pointYA - pointYB;
    dist = Math.sqrt(vx * vx + vy * vy);
    dx = vx / dist;
    dy = vy / dist;
    dx *= speed;
    dy *= speed;

    return {
        dx: dx,
        dy: dy
    };
}

function shoot(dmg, posX, posY, bwidth, bheight, dx, dy, array) {
    array.push(new Bullet({
        position: {
            x: posX,
            y: posY
        }
    }, dmg, bwidth, bheight, dx, dy))
}

canvas.addEventListener("mousemove", (e) => {
    var pos = getMousePos(canvas, e);
    mouseX = pos.x;
    mouseY = pos.y;
})


function spawnEnemy(data, stage) {
    stageRand = randomInRange(stage[0], stage[stage.length - 1])
    enemyX = Math.floor(Math.random() * WIDTH);
    enemyY = Math.floor(Math.random() * HEIGHT);
    if (enemyX < WIDTH - 50 && enemyX > 50 && enemyY > 50 && enemyY < HEIGHT - 50) {
        if (data["stage"] == stageRand) {
            enemyDelta = getDelta(1 * data["speed"], player.position.x, enemyX, player.position.y, enemyY);
            enemiesSpawned.push(
                new Enemy({
                    position: {
                        x: enemyX,
                        y: enemyY
                    }
                }, data["name"], data["width"], data["height"], data["dmg"], data["life"], data["shootType"], enemyDelta.dx, enemyDelta.dy, enemyid));
            enemyid++;
        }
    }
}

function generateItem() {
    x = Math.floor(Math.random() * (items.length));
    console.log(x);
    if (items[x].length != 0) {
        y = Math.floor(Math.random() * (items[x].length));
        generatedItems.push(
            new Item({
                position: {
                    x: WIDTH / 2,
                    y: HEIGHT / 2
                }
            }, 32, 32, items[x][y]));
        console.log(x + " " + y + " " + items[x][y].type);
    }
}

function restart() {
    player.currentGun = "pistol";
    player.life = playerHp;
    enemiesSpawned = [];
    enemyid = 0;
    enemyBullets = [];
    enemyCanSpawn = true;
    canGenerateItem = true;
    generatedItems = [];
    bullets = [];
    chamber = 0;
    player.position.x = WIDTH / 2;
    player.position.y = HEIGHT / 2;
    guns = [];
    for (let i = 0; i < gunList.length; i++) {
        guns.push({
            "id": gunList[i].id,
            "name": gunList[i].name,
            "type": gunList[i].type,
            "model": gunList[i].model,
            "color": gunList[i].color,
        })
    }

}


//LOOP
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, WIDTH, HEIGHT);

    drawLine(c, player.position.x + (player.width / 2), player.position.y + (player.height / 2), mouseX, mouseY, "red");

    //entities
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }

    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].update();
    }

    for (let i = 0; i < enemiesSpawned.length; i++) {
        enemiesSpawned[i].update();
    }

    for (let i = 0; i < enemiesSpawned.length; i++) {
        enemiesSpawned[i].hit();
    }

    for (let i = 0; i < enemiesSpawned.length; i++) {
        enemiesSpawned[i].shoot();
    }

    if (enemiesSpawned.length == 0) {
        for (let i = 0; i < generatedItems.length; i++) {
            generatedItems[i].draw();
        }
    }

    //-----------------

    if (chamber < 2 + (bossKilled * 10)) {
        stages = [1];
        maxEnemies = 1;
    }
    if (chamber >= 2 + (bossKilled * 10) && chamber < 4 + (bossKilled * 10)) {
        stages = [1];
        maxEnemies = 2;
    } else if (chamber >= 4 + (bossKilled * 10) && chamber < 7 + (bossKilled * 10)) {
        stages = [1, 2];
        maxEnemies = randomInRange(3, 4);
    } else if (chamber >= 7 + (bossKilled * 10) && chamber < 10 + (bossKilled * 10)) {
        stages = [1, 2];
        maxEnemies = randomInRange(5, 6);
    } else if (chamber == 10 + (bossKilled * 10)) {
        stages = [1, 2];
        maxEnemies = randomInRange(6, 7);
    }

    if (enemyCanSpawn) {
        if (enemiesSpawned.length < maxEnemies) {
            enemyIndex = Math.floor(Math.random() * (enemies.length));
            spawnEnemy(enemies[enemyIndex], stages);
            if (enemiesSpawned.length == maxEnemies) {
                enemyCanSpawn = false;
            }
        }
    }

    if (enemiesSpawned.length == 0) {
        canPass = true;
        color = "gray";
    } else {
        canPass = false;
        color = "red";
    }

    //guns
    //automatic gun
    if (automatic) {
        gunDelta = getDelta(13, (mouseX - (player.width / 2)), player.position.x, (mouseY - (player.height / 2)), player.position.y);
        rateIncrease++;
        rate = 8;
        if (rateIncrease == rate) {
            shoot(player.dmg, player.position.x + (player.width / 2), player.position.y + (player.height / 2), bwidth, bheight, gunDelta.dx, gunDelta.dy, bullets);
            rateIncrease = 0;
        }
    }

    //bust gun
    if (burst) {
        gunDelta = getDelta(13, (mouseX - (player.width / 2)), player.position.x, (mouseY - (player.height / 2)), player.position.y, bullets);
        burstLimit = 3;
        rate = 4;
        if (burstIncrease < burstLimit) {
            rateIncrease++;
            if (rateIncrease == rate) {
                shoot(player.dmg, player.position.x + (player.width / 2), player.position.y + (player.height / 2), bwidth, bheight, gunDelta.dx, gunDelta.dy, bullets);
                rateIncrease = 0;
                burstIncrease++;
            }
        } else {
            burst = false;
            burstIncrease = 0;
        }
    }

    //-------------------------------------

    player.update();
    player.hit();

    gateLeft.passed();
    gateRight.passed();
    gateTop.passed();
    gateBottom.passed();

    if (canPass) {
        if (canGenerateItem) {
            if (generatedItems.length < 1) {
                generateItem();
                if (generatedItems.length > 0) {
                    canGenerateItem = false;
                }
            }
        }

        if (gateRight.pass || gateLeft.pass || gateTop.pass || gateBottom.pass) {

            enemyCanSpawn = true;
            canGenerateItem = true;
            generatedItems = [];
            bullets = [];
            chamber++;

            if (gateRight.pass) {
                gateRight.pass = false;
                player.position.x = 0 + gateRight.width;
            }
            if (gateLeft.pass) {
                gateLeft.pass = false;
                player.position.x = WIDTH - player.width - gateLeft.width;
            }
            if (gateTop.pass) {
                gateTop.pass = false;
                player.position.y = HEIGHT - player.height - gateTop.height;
            }
            if (gateBottom.pass) {
                gateBottom.pass = false;
                player.position.y = 0 + gateBottom.height;
            }
        }
    }
}

animate();