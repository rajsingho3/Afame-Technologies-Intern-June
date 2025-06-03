document.addEventListener("DOMContentLoaded", function () {
    const display = document.querySelector(".display");
    const buttons = document.querySelectorAll(".btn");
    const calculator = document.querySelector(".calculator");
    let currentInput = "";
    let operator = "";
    let previousInput = "";

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const value = this.textContent;
            
           
            addRippleEffect(this);
            
            // Add subtle shake animation on click
            this.style.animation = 'buttonClick 0.15s ease-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 150);

            if (this.classList.contains("clear")) {
                currentInput = "";
                operator = "";
                previousInput = "";
                display.value = "";
                
                
                display.style.animation = 'clearAnimation 0.3s ease-out';
                setTimeout(() => {
                    display.style.animation = '';
                }, 300);            } else if (this.classList.contains("backspace")) {
                if (currentInput !== "") {
                    currentInput = currentInput.slice(0, -1);
                    if (operator && previousInput) {
                        display.value = previousInput + " " + operator + " " + currentInput;
                    } else {
                        display.value = currentInput;
                    }
                    
                    // Add backspace animation
                    this.style.animation = 'backspaceAnimation 0.2s ease-out';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 200);
                }
            } else if (this.classList.contains("operator")) {
                if (currentInput !== "") {
                    if (previousInput !== "" && operator !== "") {
                        // Calculate previous operation first
                        currentInput = calculate(previousInput, currentInput, operator);
                        display.value = currentInput;
                    }
                    operator = value;
                    previousInput = currentInput;
                    currentInput = "";
                    display.value = previousInput + " " + operator + " ";
                    
                    // Add operator feedback
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }} else if (this.classList.contains("equal")) {
                if (previousInput !== "" && operator !== "" && currentInput !== "") {
                    // Show complete calculation first
                    display.value = previousInput + " " + operator + " " + currentInput + " =";
                    
                    // Add calculating animation
                    calculator.classList.add('calculating');
                    
                    setTimeout(() => {
                        currentInput = calculate(previousInput, currentInput, operator);
                        display.value = currentInput;
                        operator = "";
                        previousInput = "";
                        calculator.classList.remove('calculating');
                        
                        // Add result animation
                        display.style.animation = 'resultAnimation 0.5s ease-out';
                        setTimeout(() => {
                            display.style.animation = '';
                        }, 500);
                    }, 300);
                }            } else if (this.classList.contains("dot")) {
                
                if (currentInput.indexOf('.') === -1) {
                    if (currentInput === "") {
                        currentInput = "0.";
                    } else {
                        currentInput += ".";
                    }
                    if (operator && previousInput) {
                        display.value = previousInput + " " + operator + " " + currentInput;
                    } else {
                        display.value = currentInput;
                    }
                    
                    
                    this.style.animation = 'dotAnimation 0.2s ease-out';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 200);
                }
            } else {
                currentInput += value;
                if (operator && previousInput) {
                    display.value = previousInput + " " + operator + " " + currentInput;
                } else {
                    display.value = currentInput;
                }
                
                // Add typing animation
                display.style.animation = 'typingAnimation 0.2s ease-out';
                setTimeout(() => {
                    display.style.animation = '';
                }, 200);
            }
        });
    });

    // Ripple effect function
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

        // Check for invalid numbers
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
        
        // Check for infinity or NaN results
        if (!isFinite(result)) {
            showError();
            return "Error";
        }
        
        // Round to avoid floating point precision issues
        return Math.round(result * 1000000000) / 1000000000;
    }
    
    // Error display function
    function showError() {
        display.classList.add('error');
        setTimeout(() => {
            display.classList.remove('error');
        }, 1000);
    }

    // Add keyboard support with animations
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
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on theme
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
        
        // Update icon with animation
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
