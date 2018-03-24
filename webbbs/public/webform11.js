$(function () {
    $('#send').on('click', function () {
        var settings = {
            method: 'post',
            dataType: 'json',
            data: $('#msgform').serialize()
        };
        $.ajax('/save.json', settings)
            .done(function (data) {
                if (data.success) {
                    view(data.id);
                }
            });
    });
    
    // 상세보기
    function view(id, isBack) {
        $('[id$=Panel]').hide();
        $('#viewPanel').show();
        $.ajax({
            url: '/view.json',
            dataType: 'json',
            cache: false,
            data: {
                id: id
            }
        }).done(function (res) {
            var msg = res[0];
            $('#vname').html( msg.id + ') ' + msg.name);
            $('#vmessage').html(msg.message);
            
            if (!isBack) {
                history.pushState(msg.id, msg.id + ') ' + msg.name, '/view/' + msg.id);
            }
        });
    }

    // 목록보기
    function list(pageNo, isBack) {
        $('[id$=Panel]').hide();
        $('#listPanel').show();
        $.ajax({
            url: '/list.json',
            dataType: 'json',
            data: {
                pageNo: pageNo
            }
        }).done(function (res) {
            $('#list').html('');
            $.each(res.list, function (idx, msg) {
                $('#list').append('<dt data-id=' + msg.id + '>' + msg.id + ') ' + msg.name + '</dt>');
                $('#list').append('<dd>' + msg.message + '</dd>');
            });

            $('#list dt').on('click', function (evt) {
                view($(evt.currentTarget).data('id'));
            });

            // pagination
            // http://www.xarg.org/2011/09/jquery-pagination-revised/
            $('#pagination').paging(res.count, {
                format: '[< ncnnn >]',
                perpage: res.perpage,
                page: pageNo,
                onSelect: function (page) {
                    if (page != pageNo) {
                        list(page);
                    }
                    return event.preventDefault();
                },
                onFormat: function (type) {
                    switch (type) {
                    case 'block': // n and c
                    if (!this.active)
                        return '<span>' + this.value + '</span>';
                    else if (this.value != this.page)
                        return '<a href="#' + this.value + '">' + this.value + '</a>';
                    return '<span class="current">' + this.value + '</span>';
                    case 'next': // >
                        return '<a>&gt;</a>';
                    case 'prev': // <
                        return '<a>&lt;</a>';
                    case 'first': // [
                        return '<a>first</a>';
                    case 'last': // ]
                        return '<a>last</a>';
                    }
                }
            });
            
            if (!isBack) {
                history.pushState(pageNo, 'list ' + pageNo, '/list/' + pageNo);
            }
        });
    }

    // 글쓰기
    function write() {
        $('[id$=Panel]').hide();
        $('#writePanel').show();
    }

    $('#btnList').on('click', function () {
        list(1);
    });
    $('#btnWrite').on('click', write);

    function updatePage(data, isBack) {
        var v = location.pathname;
        if (v) {
            var fnStrs = v.substring(1).split('/');
            var fnStr = fnStrs[0];
            var num = fnStrs[1];
            if (fnStr === 'list') {
                list(num, isBack);
            }
            if (fnStr === 'view') {
                view(num, isBack);
            }
        }
    }
    updatePage();
    
    window.addEventListener('popstate', function(event) {
        console.log('popstate fired!' + event);
        updatePage(event.state, true);
    });
    
    list(1);

});