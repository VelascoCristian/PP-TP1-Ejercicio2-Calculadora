const show = document.getElementById("show"); //Una constante que va a representar los 'resultados de la calculadora'
const CeToC = (document.getElementById("ce").textContent = "C"); //Para cambiar visualmente 'CE' por 'C'
const CToCe = (document.getElementById("ce").textContent = "CE"); //Para cambiar visualmente 'C' por 'CE'
let operator = ""; //Variable para almacenar el último operador seleccionado
let firstSegment = ""; //Variable para almacenar el primer operador
let secondSegment = ""; //Variable para almacenar el segundo operador
let hasOperator = false; //Variable bandera para almacenar si lo último ingresado es un operador
let parenthesisOpen = false; //Variable bandera para almacenar sí se abrió un parentesís

//Función para resetear TODOS los valores por defecto
function eraseAll() {
  show.value = "0";
  firstSegment = "";
  secondSegment = "";
  operator = "";
  hasOperator = false;
  CeToC;
}

//Función para borrar uno en uno los operadores/operandos
function erase() {
  //Para el caso en el que el resultado sea un valor invalido y se requiera 'borrar'
  if (
    show.value === "Resultado indefinido" ||
    show.value === "No se puede dividir por cero" ||
    show.value === "Factorial no definido" ||
    show.value === "NaN"
  ) {
    eraseAll();
    return;
  }
  //Si el segundo segmento NO está vacío significa que estoy en el segundo segmento
  //Al borrar muestro nuevamente la secuencia
  if (secondSegment !== "") {
    secondSegment = secondSegment.slice(0, -1);
    show.value = firstSegment + operator + secondSegment;
    //Si el segundo segmento está vacío pero tengo un operador, procedo a borrar el operador y resetear las variables
  } else if (operator !== "") {
    operator = "";
    hasOperator = false;
    show.value = firstSegment;
    //Por último si tengo algo en mi primer segmento, borro el último elemento ingresado
  } else if (firstSegment !== "") {
    firstSegment = firstSegment.slice(0, -1);
    show.value = firstSegment || 0;
    if (show.value == 0) CeToC; //Verifico que si ya no quedan caracteres cambie el boton de 'CE' a 'C'
  } //Para el caso que no tenga nada el primer segmento no importa porque queda como 0(cero)
}

//Función que debuelve el resultado de los operandos y operadores
function calculateResult() {
  let result;
  let first = parseFloat(firstSegment);
  let second = parseFloat(secondSegment);

  // Si el segundo segmentdo es NaN (paréntesis vacío), lo tratamos como 1
  //Ya que en la calculadora si haces 10() esto se traduce como 10x10 lo cual 'result' sería 100
  //Entonces para simplificar el código se trata como 1(uno)
  if (isNaN(second)) {
    second = 1;
  }

  //Dependiendo del operandor realizo los resultados
  switch (operator) {
    case "-":
      result = first - second;
      break;
    case "+":
      result = first + second;
      break;
    case "*":
      result = first * second;
      break;
    case "/": //También se evalua los casos no definidos
      if (second === 0) {
        result =
          first === 0 ? "Resultado indefinido" : "No se puede dividir por cero";
      } else {
        result = first / second;
      }
      break;
  }
  return result.toString();
}

