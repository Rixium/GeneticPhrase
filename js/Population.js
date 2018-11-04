
function Population(mutationRate) {
  this.mutationRate = mutationRate;
}

Population.prototype.Generate = function(populationSize, target) {
  let generatedPhrases = [];
  var possible = "abcdefghijklmnopqrstuvwxyz";

  for(let j = 0; j < target.length; j++) {
    if(!possible.includes(target[j])) {
      possible += target[j];
    }
  }

  this.genes = possible;

  for(let i = 0; i < populationSize; i++) {
    let newPhrase = "";
    for(let j = 0; j < target.length; j++) {
      let selectedChar = possible.charAt(Math.floor(Math.random() * possible.length));
      newPhrase += selectedChar;
    }
    generatedPhrases.push(newPhrase);
  }

  this.population = generatedPhrases;
}

Population.prototype.CalculateFitness = function(target) {
  let pop = this.population;
  let fitnesses = [];
  for(let i = 0; i < pop.length; i++) {
    let currentMember = pop[i];
    let memberFitness = 0;
    for(let j = 0; j < currentMember.length; j++) {
      if(currentMember[j] === target[j]) {
        memberFitness++;
      }
    }
    fitnesses.push(memberFitness);
  }
  return fitnesses;
}

Population.prototype.SelectNextGeneration = function(fitnesses) {
  let selectionPopulation = [];
  let pop = this.population;
  for(let i = 0; i < pop.length; i++) {
    for(let j = 0; j < fitnesses[i]; j++) {
      selectionPopulation.push(pop[i]);
    }
  }
  let newPopulation = [];
  while(newPopulation.length < this.population.length) {
    let parent1 = Math.floor(Math.random() * selectionPopulation.length);
    let parent2 = Math.floor(Math.random() * selectionPopulation.length);
    let child = this.CrossOver(selectionPopulation[parent1], selectionPopulation[parent2]);
    child = this.Mutate(child);
    newPopulation.push(child);
  }
  this.population = newPopulation;
}

Population.prototype.Mutate = function(child) {
    let mutatedChild = "";
    for(let i = 0; i < child.length; i++) {
      if(Math.random() <= this.mutationRate) {
          let selectedChar = this.genes.charAt(Math.floor(Math.random() * this.genes.length));
          mutatedChild += selectedChar;
      } else {
        mutatedChild += child[i];
      }
    }
    return mutatedChild;
}

Population.prototype.CrossOver = function(parent1, parent2) {
  let crossOverPoint = Math.floor(Math.random() * parent1.length);
  let child = "";
  child += parent1.substring(0, crossOverPoint);
  child += parent2.substring(crossOverPoint, parent2.length);
  return child;
}
