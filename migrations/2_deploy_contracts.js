var Book = artifacts.require("Book");

module.exports = function(deployer) {
    deployer.deploy(Book);
};
