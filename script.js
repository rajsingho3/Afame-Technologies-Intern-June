document.addEventListener("DOMContentLoaded", function () {
    const display = document.querySelector(".display");
    const expressionDisplay = document.getElementById("expressionDisplay");
    const buttons = document.querySelectorAll(".btn");
    const calculator = document.querySelector(".calculator");    let currentInput = "";
    let operator = "";
    let previousInput = "";    let fullExpression = "";
    let justCalculated = false;

    function updateExpressionDisplay() {
        if (fullExpression === "") {
            expressionDisplay.textContent = "";
        } else {
            expressionDisplay.textContent = fullExpression;
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const value = this.textContent;
            
           
            addRippleEffect(this);
            
           
            this.style.animation = 'buttonClick 0.15s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 150);            if (this.classList.contains("clear")) {
                currentInput = "";
                operator = "";
                previousInput = "";
                fullExpression = "";
                justCalculated = false;
                display.value = "";
                updateExpressionDisplay();
                
                
                display.style.animation = 'clearAnimation 0.3s ease-out';
                setTimeout(() => {
                    display.style.animation = '';
                }, 300);            } else if (this.classList.contains("backspace")) {
                if (currentInput !== "") {
                    currentInput = currentInput.slice(0, -1);
                    if (operator && previousInput) {
                        display.value = previousInput + " " + operator + " " + currentInput;
                        fullExpression = previousInput + " " + operator + " " + currentInput;
                    } else {
                        display.value = currentInput;
                        fullExpression = currentInput;
                    }
                    updateExpressionDisplay();
                    
                 
                    this.style.animation = 'backspaceAnimation 0.2s ease-out';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 200);
                }            } else if (this.classList.contains("operator")) {
                if (currentInput !== "" || justCalculated) {
                    if (previousInput !== "" && operator !== "" && !justCalculated) {
                   
                        currentInput = calculate(previousInput, currentInput, operator);
                        display.value = currentInput;
                    }
                    operator = value;
                    previousInput = currentInput;
                    currentInput = "";
                    display.value = previousInput + " " + operator + " ";
                    
                    if (justCalculated) {
                        // Continue from previous result
                        fullExpression = previousInput + " " + operator + " ";
                        justCalculated = false;
                    } else {
                        fullExpression = previousInput + " " + operator + " ";
                    }
                    updateExpressionDisplay();
                    
                   
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }} else if (this.classList.contains("equal")) {
                if (previousInput !== "" && operator !== "" && currentInput !== "") {
                    
                    fullExpression = previousInput + " " + operator + " " + currentInput + " = ";
                    
                   
                    calculator.classList.add('calculating');
                      setTimeout(() => {
                        const result = calculate(previousInput, currentInput, operator);
                        fullExpression += result;
                        currentInput = result;
                        display.value = currentInput;
                        operator = "";
                        previousInput = "";
                        justCalculated = true;
                        updateExpressionDisplay();
                        calculator.classList.remove('calculating');
                        
                     
                        display.style.animation = 'resultAnimation 0.5s ease-out';
                        setTimeout(() => {
                            display.style.animation = '';
                        }, 500);
                    }, 300);
                }            } else if (this.classList.contains("dot")) {
                
                if (justCalculated) {
                   
                    currentInput = "0.";
                    fullExpression = "0.";
                    justCalculated = false;
                } else if (currentInput.indexOf('.') === -1) {
                    if (currentInput === "") {
                        currentInput = "0.";
                    } else {
                        currentInput += ".";
                    }
                    if (operator && previousInput) {
                        fullExpression = previousInput + " " + operator + " " + currentInput;
                    } else {
                        fullExpression = currentInput;
                    }
                }
                
                if (operator && previousInput) {
                    display.value = previousInput + " " + operator + " " + currentInput;
                } else {
                    display.value = currentInput;
                }
                updateExpressionDisplay();
                
                  this.style.animation = 'dotAnimation 0.2s ease-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 200);
            } else {
                
                if (justCalculated) {
                    currentInput = value;
                    fullExpression = value;
                    justCalculated = false;
                } else {
                    currentInput += value;
                    if (operator && previousInput) {
                        fullExpression = previousInput + " " + operator + " " + currentInput;
                    } else {
                        fullExpression = currentInput;
                    }
                }
                
                if (operator && previousInput) {
                    display.value = previousInput + " " + operator + " " + currentInput;
                } else {
                    display.value = currentInput;
                }
                updateExpressionDisplay();
                
                display.style.animation = 'typingAnimation 0.2s ease-out';
                setTimeout(() => {
                    display.style.animation = '';
                }, 200);
            }
        });
    });


    function addRippleEffect(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }    function calculate(num1, num2, operator) {
        num1 = parseFloat(num1);
        num2 = parseFloat(num2);

      
        if (isNaN(num1) || isNaN(num2)) {
            showError();
            return "Error";
        }

        let result;
        switch (operator) {
            case "+": result = num1 + num2; break;
            case "-": result = num1 - num2; break;
            case "×": result = num1 * num2; break;
            case "÷": 
                if (num2 === 0) {
                    showError();
                    return "Cannot divide by zero";
                }
                result = num1 / num2; 
                break;
            default: result = num2;
        }
        
      
        if (!isFinite(result)) {
            showError();
            return "Error";
        }
        
      
        return Math.round(result * 1000000000) / 1000000000;
    }
    
  
    function showError() {
        display.classList.add('error');
        setTimeout(() => {
            display.classList.remove('error');
        }, 1000);
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        let button = null;

        if (key >= '0' && key <= '9') {
            button = Array.from(buttons).find(btn => btn.textContent === key && btn.classList.contains('number'));
        } else if (key === '+' || key === '-') {
            button = Array.from(buttons).find(btn => btn.textContent === key && btn.classList.contains('operator'));
        } else if (key === '*') {
            button = Array.from(buttons).find(btn => btn.textContent === '×' && btn.classList.contains('operator'));
        } else if (key === '/') {
            event.preventDefault();
            button = Array.from(buttons).find(btn => btn.textContent === '÷' && btn.classList.contains('operator'));
        } else if (key === 'Enter' || key === '=') {
            button = Array.from(buttons).find(btn => btn.classList.contains('equal'));        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            button = Array.from(buttons).find(btn => btn.classList.contains('clear'));
        } else if (key === 'Backspace') {
            button = Array.from(buttons).find(btn => btn.classList.contains('backspace'));
        } else if (key === '.') {
            button = Array.from(buttons).find(btn => btn.classList.contains('dot'));
        }

        if (button) {
            button.click();
            button.style.animation = 'keyboardPress 0.1s ease-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 100);
        }    });
    
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    
 
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
   
    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        
        this.style.animation = 'themeSwitch 0.3s ease-out';
        setTimeout(() => {
            if (newTheme === 'dark') {
                themeIcon.textContent = '☀️';
            } else {
                themeIcon.textContent = '🌙';
            }
            this.style.animation = '';
        }, 150);
    });
});
