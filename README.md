# CYOA

CYOA is, as the name suggests, an engine for a choose-your-own-adventure style game.  It's designed to be both very simple and extremely flexible while still being relatively easy to work with.

## Building CYOA

### Prerequisites

In order to build CYOA, you will need [NPM](https://www.npmjs.com/) and [Node.js](https://nodejs.org/).  You can find installation instructions for each of these on their respective web sites.  If you want to host the game locally (as opposed to uploading it to a web server), you should also install some version of [Python](https://www.python.org).

Once you have the `npm` and `node` commands installed, building CYOA is straightforward:

```shell
npm install
node build

# To host the game locally on your computer:
python -m SimpleHTTPServer
# Then navigate to http://localhost:8000.
```

> NOTE: playing the game directly from the file system is not possible due to [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) restrictions.  If you want to play locally, use the `SimpleHTTPServer` command shown above.

### VS Code

CYOA was developed using [Visual Studio Code](https://code.visualstudio.com/).  You don't need VS Code to build or modify the code, but a `.vscode` directory is provided in the repository in case you want to use it.  If you do, you can run the build using `Ctrl+Shift+B`, or `Command-Shift-B` on Mac.

## Writing a Game

CYOA is not a game, it's a game _engine_.  It comes with a (very) simple demo game to show how it works, but you will want to write your own.  This section will tell you how.

### About the Data Files

If you look in the `data` folder, you will see two files there: `game.json`, and `game_schema.json`.  

`game_schema.json` is a computer-readable description of how to write a valid game.  CYOA uses it at startup to validate the game you've written, and it will print out any errors it finds to the browser's console.  (The error messages are not excellent, but they'll hopefully be enough to figure out what went wrong.)  You should _not_ modify this file.

`game.json` is the file that defines the game itself.  This is the file you will edit to write your game.  It is in JSON format; if you aren't familiar with JSON, you should probably [read a little bit about it](https://www.copterlabs.com/json-what-it-is-how-it-works-how-to-use-it/) so you understand what you're looking at.

> TIP: JSON can be pretty hard to read because of all the braces and brackets.  If you're having trouble editing the game data, here are a couple of things to try:
> 1. Convert the JSON to YAML, which is another format that some people find easier to read.  Then edit the YAML, and convert it back to JSON when you're done.  You can do this online using the [JSON2YAML web app](https://www.json2yaml.com/).
> 1. Paste the JSON into an app that will turn it into a visual tree, then edit the tree and copy the JSON back when you're done.  One such app is [JSON Editor Online](http://jsoneditoronline.org/).
> 1. Use a text editor like Visual Studio Code, Sublime Text, or Atom that supports code folding.  This will let you collapse the parts of the file that you don't care about so that you can see just the parts you do.

The `game.json` file is a JSON dictionary (aka an object) with three keys: `stats`, `items`, and `areas`.  We'll talk about stats first.

### Stats

A stat (short for statistic) is a number associated with the player's character.  It can have any value from 0 and 255 (for reasons of historical significance).  You can use stats for all sorts of things: it could represent hit points, strength, character level, or any number of other things.

The value of the `stats` key is a list (aka an array).  Each item in the list is a dictionary with the following four keys:

Key             | Type    | Meaning
----------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------
`name`          | string  | The name by which the rest of the game will refer to the stat.
`visible`       | boolean | `true` if the stat should be shown in the game's stats panel, `false` if it shouldn't.  You can use `false` here for "hidden" stats that the player can't see.
`title`         | string  | The text shown for this stat in the game's stats panel.  You only need this if the stat is visible.
`startingValue` | number  | The initial value of this stat when the player creates a new character.

### Items

Items are things the player can either use or equip.  Examples of items include keys, swords, potions, hats, and trout.  Apart from being fun to collect, using or equipping an item can cause things to happen in the world by meeting requirements.

An item is a dictionary with the following keys:

Key           | Type    | Meaning
--------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------
`name`        | string  | The name by which the rest of the game will refer to the item.
`title`       | string  | The name of the item as it is shown to the player.
`description` | string  | The long description of the item shown to the player.
`equipment`   | boolean | If `true`, this item can be equipped.  If `false`, it can be used.
`consume`     | boolean | If `true`, this item will be taken away from the player when it is used.  This has no effect if `equipment` is `true`.
`slot`        | string  | If this item is equipped, it will cause any other equipped item with the same slot to be unequipped.  This has no effect if `equipment` is `false`.

### Areas

The majority of the game is represented as a list of areas for the player to explore.  Each area can have `requirements` (which will be explained in a moment) that determine whether the player can access it.  At the beginning of the game, the player starts in the first area in the list for which she meets the requirements.

An area is a dictionary with the following keys:

Key            | Type   | Meaning
---------------|--------|------------------------------------------------------------------------------------------------------------------
`title`        | string | The title of the area as shown to the player.
`name`         | string | The name by which the rest of the game will refer to the area.
`description`  | string | The long description of the area shown to the player while they are there.
`requirements` | list   | The list of requirements that must all be met for the user to be able to travel to the area.  This may be empty.
`encounters`   | list   | A list of encounters that may occur in that area.  See the Encounters section below.

### Requirements

Requirements show up in many places within the game.  They determine things like whether the player can access an area, whether they have won an encounter, and whether they can access a certain event within an encounter.  A requirement is a dictionary with the following keys:

Key         | Type   | Meaning
------------|--------|-------------------------------------------------------------------------------------------------
`flags`     | list   | A list of flags that must be either on or off.  (Flags are discussed below.) This may be empty.
`stats`     | list   | A list of stats that must be at least a certain value.
`item`      | string | The name of an item that the player must use.  (Players can only use one item at a time.)
`equipment` | list   | A list of names of equipment the player must be wearing.

#### Stats within Requirements

The way a stat is represented inside `requirements` is simpler than how it's represented at the top level of the file.  It's a dictionary with the following keys:

Key     | Type   | Meaning
--------|--------|-----------------------------------------------------------------------
`name`  | string | The name of the stat (must match the `name` key of an existing stat).
`value` | number | The minimum value the stat must have.

### Flags

Flags are a powerful feature that let you change the world over time as the player explores it.  A flag is a boolean value (that is, either `true` or `false`) that has a name.  So, for example, you might make a flag called `hasKey` that stores whether the player has picked up the key they need to access a secret room.  You can then represent the room as an area that has a requirement that that flag be `true`.  If the flag starts off with a value of `false`, the player won't be able to enter the area until the flag is switched on (which can happen as part of an _effect_, described later on).  When the player quits the game and reloads, the flag will be saved and restored, so the player will still have access to the new area.

Flags can also be specific to an encounter.  These flags are only available within a specific encounter, and are thrown away when the encounter is finished (win or lose).  We'll talk more about these in the Encounters section.

A flag is a dictionary with the following keys:

Key    | Type    | Meaning
-------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------
name   | string  | The name by which the rest of the game will refer to the flag.
value  | boolean | The value of the flag, either `true` or `false`.
global | boolean | Whether the flag is associated with the entire game and saved when the player quits (`true`), or is specific to the current encounter (`false`).

### Encounters

Encounters are what the player does during the game.  When a player is in a given area, they can choose to explore that area.  When they do, they will trigger one of the encounters listed in that area.  Which encounter they trigger is random, but is weighted based on the `chance` value of each encounter.  An encounter with a higher `chance` is more likely.  It's also possible to put requirements on encounters so that the player will only trigger them if certain requirements are met.

An encounter can be won or lost.  Winning the encounter means meeting certain requirements that are set using the `successRequirements` key.  Losing the encounter happens automatically after a certain number of turns, which can be set using the `turns` key.  If the `turns` key has a value of `0`, the encounter will never be lost (which is useful in encounters such as conversations).

An encounter is a dictionary with the following keys:

Key                   | Type   | Meaning
----------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`title`               | string | The title of the encounter which is shown to the player.
`name`                | string | The name by which the rest of the game will refer to the encounter.
`chance`              | number | The relative chance of this encounter happening if the requirements are met.
`requirements`        | list   | A list of requirements for the encounter to be triggered.  If the requirements are met, the encounter might be triggered if its `chance` is sufficiently high.  If they aren't, it will never be triggered no matter what.
`successRequirements` | list   | A list of requirements for the encounter to be won.
`successDescription`  | string | The description shown to the player when the encounter is won.
`successEffects`      | list   | A list of effects that will occur when the encounter is won.  See the Effects section below.
`turns`               | number | The number of turns after which the encounter will be lost.  If `0`, it will never be lost.
`failureDescription`  | string | The description shown to the player when the encounter is lost.
`failureEffects`      | list   | A list of effects that will occur when the encounter is lost. See the Effects section below.
`states`              | list   | A list of states for this encounter.  See the States section below.

### States

Whenever the player is in an encounter, the encounter is in a certain _state_.  A state has a description that is shown to the player, a list of requirements for being in that state, a list of effects that will occur when the state is entered, and a list of actions that the player can take while in the state.

To see why this is useful, imagine an encounter with an angry goblin.  To win the encounter, the player needs to calm the goblin down, then walk away slowly.  We can represent this as a list of states like this:

1. The goblin is angry.  (Requirements: none - this is the state we start in)
   - Action: soothe the goblin (Effects: sets the `goblinSoothed` encounter flag to `true`)
   - Action: throw rocks at the goblin (Effects: none)
2. The goblin is calm.  (Requirements: `goblinSoothed` flag must be `true`)
   - Action: walk away slowly (Effects: sets the `walkAway` encounter flag to `true`)
   - Action: enrage the goblin (Effects: sets the `goblinSoothed` flag to `false`)

We then set the `successCondition` of the encounter to be "`walkAway` flag must be `true`".

When the encounter starts, the only state we meet the requirements for is state 1, and we tell the player the goblin is angry.  We then give them the options of either soothing the goblin or throwing rocks at it.

If the player chooses to soothe the goblin, we set a flag that allows us to progress to state 2, in which the goblin is calm.  This changes the description shown to the player, and also changes the available actions: we can either enrage the goblin (which will put us back to state 1), or we can walk away, which will set the flag needed to win the encounter.

If we set the value of `turns` on the encounter to a low number, then if the player chooses the wrong options for too long, they will lose the encounter (maybe the goblin attacks).  Either way, the encounter ends and the player is returned to the current area.

> TIP: When determining what state the encounter is, the engine first checks the `successRequirements`.  If they aren't satisfied, it always picks the _last_ state for which all the requirements are satisfied.  This lets you write your states in roughly chronological order.

A state is a dictionary with the following keys:

Key            | Type   | Meaning
---------------|--------|-----------------------------------------------------------------------------------------------
`description`  | string | The description shown to the player for this state.
`effects`      | list   | A list of effects that happen when this state is entered.
`actions`      | list   | A list of custom actions the player can perform in this state. See the Actions section below.
`requirements` | list   | A list of requirements for this state to be available.

#### Actions

When in a state within an encounter, the player has a set of actions they can perform.  They can always use or equip an item, and they can also perform any custom actions defined by the state.  

A custom action is a dictionary with the following keys:

Key           | Type   | Meaning
--------------|--------|---------------------------------------------------------------------------------------------------
`name`        | string | The name by which the rest of the game will refer to the action.
`description` | string | The description of the action as shown to the player.
`effects`     | list   | A list of effects that happen when the player chooses this action. See the Effects section below.

### Effects

Effects represent changes to the game's state.  These might be stats changing, flags getting turned on or off, or items being given or taken away from the player.  These might happen when the player enters a certain state within an encounter, or when they win or lose one.

An effect is a dictionary with the following keys:

Key           | Type    | Meaning
--------------|---------|------------------------------------------------------------------------------------------
`changeStats` | list    | A list of changes to be made to the player's stats.  See the Stat Changes section below.
`setFlags`    | list    | A list of global and/or encounter-specific flags to be set to a certain value.
`giveItems`   | list    | A list of item names to give to the player.
`takeItems`   | list    | A list of item names to take away from the player.
`gameOver`    | boolean | If `true`, the game will end once this effect is applied.

#### Stat Changes

A stat change within an effect is a dictionary with the following keys:

Key    | Type   | Meaning
-------|--------|-----------------------------------------------------------------------
`name` | string | The name of the stat to change.
`add`  | number | The amount to add to the stat. Use negative numbers to reduce a stat.

### Putting it All Together

Using all of the features described above, you can create some very rich and complex games.  Take a look at the demo `game.json` file for an example of what you can do.  Don't be afraid to get creative, particularly with encounters.  An encounter might be:

- A shop, where the actions are items you can buy and the `successCondition` is set when you use the "leave" action, and has no effects.
- A campsite, where the states depend on which followers you have obtained and the actions are conversations you can have with each of them.
- A labyrinthine dungeon, where the states are rooms and the actions are directions you can travel.

Above all, have fun!