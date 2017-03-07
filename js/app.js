; (function () {

    const KEY = { ENTER: 13 };

    function Todo(parentEl, todoItems = []) {

        if (typeof parentEl !== 'string') {
            var stringify = '' + parentEl;
        }

        this.$parent = document.querySelector(parentEl || stringify);
        this.$ul = this.$parent.querySelector('ul.todo_items');
        this.$filters = this.$parent.querySelector('ul.filters');
        this.$input = this.$parent.querySelector('input.inputText');
        this.$span = this.$parent.querySelector('span.clear');

        this.todoItems = todoItems;
        this.bind();
        this.render();
    }

    Todo.prototype.bind = function () {

        let self = this;
        this.$input.addEventListener('keyup', function (e) {

            if (e.which === KEY.ENTER && e.target.value !== '') {
                self.todoItems.push({
                    id: +new Date(),
                    title: e.target.value,
                    completed: false,
                    state: ''
                });

                self.counter(self.todoItems);
                self.render();

                e.target.value = '';
            }

        }, false);

        this.$ul.addEventListener('click', function (e) {

            if (e.target.classList.contains('checkbox')) {
                let id = e.target.parentNode.parentNode.getAttribute('data-id');
                let attrValue = e.target.parentNode.parentNode.getAttribute('class');
                self.todoItems.forEach(function (item) {

                    if (item.id === +id) {
                        item.completed = true;
                        self.render();
                    }
                    if (attrValue === 'completed' && item.id === +id) {
                        item.completed = false;
                        self.render();
                    }
                    self.counter(self.todoItems);
                })
            }

            if (e.target.classList.contains('delete')) {
                let id = e.target.parentNode.parentNode.getAttribute('data-id');

                self.delete(id);
                self.counter(self.todoItems);
                self.render();
            }
        }, false);

        this.$filters.addEventListener('click', function (e) {

            let attrValue = e.target.getAttribute('id');

            self.todoItems.forEach(function (item) {
                if (attrValue === 'all') {
                    item.state = '';
                    self.render();
                }
                if (attrValue === 'complete') {

                    if (item.completed === false) {
                        item.state = 'showOnly';
                    } else {
                        item.state = '';
                    }
                    self.render();
                }
                if (attrValue === 'active') {

                    if (item.completed === true) {
                        item.state = 'showOnly';
                    } else {
                        item.state = '';
                    }
                    self.render();
                }
            })

        }, false);

        this.$ul.addEventListener('dblclick', function (e) {

            let id = e.target.parentNode.parentNode.getAttribute('data-id');

            if (id && !e.target.parentNode.parentNode.classList.contains('completed')) {
                self.todoItems.forEach(function (item) {

                    if (item.id === +id) {
                        item.state = 'processText';
                    }
                    self.render();
                })
            }

        }, false);

        this.$ul.addEventListener('blur', function (e) {

            self.todoItems.forEach(function (item) {
                if (item.state === 'processText') {
                    item.title = e.target.value;
                    item.state = '';
                }
                self.render();
            })

        }, true);

        this.$ul.addEventListener('keyup', function (e) {

            if (e.which === KEY.ENTER) {
                self.todoItems.forEach(function (item) {
                    if (item.state === 'processText') {
                        item.title = e.target.value;
                        item.state = '';
                    }
                    self.render();
                })
            }
        }, false);

        this.$span.addEventListener('click', function (e) {

            self.todoItems.forEach(function (item) {
                if (item.completed === true) {
                    self.delete(item.id);
                }
                self.render();
            })
        }, false);
    }

    Todo.prototype.render = function () {

        let self = this;

        while (this.$ul.firstChild) {
            this.$ul.removeChild(this.$ul.firstChild);
        }

        self.todoItems.forEach(function (item) {
            let $todo = self.createList(item);
            self.$ul.appendChild($todo);
        })
    }

    Todo.prototype.createList = function (item) {

        let self = this;

        let $li = document.createElement('li');
        $li.setAttribute('data-id', item.id);

        let $label = document.createElement('label');
        $label.setAttribute('id', 'labelAttr');
        let $div = document.createElement('div');
        $div.setAttribute('class', 'item');

        if (item.completed === true) {
            $li.setAttribute('class', 'completed');
        }

        if (item.state === 'showOnly') {
            $li.setAttribute('class', 'hide');
        }

        if (item.state === 'processText') {
            let $textChange = document.createElement('input');
            $textChange.setAttribute('class', 'changeText');
            $textChange.value = item.title;
            $div.appendChild($textChange);
        } else {
            let $text = document.createTextNode(item.title);
            $label.appendChild($text);
            $div.appendChild($label);
        }

        let $checkbox = document.createElement('checkbox');
        $checkbox.setAttribute('class', 'checkbox');

        let $delete = document.createElement('span');
        $delete.setAttribute('class', 'delete');

        $div.appendChild($checkbox);
        $div.appendChild($delete);

        $li.appendChild($div);

        return $li;
    }

    Todo.prototype.counter = function (items) {
        let count = document.getElementById("counter");
        let elements = items.filter(function (item) {
            if (item.completed === false) {
                return item;
            }
        });
        count.innerText = elements.length || 0;
    }

    Todo.prototype.delete = function (id) {

        this.todoItems = this.todoItems.filter(function (item) {
            return item.id !== +id;
        })
    }
    this.todo = new Todo("#firstTodo");
})();