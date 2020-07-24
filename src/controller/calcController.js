class CalcController {

    constructor(){
        // se eu tiver um _ antes do atributo significa que ele eh privado
        this._locale = 'pt-BR';        
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');        
        this._currentDate;
        this.initialize();
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
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value ){
        this._currentDate = value; 
    }

    initialize() {
        this.setDisplayDateAndTime();
        setInterval( () => {            
            this.setDisplayDateAndTime();
        }, 1000);
    }
    addEventListenerAll(element, events, function_name) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, function_name, false)
        })
    }
    // execBtn(value) {
    //     switch()
    // }
    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((currentBtn, index) => {
            this.addEventListenerAll(currentBtn, "click drag", e => {
                console.log(currentBtn.className.baseVal.replace('btn-', ''));
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
