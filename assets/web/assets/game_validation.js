class GameValidation {    
    //constructor(tilesOnHand, tilesShow) {
    constructor(tilesOnHand) {
        this._tilesOnHand = tilesOnHand;
        //this._tilesShow   = tilesShow;

        this._errorMessage = "";
        this._allSpecialPatterns = [];
        this._allPossibleTiles = [];
        this._allPossiblePatterns = [];
        this._allIsSpecials = [];

        // 21 - 29 筒字
        // 31 - 39 索字
        // 41 - 49 萬字
        // 51, 53, 55, 57 東南西北
        // 61, 63, 65 中發白
        // 71, 72, 73, 74 春夏秋冬
        // 81, 82, 83, 84 梅蘭菊竹    
        this._allPins = ["21","22","23","24","25","26","27","28","29"];
        this._allBamboos = ["31","32","33","34","35","36","37","38","39"];
        this._allMans = ["41","42","43","44","45","46","47","48","49"];
        this._allWinds = ["51","53","55","57"];
        this._allDragons = ["61","63","65"];
        this._allFlowersFlower = ["71","72","73","74"];
        this._allFlowersSeason = ["81","82","83","84"];
    
        this._allTiles = this._allPins.concat(this._allBamboos, this._allMans, this._allWinds, this._allDragons);
    }

    get allSpecialPatterns() {
        return this._allSpecialPatterns;
    }

    get allPossiblePatterns() {
        return this._allPossiblePatterns;
    }

    get allPossibleTiles() {
        return this._allPossibleTiles;
    }

    get allIsSpecials() {
        return this._allIsSpecials;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    process() {
        "use strict";

        var propertilesOnHandNumbers = [1, 4, 7, 10, 13, 16];
        
        if (propertilesOnHandNumbers.indexOf(this._tilesOnHand.length) == -1) {
            this._errorMessage = "Number of mahjong on hand does not fit";
            return -1;
        }

        //Add all feasible mahjong one by one to check if it can win the game
        for (var i = 0; i < this._allTiles.length; i ++) {
            //var completeTiles = this._tilesOnHand.concat(this._tilesShow);
            var completeTiles = this._tilesOnHand.slice();
            completeTiles.push(this._allTiles[i]);
            completeTiles.sort(function(a,b){return a - b});
  
            var resultPatternsForSpecificTile = [];

            if (this.preCheck(completeTiles)) {
                var pattern = this.checkSpecialPatterns(completeTiles);

                if (pattern > 0) {
                    this._allSpecialPatterns.push(pattern);
                    this._allPossibleTiles.push(this._allTiles[i]);
                    this._allIsSpecials.push('1');
                    this._allPossiblePatterns.push(completeTiles);
                }

                //if not 十六不搭 nor 十三么
                if (pattern == 0 || pattern == 3 || pattern == 4) {	
                    var pairs = this.findPairs(completeTiles);

                    for (var j = 0; j < pairs.length; j ++) {
                        //Try 4 approaches to check if the tile set is valid
                        
                        //1. small to large tiles, find pong and then eat 
                        var resultPattern = [];
                        var processCompleteTiles = this.setEmpty(completeTiles.slice(), pairs[j], 2);
                        resultPattern.push(new Array(pairs[j], pairs[j]));
                        for (var k = 0; k < processCompleteTiles.length; k ++) {
                            if (processCompleteTiles[k] != '') {
                                //find and remove pong
                                if (this.isPong(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 3);
                                    resultPattern.push(new Array(tile1.toString(), tile1.toString(), tile1.toString())); 
                                }
                                //find and remove eat
                                else if (this.isEat(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    var tile2 = parseInt(processCompleteTiles[k]) + 1;
                                    var tile3 = parseInt(processCompleteTiles[k]) + 2;            
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile2.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile3.toString(), 1);
                                    resultPattern.push(new Array(tile1.toString(), tile2.toString(), tile3.toString()));
                                }
                            }
                        }

                        //Keep all possible patterns on the same tile
                        if (this.isAllEmpty(processCompleteTiles) && ! this.containPattern(resultPatternsForSpecificTile, resultPattern.slice().sort())) {
                            resultPatternsForSpecificTile.push(resultPattern.slice().sort());
                            this._allSpecialPatterns.push('0');
                            this._allPossibleTiles.push(this._allTiles[i]);
                            this._allIsSpecials.push('0');
                            this._allPossiblePatterns.push(resultPattern);
                        }

                        //2. small to large tiles, find eat and then pong
                        resultPattern = [];
                        processCompleteTiles = this.setEmpty(completeTiles.slice(), pairs[j], 2);
                        resultPattern.push(new Array(pairs[j], pairs[j]));
                        for (var k = 0; k < processCompleteTiles.length; k ++) {
                            if (processCompleteTiles[k] != '') {
                                //find and remove eat
                                if (this.isEat(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    var tile2 = parseInt(processCompleteTiles[k]) + 1;
                                    var tile3 = parseInt(processCompleteTiles[k]) + 2;            
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile2.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile3.toString(), 1);
                                    resultPattern.push(new Array(tile1.toString(), tile2.toString(), tile3.toString()));
                                }
                                //find and remove pong
                                else if (this.isPong(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 3);
                                    resultPattern.push(new Array(tile1.toString(), tile1.toString(), tile1.toString())); 
                                }
                            }
                        }

                        //Keep all possible patterns on the same tile
                        if (this.isAllEmpty(processCompleteTiles) && ! this.containPattern(resultPatternsForSpecificTile, resultPattern.slice().sort())) {
                            resultPatternsForSpecificTile.push(resultPattern.slice().sort());
                            this._allSpecialPatterns.push('0');
                            this._allPossibleTiles.push(this._allTiles[i]);
                            this._allIsSpecials.push('0');
                            this._allPossiblePatterns.push(resultPattern);
                        }

                        //3. large to small tiles, find pong and then eat 
                        resultPattern = [];
                        processCompleteTiles = this.setEmpty(completeTiles.slice().reverse(), pairs[j], 2);
                        resultPattern.push(new Array(pairs[j], pairs[j]));
                        for (var k = 0; k < processCompleteTiles.length; k ++) {
                            if (processCompleteTiles[k] != '') {
                                var prev2Tile = parseInt(processCompleteTiles[k]) - 2;
                                //find and remove pong
                                if (this.isPong(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 3);
                                    resultPattern.push(new Array(tile1.toString(), tile1.toString(), tile1.toString())); 
                                }
                                //find and remove eat
                                else if (this.isEat(processCompleteTiles, prev2Tile.toString())) {
                                    var tile1 = prev2Tile;
                                    var tile2 = prev2Tile + 1;
                                    var tile3 = prev2Tile + 2;            
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile2.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile3.toString(), 1);
                                    resultPattern.push(new Array(tile1.toString(), tile2.toString(), tile3.toString()));
                                }
                            }
                        }

                        //Keep all possible patterns on the same tile
                        if (this.isAllEmpty(processCompleteTiles) && ! this.containPattern(resultPatternsForSpecificTile, resultPattern.slice().sort())) {
                            resultPatternsForSpecificTile.push(resultPattern.slice().sort());
                            this._allSpecialPatterns.push('0');
                            this._allPossibleTiles.push(this._allTiles[i]);
                            this._allIsSpecials.push('0');
                            this._allPossiblePatterns.push(resultPattern);
                        }

                        //4. large to small tiles, find eat and then pong 
                        resultPattern = [];
                        processCompleteTiles = this.setEmpty(completeTiles.slice().reverse(), pairs[j], 2);
                        resultPattern.push(new Array(pairs[j], pairs[j]));
                        for (var k = 0; k < processCompleteTiles.length; k ++) {
                            if (processCompleteTiles[k] != '') {
                                var prev2Tile = parseInt(processCompleteTiles[k]) - 2;
                                //find and remove eat
                                if (this.isEat(processCompleteTiles, prev2Tile.toString())) {
                                    var tile1 = prev2Tile;
                                    var tile2 = prev2Tile + 1;
                                    var tile3 = prev2Tile + 2;            
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile2.toString(), 1);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile3.toString(), 1);
                                    resultPattern.push(new Array(tile1.toString(), tile2.toString(), tile3.toString()));
                                }
                                //find and remove pong
                                else if (this.isPong(processCompleteTiles, processCompleteTiles[k])) {
                                    var tile1 = parseInt(processCompleteTiles[k]);
                                    processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 3);
                                    resultPattern.push(new Array(tile1.toString(), tile1.toString(), tile1.toString())); 
                                }
                            }
                        }

                        //Keep all possible patterns on the same tile
                        if (this.isAllEmpty(processCompleteTiles) && ! this.containPattern(resultPatternsForSpecificTile, resultPattern.slice().sort())) {
                            resultPatternsForSpecificTile.push(resultPattern.slice().sort());
                            this._allSpecialPatterns.push('0');
                            this._allPossibleTiles.push(this._allTiles[i]);
                            this._allIsSpecials.push('0');
                            this._allPossiblePatterns.push(resultPattern);
                        }
                    }
                }
            }
        }

        return 0;
    }

    //Check if there is any tile more than 4
    preCheck(completeTiles) {
        for (var i = 0; i < completeTiles.length; i ++) {
            if (this.arrayCount(completeTiles, completeTiles[i]) > 4) return false;
        }

        return true;
    }

    arrayCount(tiles, element) {
        var tileCount = 0;

        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i] == element) tileCount ++;
        }

        return tileCount;
    }

    checkSpecialPatterns(completeTiles) {
		//All special pattern should have no mahjong show, i.e. number of mahjong on hand should be 16
        //if (this._tilesOnHand.length != 16 || this._tilesShow.length != 0) return 0;
        if (this._tilesOnHand.length != 16) return 0;

        var specialPattern13Moo = ["21","29","31","39","41","49","51","53","55","57","61","63","65"];
        var specialPattern16NoConnection = ["51","53","55","57","61","63","65"];

        var processCompleteTiles = completeTiles.slice();

        //1 - 十三么
        function tileExists(value) {
            return processCompleteTiles.indexOf(value) != -1;
        }; 
        var isPattern13Moo = specialPattern13Moo.every(tileExists);

        if (isPattern13Moo) {
            for (var i = 0; i < specialPattern13Moo.length; i ++) {
                this.setEmpty(processCompleteTiles, specialPattern13Moo[i], 1);
            }

            var processCompleteTilesReverse = processCompleteTiles.reverse();

            for (var i = 0; i < processCompleteTiles.length; i ++) {
                if (processCompleteTiles[i] != '') {
                    //find and remove pong
                    if (this.isPong(processCompleteTiles, processCompleteTiles[i])) {
                        var tile1 = parseInt(processCompleteTiles[i]);
                        processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 3);
                    }
                    //find and remove eat
                    if (this.isEat(processCompleteTiles, processCompleteTiles[i])) {
                        var tile1 = parseInt(processCompleteTiles[i]);
                        var tile2 = parseInt(processCompleteTiles[i]) + 1;
                        var tile3 = parseInt(processCompleteTiles[i]) + 2;
                        processCompleteTiles = this.setEmpty(processCompleteTiles, tile1.toString(), 1);
                        processCompleteTiles = this.setEmpty(processCompleteTiles, tile2.toString(), 1);
                        processCompleteTiles = this.setEmpty(processCompleteTiles, tile3.toString(), 1);
                    }
                }
            }

            //if the only 1 remaining mahjong is 13 moo basic elements, the game is 十三么
            if (this.arrayCount(processCompleteTiles, '') == 16) {
                function filterEmpty(value) {
                    return value != '';
                };
                var nonEmptyTiles = processCompleteTiles.filter(filterEmpty);

                if (nonEmptyTiles.length = 1 && specialPattern13Moo.indexOf(nonEmptyTiles[0]) != -1) {
                    return 1;
                }
            }

            //reverse the tiles to find possible pong and eat again 
            for (var j = 0; j < processCompleteTilesReverse.length; j ++) {
                if (processCompleteTilesReverse[j] != '') {
                    var prev2Tile = parseInt(processCompleteTilesReverse[j]) - 2;
                    //find and remove pong
                    if (this.isPong(processCompleteTilesReverse, processCompleteTilesReverse[j])) {
                        var tile1 = parseInt(processCompleteTilesReverse[j]);
                        processCompleteTilesReverse = this.setEmpty(processCompleteTilesReverse, tile1.toString(), 3);
                    }
                    //find and remove eat
                    if (this.isEat(processCompleteTilesReverse, prev2Tile.toString())) {
                        var tile1 = prev2Tile;
                        var tile2 = prev2Tile + 1;
                        var tile3 = prev2Tile + 2;
                        processCompleteTilesReverse = this.setEmpty(processCompleteTilesReverse, tile1.toString(), 1);
                        processCompleteTilesReverse = this.setEmpty(processCompleteTilesReverse, tile2.toString(), 1);
                        processCompleteTilesReverse = this.setEmpty(processCompleteTilesReverse, tile3.toString(), 1);
                    }
                }
            }

            //if the only 1 remaining mahjong is 13 moo basic elements, the game is 十三么
            if (this.arrayCount(processCompleteTilesReverse, '') == 16) {
                function filterEmpty(value) {
                    return value != '';
                };
                var nonEmptyTiles = processCompleteTilesReverse.filter(filterEmpty);

                if (nonEmptyTiles.length = 1 && specialPattern13Moo.indexOf(nonEmptyTiles[0]) != -1) {
                    return 1;
                }
            }
        }

        processCompleteTiles = completeTiles.slice();

        //2 - 十六不搭
        var isPattern16NoConnection = specialPattern16NoConnection.every(tileExists);
        if (isPattern16NoConnection) {
            var pairs = this.findPairs(processCompleteTiles);

			//Only one pair exists
            if (pairs.length == 1) {
				//remove the remaining and basic elements 
				this.setEmpty(processCompleteTiles, pairs[0], 1);

                for (var i = 0; i < specialPattern16NoConnection.length; i ++) {
                    this.setEmpty(processCompleteTiles, specialPattern16NoConnection[i], 1);
                }
            }

            //Only 9 mahjongs remain in the game
            var pins = this.getCategory(processCompleteTiles, this._allPins);
            var bamboos = this.getCategory(processCompleteTiles, this._allBamboos);
            var mans    = this.getCategory(processCompleteTiles, this._allMans);
            pins.sort();
            bamboos.sort();
            mans.sort();

            //Each type has exactly 3 mahjongs and the mahjong has no connection
            if (pins.length == 3 && bamboos.length == 3 && mans.length == 3)
            {
                if (this.isNoConnection(pins) && this.isNoConnection(bamboos) && this.isNoConnection(mans))
                    return 2;
            }
        }

        processCompleteTiles = completeTiles.slice();

        //3 - 嚦咕嚦咕, 4 - 八飛嚦咕嚦咕
        if (this.findPairs(this._tilesOnHand).length == 7 && this.hasPong(this._tilesOnHand)) {
            if (this.findPairs(processCompleteTiles).length == 8 && this.hasPong(processCompleteTiles)) {
                return 3;
            }
        }
        else if (this.findPairs(this._tilesOnHand).length == 8 && this.hasPong(processCompleteTiles)) {
            return 4;
        }

        return 0;
    }

    findPairs(tiles) {
        var pairs = [];

        for (var i = 0; i < tiles.length; i++) {
            if (pairs.indexOf(tiles[i]) == -1) {
                //occurs three times also count as a pair 
                if (this.arrayCount(tiles, tiles[i]) >= 2) pairs.push(tiles[i]);
                //occurs four times count as two pairs  
                if (this.arrayCount(tiles, tiles[i]) == 4) pairs.push(tiles[i]);
            }
        }

        return pairs;
    }

    hasPong(tiles) {
        for (var i = 0; i < tiles.length; i ++) {
            if (this.arrayCount(tiles, tiles[i]) == 3) return true;
        }

        return false;
    }

    setEmpty(tiles, tile, frequency) {
        for (var i = 1; i <= frequency; i ++) {
            var index = tiles.indexOf(tile);
            if (index >= 0) tiles[index] = '';
        }

        return tiles;
    }

    isPong(tiles, tile) {
        if (this.arrayCount(tiles, tile) == 3) {
            return true;
        }

        return false;
    }

    isEat(tiles, tile) {
        var tile2 = parseInt(tile) + 1;
        var tile3 = parseInt(tile) + 2;
        if (tiles.indexOf(tile) != -1 && tiles.indexOf(tile2.toString()) != -1 && tiles.indexOf(tile3.toString()) != -1) {
            return true;
        }

        return false;
    }

    isAllEmpty(tiles) {
        function filterEmpty(value) {
            return value != '';
        };
        var nonEmptyTiles = tiles.filter(filterEmpty);

        if (nonEmptyTiles.length == 0) return true;

        return false;
    }

    getCategory(tiles, category) {
        function filterCategory(value) {
            return category.indexOf(value) != -1;
        }
        return tiles.filter(filterCategory);
    }

    isNoConnection(tiles) {
        var difference = 0;

        for (var i = 1; i < tiles.length; i ++) {
            difference = parseInt(tiles[i]) - parseInt(tiles[i-1]); 
            if (difference <= 2) return false;
        }

        return true;
    }

    containPattern(list, pattern) {
        for (var i = 0; i < list.length; i ++) {
            if (this.isEqual(list[i], pattern)) return true;
        }

        return false;
    }

    isEqual(value, other) {
        // Get the value type
        var type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;

        // Compare two items
        var compare = function (item1, item2) {
            // Get the object type
            var itemType = Object.prototype.toString.call(item1);

            // If an object or array, compare recursively
            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!isEqual(item1, item2)) return false;
            }
            // Otherwise, do a simple comparison
            else {
                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) return false;

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }
            }
        };

        // Compare properties
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {
                if (compare(value[i], other[i]) === false) return false;
            }
        } else {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    if (compare(value[key], other[key]) === false) return false;
                }
            }
        }

        // If nothing failed, return true
        return true;
    }

    arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
    
        return a.sort();
    }    
}