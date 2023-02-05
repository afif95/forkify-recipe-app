class searchView {
    _parentEl = document.querySelector('.search');

    getquery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearinput();
        return query;
    }

    _clearinput() {
        this._parentEl.querySelector('.search__field').value = '';
    }
    //publisher (publisher subscriber pattern)
    addhandlersearch(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }

}

export default new searchView();