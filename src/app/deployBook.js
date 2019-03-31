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
    /////////////////////////////////////////////////////////////////////
    publish: async function () {
        if (!$("#form").valid()) return;
        $("#tip").html('<span style="color:blue">正在发布资讯...</span>');

        // 获取数据
        var nameWriter = $("#nameWriter").val();
        var style = $("#style").val();
        var publisherPublishAge = $("#publisherPublishAge").val();
        var ISBN = $("#ISBN").val();
        var pages = $("#pages").val();
        var status = $("#status").val();
        var intro = $("#intro").val();
        var cover = $("#cover")[0].files[0];

        // 上传到 IPFS
        cover = 'https://ipfs.io/ipfs/' + await App._ipfsBookAdd(cover);
        $("#tip_cover").html(cover).attr('href', cover);
        // 上传到 Ethereum
        App.handleBookPublish(nameWriter, style,publisherPublishAge,ISBN, intro, cover, status, pages);
    },

    handleBookPublish: function (nameWriter, style,publisherPublishAge,ISBN, intro, cover, status, pages) {
        book.deployed().then(function (bookInstance) {
            bookInstance.publishBookInfo(nameWriter, style,publisherPublishAge,ISBN, intro, cover, status, pages, {
                from: web3.eth.accounts[0]
            }).then(function (result) {
                alert("发布成功,等待写入区块!");
                window.location.reload();
            }).catch(function (err) {
                alert("发布失败: " + err);
                window.location.reload();
            });
        });
    },
    //////////////////////////////////////////////////////////////////////
    _ipfsBookAdd: function (f) {
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();
            reader.onloadend = function () {
                const buffer = ipfs.Buffer.from(reader.result);
                ipfs.add(buffer, {
                    progress: (prog) => console.log(`received: ${prog}`)
                }).then((response) => {
                    console.log(response[0].hash);
                    resolve(response[0].hash);
                }).catch((err) => {
                    alert("IPFS 发生错误");
                    window.location.reload();
                });
            };
            reader.readAsArrayBuffer(f);
        });
    }

}

$(function () {
    App.init();
    $("#publishBook-menu").addClass("menu-item-active");

    // 文本限制
    var introCnt = 1000; // 文本字数最大限制
    $("[name^='intro']").keyup(function () {
        var num = introCnt - $(this).val().length;
        if (num > 0) {
            $(this).next('span').html('剩余' + num + '字数');
        } else {
            $(this).next('span').html('剩余 0 字数');
            var c = $(this).val().substr(0, introCnt);
            $(this).val(c);
        }
    }).blur(function () {
        $(this).next('span').html('');
    });

    // 验证表单
    $("#form").validate({
        rules: {
            nameWriter:{
              required: true,
              rangelength: [1, 50]
            },
            style: {
                required: true
            },
            publisherPublishAge: {
                required: true,
                rangelength: [1, 50]
            },
            ISBN: {
                required: true
            },
            pages: {
                required: true
            },
            status: {
                required: true
            },
            intro: {
                required: true,
                rangelength: [1, 1000]
            },
            cover: {
                required: true
            }
        },
        messages: {
            nameWriter: {
                required: "×",
                rangelength: "字数范围[1-50]"
            },
            style: {
                required: "×"
            },
            publisherPublishAge: {
                required: "×",
                rangelength: "字数范围[1-50]"
            },
            ISBN: {
                required: "×"
            },
            pages: {
                required: "×"
            },
            status: {
                required: "×"
            },
            intro: {
                required: "×",
                rangelength: "字数范围[1-1000]"
            },
            cover: {
                required: "×"
            }
        },
        success: function (label) {
            label.text("√"); // 正确时候输出
        },
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        }
    });
});