//Función matriz encargada de controlar y largar las funciones necesarios de acuerdo al boton seleccionado
function showKey(input) {
  //Aunque la calculadora muestra 0(cero), la primerava vez, es solo visualmente entonces de esta forma lo agregamos al código
  if (!firstSegment) {
    firstSegment = "0";
  }
  if (!show.value) {
    show.value = "0";
  }

  //Reseteo valores cuando da indefinido
  if (
    show.value === "Resultado indefinido" ||
    show.value === "No se puede dividir por cero" ||
    show.value === "Factorial no definido" ||
    show.value === "NaN"
  ) {
    eraseAll();
  }

  //Si es un número lo que se seleccionó
  if (!isNaN(input)) {
    //Si ya se seleccionó un operador significa que el actual número ingresado pertenece al segundo segmento
    if (hasOperator) {
      secondSegment += input;
      show.value += input;
    } else {
      //Significa que estoy en el primer segmetno
      CToCe;
      if (firstSegment === "0" && input !== "0") {
        //Significa que es el primer número ingresado
        firstSegment = input;
        show.value = firstSegment;
      } else if (firstSegment !== "0") {
        //Ya se ingreso algun operando entonces le tengo que seguir concatenando al primers segmento el nuevo número
        firstSegment += input;
        show.value = firstSegment;
      }
    }
  }

  //Manejo de factorial
  if (input === "factorial") {
    let number = hasOperator //Si tiene operador voy a tener que hacer el operando (operador +-*/) factorial(operando)
      ? parseFloat(secondSegment)
      : parseFloat(firstSegment);
    if (number < 0 || !Number.isInteger(number)) {
      //Para casos negativos
      show.value = "Factorial no definido";
    } else {
      //Hago el factorial
      let result = 1;
      for (let i = 2; i <= number; i++) result *= i;
      if (hasOperator) {
        secondSegment = result.toString();
      } else {
        firstSegment = result.toString();
      }
      show.value = hasOperator
        ? firstSegment + operator + secondSegment
        : firstSegment;
    }
  }

  //Para tener en cuenta los parentesis
  if (input === "openParenthesis") {
    if (show.value === "0" || show.value === "") {
      show.value = "(";
    } else {
      if (firstSegment && !hasOperator) {
        operator = "*"; //Multiplicación implícita cuando se realiza 10() el resultado es 100 porque es 10x10
        hasOperator = true;
      }
      show.value += "(";
    }
    parenthesisOpen = true;
  }

  if (input === "closeParenthesis") {
    if (parenthesisOpen) {
      show.value += ")";
      parenthesisOpen = false;
      if (hasOperator) {
        if (secondSegment === "" || secondSegment === "(") {
          //Si el paréntesis está vacío, usamos el primer operando como valor por defecto osea repite el operando
          secondSegment = firstSegment;
        }
        firstSegment = calculateResult();
        secondSegment = "";
        operator = "";
        hasOperator = false;
        show.value = firstSegment;
      }
    }
  }

  //Voy a la funcion borrar 1 en 1
  if (input === "erase") {
    erase();
  }

  //Valor π
  if (input === "pi") {
    const piValue = Math.PI.toString();
    if (!hasOperator) {
      firstSegment = piValue;
      show.value = firstSegment;
      CToCe;
    } else {
      secondSegment = piValue;
      show.value += secondSegment;
    }
  }

  //Valor e
  if (input === "e") {
    const eValue = Math.E.toString();
    if (!hasOperator) {
      firstSegment = eValue;
      show.value = firstSegment;
      CToCe;
    } else {
      secondSegment = eValue;
      show.value += secondSegment;
    }
  }

  //Borro todo (se resetea todo)
  if (input === "ce") {
    eraseAll();
  }

  //Para la resta
  if (input === "minus") {
    if (show.value === "0") {
      firstSegment = "-";
      show.value = firstSegment;
    } else if (!hasOperator || parenthesisOpen) {
      operator = "-";
      hasOperator = true;
      show.value += "-";
    } else if (secondSegment && !parenthesisOpen) {
      firstSegment = calculateResult();
      secondSegment = "";
      operator = "-";
      show.value = firstSegment + operator;
    }
  }

  //Para el caso de la multiplicación
  if (input === "multiply") {
    if (!hasOperator) {
      operator = "*";
      hasOperator = true;
      show.value = `${show.value}x`;
    } else if (secondSegment) {
      firstSegment = calculateResult();
      secondSegment = "";
      operator = "*";
      show.value = firstSegment + operator;
    }
  }

  //Para el caso de la suma
  if (input === "plus") {
    if (show.value === "0") {
      firstSegment = "+";
      show.value = firstSegment;
    } else if (!hasOperator || parenthesisOpen) {
      operator = "+";
      hasOperator = true;
      show.value += "+";
    } else if (secondSegment && !parenthesisOpen) {
      firstSegment = calculateResult();
      secondSegment = "";
      operator = "+";
      show.value = firstSegment + operator;
    }
  }

  //Para el caso de división
  if (input === "divide") {
    if (!hasOperator) {
      operator = "/";
      hasOperator = true;
      show.value = `${show.value}÷`;
    } else if (secondSegment) {
      let first = parseFloat(firstSegment || "0"); //Usamos 0 si firstSegment está vacío
      let second = parseFloat(secondSegment);
      if (second === 0) {
        result =
          first === 0 ? "Resultado indefinido" : "No se puede dividir por cero";
      } else {
        result = first / second;
      }
      firstSegment = result.toString();
      secondSegment = "";
      operator = "/";
      show.value = firstSegment + operator;
    }
  }

  //Caso igual
  if (input === "equal") {
    if (hasOperator && secondSegment) {
      firstSegment = calculateResult();
      secondSegment = "";
      operator = "";
      hasOperator = false;
      show.value = firstSegment;
    }
  }

  //Caso mas o menos
  if (input === "plusOrMinus") {
    if (!hasOperator && !isNaN(firstSegment) && firstSegment !== "") {
      firstSegment = (-parseFloat(firstSegment)).toString();
      show.value = firstSegment;
    }
  }

  //Caso decimal
  if (input === "decimal") {
    if (hasOperator) {
      if (!secondSegment.includes(".")) {
        secondSegment += secondSegment === "" ? "0." : ".";
        show.value += secondSegment === "0." ? "0." : ".";
      }
    } else {
      if (!firstSegment.includes(".")) {
        if (firstSegment === "") {
          firstSegment = "0.";
          show.value = "0.";
        } else {
          firstSegment += ".";
          show.value += ".";
        }
      }
      CToCe;
    }
  }
}
