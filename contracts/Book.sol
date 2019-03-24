pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract Book{
    struct OptBook{
        uint[] publishedBooks;//已经发表的图书
        uint[] borrowedBooks;//已经借的图书
        uint[] returnedBooks;//还的书
        uint[] commentedBooks;//评论的书
    }

    struct Book{
        address owner;//书籍发布者

        uint publishDate;//图书上架时间
        uint score;//图书评分
        uint comment;//图书评论个数
        mapping(uint => BookInfo) bookInfo;//书籍相关信息
        mapping(uint => Comment) comments;//评价列表
    }

    struct Comment {
        address reader; // 借阅者
        uint date;      // 评价日期
        uint score;     // 评分
        string content; // 评论正文
    }

    struct BookInfo{
        string name;//书籍名字
        string style;//书籍类型
        string publisher;//出版社
        string writer;//作者
        string ISBN;//书号
        string intro;//书籍简介
        string layout;//书籍装帧
        string cover;//图书封面

        uint publishAge;//出版时间
        uint status;//图书状态(0：在架；1：借阅)
        uint pages;//页数
    }

    Book[] books;
    mapping(address => OptBook) BooksPool;
    //发布图书成功
    event publishBookSuccess(uint id,BookInfo bookinfo,uint publishDate);
    //图书评价成功
    event evaluateSuccess(uint id,address addr,uint score);
    //还书成功
    event returnBookSuccess(uint id,address addr, uint status);

    //获取已经被借阅的书单
    function getBorrowedBooks() public view returns (uint[] memory){
        return BooksPool[msg.sender].borrowedBooks;
    }
    //获取已经被评论过的书
    function getCommentedBookd() public view returns(uint[] memory){
        return BooksPool[msg.sender].commentedBooks;
    }
    //获取发布的书籍
    function getPublishedBooks() public view returns(uint[] memory){
        return BooksPool[msg.sender].publishedBooks;
    }
    //获取还的书
    function getReturnedBooks() public view returns(uint[] memory){
        return BooksPool[msg.sender].returnedBooks;
    }

    //获取书籍数量
    function getBooksLength() public view returns(uint){
        return books.length;
    }

    //获取评价数量
    function getCommentLength(uint id) public view returns (uint) {
        return books[id].comment;
    }

    //获取书籍信息
    function getBooksInfo(uint id) public view returns(address,uint,uint){
        require(id < books.length);
        //获取图书,载入合约
        Book storage book = books[id];
        return (book.owner,book.publishDate,book.score);
    }

    //获得评价消息
    function getCommentInfo(uint bookId,uint commentId) public view returns(
        address, uint, uint, string memory){
        require(bookId < books.length);
        require(commentId < books[bookId].comment);
        Comment storage c = books[bookId].comments[commentId];
        return (c.reader, c.date, c.score, c.content);
    }

    // 是否已经评价 通过遍历实现
    function isEvaluated(uint id) public view returns (bool) {
        Book storage book = books[id];
        for(uint i = 0; i < book.comment; i++)
            if(book.comments[i].reader == msg.sender)
                return true; // 已经评价
        return false; // 尚未评价
    }

    //发布图书
    function publishBookInfo(string memory name, string memory style, string memory publisher,string memory writer,string memory ISBN,string memory intro,string memory layout,
        string memory cover, uint publishAge, uint pages, uint status) public {
        uint id = books.length;
        BookInfo memory bookInfo = BookInfo(name,style,publisher,writer,ISBN,intro,layout,cover,publishAge,pages,status);
        Book memory book = Book(msg.sender, now,0,0); // 评论,评分都是0
        books.push(book);
        BooksPool[msg.sender].publishedBooks.push(id);
        emit publishBookSuccess(id,bookInfo,book.publishDate);
    }

    //评价图书
    function evaluate(uint id, uint score, string memory content) public{
        require(id < books.length);
        // 读取合约
        Book storage book = books[id];
        require(book.owner != msg.sender && !isEvaluated(id)); // 限制条件
        require(0 <= score && score <= 10); // 合法条件
        // 记录评价
        book.score += score;
        book.comments[book.comment++] = Comment(msg.sender, now, score, content);

        emit evaluateSuccess(id, msg.sender, book.score);
    }

    //还书
    function returnBook(uint id, uint status) public{
        require(id < books.length);
        BookInfo storage bookInfo = books[id].bookInfo[id];
        bookInfo.status = status;
        emit returnBookSuccess(id, msg.sender,bookInfo.status);
    }

    function () external {
        revert();
    }
}