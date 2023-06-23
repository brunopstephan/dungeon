addEventListener("keydown", (e) => {
    const speed = 6;
    switch (e.key) {
        case "w":
            player.velocity.y = -speed;
            break;
        case "s":
            player.velocity.y = speed;
            break;
        case "a":
            player.velocity.x = -speed;
            break;
        case "d":
            player.velocity.x = speed;
            break;

        case "e":
            for (let i = 0; i < generatedItems.length; i++) {
                generatedItems[i].catch();
            }
            break;

        case "W":
            player.velocity.y = -speed;
            break;
        case "S":
            player.velocity.y = speed;
            break;
        case "A":
            player.velocity.x = -speed;
            break;
        case "D":
            player.velocity.x = speed;
            break;

        case "E":
            for (let i = 0; i < generatedItems.length; i++) {
                generatedItems[i].catch();
            }
            break;
    }
})

addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            player.velocity.y = 0;
            break;
        case "s":
            player.velocity.y = 0;
            break;
        case "a":
            player.velocity.x = 0;
            break;
        case "d":
            player.velocity.x = 0;
            break;

        case "W":
            player.velocity.y = 0;
            break;
        case "S":
            player.velocity.y = 0;
            break;
        case "A":
            player.velocity.x = 0;
            break;
        case "D":
            player.velocity.x = 0;
            break;
    }
})


canvas.addEventListener("mousedown", () => {
    delta =  getDelta(13, (mouseX - (player.width / 2)), player.position.x, (mouseY - (player.height / 2)), player.position.y);

    if(player.currentGun == "pistol") {
        shoot(player.dmg, player.position.x + (player.width / 2), player.position.y + (player.height / 2), bwidth, bheight, delta.dx, delta.dy, bullets);
    }
    if(player.currentGun == "automaticrifle"){
        shoot(player.dmg, player.position.x + (player.width / 2), player.position.y + (player.height / 2), bwidth, bheight, delta.dx, delta.dy, bullets);
        automatic = true;
    }
    if(player.currentGun == "burstrifle"){
        burst = true;
    }
    if(player.currentGun == "lasergun"){
        laser = true;
    }

})

canvas.addEventListener("mouseup", () => {
    automatic = false;
    laser = false;
    rateIncrease = 0;
})

