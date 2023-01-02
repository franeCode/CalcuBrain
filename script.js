class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, errorTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.errorTextElement = errorTextElement;
      this.isErrorDisplayed = false;
      this.clear();
    }
  
    clear() {
      this.previousOperand = '';
      this.currentOperand = '';
      this.operation = undefined;
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      // If there's an operation but no previous operand, set it to the current operand
      if (this.operation && this.previousOperand === '') {
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
      }
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return;
      if (this.previousOperand !== '') {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '';
    }
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
      
        if (isNaN(prev) || isNaN(current)) {
          this.displayError('Invalid input');
          this.updateDisplay();
          return;
        }
      
        if (this.operation === '÷' && current === 0) {
          this.displayError('Cannot divide by zero');
          this.updateDisplay();
          return;
        }
      
        switch (this.operation) {
          case '+':
            computation = prev + current;
            break;
          case '-':
            computation = prev - current;
            break;
          case '*':
            computation = prev * current;
            break;
          case '÷':
            computation = prev / current;
            break;
          case '%':
            computation = (prev * current) / 100;
          break;
          default:
            return;
        }
      
        // Set decimal precision to 2 places
        this.currentOperand = computation.toFixed(2);

        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
        console.log(computation)
      }
      
    //   computePercentage() {
    //     const current = parseFloat(this.currentOperand);
      
    //     if (isNaN(current)) {
    //       this.displayError('Invalid input');
    //       this.updateDisplay();
    //       return;
    //     }
      
    //     this.currentOperand = (current / 100).toFixed(2);
    //     this.operation = undefined;
    //     this.previousOperand = '';
    // }

    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
      this.updateDisplay();
      console.log("deleted")
    }
  
    displayError(message) {
        this.errorTextElement.innerText = message;
        this.errorTextElement.classList.remove('hidden');
        this.currentOperandTextElement.classList.add('hidden');
        this.previousOperandTextElement.classList.add('hidden');
        // this.errorTextElement.hidden = false;
        // this.currentOperandTextElement.hidden = true;
        // this.previousOperandTextElement.hidden = true;
        if (!this.isErrorDisplayed) {
          this.currentOperandTextElement.classList.remove('hidden');
          this.previousOperandTextElement.classList.remove('hidden');
        }
    
        this.isErrorDisplayed = true;
        console.log(message)
    }
  
    clearOperands() {
      this.currentOperandTextElement.innerText = '';
      this.previousOperandTextElement.innerText = '';
    }
  
    clearError() {
      this.errorTextElement.innerText = '';
      this.errorTextElement.classList.add('hidden');
      this.isErrorDisplayed = false;
    }
  
    updateDisplay() {
      this.currentOperandTextElement.innerText = this.currentOperand;
      this.previousOperandTextElement.innerText = this.previousOperand;
      this.clearError();
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const previousOperandTextElement = document.querySelector('.previous-operand');
    const currentOperandTextElement = document.querySelector('.current-operand');
    const errorTextElement = document.querySelector('.error');
    const numberButtons = document.querySelectorAll('.number');
    const operationButtons = document.querySelectorAll('.operation');
    const equalsButton = document.querySelector('.equal');
    const allClearButton = document.querySelector('.all-clear');
    const deleteButton = document.querySelector('.delete');
    const percentageButton = document.querySelector('.percentage');
  
    // Calculator instance
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, errorTextElement);

    
    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Map the keyboard keys to calculator actions
        switch (key) {
          case '0':
            calculator.appendNumber(0);
            break;
          case '1':
            calculator.appendNumber(1);
            break;
          case '2':
            calculator.appendNumber(2);
            break;
          case '3':
            calculator.appendNumber(3);
            break;
          case '4':
            calculator.appendNumber(4);
            break;
          case '5':
            calculator.appendNumber(5);
            break;
          case '6':
            calculator.appendNumber(6);
            break;
          case '7':
            calculator.appendNumber(7);
            break;
          case '8':
            calculator.appendNumber(8);
            break;
          case '9':
            calculator.appendNumber(9);
            break;
          case '+':
            calculator.chooseOperation('+');
            break;
          case '-':
            calculator.chooseOperation('-');
            break;
          case '*':
            calculator.chooseOperation('*');
            break;
          case '/':
            calculator.chooseOperation('÷');
            break;
          case '=':
            calculator.compute();
            break;
          case 'Enter':
            calculator.compute();
            break;
          case 'Backspace':
            calculator.delete();
            break;
          case 'Escape':
            calculator.clear();
            break;
          case '.':
            calculator.appendNumber('.');
            break;
          default:
            // Ignore other keys
            break;
        }
      
        calculator.updateDisplay();
      });
      
    // Add a variable to track the active state of the calculator
    let isCalculatorActive = false;
    let isStateUpdatePending = false;
    let stateUpdateTimeout;

    // Function to update the output color based on the active state
    const updateOutputColor = () => {
      const output = document.querySelector('.output');

      if (isCalculatorActive) {
        console.log('Calculator is active.');
        output.classList.remove('output-previous');
        output.classList.add('output-active');
      } else {
        console.log('Calculator is not active.');
        output.classList.remove('output-active');
        output.classList.add('output-previous'); 
      }
    }
    numberButtons.forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        isCalculatorActive = true; 
        updateOutputColor();
      });
    });
  
    allClearButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (isStateUpdatePending) return;
      
      calculator.clear();
      calculator.updateDisplay();
      calculator.clearError();
    
      isStateUpdatePending = true;
      clearTimeout(stateUpdateTimeout);
    
      stateUpdateTimeout = setTimeout(() => {
        isCalculatorActive = false;
        isStateUpdatePending = false;
        updateOutputColor();
      }, 100);
    });
  
    operationButtons.forEach(button => {
      button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        isCalculatorActive = true; 
        updateOutputColor();
      });
    });
  
    // percentageButton.addEventListener('click', () => {
    //     calculator.computePercentage();
    //     calculator.updateDisplay();
    //     isCalculatorActive = true; 
    //     updateOutputColor();
    //   });

    equalsButton.addEventListener('click', () => {
      calculator.compute();
      calculator.updateDisplay();
      calculator.clearError();
      isCalculatorActive = true; 
      updateOutputColor();
    });
  
    console.log('Delete button element:', deleteButton);

    deleteButton.addEventListener('click', () => {
      calculator.delete();
      calculator.updateDisplay();
      isCalculatorActive = true; 
      updateOutputColor();
      console.log('Delete button clicked');
    });
  });
  