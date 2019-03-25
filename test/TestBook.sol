pragma solidity >=0.4.22 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Book.sol";

contract TestBook{
    Book book = new Book();
    struct C {
        address reader; // 借阅者
        uint date;      // 评价日期
        uint score;     // 评分
        string content; // 评论正文
    }
    function testpublishBookInfo() public{
        book.publishBookInfo("设计模式之禅/秦小波","教材","机械工业出版社/2018","123456789","这是摘要","cover",1,250);
        string memory publisherPublishAge = book.getBookTestInfo(0);
        Assert.equal(publisherPublishAge,"机械工业出版社/2018","出版社出版时间正确");
    }
}