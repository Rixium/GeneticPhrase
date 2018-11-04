let population = new Population();
let phrase = "";
let totalGenerations = 0;
let refreshTimeout;
let started = false;

window.onload = function() {
    generatePopulation();
};

function generatePopulation() {
  clearTimeout(refreshTimeout);
  totalGenerations = 0;
  phrase = $("#phrase").val();
  let populationSize = $("#populationSize").val();
  let mutationRate = $("#mutationRate").val();
  population = new Population(mutationRate);
  population.Generate(populationSize, phrase);
  showPopulation();

  let fitnesses = population.CalculateFitness(phrase);
  let bestFitness = getBestFitness(phrase);
  $('.best-member').text(bestFitness.member);
  $('.best-fitness').text(bestFitness.fitness);
  $('.total-generations').text(totalGenerations);

  let notif = $('.notification');
  notif.html("With " + population.genes.length + " different characters, giving ~" + Math.pow(population.genes.length, phrase.length).toExponential() + " possible combinations of letters for the length of your phrase. If a computer calculates a billion different combinations a second, it would take ~" +
  (Math.pow(population.genes.length, phrase.length) / 1000000000 / 60 / 60 / 24 / 365).toExponential() + " years to find the correct combination.<br/><br/>With a genetic algorithm, this can be a much shorter amount of time..");
}

function showPopulation() {
    let table = $('.population-table tbody');
    $(".population-table tbody tr").remove();
    for (let i = 0; i < 5; i++) {
      if(i > population.population.length) {
        break;
      }
      table.append("<tr><td>" + (i + 1) + "</td><td>" + population.population[i] + "</td></tr>");
    }

    if(population.population.length > 5) {
      let remaining = population.population.length - 5;
      table.append("<tr><td>...</td><td>And " + remaining + " more..</td></tr>");
    }
}

function start() {
  if(!started) {
    $('#runButton')[0].innerHTML = "Stop";
    started = true;
    update();
  } else {
    end();
  }
}

function end() {
    clearTimeout(refreshTimeout);
    $('#runButton')[0].innerHTML = "Run";
    started = false;
}

function update() {
  refreshTimeout = setTimeout(update, 1);
  totalGenerations++;
  selectNextGeneration();
}


function selectNextGeneration() {
  let fitnesses = population.CalculateFitness(phrase);
  let bestFitness = getBestFitness(phrase);
  $('.best-member').text(bestFitness.member);
  $('.best-fitness').text(bestFitness.fitness);
  $('.total-generations').text(totalGenerations);
  if(bestFitness.member == phrase) {
    end();
  }
  population.SelectNextGeneration(fitnesses);
  showPopulation();
}

function getBestFitness(target) {
  let bestFitness = 0;
  let bestFitnessIndex = 0;
  for(let i = 0; i < population.population.length; i++) {
      let currentMember = population.population[i];
      let memberFitness = 0;
      for(let j = 0; j < currentMember.length; j++) {
        if(currentMember[j] === target[j]) {
          memberFitness++;
        }
      }
      if(memberFitness >= bestFitness) {
        bestFitness = memberFitness;
        bestFitnessIndex = i;
      }
    }
    return {
      member: population.population[bestFitnessIndex],
      fitness: bestFitness
    };
  }
