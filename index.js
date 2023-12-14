import { tweetsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const tweetsDataFromLocalStorage = JSON.parse(localStorage.getItem("tweetsData"))
let replyId = ''

document.addEventListener('click', (e) => {
    if (e.target.dataset.deleteTweet) {
        handleDeleteTweetClick(e.target.dataset.deleteTweet)
    } else if (e.target.dataset.deleteReply) {
        handleDeleteReplyClick(e.target.dataset.deleteReply)
    } else if (e.target.dataset.replies) {
        handleRepliesClick(e.target.dataset.replies)
    } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target.id === 'reply-btn') {
        handleReplyBtnClick()
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtn()
    }
})

function handleDeleteTweetClick(tweetId){
    tweetsDataFromLocalStorage.forEach((tweet, index) => {
        if (tweet.uuid === tweetId) {
            tweetsDataFromLocalStorage.splice(index, 1)
        }
    })
    render()
}

function handleDeleteReplyClick(replyId){
    tweetsDataFromLocalStorage.forEach((tweet, index) => {
        if (tweet.uuid === replyId) {
            tweet.replies.splice(index, 1)
        }
    })
    render()
}

function handleRepliesClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsDataFromLocalStorage.filter((tweet) => {return tweet.uuid === tweetId})[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    } else {
        targetTweetObj.likes++
    }

    targetTweetObj.isLiked = !targetTweetObj.isLiked

    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsDataFromLocalStorage.filter((tweet) => {return tweet.uuid === tweetId})[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    } else {
        targetTweetObj.retweets++
    }

    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    render()
}

function handleReplyClick(tweetId) {
    document.getElementById('reply-to-modal').style.display = 'block'

    replyId = tweetId
}

function handleReplyBtnClick() {
    const replyInput = document.getElementById('reply-input')
    const targetTweetObj = tweetsDataFromLocalStorage.filter((tweet) => {return tweet.uuid === replyId})[0]

    if (replyInput.value && targetTweetObj) {
        document.getElementById('reply-to-modal').style.display = 'none'
    
        targetTweetObj.replies.unshift({
            handle: `@york.xuan`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
            isOp: true,
            uuid: uuidv4()
        })

        render()

        replyInput.value = ''

        document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    }    
}

function handleTweetBtn() {
    const tweetInput = document.getElementById('tweet-input')
    
    if (tweetInput.value) {
     tweetsDataFromLocalStorage.unshift({
            handle: `@york.xuan`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isOp: true,
            uuid: uuidv4()
        })
        render()
    
        tweetInput.value = ''
    }
}

function getFeedHtml() {
    let feedHtml = ``

    tweetsDataFromLocalStorage.forEach((tweet) => {
        let repliesHtml = ``

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let deleteTweetIcon = ``

        if (tweet.isOp) {
            deleteTweetIcon += `<i class="fa-solid fa-trash-can" data-delete-tweet="${tweet.uuid}"></i>`
        }

        if (tweet.replies.length > 0) {
            tweet.replies.forEach((reply) => {
                let deleteReplyIcon = ``

                if (reply.isOp) {
                    deleteReplyIcon += `<i class="fa-solid fa-trash-can" data-delete-reply="${tweet.uuid}"></i>`
                }

                repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle} ${deleteReplyIcon}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        }

        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle} ${deleteTweetIcon}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-replies="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-reply" data-reply="${tweet.uuid}"></i>
                            </span>
                        </div>   
                    </div>            
                </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        `
    })

    return feedHtml
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem("tweetsData", JSON.stringify(tweetsDataFromLocalStorage))
}

function initializeApp(){
    if (!localStorage.getItem("tweetsData")) {
        localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    } 
}

initializeApp()
render()