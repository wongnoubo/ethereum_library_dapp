var modal = document.querySelector("#modal");

App = {
    init: function () {
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
            App.getBooks();
        });
    },
    //////////////////////////////////////////////////////////////////////////////////////

    getBooks:async function(){
    window.gid = getQueryVariable('id');

    var result = await App._getBookInfo(gid);
    $("#owner").html(result[0]);
    $("#intro").html(result[5]);
    $("#date").html(fmtBookDate(result[9].toString()));
    $("#cover").attr('src', result[6]);
    var borrowNum = await App._getBorrowedNums(gid);

    $("#bookspage").html('');
    var buttonContent = '';
    buttonContent+=
        '<span id="id" hidden>0</span>'
        +'<span class="name" id="nameWriter">'+ result[1] +'</span>'
        +'<span class="btn-primary" id="style">'+ result[2] +'</span>'
        +   '<p class="normal">评分：<samp id="score">'+result[10].toString()+'</samp></p>'
        +'<p class="normal">出版社&出版时间：<samp id="publisherPublishAge">'+result[3]+'</samp></p>'
        +'<p class="normal">书号：<samp id="ISBN">'+result[4]+'</samp></p>'
        +'<p class="normal">页数：<samp id="pages">'+result[8].toString()+'</samp></p>'
        +'<p class="normal">在架状态：<samp id="status">'+ result[7] +'</samp></p>'
        +'<p class="normal">借阅次数：<samp id="borrowNums">'+borrowNum+'</samp></p>'
        +'<p class="buy" id="bottonCentent">'
        +'<button id="comment"  style="background-color: red" onclick="App.set('+gid+')">立即评价</button>'
        +'<button onclick="window.location.href=\'library/bookHome.html\'" style="background-color: #00bdef">返回主页</button>'
        +'</p>'
    $("#bookspage").append(buttonContent);

    var clen = await App._getBooksCommentLength(gid);
    $("#books_comments_cnt").html(clen.toString());
    var bookInfo =await App._getBookInfo(gid);
    var content = '';
    var userPic = '';
    for (var i = 0; i < clen; i++) {
        var result = await App._getBookCommentInfo(gid, i);
        if(bookInfo[0] == result[0])
            userPic = "images/owner.png";
        else
            userPic = "images/buyer.png"
        content += '<div class="row">'
            + '<div class="col-sm-1">'
            + '<img src='+ userPic +'>'
            + '<samp>***' + result[0].substr(-3) + '</samp>'
            + '</div>'
            + '<div class="col-sm-11">'
            + '<p>' + fmtBookDate(result[1].toString()) + '</p>'
            + '<p name="star" data-score="' + result[2] + '"></p>'
            + '<p>' + result[3] + '</p>'
            + '</div>'
            + '</div>'
            + '<hr/>';
    }
    $("#comments").append(content);
    // 设置星星
    $("[name^='star']").raty({
        number: 10, // 星星上限
        readOnly: true,
        score: function () {
            return $(this).attr('data-score');
        }
    });
},

    set: async function(id){
        window.evaluateScore = 10;
        window.evaluateId = id;
        showModal();
        $("#starBooksBtn").html('确 认');
        $("#starBooksBtn").attr("disabled", false);
        // 重置星星
        $('#star').raty({
            number: 10, // 星星上限
            targetType: 'hint', // number是数字值 hint是设置的数组值
            target: '#hint',
            targetKeep: true,
            targetText: '请选择评分',
            hints: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'SSS'],
            click: function (score, evt) {
                window.evaluateScore = score;
            }
        });
    },

    /**
     * 评价书籍
     * @returns {Promise<void>}
     */
    bookevaluate: async function () {
        var content = $("#content").val();
        if (content == '') content = '对方很高冷,什么也没有说......';
        book.deployed().then(function (bookInstance) {
            bookInstance.evaluate(evaluateId, evaluateScore, content, {
                from: web3.eth.accounts[0],
            }).then(function (result) {
                alert("评价成功,等待写入区块!");
                hideModal();
                window.location.reload();
            }).catch(function (err) {
                alert("评价失败: " + err);
                hideModal();
                window.location.reload();
            });
        });
    },

    ////////////////////////////////////////////////////////////

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
    },

    _getBookCommentInfo: function (gid, cid) {
    return new Promise(function (resolve, reject) {
        book.deployed().then(function (bookInstance) {
            bookInstance.getCommentInfo.call(gid, cid).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                alert("内部错误: " + err);
            });
        });
    });
},
    _getBooksCommentLength: function (id) {
        return new Promise(function (resolve, reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getCommentLength.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getBorrowedNums: function (id) {
        return new Promise(function (resolve,reject) {
            book.deployed().then(function (bookInstance) {
                bookInstance.getBorrowNums.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误" + err);
                })
            })
        })
    }
}

document.querySelector("#cancel").addEventListener("click", () => {
    hideModal();
});

function hideModal() {
    modal.style.display = 'none';
}

function showModal() {
    modal.style.display = 'block';
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function fmtBookDate(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
}

$(function () {
    App.init();
});