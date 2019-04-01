App = {
    init: function () {
        // connect to ipfs daemon API server
        window.ipfs = window.IpfsApi('localhost', '5001');

        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }
        App.initContract();
    },

    initContract: function () {
        $.getJSON('Book.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            window.book = TruffleContract(data);
            // Set the provider for our contract
            window.book.setProvider(web3.currentProvider);
            // Init app
            // ......
        });
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////
    pageCallback: async function (index, jq) {
        $("#bg").hide();
        $("#Viewbooks").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalBooksNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = await App._getBookInfo(booksList[i]);
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="book.html?id=' + booksList[i] + '">'
                + '<div style="position: relative;">'
                + '<img id="cover" class="img-cover" src="' + result[6] + '" alt="资讯封面"/>'
                + '<figcaption id="nameWriter" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                +'<span class="label label-info">评分</span>'
                +'<samp id="score">' + result[10] + '</samp>'
                +'<br/>'
                + '<span class="label label-info">类型</span>'
                + '<samp id="style">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">出版社&出版时间</span>'
                + '<samp id="publisherPublishAge">' + result[3] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">书号</span>'
                + '<samp id="ISBN">' + result[4] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">页数</span>'
                + '<samp id="pages">' + result[8] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">在架状态</span>'
                + '<samp id="status">' + result[7] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">书籍简介</span>'
                + '<samp id="intro">' + result[5].substr(0, 20) + '......</samp>'
                + '<br/>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#Viewbooks").append(content);
    },

    pageCallReturnback: async function (index, jq) {
        $("#bg").hide();
        $("#Viewbooks").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalBooksNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = await App._getBookInfo(booksList[i]);
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="book.html?id=' + booksList[i] + '">'
                + '<div style="position: relative;">'
                + '<img id="cover" class="img-cover" src="' + result[6] + '" alt="资讯封面"/>'
                + '<figcaption id="nameWriter" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                +'<span class="label label-info">评分</span>'
                +'<samp id="score">' + result[10] + '</samp>'
                +'<br/>'
                + '<span class="label label-info">类型</span>'
                + '<samp id="style">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">出版社&出版时间</span>'
                + '<samp id="publisherPublishAge">' + result[3] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">书号</span>'
                + '<samp id="ISBN">' + result[4] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">页数</span>'
                + '<samp id="pages">' + result[8] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">在架状态</span>'
                + '<samp id="status">' + result[7] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">书籍简介</span>'
                + '<samp id="intro">' + result[5].substr(0, 20) + '......</samp>'
                + '<div align="center" id="returnBookBtn">'
                + '<button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#modal"'
                + 'onclick="App.set('+ booksList[i] +')">还书'
                + '</button>'
                + '</div>'
                + '<br/>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#Viewbooks").append(content);
    },


    getBooksByKeyword: async function(keyword){
    var publishBooks = await App._getPublishedBooks();
    var commentedBooks = await App._getCommentedBooks();
    var borrowedBooks = await  App._getBorrowedBooks();
    var returnedBooks = await  App._getReturnedBooks();
    var result1 = publishBooks.concat(commentedBooks);
    var result2 = borrowedBooks.concat(returnedBooks);
    var result = result1.concat(result2);
    result1 = null;
    result2 = null;
    var tempNum = result.length;
    var start = 0;
    var tempList = new Array();
    var resultInfo=null;
    for(var i = start;i < tempNum;i++){
        resultInfo = await App._getBookInfo(result[i]);
        if(resultInfo[1].match(keyword)==null){
        }else {
            tempList.push(result[i]);
        }
    }
    window.booksList = tempList;
    window.totalBooksNum = tempList.length;
    $("#pagination").pagination(totalBooksNum, {
        callback: App.pageCallback,
        prev_text: '<<<',
        next_text: '>>>',
        ellipse_text: '...',
        current_page: 0, // 当前选中的页面
        items_per_page: 8, // 每页显示的条目数
        num_display_entries: 4, // 连续分页主体部分显示的分页条目数
        num_edge_entries: 1 // 两侧显示的首尾分页的条目数
    });
    if(tempList.length==0){
        alert("没有找到该类型图书，请您换个搜索类型( ˶‾᷄࿀‾᷅˵ )");
    }
},


