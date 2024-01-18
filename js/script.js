import {convertStringNumber} from './convertStringNumber.js';
import { OverlayScrollbars } from "./overlayscrollbars.esm.min.js";

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const report = document.querySelector('.report');
const financeReport = document.querySelector('.finance__report');
const reportOperationList = document.querySelector('.report__operation-list');
const reportDates = document.querySelector('.report__dates'); // calendar date

const API_URL = 'https://best-flying-sombrero.glitch.me/api/';


// OverlayScrollbars(report, {});

const typeOperation = {
    income: 'доход',
    expenses: 'расход',
};

let amount = 0;

financeAmount.textContent = amount; // 0

financeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const typeOperation = event.submitter.dataset.typeOperation; // income +, expenses -

    const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value)); 

    if (typeOperation === 'income') {
        amount += changeAmount;
    }

    if (typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    financeAmount.textContent = `${amount.toLocaleString()} ₽`; // 00 000 ₽

});

// get report data from server
const getData = async (url) => {
    try {
        const response = await fetch(`${API_URL}${url}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);            
        }
        return await response.json();

    } catch (error) {
        console.log('Ошибка данных:', error);
        throw error;
    }
}

// reformat date 01-12-1999
const reformatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
};

// render report data
const renderReport = (data) => {
    reportOperationList.textContent = "";

    const reportRows = data.map(
        ({category, amount, description, date, type}) => {
        const reportRow = document.createElement('tr');
        reportRow.classList.add('report__row');

        reportRow.innerHTML = `
            <td class="report__cell">${category}</td>
            <td class="report__cell">${amount.toLocaleString()}&nbsp;₽</td>
            <td class="report__cell">${description}</td>
            <td class="report__cell">${reformatDate(date)}</td>
            <td class="report__cell">${typeOperation[type]}</td>
            <td class="report__action-cell">
            <button class="del__button">&#10006;</button>
            </td>
        `;

        return reportRow;
    });

    reportOperationList.append(...reportRows); // tbody > tr
};

// modal report
const closeReport = ({target}) => {    

    if (target.closest('.report__close') || 
        (!target.closest('.report') && target !== financeReport)) {
            report.classList.remove('report__open');
            document.removeEventListener('click', closeReport);
        }
};

const openReport = async() => {
    report.classList.add('report__open');

    document.addEventListener('click', closeReport)

    const data = await getData('/test');
    renderReport(data);
};

financeReport.addEventListener('click', openReport);

// get date from calendar input form
reportDates.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(reportDates));

    // add date in url data query
    const searchParams = new URLSearchParams();
    
    if(formData.startDate) {
        searchParams.append('startDate', formData.startDate);
    } 
    if(formData.endDate) {
        searchParams.append('endDate', formData.endDate);
    }

    const queryString = searchParams.toString();

    const url = queryString ? `/test?${queryString}` : '/test';

    const data = await getData(url);
    renderReport(data);
    
});