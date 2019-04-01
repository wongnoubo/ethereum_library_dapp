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
            App.sortBookByBorrowNums();
        });
    },
    ////////////////////////////////////////////////////////////////////////////////////////////
    pageCallback: async function(index,jq){
        $("#bg").hide();
        $("#sortList").html("");
        var pageNum = 10;
        var start = index*pageNum;//开始
        var end = Math.min((index+1)*pageNum,totalNum);
        var content='';
        for(var i=start;i<end;i++){
            var borrowNum = await App._getBorrowedNums(sortList[i][0]);
            var result = await App._getBookInfo(sortList[i][0]);
            content+=' <div class="row">'
                +'<div class="col-xs-1" id="rank">'+(i+1)+'</div>'
                +'<div class="col-xs-1" id="nameWriter">'+ result[1] +'</div>'
                +'<div class="col-xs-3" id="owner">'+result[0]+'</div>'
                +'<div class="col-xs-1" id="date">'+fmtDate(result[9].toString())+'</div>'
                +'<div class="col-xs-1" id="style">'+result[2]+'</div>'
                +'<div class="col-xs-2" id="ISBN">'+result[4]+'</div>'
                +'<div class="col-xs-1" id="borrowNum">'+ borrowNum +'</div>'
                +'<div class="col-xs-1" id="score">'+result[10]+'</div>'
                +' <div class="col-xs-1">'
                +'<a href="book.html?id='+sortList[i][0]+'"><img id="cover" style="width: 50px;height: 50px;" src='+result[9]+'/></a>'
                +'</div>'
                +'</div>'
        }
        $("#sortList").append(content);
    },


    sortBookByComments: async function(){
        $("#bg").hide();
        window.totalNum = await App._getBooksLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getBookInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[10];
            console.log(saleTempList[i][0]);
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        window.sortList = newArray;
        $("#pagination").pagination(totalNum,{
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 10, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    sortBookByBorrowNums: async function(){
        $("#bg").hide();
        window.totalNum = await App._getBooksLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var borrowNum = await App._getBorrowedNums(i);
            saleTempList[i][0] = i;
            saleTempList[i][1] = borrowNum;
            console.log(saleTempList[i][0]);
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        window.sortList = newArray;
        $("#pagination").pagination(totalNum,{
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 10, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    sortBookByDate: async function(){
        $("#bg").hide();
        window.totalNum = await App._getBooksLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getBookInfo(i);
            saleTempList[i][0] = i;
            saleTempList[i][1] = result[9];
            console.log(saleTempList[i][0]);
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        window.sortList = newArray;
        $("#pagination").pagination(totalNum,{
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 10, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////
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
    /////////////////////////////////////////////////////////////////////////////////

}

function fmtDate(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    return Y + M + D;
}

$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#sort-menu").addClass("menu-item-active");

});