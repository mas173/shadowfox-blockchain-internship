// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Decentralised voting contract.
// Everything lives here on chain - proposals, descriptions, votes, tallies.
// There is no backend, the frontend reads and writes directly to this contract.

contract DecentralisedVoting {
    address public admin;
    bool public allowPublicProposals;
    uint256 public proposalCount;

    struct Option {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        string category;
        address creator;
        uint256 startTime;
        uint256 endTime;
        uint256 totalVotes;
        bool finalized;
        uint256 winningOptionId;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Option[]) private proposalOptions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voterChoice;

    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address indexed creator,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 indexed optionIndex,
        uint256 timestamp
    );
    event ProposalFinalized(uint256 indexed proposalId, uint256 winningOptionIndex, uint256 totalVotes);

    error UnauthorizedCreator();
    error InvalidProposalId();
    error VotingWindowClosed();
    error VotingStillActive();
    error AlreadyVotedOnProposal();
    error InvalidOptionIndex();
    error NotAdmin();

    constructor() {
        admin = msg.sender;
        allowPublicProposals = false;
    }

    // admin can open proposal creation to everyone, handy for demos
    function setAllowPublicProposals(bool allowed) external {
        if (msg.sender != admin) revert NotAdmin();
        allowPublicProposals = allowed;
    }

    function createProposal(
        string memory title,
        string memory description,
        string memory category,
        string[] memory optionNames,
        uint256 durationSeconds
    ) external returns (uint256) {
        if (msg.sender != admin && !allowPublicProposals) revert UnauthorizedCreator();
        require(bytes(title).length > 0, "title is empty");
        require(optionNames.length >= 2 && optionNames.length <= 10, "need 2 to 10 options");
        require(durationSeconds >= 60, "duration too short");

        proposalCount++;
        uint256 id = proposalCount;

        Proposal storage p = proposals[id];
        p.id = id;
        p.title = title;
        p.description = description;
        p.category = category;
        p.creator = msg.sender;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + durationSeconds;
        p.totalVotes = 0;
        p.finalized = false;
        p.winningOptionId = 0;

        for (uint256 i = 0; i < optionNames.length; i++) {
            proposalOptions[id].push(Option({id: i, name: optionNames[i], voteCount: 0}));
        }

        emit ProposalCreated(id, title, msg.sender, p.startTime, p.endTime);
        return id;
    }

    function castVote(uint256 proposalId, uint256 optionIndex) external {
        if (proposalId == 0 || proposalId > proposalCount) revert InvalidProposalId();
        Proposal storage p = proposals[proposalId];
        if (block.timestamp > p.endTime) revert VotingWindowClosed();
        if (hasVoted[proposalId][msg.sender]) revert AlreadyVotedOnProposal();
        if (optionIndex >= proposalOptions[proposalId].length) revert InvalidOptionIndex();

        // mark first, then update counts
        hasVoted[proposalId][msg.sender] = true;
        voterChoice[proposalId][msg.sender] = optionIndex;
        proposalOptions[proposalId][optionIndex].voteCount++;
        p.totalVotes++;

        emit VoteCast(proposalId, msg.sender, optionIndex, block.timestamp);
    }

    function finalizeProposal(uint256 proposalId) external {
        if (proposalId == 0 || proposalId > proposalCount) revert InvalidProposalId();
        Proposal storage p = proposals[proposalId];
        if (block.timestamp <= p.endTime) revert VotingStillActive();
        require(!p.finalized, "already finalized");

        uint256 bestVotes = 0;
        uint256 bestIndex = 0;
        for (uint256 i = 0; i < proposalOptions[proposalId].length; i++) {
            if (proposalOptions[proposalId][i].voteCount > bestVotes) {
                bestVotes = proposalOptions[proposalId][i].voteCount;
                bestIndex = i;
            }
        }

        p.finalized = true;
        p.winningOptionId = bestIndex;

        emit ProposalFinalized(proposalId, bestIndex, p.totalVotes);
    }

    // status: 0 = Active, 1 = Ended (not finalized), 2 = Finalized
    function getProposal(
        uint256 proposalId
    ) external view returns (Proposal memory proposal, uint256 status, Option[] memory options) {
        if (proposalId == 0 || proposalId > proposalCount) revert InvalidProposalId();
        proposal = proposals[proposalId];
        if (proposal.finalized) {
            status = 2;
        } else if (block.timestamp > proposal.endTime) {
            status = 1;
        } else {
            status = 0;
        }
        options = proposalOptions[proposalId];
    }

    function getOptions(uint256 proposalId) external view returns (Option[] memory) {
        if (proposalId == 0 || proposalId > proposalCount) revert InvalidProposalId();
        return proposalOptions[proposalId];
    }

    function getVoterReceipt(
        uint256 proposalId,
        address voter
    ) external view returns (bool voted, uint256 selectedOptionIndex) {
        if (proposalId == 0 || proposalId > proposalCount) revert InvalidProposalId();
        voted = hasVoted[proposalId][voter];
        selectedOptionIndex = voterChoice[proposalId][voter];
    }
}
