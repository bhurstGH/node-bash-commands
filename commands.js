const fs = require('fs');

function done(output) {
  process.stdout.write(output);
  process.stdout.write('\nprompt > ');
}

function errorHandler(input) {
  if (!input) process.stdout.write('prompt > ');
  else {
    process.stdout.write(`${input} is not a known command.`);
    process.stdout.write('\nprompt > ');
  }
}

function mergeSort(data) {

  if (data.length === 1) {
    return data;
  }

  const middle = Math.floor(data.length / 2);
  const left = data.slice(0, middle);
  const right = data.slice(middle);

  const mergeData = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  return mergeData(mergeSort(left), mergeSort(right));
}

function evaluateCmd(userInput) {
  const userInputArray = userInput.split(" ");
  const command = userInputArray[0];

  switch (command) {
    case "echo":
      commandLibrary.echo(userInputArray.slice(1).join(" "));
      break;
    case "cat":
      commandLibrary.cat(userInputArray.slice(1));
      break;
    case "head":
      commandLibrary.head(userInputArray.slice(1));
      break;
    case "tail":
      commandLibrary.tail(userInputArray.slice(1));
      break;
    case "sort":
      commandLibrary.sort(userInputArray.slice(1));
      break;
    case "wc":
      commandLibrary.wc(userInputArray.slice(1));
      break;
    case "uniq":
      commandLibrary.uniq(userInputArray.slice(1));
      break;
    case "reverse":
      commandLibrary.reverse(userInputArray.slice(1));
      break;
    default:
      errorHandler(command);
  }
}

const commandLibrary = {
  "echo": function(userInput) {
    done(userInput);
  },

  "cat": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      done(data.trim());
    });
  },

  "head": function(fullPath) {
    const fileName = fullPath[0];
    const lines = fullPath[1];
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      const splitData = data.split("\n").slice(0, lines).join("\n");
      done(splitData);
    });
  },

  "tail": function(fullPath) {
    const fileName = fullPath[0];
    const lines = fullPath[1];
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      const splitData = data.split("\n").slice(-(lines)).join("\n");
      done(splitData);
    });
  },

  "sort": function(fullPath) {
    const fileName = fullPath[0];
    var sorted;
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      const splitData = data.trim().split("\n");
      sorted = mergeSort(splitData);
      done(sorted.join("\n"));
    });
  },

  "wc": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      const lines = data.trim().split("\n").length;
      const words = data.trim().split(/\s/).filter(value => value !== '').length;
      const bytes = Buffer.byteLength(data);
      const output = `${lines} ${words} ${bytes}`;
      done(output);
    });
  },

  "uniq": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) throw err;
      var data = data.trim().split("\n");
      var filterData = data.filter( (value, index, arr) => {
        return (value !== arr[index + 1]);
      })

      done(filterData.join("\n"));
    });
  },

  "reverse": function(userInput) {
    var reversed = [];
    userInput.forEach( element => {
      reversed.push(element.split('').reverse().join(''));
    });
    var output = reversed.join(" ");
    done(output);
  }
}

module.exports.commandLibrary = commandLibrary;
module.exports.evaluateCmd = evaluateCmd;
