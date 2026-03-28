// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GovChain {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    struct Record {
        bytes32 milestoneHash;
        bytes32 transactionHash;
        uint256 timestamp;
    }

    mapping(string => Record) private records;
    mapping(string => mapping(bytes32 => bool)) private documentExists;

    event MilestoneStored(
        string milestoneId,
        bytes32 milestoneHash,
        bytes32 transactionHash,
        uint256 timestamp
    );

    function storeMilestone(
        string memory milestoneId,
        bytes32 milestoneHash,
        bytes32 transactionHash,
        bytes32[] memory docHashes
    ) public onlyOwner {

        require(records[milestoneId].timestamp == 0, "Already stored");
        require(milestoneHash != bytes32(0), "Invalid milestone hash");
        require(transactionHash != bytes32(0), "Invalid tx hash");

        records[milestoneId] = Record(
            milestoneHash,
            transactionHash,
            block.timestamp
        );

        uint len = docHashes.length;
        for (uint i; i < len; ) {
            documentExists[milestoneId][docHashes[i]] = true;
            unchecked { i++; }
        }

        emit MilestoneStored(
            milestoneId,
            milestoneHash,
            transactionHash,
            block.timestamp
        );
    }

    function verifyDocumentHash(
        string memory milestoneId,
        bytes32 docHash
    ) public view returns (bool) {
        return documentExists[milestoneId][docHash];
    }

    function verifyMilestoneHash(
        string memory milestoneId,
        bytes32 incomingHash
    ) public view returns (bool) {

        Record memory record = records[milestoneId];

        if (record.timestamp == 0) return false;

        return record.milestoneHash == incomingHash;
    }

    function getMilestone(string memory milestoneId)
        public
        view
        returns (Record memory)
    {
        return records[milestoneId];
    }
}