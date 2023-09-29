import { world, system } from "@minecraft/server"

const overworld = world.getDimension("overworld");

function getScore(player, objective) {
    const score = world.scoreboard.getObjective(objective).getScore(player);
    if (score === undefined) {
        return 0;
    } else {
        return score
    }
}

system.runInterval(() => {
    overworld.runCommand(`scoreboard players add "kothTimer" counters 1`)
}, 20);

system.runInterval(() => {
    if (getScore("kothTimer", "counters") >= 1200 && getScore("kothOn", "counters") === 0) {
        overworld.runCommand(`scoreboard players set "kothTimer" counters 0`)
        overworld.runCommand(`scoreboard players set "kothOn" counters 1`)
        world.sendMessage("§aKoth is now ACTIVE")
    }
    if (getScore("kothTimer", "counters") >= 1200 && getScore("kothOn", "counters") === 1) {
        overworld.runCommand(`scoreboard players set "kothOn" counters 0`)
        world.sendMessage("§cKoth is now INACTIVE")
    }
});

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const { x, y, z } = player.location;
        if (x === -748 && y === -42 && z === -440) {
            player.runCommand("scoreboard players add @s koth 1")
        }
        if (getScore(player, "koth") >= 100) {
            player.runCommand("scoreboard objectives remove koth")
            player.runCommand("scoreboard objectives add koth dummy")
            player.runCommand(`scoreboard players set "kothOn" counters 0`)
            world.sendMessage(`§cKoth is now INACTIVE, §b${player.name} §chas won koth\n §fReward: §a$10,000`)
        }
    }
}, 20);
