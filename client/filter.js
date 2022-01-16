const filterBtn = document.getElementById('btn-filter');
const clearBtn = document.getElementById('btn-clear');
const nameSelect = document.getElementById('name-select');
const statusSelect = document.getElementById('status-select');
const typeSelect = document.getElementById('type-select');
const lastUpdatedBySelect = document.getElementById('last-updated-by-select');
const categorySelect = document.getElementById('category-select');
const dateSelect = document.getElementById('date-select');
let productsList;
let filters = new Map();

filterBtn.addEventListener('click', filterResult);
clearBtn.addEventListener('click', clearResult);

function filterResult(e) {
    getFilters();

    productsList = document.querySelectorAll('.products-list tr');

    for (let i = 1; i < productsList.length; i++) {
        let p = productsList[i];

        if (!hasFilter(p))
            p.classList.add('hidden');
        else    
            p.classList.remove('hidden');
    }
}

function hasFilter(p) {
    for (const value of filters.values()) {
        if (!p.textContent.toLowerCase().includes(value)){
            return false;
        }
    }

    return true;
}

function getFilters() {
    filters.clear();
    if (nameSelect.value !== '')
        filters.set('name', nameSelect.value.toLowerCase());
    if (statusSelect.value !== '')
        filters.set('status', statusSelect.value.toLowerCase());
    if (typeSelect.value !== '')
        filters.set('type', typeSelect.value.toLowerCase());
    if (lastUpdatedBySelect.value !== '')
        filters.set('lastUpdatedBy', lastUpdatedBySelect.value.toLowerCase().substr(0, 10) + '...');
    if (categorySelect.value !== '')
        filters.set('category', categorySelect.value.toLowerCase());
    if (dateSelect.value !== '')
        filters.set('date', (new Date(dateSelect.value)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase());
}

function clearResult() {
    filters.clear();
    clearFilters();
    filterResult();
}

function clearFilters() {
    nameSelect.value = '';
    statusSelect.value = '';
    typeSelect.value = '';
    lastUpdatedBySelect.value = '';
    categorySelect.value = '';
    dateSelect.value = '';
}