/**
     * 根据类型获得书籍
     * @param type
     * @returns {Promise<void>}
     */
    getBooksByType: async function(type){
        var publishBooks = await App._getPublishedBooks();
        var commentedBooks = await App._getCommentedBooks();
        var borrowedBooks = await  App._getBorrowedBooks();
        var returnedBooks = await  App._getReturnedBooks();
        var result1 = publishBooks.concat(commentedBooks);
        var result2 = borrowedBooks.concat(returnedBooks);
        var result = result1.concat(result2);
        result1 = null;
        result2 = null;
        var tempNum = result.length;
        var start = 0;
        var tempList = new Array();
        var resultInfo=null;
        for(var i = start;i < tempNum;i++){
            resultInfo = await App._getBookInfo(result[i]);
            if(resultInfo[2].match(type)==null){
            }else {
                tempList.push(result[i]);
            }
        }
        window.booksList = tempList;
        window.totalBooksNum = tempList.length;
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
        if(tempList.length==0){
            alert("没有找到该类型图书，请您换个搜索类型( ˶‾᷄࿀‾᷅˵ )");
        }
    },

    /**
     * 我发布的图书
     * @returns {Promise<void>}
     */
    getPublishedBooks: async function(){
        var result = await App._getPublishedBooks();
        window.booksList = result;
        window.totalBooksNum = result.length;
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    /**
     * 获取已经评论过的图书
     * @returns {Promise<void>}
     */
    getCommentedBooks: async function(){
        $("#returnBookBtn").hide();
        var result = await App._getCommentedBooks();
        window.booksList = result;
        window.totalBooksNum = result.length;
        console.log(totalBooksNum);
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    /**
     * 获取借阅书籍
     * @returns {Promise<void>}
     */
    getBorrowedBooks: async function(){
        var result = await App._getBorrowedBooks();
        window.booksList = result;
        window.totalBooksNum = result.length;
        console.log(totalBooksNum);
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallReturnback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    /**
     * 获取归还书籍
     */
    getReturnedBooks: async function(){
        var result = await App._getReturnedBooks();
        window.booksList = result;
        window.totalBooksNum = result.length;
        console.log(totalBooksNum);
        $("#pagination").pagination(totalBooksNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },


    set: function (_id) {
        window.ReturnId = _id;
    },

    returnBook: function(){
        book.deployed().then(function (bookInstance) {
            bookInstance.isBorrowed.call(ReturnId).then(function (result) {
             if(result){
                 $("#returnBookBtn").html('归 还');
                 $("#returnBookBtn").attr("disabled", false);
                 bookInstance.returnBook(ReturnId,{
                     from: web3.eth.accounts[0],
                 }).then(function (result) {
                     alert("归还成功,等待写入区块!");
                     $("#modal").modal('hide');
                     window.location.reload();
                 }).catch(function (err) {
                     alert("归还失败: " + err);
                     $("#modal").modal('hide');
                     window.location.reload();
                 });
             }else{
                 $("#returnBookBtn").html('已归还');
                 $("#returnBookBtn").attr("disabled", true);
                 alert("这本书你已经归还");
                 $("#modal").modal('hide');
             }
            });
        });
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 发布的书籍
     * @returns {Promise<any>}
     * @private
     */
    _getPublishedBooks: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getPublishedBooks.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    /**
     * 获取评论过的书籍
     * @returns {Promise<any>}
     * @private
     */
    _getCommentedBooks: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getCommentedBook.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },


    /**
     * 获取借阅过的书籍
     * @returns {Promise<any>}
     * @private
     */
    _getBorrowedBooks: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBorrowedBooks.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    /**
     *获取归还的书籍
     * @returns {Promise<any>}
     * @private
     */
    _getReturnedBooks: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getReturnedBooks.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    /**
     * 获取书籍数量
     * @returns {Promise<any>}
     * @private
     */
    _getBooksLength: function () {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBooksLength.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },



    /**
     * 获取书籍详细信息
     * @param id
     * @returns {Promise<any>}
     * @private
     */
    _getBookInfo: function (id) {
        return new Promise(function (resolve,reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBookInfo.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: "+err);
                });
            });
        });
    }
}

/**
 * 点击事件监听器，监听list节点的点击事件
 */
document.querySelector('#myBooksList').addEventListener('click', handleClick);

function handleClick(e) {
    const target = e.target;//鼠标点击的目标
    if (target.tagName.toLowerCase() !== 'a') return;//筛选目标里面的a
    console.log(target.innerHTML);
    App.getBooksByType(target.innerHTML);
}

/**
 * 关键词检索
 */
function keyWordSearch() {
    var keyword = document.getElementById("myBookSearchBtn").value;
    App.getBooksByKeyword(keyword);
}

/**
 * 搜索回车监听
 */
$('#myBookSearchBtn').bind('keydown',function(event){
    if(event.keyCode == "13")
    {
        keyWordSearch();
    }
});

$(function () {
    App.init();
    // 激活导航
    $("#myBook-menu").addClass("menu-item-active");
});