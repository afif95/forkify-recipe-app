import View from './View.js';
import icons from 'url:../../img/icons.svg';


class paginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addhandlerclick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const gotopage = +btn.dataset.goto;
            handler(gotopage);
        })
    }

    _generateMarkup() {
        const currentpage = this._data.page;
        const numpages = Math.ceil(this._data.results.length / this._data.resultsperpage);

        // page1, and other pages
        if (currentpage === 1 && numpages > 1) {
            return `
                <button data-goto="${currentpage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentpage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
          </button>`;
        }

        // last page
        if (currentpage === numpages && numpages > 1) {
            return `
                    <button data-goto="${currentpage - 1}"class="btn--inline          pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                    <span>Page ${currentpage - 1}</span>
          </button>`;
        }

        // other page
        if (currentpage < numpages) {
            return `
                    <button data-goto="${currentpage - 1}"class="btn--inline          pagination__btn--prev">
                        <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                    <span>Page ${currentpage - 1}</span>
          </button>
          <button data-goto="${currentpage + 1}"class="btn--inline pagination__btn--next">
                <span>Page ${currentpage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
          </button>`;
        }

        // page1, and no pages
        return '';
    }
}

export default new paginationView();