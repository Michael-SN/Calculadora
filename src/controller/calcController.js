class CalcController {

    constructor(){
        // se eu tiver um _ antes do atributo significa que ele eh privado
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';        
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');        
        this._currentDate;
        this.initialize();
        this.initkeyBoard();
        this.initButtonsEvents();
    }   

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        if(value.toString().length > 10){
            this.setError();
            // Por limitações do display, não é permitidos valores acime de dez digitos
            console.log('Due to display limitations, values above ten digits are not allowed');
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value ){
        this._currentDate = value; 
    }
    copyToClipboard() {

        let input = document.createElement('input');        
        
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }
    pasteFormClipboard () {
        
        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            if(!isNaN(text)) {
                this.displayCalc = parseFloat(text);
            } else {
                this.displayCalc = 0;
                console.log(`Error '${text}' is not a Number`);
            }           
        });
    }
    initialize() {
        this.setDisplayDateAndTime();
        setInterval( () => {            
            this.setDisplayDateAndTime();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFormClipboard();

        document.querySelectorAll('.btn-ac').forEach( btn => {
            btn.addEventListener('dblclick', e => {

                this.toggleAudio();
            })
        })
    }
    toggleAudio() {
        // se for true passa a ser false, ao contrario passa a ser true
        this._audioOnOff = !this._audioOnOff;
    }
    playAudio() {
        
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    initkeyBoard() {
        this.playAudio();

        document.addEventListener('keyup', e => {            
            
            switch(e.key){
                case 'Escape': this.clearAll();
                    break;
                case 'Backspace': this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;               
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case ',':
                case '.':
                    this.addDot('.');
                    break;    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break; 
                case 'c':
                    if(e.ctrlKey){
                        this.copyToClipboard();
                    }
                    break;
            }
        });
    }

    addEventListenerAll(element, events, function_name) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, function_name, false)
        })
    }
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();    
    }
    getLastOperation(){
        return this._operation[this._operation.length -1];
    }
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);           
    }
    pushOperation(value) {
        this._operation.push(value);

        if(this._operation.length > 3 ) {
            this.calc();            
        }
    }
    getResult() {            

        try {

            return eval(this._operation.join(""));
        } catch (e) {            
            
            setTimeout(()=> this.setError(), 1);
        }
    }
    calc() {

        let last = '';
        this._lastOperator = this.getLastItem(true);

        if (this._operation.length < 3) {           
            
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();               
            this._lastNumber = this.getResult();            
        }

        else if (this._operation.length === 3) {
            this._lastNumber = this.getLastItem(false);            
        }       

        let result = this.getResult();

        if (last === '%') {

            result /= 100;
            this._operation =  [result];          

        } else {
            this._operation = [result];               

            if(last) this._operation.push(last);
        }  

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {

        let lastItem;

        for(let i = this._operation.length -1; i >= 0; i--){
            
            if(this.isOperator(this._operation[i]) == isOperator) {
                lastItem =  this._operation[i];
                break;
            }
        }       
        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;        
        this.displayCalc = lastNumber;
    }

    addOperation(value){       
        
        if(isNaN(this.getLastOperation())) { // [ + - * / .]

            if(this.isOperator(value)) {
                this.setLastOperation(value);
            
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if(this.isOperator(value)) {
                this.pushOperation(value);

            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((newValue));
                this.setLastNumberToDisplay();
            }
        }       
    }
    addDot() {
        let lastOperation = this.getLastOperation();        

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) ||  !lastOperation) {
            this.pushOperation('0.');
        } else {

            this.setLastOperation(lastOperation.toString() + '.');            
        }
        this.setLastNumberToDisplay();
    }

    setError(){
        this.displayCalc = 'Error';
    }
    execBtn(value) {

        this.playAudio();

        switch(value){
            case 'ac': this.clearAll();
                break;
            case 'ce': this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default: this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((currentBtn, index) => {
            this.addEventListenerAll(currentBtn, "click drag", e => {
                let textBtn = currentBtn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(currentBtn, "mouseover mouseup mousedown", e => {                
                currentBtn.style.cursor = "pointer";
            });
        });
    }
    setDisplayDateAndTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day:'2-digit',
            month:'long',
            year:'numeric' // ou 2-digit
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
}
