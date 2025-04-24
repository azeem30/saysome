// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TweetContract {
    struct Comment {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
    }

    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 dislikes;
        uint256[] commentIds;
    }

    uint256 private tweetIdCounter;
    uint256 private commentIdCounter;
    
    mapping(uint256 => Tweet) public tweets;
    mapping(uint256 => Comment) public comments;
    mapping(address => uint256[]) public userTweets;
    mapping(address => mapping(uint256 => bool)) public userLikedTweet;
    mapping(address => mapping(uint256 => bool)) public userDislikedTweet;

    event TweetCreated(uint256 id, address author, string content, uint256 timestamp);
    event CommentAdded(uint256 tweetId, uint256 commentId, address author, string content, uint256 timestamp);
    event TweetLiked(uint256 id, address user);
    event TweetDisliked(uint256 id, address user);

    function createTweet(string memory _content) public returns (uint256) {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");
        require(bytes(_content).length <= 280, "Tweet content too long");
        
        uint256 tweetId = tweetIdCounter++;
        uint256[] memory emptyArray = new uint256[](0);
        
        tweets[tweetId] = Tweet({
            id: tweetId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likes: 0,
            dislikes: 0,
            commentIds: emptyArray
        });
        
        userTweets[msg.sender].push(tweetId);
        
        emit TweetCreated(tweetId, msg.sender, _content, block.timestamp);
        
        return tweetId;
    }

    function likeTweet(uint256 _tweetId) public {
        require(_tweetId < tweetIdCounter, "Tweet does not exist");
        require(!userLikedTweet[msg.sender][_tweetId], "Already liked this tweet");
        
        Tweet storage tweet = tweets[_tweetId];
        
        // If user previously disliked, remove the dislike
        if (userDislikedTweet[msg.sender][_tweetId]) {
            tweet.dislikes--;
            userDislikedTweet[msg.sender][_tweetId] = false;
        }
        
        tweet.likes++;
        userLikedTweet[msg.sender][_tweetId] = true;
        
        emit TweetLiked(_tweetId, msg.sender);
    }

    function dislikeTweet(uint256 _tweetId) public {
        require(_tweetId < tweetIdCounter, "Tweet does not exist");
        require(!userDislikedTweet[msg.sender][_tweetId], "Already disliked this tweet");
        
        Tweet storage tweet = tweets[_tweetId];
        
        // If user previously liked, remove the like
        if (userLikedTweet[msg.sender][_tweetId]) {
            tweet.likes--;
            userLikedTweet[msg.sender][_tweetId] = false;
        }
        
        tweet.dislikes++;
        userDislikedTweet[msg.sender][_tweetId] = true;
        
        emit TweetDisliked(_tweetId, msg.sender);
    }

    function addComment(uint256 _tweetId, string memory _content) public returns (uint256) {
        require(_tweetId < tweetIdCounter, "Tweet does not exist");
        require(bytes(_content).length > 0, "Comment content cannot be empty");
        require(bytes(_content).length <= 280, "Comment content too long");
        
        uint256 commentId = commentIdCounter++;
        
        comments[commentId] = Comment({
            id: commentId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });
        
        tweets[_tweetId].commentIds.push(commentId);
        
        emit CommentAdded(_tweetId, commentId, msg.sender, _content, block.timestamp);
        
        return commentId;
    }

    function getTweet(uint256 _tweetId) public view returns (
        uint256 id,
        address author,
        string memory content,
        uint256 timestamp,
        uint256 likes,
        uint256 dislikes,
        uint256[] memory commentIds
    ) {
        require(_tweetId < tweetIdCounter, "Tweet does not exist");
        
        Tweet storage tweet = tweets[_tweetId];
        
        return (
            tweet.id,
            tweet.author,
            tweet.content,
            tweet.timestamp,
            tweet.likes,
            tweet.dislikes,
            tweet.commentIds
        );
    }

    function getComment(uint256 _commentId) public view returns (
        uint256 id,
        address author,
        string memory content,
        uint256 timestamp
    ) {
        require(_commentId < commentIdCounter, "Comment does not exist");
        
        Comment storage comment = comments[_commentId];
        
        return (
            comment.id,
            comment.author,
            comment.content,
            comment.timestamp
        );
    }

    function getTweetComments(uint256 _tweetId) public view returns (uint256[] memory) {
        require(_tweetId < tweetIdCounter, "Tweet does not exist");
        return tweets[_tweetId].commentIds;
    }

    function getUserTweets(address _user) public view returns (uint256[] memory) {
        return userTweets[_user];
    }

    function getTweetCount() public view returns (uint256) {
        return tweetIdCounter;
    }

    // Get tweets with pagination
    function getTweets(uint256 _offset, uint256 _limit) public view returns (
        uint256[] memory ids,
        address[] memory authors,
        string[] memory contents,
        uint256[] memory timestamps,
        uint256[] memory likesArray,
        uint256[] memory dislikesArray
    ) {
        uint256 tweetCount = tweetIdCounter;
        
        if (_offset >= tweetCount) {
            return (
                new uint256[](0),
                new address[](0),
                new string[](0),
                new uint256[](0),
                new uint256[](0),
                new uint256[](0)
            );
        }
        
        uint256 remaining = tweetCount - _offset;
        uint256 count = remaining < _limit ? remaining : _limit;
        
        ids = new uint256[](count);
        authors = new address[](count);
        contents = new string[](count);
        timestamps = new uint256[](count);
        likesArray = new uint256[](count);
        dislikesArray = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            uint256 tweetId = tweetCount - 1 - _offset - i;
            Tweet storage tweet = tweets[tweetId];
            
            ids[i] = tweet.id;
            authors[i] = tweet.author;
            contents[i] = tweet.content;
            timestamps[i] = tweet.timestamp;
            likesArray[i] = tweet.likes;
            dislikesArray[i] = tweet.dislikes;
        }
        
        return (ids, authors, contents, timestamps, likesArray, dislikesArray);
    }
}
