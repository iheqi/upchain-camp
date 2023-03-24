const { ethers } = require('hardhat');
const { assert } = require("chai");

describe("NftMarket", () => {
  let accounts = [];
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    accounts = await ethers.getSigners();
    const NftMarket = await ethers.getContractFactory("NftMarket");

    _contract = await NftMarket.deploy(); // deploy默认为 account[0]
  })

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.connect(accounts[0]).mintToken(tokenURI, _nftPrice, {
        value: _listingPrice
      })
    })

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(owner, accounts[0].address, "Owner of token is not matching address[0]");
    })

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    })

    // tokenURI不能重复
    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.connect(accounts[0]).mintToken(tokenURI, _nftPrice);
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    })

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
    })

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Nft price is not correct");
      assert.equal(nftItem.creator, accounts[0].address, "Creator is not account[0]");
      assert.equal(nftItem.isListed, true, "Token is not listed");
    })
  })

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.connect(accounts[1]).buyNft(1, {
        value: _nftPrice
      })
    })

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    })

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
    })

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1].address, "Item is still listed");
    })
  })

  describe("Token transfers", () => {
    const tokenURI = "https://test-json-2.com";
    before(async () => {
      await _contract.connect(accounts[0]).mintToken(tokenURI, _nftPrice, {
        value: _listingPrice
      })
    })

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
    })

    it("should be able to retrieve nft by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);

      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    })

    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
    })

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.connect(accounts[1]).getOwnedNfts();
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
    })

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.connect(accounts[0]).getOwnedNfts();
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
    })

  })

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(
        accounts[0].address,
        accounts[1].address,
        2
      )
    })

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.connect(accounts[0]).getOwnedNfts;
      assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
    })

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.connect(accounts[1]).getOwnedNfts();
      assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
    })
  })

  // 不是说 describe 不会相互影响吗
  // describe("Burn Token", () => {
  //   const tokenURI = "https://test-json3.com";
  //   before(async () => {
  //     await _contract.connect(accounts[2]).mintToken(tokenURI, _nftPrice, {
  //       value: _listingPrice
  //     })
  //   })

  //   it("account[2] should have one owned NFT", async () => {
  //     const ownedNfts = await _contract.connect(accounts[2]).getOwnedNfts();

  //     assert.equal(ownedNfts[0].tokenId, 3, "Nft has a wrong id");
  //   })

  //   it("account[2] should own 0 NFTs", async () => {
  //     await _contract.connect(accounts[2]).burnToken(3);
  //     const ownedNfts = await _contract.connect(accounts[2]).getOwnedNfts();

  //     assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
  //   })
  // })

  describe("List an Nft", () => {
    before(async () => {
      await _contract.connect(accounts[1]).placeNftOnSale(
        1,
        _nftPrice,
        {
          value: _listingPrice
        }
      )
    })

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();
      assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
    })

    it("should set new listing price", async () => {
      await _contract.connect(accounts[0]).setListingPrice(_listingPrice);
      const listingPrice = await _contract.listingPrice();

      assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
    })

  })
})