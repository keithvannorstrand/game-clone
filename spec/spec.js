var Enemy = require('../js/Enemy.js');
var Food = require('../js/Food.js');

describe('Enemy Method Tests', function() {
  var food = [];
  var enemy;
  beforeEach(function() {
    enemy = new Enemy(700,1200,20,'orange');
    for(var i=0;i<5;i++){
      food.push(new Food(700,1200));
    }
  });
  it('should order the array by distance', function() {
    expect(enemy.position).toBe();
    expect(enemy.orderByDistance(food)).toEqual();
  });
});
