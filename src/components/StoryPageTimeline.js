import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Link } from '@reach/router'
import userStory from '../services/user_story'
import Lists from '../utils/Lists'

const StoryPageTimeline = (props) => {
  const { story, currentStatus } = props

  const userId = localStorage.getItem('id')

  const followerIds = story.followers.map((follower) =>
    JSON.stringify(follower.id)
  )

  const [followers, setFollowers] = useState(followerIds)

  const [votes, setVotes] = useState(story.followers.length)

  const [voteClicked, setVoteClicked] = useState(false)

  const [voted, setVoted] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const [previousStatuses, setPreviousStatuses] = useState([])

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const setStatuses = () => {
      const tempList = []
      for (let i = 0; i < Lists.stateList.length; i++) {
        tempList.push(Lists.stateList[i].status)
        if (Lists.stateList[i].status === currentStatus) break
      }

      setPreviousStatuses(tempList)
    }
    setStatuses()
  }, [currentStatus])

  useEffect(() => {
    const followerIds = story.followers.map((follower) => follower.id)
    if (followerIds.includes(userId)) {
      setVoted(true)
    }
  }, [story.followers, userId])

  const updateVote = async (story) => {
    setVoteClicked(true)
    if (voted) {
      let updatedFollowerIds = followers.filter(
        (id) => id !== JSON.stringify(userId)
      )
      const response = await userStory.updateVotes(story.id, updatedFollowerIds)
      updatedFollowerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(updatedFollowerIds)
      setVoted(false)
      setVotes((votes) => votes - 1)
    } else {
      followers.push(JSON.stringify(userId))
      let updatedFollowerIds = followers
      const response = await userStory.updateVotes(story.id, updatedFollowerIds)
      updatedFollowerIds = response.data.data.updateUserStory.userStory.followers.map(
        (follower) => JSON.stringify(follower.id)
      )
      setFollowers(updatedFollowerIds)
      setVoted(true)
      setVotes((votes) => votes + 1)
    }
    setVoteClicked(false)
  }

  return (
    <div>
      <div
        className={`flex flex-column story-vote-wrapper ${
          userId && voted ? 'story-vote-wrapper-voted' : ''
        }`}
      >
        <div
          className={`story-vote-button ${
            userId ? 'story-vote-button-clickable' : ''
          }`}
          onClick={() => {
            if (userId && !voteClicked) updateVote(story)
          }}
        >
          <i className='eos-icons'>thumb_up</i>
        </div>
        <div className='story-votes-count' onClick={togglePopup}>
          {votes} Votes
        </div>
        {isOpen && (
          <Modal
            content={
              <>
                <div>
                  {story.followers.length === 0 ? (
                    <h1>No Voters For This Story</h1>
                  ) : (
                    <h1>Voters For This Story</h1>
                  )}
                </div>
                {story.followers.map((voters) => (
                  <div className='flex flex-row author-information'>
                    <div className='user-avatar avatar-vote'>
                      <img
                        className='avatar'
                        src={`https://avatars.dicebear.com/api/jdenticon/${voters.username}.svg`}
                        alt='Default User Avatar'
                      ></img>
                    </div>
                    <div>
                      <Link
                        className='link-vote link link-default'
                        to={`/profile/${voters.id}`}
                      >
                        {voters.username}
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            }
            handleClose={togglePopup}
            active={isOpen}
          />
        )}
      </div>
      <div className='storypage-timeline'>
        {Lists.stateList.map((ele, key) => {
          return (
            <div className='status-element' key={key}>
              {previousStatuses.includes(ele.status) ? (
                <div className='status-current'>
                  <i className='eos-icons status-icon'>{ele.icon}</i>
                  {ele.status}
                </div>
              ) : (
                <div className='status-previous'>
                  <i className='eos-icons status-icon'>{ele.icon}</i>
                  {ele.status}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className='story-pattern'>
        <img
          src={require(`../assets/images/story-page-pattern.svg`)}
          alt='pattern'
        />
      </div>
    </div>
  )
}

export default StoryPageTimeline
