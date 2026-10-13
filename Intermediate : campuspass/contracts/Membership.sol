// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Membership {
    address public owner;
    mapping(address => bool) public members;

    event MembershipGranted(address indexed user);
    event MembershipRemoved(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function grantMembership(address user) external onlyOwner {
        members[user] = true;
        emit MembershipGranted(user);
    }

    function removeMembership(address user) external onlyOwner {
        members[user] = false;
        emit MembershipRemoved(user);
    }

    function isMember(address user) external view returns (bool) {
        return members[user];
    }
}
